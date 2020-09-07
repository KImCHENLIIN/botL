module.exports.run = async (bot, message, args, data) => {
  let time = data.User.WorkTime - Date.now();
  let sec, min, hours;
  hours = Math.floor(time / 1000 / 60 / 60);
  if (hours) time -= 1000 * 60 * 60 * hours;
  min = Math.floor(time / 1000 / 60);
  if (min) time -= 1000 * 60 * min;
  sec = Math.floor(time / 1000);
  const works = global.config.works,
        embed = new global.MessageEmbed()
            .setColor('#36393f')
            .setTitle('Работа');
    if (data.User.WorkTime > Date.now()) return bot.sendErrEmbed(embed, `**Вы уже поработали! Вы сможете работать снова через ${hours > 0 ? global.uts(hours, "час ", "часа ", "часов ") : ''}${min > 0 ? `${global.uts(min - (hours * 60), "минута ", "минуты ", "минут ")}` : ''}${sec > 0 ? `${global.uts(sec - (min * 60), "секунда ", "секунды ", "секунд ")}` : ''}${(!hours && !min && !sec) ? global.uts(time, "миллисекунда", "миллисекунды", "миллисекунд") : ''}** `, message);
    data.User.Coins += global.config.works[data.User.WorkLevel].coins;
    data.User.WorkTime = Date.now() + (1000 * 60 * global.config.workInterval);
    embed.addField(`${message.author.tag} `, `**Вы поработали на работе __${works[data.User.WorkLevel].name}__ и заработали ${bot.locale(works[data.User.WorkLevel].coins)} ${global.config.Coins.Value}** `)
    if (works[data.User.WorkLevel + 1] && data.User.WorkCount <= works[data.User.WorkLevel + 1].xp) embed.setFooter(`Осталось поработать ${global.uts(works[data.User.WorkLevel + 1].xp - data.User.WorkCount + 1, "раз", "раза", "раз")} Следующая должность: "${works[data.User.WorkLevel + 1].name}`)
    if (works[data.User.WorkLevel + 1] && data.User.WorkCount > works[data.User.WorkLevel + 1].xp) {
      embed.addField('Поздравляем!', '**Вы получили повышение.**');
      data.User.WorkLevel++;
    }
    await global.Collection.User.upsertOne({ UserId: message.author.id },
        {
            Coins: data.User.Coins,
            WorkCount: data.User.WorkCount + 1,
            WorkTime: data.User.WorkTime,
            WorkLevel: data.User.WorkLevel
        }
    )
    await message.channel.send(embed);
    global.addMark(true, '👷', data.User, message);
}
module.exports.help = {
    name: 'work',
    aliases: ['работа', 'работать', 'зарабатывать', 'hackme', 'дайтеденег'],
    description: 'Поработать на вашей работе.',
    usages: { 'work': 'Вы поработаете на своей работе.' },
    category: 'Экономика'
}