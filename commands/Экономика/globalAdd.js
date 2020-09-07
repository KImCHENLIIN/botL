const configCoins = global.config.Coins;
module.exports.run = async (bot, message, args, data) => {
  let rUser = await message.mentions.users.first() || bot.users.cache.get(bot.toNum(args[0])),
    embed = new global.MessageEmbed()
      .setColor("80EB52")
      .setTitle("Добавление " + configCoins.Format[3] + ".");
  let sum = bot.toNum(args[1]) || (rUser ? null : bot.toNum(args[0]));
  if(!rUser) rUser = message.author;
  if (!sum) return bot.sendErrEmbed(embed, `Используйте \`${data.command} @User#0001 <Cумма>\``, message)
  let res = rUser.id == message.author.id ? data.User : await global.Collection.User.getOne(data => data.UserId == rUser.id);
  embed.addField(
    `${message.author.tag} добавил ${rUser.id == message.author.id ? "себе" : rUser.tag} ${bot.locale(sum)} ${global.config.Coins.Value}`,
    `**Баланс ${rUser.tag} составляет: ${bot.locale(res.Coins + sum)} ${global.config.Coins.Value}**`
  );
  await global.Collection.User.upsertOne(
    { UserId: rUser.id },
    { Coins: res.Coins + sum }
  );
  message.channel.send(embed);
};
module.exports.help = {
  name: "globalAdd",
  aliases: [
    "gadd",
    "глобалдобавить",
    "добавитьглобал",
    "гдобавить",
    "гдоб",
    "addbananas",
    "addban",
    "добавитьбананов"
  ],
  description: "Изменение количества бананов.",
  usages: { "gAdd @user#0001 1000": "Добавит 1.000 бананов." },
  category: "Экономика",
  owneronly: true
};