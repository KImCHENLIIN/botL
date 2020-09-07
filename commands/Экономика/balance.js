module.exports.run = async (bot, message, args, data) => {
  const rUser = message.mentions.members.first() || message.guild.members.cache.get(bot.toNum(args[0])) || message.member,
        res = rUser.id == message.author.id ? data.User : await global.Collection.User.getOne(data => data.UserId == rUser.id),
        resMember = rUser.id == message.author.id ? data.Member : await global.Collection.Member.getOne(data => data.UserId == rUser.id && data.GuildId == message.guild.id);
  message.channel.send(
    new global.MessageEmbed()
      .setTitle(`Баланс участника ${rUser.user.tag}`)
      .setThumbnail(rUser.user.displayAvatarURL({ format: "png", size: 4096, dynamic: true }))
      .setColor("#36393f")
      .addField("**💰 Баланс**", `**${bot.locale(resMember.Coins)} $**`)
      .addField("**🍌 Бананов**", `**${bot.locale(res.Coins)}**`)
  )
};

module.exports.help = {
  name: "balance",
  aliases: [],
  description: "Узнать свой или чужой баланс.",
  usages: {
    "balance": "Покажет ваш баланс.",
    "balace @User#0001": "Покажет баланс участника User#0001."
  },
  category: "Экономика"
};