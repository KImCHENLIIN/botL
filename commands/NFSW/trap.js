const configCoins = global.config.Coins;
module.exports.run = async (bot, message, args, data) => {
    if (!message.channel.nsfw) return bot.sendErrEmbed(new global.MessageEmbed(), "Использование 18+ команд только в nsfw чатах.", message);
    let coins = data.User.Coins;
    if (coins < 25) return bot.sendErrEmbed(new global.MessageEmbed(), `У вас недостаточно ${configCoins.Format[3]}! ${configCoins.Value} Для этого действия требуется 25 ${configCoins.Format[3]}`, message);
    const { body } = await global.superagent.get("https://nekos.life/api/v2/img/trap");
    await message.channel.send(
        new global.MessageEmbed()
            .setColor("#FF30A2")
            .setTitle(message.author.username)
            .setImage(body.url)
    );
    global.Collection.User.upsertOne(
        { UserId: message.guild.id },
        { Coins: coins - 25 }
    );
    global.addMark(true, '😳', data.User, message);
};
module.exports.help = {
    name: 'trap',
    aliases: ['трап', 'мальчикдевка', 'некотя'],
    description: 'Покажет картинки 18+ (Стоимость 25 бананов.)',
    usages: { 'trap': 'NSFW NSWF NSFW' },
    category: "18+"
};