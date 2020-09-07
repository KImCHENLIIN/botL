module.exports.run = async (bot, message, args, data) => {
  const bug = args.join(" "),
    embed = new global.MessageEmbed()
      .setColor("EB40FF")
      .setTitle("Отправка бага.");
  if (!bug) return bot.sendErrEmbed(embed, 'Укажите описание бага.', message);
  if (bug.length > 1920) return;
  message.delete();
  let bugText = `
**Новый баг от __${message.author.tag}__ [${message.author.id}]**

**Описание бага:**
${bug}`;
  global.config.owners
    .filter(e => bot.users.cache.has(e))
    .forEach(e => bot.users.cache.get(e).send(bugText));
  embed.setTitle("Баг отправлен!");
  await message.channel.send(embed);
  global.addMark(true, "🆘", data.User, message);
};
module.exports.help = {
  name: "bug",
  aliases: ["баг", "чтоетозабред", "сломалбота.com"],
  description: "Зарепортить баг в боте.",
  usages: { "bug ошибка": "Отправит ошибку создателям бота." },
  category: "Разработка"
};