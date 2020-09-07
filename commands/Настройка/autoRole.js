module.exports.run = async (bot, message, args) => {
  if (!message.member.hasPermission("MANAGE_ROLES")) return;
  let embed = new global.MessageEmbed().setColor("7FFFD4").setTitle("Авто-Pоль.");
  if (!args[0]) return bot.sendErrEmbed(embed, "Укажите роль.", message);
  const role = message.mentions.roles.first() || message.guild.roles.cache.get(bot.toNum(args[0])) || message.guild.roles.cache.find(e => e.name == args.join(" "));
  if (!role) return bot.sendErrEmbed(embed, "Роль не найдена.", message);
  await global.Collection.Guild.upsertOne(
    { GuildId: message.guild.id },
    { AutoRole: role.id }
  );
  embed.addField(
    message.author.tag,
    `**Роль ${role} установлена как автороль.**`
  );
  message.channel.send(embed);
};
module.exports.help = {
  name: "autoRole",
  aliases: [
    "автороль",
    "arole",
    "ароль",
    "автоматическаяроль",
    "рольпризаходе",
    "joinrole"
  ],
  description: "Выдает выбранную роль при заходе на ваш сервер",
  usages: {
    "autoRole @RoLe123": "При заходе на ваш сервер будет выдана роль `RoLe123`"
  },
  category: "Настройка"
};