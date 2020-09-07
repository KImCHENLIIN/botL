module.exports.run = async(bot, message, args, data) => {
    if (!message.member.hasPermission("BAN_MEMBERS") || !message.guild.me.permissions.has("MANAGE_ROLES")) return;
    const embed = new global.MessageEmbed().setColor("FF8A14").setTitle("Блокировка."),
        rUser = await message.mentions.members.first() || message.guild.members.cache.get(bot.toNum(args[0]));
    if (!rUser) return bot.sendErrEmbed(embed, "Пользователь не найден | Укажите пользователя через @", message);
    if (rUser.id == message.author.id) return bot.sendErrEmbed(embed, `Вы не можете запретить писать самому себе.`, message);
    let role = message.guild.roles.cache.get(data.Guild.MuteRole);
    if (!role) {
        role = await message.guild.roles.create({
          data: {
            name: "muted",
            color: "#000000"
          }
        });
        global.Collection.Guild.upsertOne({
            GuildId: message.guild.id
        }, {
            MuteRole: role.id
        })
    }
    message.guild.channels.cache.forEach(async channel => {
        if (channel.permissionOverwrites.has(role.id)) return
        await channel.overwritePermissions([{
            id: role.id,
            deny: ['SEND_MESSAGES', "ADD_REACTIONS"],
        }
      ])
    })
    if (rUser.roles.cache.has(role.id)) bot.sendErrEmbed(embed, 'Пользователь уже не может писать.', message);
    const sym = args[1] ? args[1].split("").reverse()[0] : undefined,
        time = bot.toNum(args[1]);
    let reason = args.slice(2).join(" ");
    async function mute(time, content, reason) {
        embed.addField(`**Администратор \`${message.author.tag}\` запретил писать сообщения \`${rUser.user.tag}\`**`, `**Время блокировки сообщений: ${!time ? "Навсегда." : content}**\n**Причина: ${!reason ? "Не указана." : reason}**`);
        global.addMark(true, "🤬", data.User, message);
        await rUser.send(embed).catch(err => err);
        await message.channel.send(embed).catch(err => err);
        await rUser.roles.add(role, {
            reason
        });
        if (time) {
            await global.Collection.Member.upsertOne({
                GuildId: message.guild.id,
                UserId: rUser.id
            }, {
                Mute: time + Date.now()
            });
            await global.handlerMute({
                UserId: rUser.id,
                GuildId: message.guild.id
            }, time)
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
    name: 'mute',
    aliases: ['tempmute', 'мут', 'мьют', 'затычка', 'убитьчтобыслетеласосальня'],
    description: 'Запрещает участнику писать сообщения.',
    usages: {
        'mute @User#0001 1h': 'Запрещает участнику `@User#0001` писать сообщения 1 час.',
        'mute @User#0001': 'Запрещает участнику `@User#0001` писать сообщения навсегда.'
    },
    category: 'Модерирование'
}