module.exports.run = (bot, message, args) => {
        global.Collection.Clan.getData().then(async data => {
            const clans = data.filter(c => c.GuildId === message.guild.id)
              .array()
              .sort((a, b) => (a.Level === b.Level) ? b.Level * 1000 + b.Xp - (a.Level * 1000 + a.Xp) : b.Level - a.Level)
              .slice(0, 10);
            const fields = clans.map((c, i) => {
                const ownerClan = global.bot.users.cache.get(c.ClanId) || { tag: "Без владельца." };
                return { name: `[ ${i + 1} ]. ${c.Name}`, value: `Владелец: ${ownerClan.tag}\nУровень: ${c.Level}` };
            });
          message.channel.send(
            new global.MessageEmbed({ fields })
              .setColor("#FF30A2")
              .setAuthor("Таблица лидеров клана по уровню.")
          );
        }).catch((err) => message.channel.send(`Произошла неизвестная ошибка!\n${"```prolog\ n " + err.message + "\n ```"}`));
};

module.exports.help = {
  name: "topClans",
  aliases: [],
  description: "Топ 10 лидеров клана по уровню.",
  usages: { "topClans": `Выведет сообщение.` },
  category: "Топы"
};