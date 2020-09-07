  module.exports.run = async (bot, message, args) => {
  if (!message.member.hasPermission("KICK_MEMBERS")) return;
  const rUser = await message.mentions.members.first() || message.guild.members.cache.get(bot.toNum(args[0])),
    embed = new global.MessageEmbed().setColor("FF8A14").setTitle("Кик.");
  let reason = args.slice(1).join(" ");
  if (!rUser) return bot.sendErrEmbed(embed, "Пользователь не найден | Укажите пользователя через @", message);
  if (!rUser.kickable) return bot.sendErrEmbed(embed, `Пользователя ${rUser.user.tag} невозможно кикнуть!`, message);
  if (!reason) reason = "Не указана.";
  embed.addField(
    `**Администратор \`${message.author.tag}\` кикнул \`${rUser.user.tag}\`**`,
    `**Причина кика: \`${reason}\`**`
  );
  await rUser.send(embed).catch(err => err);
  await message.channel.send(embed).catch(err => err);
  await rUser.kick(rUser)
};
module.exports.help = {
  name: "kick",
  aliases: ["кик", "кикнуть", "закикать", "кикуть", "кицк"],
  description: "Выгнать/Кикнуть участника с сервера",
  category: "Модерирование",
  usages: {
    "kick @User#0001 Причина": "Kикнуть участника User#0001 без причины.",
    "kick @User#0001 Hе оплатил налог.":
      "Kикнуть участника User#0001 по причине: `Hе оплатил налог`."
  }
};