const configCoins = global.config.Coins;
module.exports.run = async (bot, message, args, data) => {
  let rUser = await message.mentions.users.first() || bot.users.cache.get(bot.toNum(args[0])),
    embed = new global.MessageEmbed()
      .setColor("80EB52")
      .setTitle("Изменение " + configCoins.Format[3] + ".");
  let sum = bot.toNum(args[1]) || (rUser ? null : bot.toNum(args[0]));
  if(!rUser) rUser = message.author;
  if (!sum) return bot.sendErrEmbed(embed, `Используйте \`${data.command} @User#0001 <Cумма>\``, message);
  embed.addField(
    `${message.author.tag} изменил ${message.author.id == rUser.id ? "себе" : rUser.tag} ${bot.locale(sum)} ${global.config.Coins.Value}`,
    `**Баланс \`${rUser.tag}\` составляет: ${bot.locale(sum)} ${global.config.Coins.Value}**`
  );
  await global.Collection.User.upsertOne({ UserId: rUser.id }, { Coins: sum });
  message.channel.send(embed);
};
module.exports.help = {
  name: "globalSet",
  aliases: [
    "gset",
    "глобалустановить",
    "установитьглобал",
    "густановить",
    "густ",
    "setbananas",
    "setban",
    "установитьбананы"
  ],
  description: "Изменение количества бананов.",
  usages: {
    "gset @User#0001 1050": "Изменит количество бананов \`@User#0001\` на 1050."
  },
  category: "Экономика",
  owneronly: true
};