const configCoins = global.config.Coins;
module.exports.run = async (bot, message, args, data) => {
  if (!message.channel.nsfw) return bot.sendErrEmbed(new global.MessageEmbed(), "Использование 18+ команд только в nsfw чатах.", message);
  if (data.User.Coins < 25) return bot.sendErrEmbed(new global.MessageEmbed(), `У вас недостаточно ${configCoins.Format[3]}! ${configCoins.Value} Для этого действия требуется 25 ${configCoins.Format[3]}`, message);
  const { body } = await global.superagent.get("https://nekos.life/api/v2/img/anal");
  data.User.Coins -= 25;
  await global.Collection.User.upsertOne(
    { UserId: message.guild.id },
    { Coins: data.User.Coins }
  );
  message.channel.send(
    new global.MessageEmbed()
      .setColor("#FF30A2")
      .setTitle(message.author.username)
      .setImage(body.url)
  );
};
module.exports.help = {
  name: "anal",
  aliases: ["анал", "жопа", "ачко"],
  description: "Покажет картинки 18+ (Стоимость 25 бананов)",
  usages: { "anal": "NSFW NSWF NSFW" },
  category: "18+"
};