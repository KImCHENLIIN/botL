module.exports.run = async (bot, message, args) => {
  const rUser = await message.mentions.users.first() || bot.users.cache.get(bot.toNum(args[0])) || message.author;
  await message.channel.send(
    new global.MessageEmbed()
      .setColor("9D4DFF")
      .setTitle(`Аватар ${rUser.username}!`)
      .setImage(rUser.displayAvatarURL({ format: "png", dynamic: true, size: 2048 }))
  );
};
module.exports.help = {
  name: "avatar",
  aliases: ["аватар"],
  description: "Получить аватар пользователя.",
  usages: {
    "avatar": "Получает ваш аватар.",
    "avatar @User#0001": "Аватар @User#0001."
  },
  category: "Инструменты"
};
