const configCoins = global.config.Coins;
module.exports.run = async (bot, message, args, data) => {
    const rUser = await message.mentions.members.first() || message.guild.members.cache.get(bot.toNum(args[0]));
    if (!rUser) return bot.sendErrEmbed(new global.MessageEmbed(), "Укажите пользователя.", message);
    if (data.User.Coins < 10) return bot.sendErrEmbed(new global.MessageEmbed(), `У вас недостаточно ${configCoins.Format[3]}! ${configCoins.Value} Для этого действия требуется 10 ${configCoins.Format[3]}`, message);
    await global.Collection.User.upsertOne(
        { UserId: message.author.id },
        { Coins: data.User.Coins - 10 }
    );
    const { body } = await global.superagent.get("https://nekos.life/api/v2/img/tickle");
    message.channel.send(
        new global.MessageEmbed()
            .setColor("#FF30A2")
            .setTitle(`${message.author.username} пощекотал(а) ${rUser.user.username}`)
            .setImage(body.url)
    );
};
module.exports.help = {
    name: 'tickle',
    aliases: ['щекотать', 'защекотать', 'пощекотать'],
    description: 'Щекочет пользователя. (Стоимость 10 бананов.)',
    usages: { 'tickle @User#0001': 'Пощекочет @User#0001' },
    category: "Развлечения"
};