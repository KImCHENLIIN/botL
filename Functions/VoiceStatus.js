async function script(member, ac) {
    if (!member.guild.me.hasPermission("MANAGE_CHANNELS")) return;
    const res = await global.Collection.Guild.getOne(data => data.GuildId == member.guild.id);
    let a = false;
    if (res.ChannelBotCount) {
        const channel = member.guild.channels.cache.get(res.ChannelBotCount);
        if (channel) {
            const channelName = channel.name.replace(/[0-9]/g, "");
            channel.setName(`${channelName}${
                member.guild.members.cache.filter(m => m.user.bot).size
                }`);
        } else {
            a = true;
            res.ChannelBotCount = null;
        }
    }
    if (res.ChannelUsersCount) {
        const channel = member.guild.channels.cache.get(res.ChannelUsersCount);
        if (channel) {
            const channelName = channel.name.replace(/[0-9]/g, "");
            channel.setName(`${channelName}${
                member.guild.members.cache.filter(m => !m.user.bot).size
                }`);
        } else {
            a = true;
            res.ChannelUsersCount = null;
        }
    }
    if (res.ChannelVoiceOnline && ac) {
        const channel = global.bot.channels.cache.get(res.ChannelVoiceOnline);
        if (channel) {
            const channelName = channel.name.replace(/[0-9]/g, "");
            channel.setName(`${channelName}${
                member.guild.members.cache.filter(m => m.voice.channel).size
                } `).catch(err => err);
        } else {
            res.ChannelVoiceOnline = null;
            a = true;
        }
    }
    if (a) {
        delete res._id;
        delete res.GuildId;
        global.Collection.Guild.upsertOne({
            GuildId: member.guild.id
        }, res);
    }
}
global.bot.on("guildMemberAdd", member => script(member));
global.bot.on("guildMemberRemove", member => script(member));
global.bot.on("voiceStateUpdate", (oldState, newState) => script(newState.member, true));