module.exports.run = async (bot, message, args, data) => {
    const rUser = await message.mentions.members.first() || message.guild.members.cache.get(bot.toNum(args[0])) || message.member,
        res = rUser.id == message.author.id ? data.User : await global.Collection.User.getOne(data => data.UserId == rUser.id),
        resMember = rUser.id == message.author.id ? data.Member : await global.Collection.Member.getOne(data => data.UserId == rUser.id && data.GuildId == message.guild.id),
        resClan = rUser.id == message.author.id ? data.Clan : await global.Collection.Clan.getOne(data => res.ClanId == res.ClanId);
    let voiceTime = resMember.VoiceTime;
    let sec, min, hours;
    hours = Math.floor(voiceTime / 1000 / 60 / 60);
    if (hours) voiceTime -= ((1000 * 60 * 60) * hours)
    min = Math.floor(voiceTime / 1000 / 60);
    if (min) voiceTime -= ((1000 * 60) * min)
    sec = Math.floor(voiceTime / 1000);
    const embed = new global.MessageEmbed()
        .setThumbnail(rUser.user.displayAvatarURL({ format: "png", size: 2048, dynamic: true }))
        .setColor("#36393f")
        .setDescription(`${"```fix\n"}${res.Status}\n${"```"}`)
        .setTitle(`**${rUser.user.username}**`)
        .setImage(`https://media.giphy.com/media/NKEt9elQ5cR68/giphy.gif`)
    const pages = {
        0: new global.MessageEmbed(embed)
            .addField("**💰 Баланс**", `**${bot.locale(resMember.Coins)} $**`, true)
            .addField("**⚔ Клан**", `**${resClan && resClan.Name ? resClan.Name : "Отсутствует."}**`, true)
            .addField("**🔰 Лвл**", `**${bot.locale(res.Level)}**`, true)
            .addField(`📢Голосовой онлайн:`,
                `${global.uts(hours, "час", "часа", "часов")},
${global.uts(min, "минута", "минуты", "минут")},
${global.uts(sec, "секунда", "секунды", "секунд")}.`, true)
            .addField("**🚩 Варны**", `**${resMember.Warns}**`, true)
            .addField("**🍌 Бананов**", `**${bot.locale(res.Coins)}**`, true),
        1: new global.MessageEmbed(embed)
            .addField("**💑 Партнер**", `**${res.Parther && bot.users.cache.has(res.Parther) ? bot.users.cache.get(res.Parther).tag : "Нету."}**`, true)
            .addField("**⛏️ Работа**", `**${global.config.works[res.WorkLevel].name}**`, true)
            .addField("**💵 Рубли **", `**${res.Rubles} ₽**`, true)
            .addField("**🏅 Достижения**", `**${res.Marks.join(" ")}**`)
    };
    let page = 0;
    let msg = await message.channel.send(pages[0].setFooter(`Страница ${page + 1} из 2`));
    await msg.react("⏪");
    await msg.react("⏩");
    const backwardsFilter = (reaction, user) => reaction.emoji.name === "⏪" && user.id === message.author.id;
    const forwardsFilter = (reaction, user) => reaction.emoji.name === "⏩" && user.id === message.author.id;
    const backwards = msg.createReactionCollector(backwardsFilter);
    const forwards = msg.createReactionCollector(forwardsFilter);
    setTimeout(() => {
        backwards.stop();
        forwards.stop();
        msg.delete();
        message.delete();
    }, 90000);
    backwards.on("collect", r => {
        msg.reactions.cache.forEach(e => e.users.remove(message.author.id));
        if (page === 0) return;
        page--;
        msg.edit(pages[page].setFooter(`Страница ${page + 1} из 2`));
    });
    forwards.on("collect", r => {
        msg.reactions.cache.forEach(e => e.users.remove(message.author.id));
        if (page === 1) return;
        page++;
        msg.edit(pages[page].setFooter(`Страница ${page + 1} из 2`));
    });
};
module.exports.help = {
    name: "profile",
    aliases: ["p", "профиль", "п"],
    description: "Посмотреть ваш профиль",
    usages: {
        "profile @User#0001": "Покажет ваш профиль."
    },
    category: "Информация"
};