const configCoins = global.config.Coins;
module.exports.run = async (bot, message, args, data) => {
    const rUser = await message.mentions.users.first() || message.guild.members.cache.get(bot.toNum(args[0])),
        embed = new global.MessageEmbed().setColor("#FF30A2")
    if (!rUser) return bot.sendErrEmbed(embed, 'Укажите пользователя', message);
    if (data.User.Coins < 15) return bot.sendErrEmbed(embed, `У вас недостаточно ${configCoins.Format[3]}! ${configCoins.Value} Для этого действия требуется 15 ${configCoins.Format[3]}`, message);
    const { body } = await global.superagent.get("https://nekos.life/api/v2/img/slap");
    await global.Collection.User.upsertOne({ UserId: message.author.id }, { Coins: data.User.Coins - 15 })
    embed
        .setTitle(`${message.author.username} ударил(а) ${message.mentions.users.first().username}`)
        .setImage(body.url)
    message.channel.send(embed)
};
module.exports.help = {
    name: 'slap',
    aliases: ['шлепнуть', 'ударить', 'слапнуть'],
    description: 'Ударить пользователя. (Стоимость 15 бананов.)',
    usages: { 'slap @User#0001': 'Ударит @User#0001 ♥' },
    category: "Развлечения"
};