require("moment-duration-format");
module.exports.run = (bot, message, args) => {
  const duration = global.moment
    .duration(bot.uptime)
    .format(" D [days], H [hrs], m [mins], s [secs]");
  message.channel.send(
    new global.MessageEmbed()
      .setAuthor("Показатели бота.")
      .setColor("#a7f442")
      .setThumbnail(
        "https://discordemoji.com/assets/emoji/3619_discord_online.png"
      )
      .setTimestamp()
      .addField(
        "**⭕ | Использование памяти**",
        `**${(process.memoryUsage().heapUsed / (1000 * 1000)).toFixed(2)} MB**`,
        true
      )
      .addField("**🕑 | Uptime**", `**${duration}**`, true)
      .addField("**👥 | Пользователей**", `**${bot.users.cache.size}**`, true)
      .addField("**🌐 | Серверов**", `**${bot.guilds.cache.size}**`, true)
      .addField("**🗨 | Каналов**", `**${bot.channels.cache.size}**`, true)
      .addField("**⚙ | Кол-во команд**", `**${global.commands.size}**`, true)
      .addField("**💡 | Discord.js**", `**v${global.Discord.version}**`, true)
      .setFooter("Автор команды: 3ефирка❤")
  );
};
module.exports.help = {
  name: "botstats",
  aliases: ["bs", "статистика", "ботстат"],
  description: "Статистика бота.",
  usages: { "botstats": `Покажет статистику бота.` },
  category: "Информация о боте"
};