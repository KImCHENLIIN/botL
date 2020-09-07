const config = global.config.VoiceOnline,
    ignorChannel = ["718083354372866099", "718083354372866099"]; // Игнорируемые каналы.
global.bot.on("voiceStateUpdate", async (oldState, newState) => {
    const oldMember = oldState.member,
        newMember = newState.member,
        { guild } = newMember,
        newChannel = newState.channel,
        oldChannel = oldState.channel;
    if (oldChannel && newChannel && oldChannel.id == newChannel.id) return;
    if (ignorChannel.some(id => (newChannel && newChannel.id == id) || (oldChannel && oldChannel.id == id))) return;
    let oldTime, newTime;
    if (!oldChannel && newChannel) {
        global.Collection.User.upsertOne({
            UserId: oldMember.id
        }, {
            OldMember: Date.now()
        });
    } else {
        newTime = Date.now();
        const res = await global.Collection.User.getOne(data => data.UserId == oldMember.id),
            resMember = await global.Collection.Member.getOne(data => data.UserId == oldMember.id && data.GuildId == guild.id);
        oldTime = res.OldMember;
        if (!oldTime) return;
        const time = parseInt(newTime - oldTime)
              resMember.VoiceTime2 += time;
      resMember.VoiceTime += (time);
        const coins = Math.floor(resMember.VoiceTime2 / config.Time) * config.Coins;
        res.OldMember = null;
        if (coins) {
            resMember.Coins += coins;
            resMember.VoiceTime2 = resMember.VoiceTime2 % config.Time;
        };
        delete res._id;
        delete res.UserId;
        delete resMember._id;
        delete resMember.UserId;
        delete resMember.GuildId;
        global.Collection.User.upsertOne({
            UserId: oldMember.id
        }, res);
        global.Collection.Member.upsertOne({
            UserId: oldMember.id,
            GuildId: oldMember.guild.id
        }, resMember)
    }
});