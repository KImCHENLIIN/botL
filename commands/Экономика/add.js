module.exports.run = async (bot, message, args, data) => {
  if (!message.member.hasPermission("ADMINISTRATOR")) return;
  let rUser = await message.mentions.users.first() || bot.users.cache.get(bot.toNum(args[0])),
    embed = new global.MessageEmbed()
      .setColor("80EB52")
      .setTitle("Добавление");
  if (!args[1]) return bot.sendErrEmbed(embed, `Используйте \`${data.command} @User#0001 <Сумма>\``, message);
  const sum = bot.toNum(args[1]) || (rUser ? null : bot.toNum(args[0]));
  if(!rUser) rUser = message.author;
  if (!sum) return bot.sendErrEmbed(embed, `Используйте \`${data.command} @User#0001 <Сумма>\``, message);
  const res = rUser.id == message.author.id ? data.Member : await global.Collection.Member.getOne(data => data.UserId == rUser.id && data.GuildId == message.guild.id);
  await global.Collection.Member.upsertOne({ UserId: rUser.id, GuildId: message.guild.id }, { Coins: res.Coins + sum })
  embed.addField(
    `${message.author.tag} добавил ${rUser.tag} ${bot.locale(sum)} $`,
    `**Баланс ${rUser.tag} составляет: ${bot.locale(res.Coins + sum)} $**`
  );
  message.channel.send(embed);
};
module.exports.help = {
  name: "add",
  aliases: ["добавить", "доб"],
  description: "Изменение баланса. (На вашем сервере.)",
  usages: { "add @User#0001 1000": "Добавить 1.000$" },
  category: "Экономика"
};