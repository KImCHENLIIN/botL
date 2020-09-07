module.exports.run = async (bot, message, args, data) => {
    const rUser = await message.mentions.members.first() || message.guild.members.cache.get(bot.toNum(args[0])),
        embed = new global.MessageEmbed().setColor('#36393f').setTitle('Платеж.'),
        num = bot.toNum(args[1]);
    if (!rUser || !num) return bot.sendErrEmbed(embed, `Используйте: \`${data.command} @User#0001 <Cумма>\``, message)
    if (rUser.id == message.author.id) return bot.sendErrEmbed(embed, `Нельзя самому себе передать!`, message)
    if (num > data.Member.Coins) return bot.sendErrEmbed(embed, `У вас недостаточно денег! Ваш баланс: ${bot.locale(data.Member.Coins)}`, message)
    const res = await global.Collection.Member.getOne(data => data.UserId == rUser.id && data.GuildId == message.guild.id);
    global.addMark(num >= 1000000, '👼', data.User, message);
    await global.Collection.Member.upsertOne({
        UserId: message.author.id,
        GuildId: message.guild.id
    }, { Coins: data.Member.Coins - num });
    await global.Collection.Member.upsertOne({
        UserId: rUser.id,
        GuildId: message.guild.id
    }, { Coins: res.Coins + num });
    embed.addField(message.author.tag, `**Вы передали ${rUser.user.tag} ${bot.locale(num)} $!
    Ваш баланс: ${bot.locale(data.Member.Coins)} $**`);
    message.channel.send(embed)
}
module.exports.help = {
    name: 'pay',
    aliases: ['передать', 'платеж', 'отдать', 'перекинуть', 'заплатить'],
    description: 'Передать деньги другому пользователю.',
    usages: {
        'pay @User#0001 3000': 'Передаст `@User#0001` 3.000$'
    },
    category: 'Экономика'
}