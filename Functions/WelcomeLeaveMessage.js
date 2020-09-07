async function script(member, text) {
    const res = await global.Collection.Guild.getOne(data => data.GuildId == member.guild.id);
    if (!res.ChannelJoinleave) return;
    const channel = member.guild.channels.cache.get(res.ChannelJoinleave);
    if (channel) {
        channel.send(new global.MessageEmbed().setColor("55E82A").setTitle(`${member.user.tag} ${text} ${member.guild.name}`).setFooter(`${member.guild.memberCount} участников.`));
    } else {
        global.Collection.Guild.upsertOne({
            GuildId: member.guild.id
        }, {
            ChannelJoinleave: null
        });
    }
}
global.bot.on("guildMemberAdd", async member => script(member, "добро пожаловать на"));
global.bot.on("guildMemberRemove", async member => script(member, "выход"));