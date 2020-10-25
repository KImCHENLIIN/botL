const embed = new global.MessageEmbed()
    .setColor('FF8A14')
    .setTitle('Блокировка войса');
module.exports.run = async (bot, message, args, data) => {
    const rUser = message.mentions.members.first() || message.guild.members.cache.get(bot.toNum(args[0]));
    if (!message.member.hasPermission('BAN_MEMBERS')) return;
    if (!rUser) return bot.sendErrEmbed(embed, "Пользователь не найден | Укажите пользователя через @", message);
    if (rUser.id == message.author.id) return bot.sendErrEmbed(embed, `Вы не можете запретить писать самому себе.`, message);
    let role = message.guild.roles.cache.get(data.Guild.VoiceMuteRole);
    if (!role) {
        if (!message.guild.me.hasPermission("MANAGE_ROLES")) return bot.sendErrEmbed(embed, "У меня нет прав на создание роли voiceMuted!", message);
        role = await message.guild.roles.create({
            data: {
                name: "voiceMuted",
                color: "#000000"
            }
        });
        global.Collection.Guild.upsertOne({ GuildId: message.guild.id }, { VoiceMuteRole: role.id })
    };
    
    if (rUser.roles.cache.has(role.id)) bot.sendErrEmbed(embed, 'Пользователь уже не может говорить.', message);
    const notConfiguredChannels = message.guild.channels.cache
        .filter(channel => channel.type === "voice")
        .filter(channel => !channel.permissionOverwrites.has(role.id));

    if (notConfiguredChannels.length && !message.guild.me.overwritePermissions("MANAGE_CHANNELS")) {
        message.channel.send(
            new global.MessageEmbed()
                .setDescription(`${global.uts(notConfiguredChannels, "голосовой канал", "голосовых каналов", "голосовых каналов")} остались без настроек на роль voiceMuted ( Замьюченные всё ещё могут в них входить )`)
                .setColor(embed.color)
                .addField("К ним относятся каналы:", notConfiguredChannels.array().map((c, i) => `${i - 1}. ${c.name}`).join("\n"))
        );
    } else notConfiguredChannels.forEach(channel => channel.overwritePermissions([{ id: role.id, deny: ["SPEAK"] }]));

    const sym = args[1] ? args[1].split("").reverse()[0] : undefined,
        time = bot.toNum(args[1]);
    let reason = args.slice(2).join(" ");
    async function mute(time, content, reason) {
        embed.addField(`**Администратор \`${message.author.tag}\` запретил говорить в войсе \`${rUser.user.tag}\`**`, `**Время блокировки микрофона: ${!time ? "Навсегда." : content}**\n**Причина: ${!reason ? "Не указана." : reason}**`);
        global.addMark(true, "🤬", data.User, message);
        await rUser.send(embed).catch(err => err);
        await message.channel.send(embed).catch(err => err);
        await rUser.roles.add(role, { reason });
        if (time) {
            await global.Collection.Member.upsertOne({
                GuildId: message.guild.id,
                UserId: rUser.id
            }, { VoiceMute: time + Date.now() });
            await global.handlerMute({
                UserId: rUser.id,
                GuildId: message.guild.id
            }, time, true)
        }
    }
    if (isNaN(time)) {
        mute(null, null, args.slice(1).join(" "));
    } else {
        if (["s", "с", "c", "sec", "сек"].some(e => e === sym.toLowerCase())) return mute(time * 1000, global.uts(time, "секунду", "секунды", "секунд"), reason);
        if (["m", "м", "min", "мин"].some(e => e === sym.toLowerCase())) return mute(60 * time * 1000, global.uts(time, "минуту", "минуты", "минут"), reason);
        if (["h", "ч", "hours", "час"].some(e => e === sym.toLowerCase())) return mute(60 * 60 * time * 1000, global.uts(time, "час", "часа", "часов"), reason);
        if (["d", "д", "day", "день"].some(e => e === sym.toLowerCase())) return mute(60 * 60 * 24 * time * 1000, global.uts(time, "день", "дня", "дней"), reason);
        if (["w", "н", "week", "неделя"].some(e => e === sym.toLowerCase())) return mute(60 * 60 * 24 * 7 * time * 1000, global.uts(time, "неделю", "недели", "недель"), reason);
        if (["y", "г", "year", "год"].some(e => e === sym.toLowerCase())) return mute(60 * 60 * 24 * 7 * 365 * time * 1000, global.uts(time, "год", "года", "лет"), reason);
        mute(time, global.uts(time, "миллисекунду", "миллисекунды", "миллисекунд"), reason);
    }
};

module.exports.help = {
    name: 'voicemute',
    aliases: [],
    description: 'Запрещает участнику разговаривать.',
    usages: {
        'voiceMute @User#0001 1h': 'Запрещает участнику `@User#0001` говорить в войсе 1 час.',
        'voiceMute @User#0001': 'Запрещает участнику `@User#0001` говорить в войсе навсегда.'
    },
    category: 'Модерирование'
}