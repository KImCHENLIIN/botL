module.exports.run = async (bot, message, args) => {
  if (!message.member.hasPermission("MANAGE_MESSAGES")) return;
  let num = bot.toNum(args[0]);
  const embed = new global.MessageEmbed().setColor("FFC194");
  if (!num) {
    num = 5;
  } else if (num > 100 || num < 1) {
    return bot.sendErrEmbed(embed, `Укажите число меньше 100 и больше 1.`, message);
  } else if (num == 1) num = 2;
  message.channel
    .bulkDelete(Math.floor(num))
    .then(() => {
      embed.setTitle(`Успешно очищенно **${num}** сообщений.`);
      message.channel.send(embed);
    })
    .catch(err => {
      if (err.message == "You can only bulk delete messages that are under 14 days old.") bot.sendErrEmbed(embed, `В диапозоне **${num}** есть сообщения старше 14 дней.`, message);
    });
};
module.exports.help = {
  name: "clear",
  aliases: ["сдуфк", "clr", "отчистка", "чистить", "чистиговновилкой"],
  description: "Очистить чат,",
  category: "Модерирование",
  usages: { "clear 40": "Очистит 40 сообщений в чате." }
};