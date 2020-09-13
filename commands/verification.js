module.exports.run = async (bot, message) => {
  if (!message.member.hasPermission("ADMINISTRATOR")) return;
  const id = message.guild.roles.cache.find(e => e.name == "@everyone");
  const verifyRole = await message.guild.roles.create({
    data: {
      name: "Verified",
      color: "#000000"
    }
  });
  message.guild.channels.cache
    .filter(e => e.id != message.channel.id)
    .forEach(async channel => {
      await channel.overwritePermissions([
        {
          id,
          deny: ["VIEW_CHANNEL"]
        },
        {
          id: verifyRole,
          allow: ["VIEW_CHANNEL"]
        }
      ]);
    });
  await message.channel.overwritePermissions([
    {
      id,
      deny: ["SEND_MESSAGES"],
      allow: ["VIEW_CHANNEL"]
    },
    { id: verifyRole, deny: ["VIEW_CHANNEL"] }
  ]);
  message.channel
    .send(
      new global.MessageEmbed().setColor("2CE871")
        .setTitle(`Добро пожаловать на ${message.guild.name}
        Для доступа на сервер нажмите - ✅`)
    )
    .then(async msg => {
      await global.Collection.Guild.upsertOne(
        { GuildId: message.guild.id },
        {
          Verification: {
            Msg: msg.id,
            Role: verifyRole.id,
            Channel: message.channel.id
          }
        }
      );
      await msg.react("✅");
    });
};
module.exports.help = {
  name: "verification",
  aliases: ["verify", "проверка", "антибот"],
  description: "Для доступа на сервер надо поставить реакцию.",
  usages: { verification: "Добавить сообщение с реакцией." },
  category: "Модерирование"
};
