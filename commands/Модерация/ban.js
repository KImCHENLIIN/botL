module.exports.run = async(bot, message, args, data) => {
    if (!message.member.hasPermission("BAN_MEMBERS")) return;
    const embed = new global.MessageEmbed().setColor("FF8A14").setTitle("Блокировка.");
    const rUser = await message.mentions.members.first() || message.guild.members.cache.get(bot.toNum(args[0]));
    if (!rUser) return bot.sendErrEmbed(embed, "Пользователь не найден | Укажите пользователя через @", message);
    if (!rUser.bannable) return bot.sendErrEmbed(embed, `Пользователя **\`${rUser.user.tag}\`** невозможно забанить.`, message);
    const sym = args[1] ? args[1].split("").reverse()[0] : undefined;
    const time = bot.toNum(args[1]);
    console.log(sym)
    console.log(time)
    let reason = args.slice(2).join(" ");
    async function ban(time, content, reason) {
        embed.addField(`**Администратор \`${message.author.tag}\` заблокировал \`${rUser.user.tag}\`**`, `**Время блокировки: \`${!time ? "Навсегда." : content}\`**\n**Причина: \`${!reason ? "Не указана." : reason}\`**`);
        global.addMark(true, "🔨", data.User, message);
        rUser.send(embed).catch(err => err);
        message.channel.send(embed)
        await message.guild.members.ban(rUser, {
            reason
        });
        if (time) {
            await global.Collection.Member.upsertOne({
                GuildId: message.guild.id,
                UserId: rUser.id
            }, {
                Ban: Date.now() + time
            });
            global.handlerBan({
                UserId: rUser.id,
                GuildId: message.guild.id
            }, time);
        }
    }
    if (isNaN(time)) {
        ban(null, null, args.slice(1).join(" "));
    } else {
        if (["s", "с", "sec", "сек", "c"].some(e => e === sym.toLowerCase())) return ban(time * 1000, global.uts(time, "секунду", "секунды", "секунд"), reason);
        if (["m", "м", "min", "мин"].some(e => e === sym.toLowerCase())) return ban(60 * time * 1000, global.uts(time, "минуту", "минуты", "минут"), reason);
        if (["h", "ч", "hours", "час"].some(e => e === sym.toLowerCase())) return ban(60 * 60 * time * 1000, global.uts(time, "час", "часа", "часов"), reason);
        if (["d", "д", "day", "день"].some(e => e === sym.toLowerCase())) return ban(60 * 60 * 24 * time * 1000, global.uts(time, "день", "дня", "дней"), reason);
        if (["w", "н", "week", "неделя"].some(e => e === sym.toLowerCase())) return ban(60 * 60 * 24 * 7 * time * 1000, global.uts(time, "неделю", "недели", "недель"), reason);
        if (["y", "г", "year", "год"].some(e => e === sym.toLowerCase())) return ban(60 * 60 * 24 * 7 * 365 * time * 1000, global.uts(time, "год", "года", "лет"), reason);
        ban(time, global.uts(time, "миллисекунду", "миллисекунды", "миллисекунд"), reason);
    }
};
module.exports.help = {
    name: "ban",
    aliases: ["бан", "темпбан", "tempban", "забанить", "заблокировать"],
    description: "Забанить участника сервера.",
    category: "Модерирование",
    usages: {
        "ban @User#0001 1h": "Забанить участника на 1 час.",
        "ban @User#0001": "Забанить участника навсегда."
    }
};