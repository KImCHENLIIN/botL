global.bot.on("guildMemberAdd", async member => {
    if (!member.guild.me.hasPermission("MANAGE_ROLES")) return;
    const res = await global.Collection.Guild.getOne(data => data.GuildId == member.guild.id);
    if (!res.GuildId || !res.AutoRole) return;
    const role = await member.guild.roles.cache.get(res.AutoRole);
    if (role) {
        member.roles.add(role);
    } else {
        global.Collection.Guild.upsertOne({
            GuildId: member.guild.id
        }, {
            AutoRole: null
        });
    }
});