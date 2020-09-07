module.exports.run = async (bot, message, args, data) => {
    const rUser = await message.mentions.users.first() || message.guild.members.cache.get(bot.toNum(args[0])) || message.member;
    let res = rUser.id == message.author.id ? data.Member : await global.Collection.Member.getOne(data => data.UserId == rUser.id && data.GuildId == message.guild.id);
    let time = res.VoiceTime;
    let sec, min, hours;
    hours = Math.floor(time / 1000 / 60 / 60);
    if (hours) time -= ((1000 * 60 * 60) * hours)
    min = Math.floor(time / 1000 / 60);
    if (min) time -= ((1000 * 60) * min)
    sec = Math.floor(time / 1000);
    message.channel.send(new global.MessageEmbed()
        .setColor("#36393f")
        .setAuthor("Онлайн.", "https://discordemoji.com/assets/emoji/5886_online.gif")
        .setTitle(`Количество часов в войсе: ${global.uts(hours, "час", "часа", "часов")} ${global.uts(min, "минута", "минуты", "минут")} ${global.uts(sec, "секунда", "секунды", "секунд")}.`))
};
module.exports.help = {
    name: 'online',
    aliases: ['онлайн', 'войс'],
    category: "Информация",
    description: 'Посмотреть ваш голосовой онлайн.',
    usages: {
        'online @User#0001': 'Покажет ваш голосовой онлайн.'
    }
};