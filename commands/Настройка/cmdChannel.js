module.exports.run = async (bot, message, args) => {
  if (!message.member.hasPermission("MANAGE_CHANNELS")) return;
  const embed = new global.MessageEmbed()
    .setColor("7FFFD4")
    .setTitle("Канал для команд."),
    channel = await message.mentions.channels.first() || message.guild.channels.cache.get(bot.toNum(args[0]));
  if (!channel) return bot.sendErrEmbed(embed, "Укажите канал.", message);
  await global.Collection.Guild.upsertOne(
    { GuildId: message.guild.id },
    { CmdChannel: channel.id }
  );
  embed.addField(
    message.author.tag,
    `**Канал ${channel} установлен как канал для команд.**`
  );
  message.channel.send(embed);
};
module.exports.help = {
  name: "cmdchannel",
  aliases: ["cch", "коммандыйканал", "каналдлякоманд", "кмдканал"],
  description: "Устанавливает использование команд в определённом канале.",
  usages: {
    "cmdChannel #channel":
      "Команды будет разрешено использовать только в канале `#channel`"
  },
  category: "Настройка"
};