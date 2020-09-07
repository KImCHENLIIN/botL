module.exports.run = (bot, message, args) => {
        global.Collection.User.getData().then(async data => {
            const users = data
              .array()
              .filter(user => message.guild.members.cache.has(user.UserId))
              .sort((a, b) => (a.Level === b.Level) ? b.Level * 8 + b.Xp - (a.Level * 8 + a.Xp) : b.Level - a.Level)
              .slice(0, 10);
            const fields = users.map((u, i) => {
                const user = global.bot.users.cache.get(u.UserId);
                return { name: `[ ${i + 1} ]. ${user.tag}`, value: `Уровень: ${u.Level}` };
            });
          message.channel.send(
            new global.MessageEmbed({ fields })
              .setColor("#FF30A2")
              .setAuthor("Таблица лидеров участников по уровню.")
          );
        }).catch((err) => message.channel.send(`Произошла неизвестная ошибка!\n${"```prolog\ n " + err.message + "\n ```"}`));
};

module.exports.help = {
  name: "topMembers",
  aliases: [],
  description: "Топ 10 лидеров участников по уровню.",
  usages: { "topMembers": `Выведет сообщение.` },
  category: "Топы"
};