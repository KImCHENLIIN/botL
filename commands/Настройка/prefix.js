module.exports.run = async (bot, message, args) => {
  const embed = new global.MessageEmbed().setColor("7FFFD4").setTitle("Префикс бота.");
  if (!args[0]) return bot.sendErrEmbed(embed, "Укажите префикс.", message);
  if (args.join("").length > 5) return bot.sendErrEmbed(embed, "Префикс не должен быть больше 5 символов.", message);
  embed.setDescription(`Префикс \`${args.join("")}\` установлен!`)
  await global.Collection.Guild.upsertOne({ GuildId: message.guild.id }, { Prefix: args.join("") })
  message.channel.send(embed);
}
module.exports.help = {
  name: 'prefix',
  description: "Поставить префикс для бота. (Префикс должен быть не более 5 символов.)",
  category: 'Настройка',
  usages: {
    'prefix /': 'Поставить префикс: `/`\nТеперь все команды надо будет вводить через `/`, а не через `!`'
  }
}