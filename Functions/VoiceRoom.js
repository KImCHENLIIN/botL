global.bot.on("voiceStateUpdate", async (oldState, newState) => {
    const newUserChannel = newState.channel,
        oldUserChannel = oldState.channel,
        guild = newState.guild || oldState.guild,
        res = await global.Collection.Guild.getOne(data => data.GuildId == guild.id);
    if (!res.privateChannel) return;
    if (newUserChannel && newUserChannel.id == res.privateChannel) {
        const channel = await newState.guild.channels.create(`${newState.member.user.username} \`s channel`, {
            type: "voice",
            userLimit: 5,
            parent: newUserChannel.parentID,
            permissionOverwrites: [{
                id: newState.member.id,
                allow: ["MANAGE_CHANNELS"]
            }]
        });
        await newState.member.voice.setChannel(channel);
    }
    const createChannel = global.bot.channels.cache.get(res.privateChannel);
    if (!createChannel) {
        global.Collection.Guild.upsertOne({
            GuildId: guild.id
        }, {
            privateChannel: false
        });
    } else if (oldUserChannel && oldUserChannel.parentID === createChannel.parentID && oldUserChannel.members.size == 0 && oldUserChannel != createChannel) oldUserChannel.delete();
});