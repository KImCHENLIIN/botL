const events = {
  MESSAGE_REACTION_ADD: "messageReactionAdd",
  MESSAGE_REACTION_REMOVE: "messageReactionRemove"
};
global.bot.on("raw", async event => {
  if (!events.hasOwnProperty(event.t)) return;
  const { d: data } = event;
  const user = global.bot.users.cache.get(data.user_id);
  if (user.bot) return;
  const channel = global.bot.channels.cache.get(data.channel_id);
  const guildid = data.guild_id;
  const res = await global.Collection.Guild.getOne(
    data => data.GuildId == guildid
  );
  const guild = await global.bot.guilds.cache.get(guildid)
  if (res.Verification) {
    async function returnDefaultPermissions() {
      guild.channels.cache.forEach(async channel => {
        await channel.overwritePermissions([
          {
            id: guild.roles.cache.find(e => e.name == "@everyone"),
            allow: ["VIEW_CHANNEL"]
          }
        ]);
      });
      global.Collection.Guild.upsertOne(
        { GuildId: guildid },
        { Verification: null }
      );
    }
    const verifyChannel = guild.channels.cache.get(res.Verification.Channel);
    if (!verifyChannel) return returnDefaultPermissions();
    let verifyMessage = await verifyChannel.messages.fetch(res.Verification.Msg),
      verifyRole = guild.roles.cache.get(res.Verification.Role);
    if (!verifyChannel || !verifyMessage || !verifyRole)
      return returnDefaultPermissions();
    if (
      data.member &&
      data.channel_id == res.Verification.Channel &&
      data.message_id == res.Verification.Msg &&
      data.emoji.name == "✅"
    ) {
      verifyMessage.reactions.cache.forEach(e => e.users.remove(data.user_id));
      let member = guild.members.cache.get(data.user_id);
      member.roles.add(verifyRole);
    }
  }
});
