module.exports.run = async (bot, message, args, data) => {
  if (!message.member.hasPermission("BAN_MEMBERS")) return;
  const embed = new global.MessageEmbed()
    .setColor("FF4EFF")
    .setTitle("Анти-Pеклама.");
  let vkl;
  if (!data.Guild.blockInvites) {
    vkl = "включили";
    data.Guild.blockInvites = true;
  } else {
    vkl = "выключили";
    data.Guild.blockInvites = false;
  }
  await global.Collection.Guild.upsertOne(
    { GuildId: message.guild.id },
    { blockInvites: data.Guild.blockInvites }
  );
  embed.addField(message.author.tag, `Вы ${vkl} блокировку приглашений`);
  message.channel.send(embed);
};
module.exports.help = {
  name: "blockinvites",
  aliases: ["bi", "блокировкаприглашений", "бп", "антиреклама", "antiinvite"],
  description: "Удаляет приглашения на другие сервер и выдает мут.",
  usages: { "blockinvites": "Включение-отключение блокировки приглашения." },
  category: "Настройка"
};