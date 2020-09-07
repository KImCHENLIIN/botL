module.exports.run = async (bot, message, args, data) => {
  const embed = new global.MessageEmbed().setColor("FFDC4C").setTitle("Бонус");
  let time = data.Member.BonusTime - Date.now();
  let sec, min, hours;
  hours = Math.floor(time / 1000 / 60 / 60);
  if (hours) time -= 1000 * 60 * 60 * hours;
  min = Math.floor(time / 1000 / 60);
  if (min) time -= 1000 * 60 * min;
  sec = Math.floor(time / 1000);
  if (data.Member.BonusTime > Date.now()) return bot.sendErrEmbed(embed, `Вы можете получить бонус снова через ${global.uts(hours, "час", "часа", "часов")} ${global.uts(min, "минуту", "минуты", "минут")} ${global.uts(sec, "секунду", "секунды", "секунды")} ${!hours && !min && !sec ? `${global.uts(time, "миллисекунду", "миллисекунды", "миллисекунд")}.` : ""}`, message);
  await global.Collection.Member.upsertOne(
    { UserId: message.author.id, GuildId: message.guild.id },
    {
      Coins: data.Member.Coins + global.config.bonus,
      BonusTime: Date.now() + 1000 * 60 * global.config.bonusInterval
    })
  embed.addField(message.author.tag, `**Вы получили ${bot.locale(global.config.bonus)} $**`);
  global.addMark(true, "📈", data.User, message);
  message.channel.send(embed);
};
module.exports.help = {
  name: "bonus",
  aliases: ["b", "бонус", "$", "timely"],
  description: "Бонусные доллары раз в 12 часов.",
  usages: { "bonus": `Получить бонус.` },
  category: "Экономика"
};