global.bot.on("message", async message => {
    if (message.author.bot || message.channel.type === "dm") return;
    const res = {
        User: await global.Collection.User.getOne(data => data.UserId == message.author.id),
        Guild: await global.Collection.Guild.getOne(data => data.GuildId == message.guild.id),
        Member: await global.Collection.Member.getOne(data => data.UserId == message.author.id && data.GuildId == message.guild.id),
    };
    res.Clan = await global.Collection.Clan.getOne(data => data.ClanId == res.Member.ClanId && data.GuildId == message.guild.id);
    message.prefix = res.Guild.Prefix
    res.User.Coins++;
    res.User.Xp++;
    if (res.User.Xp >= res.User.Level * 8) {
        res.User.Level++;
        res.User.Xp = 0;
        if ((res.User.Level % 20) === 0) res.Member.Coins += 5000;    
    };
    global.addMark(res.User.Coins >= 1000, "🐵", res.User, message);
    global.addMark(res.User.Coins >= 100000, "💵", res.User, message);
    global.addMark(res.User.Coins >= 50000000, "🍌", res.User, message);
    global.addMark(res.User.Level >= 5, "📘", res.User, message);
    global.addMark(res.User.Level >= 25, "👨‍🎓", res.User, message);
    global.addMark(res.User.Level >= 100, "👨‍🔬", res.User, message);
    global.addMark(res.User.Level >= 499, "🤖", res.User, message);
    global.addMark(res.User.Level >= 1001, "🤡", res.User, message);
    global.addMark(res.User.ClanId, "🧙‍♀️", res.User, message);
    global.addMark(res.User.Partner, "💑", res.User, message);
    await global.clanTrigger(res.Clan, message);

    function blockInvites() {
        if (!res.Guild.blockInvites || message.member.hasPermission("MANAGE_MESSAGES") || !message.content.includes("discord.gg/" || "discordapp.com/invite/")) return;
        message.delete();
        if (!res.Guild.MuteRole) return;
        const roleS = message.guild.roles.cache.get(res.Guild.MuteRole);
        if (!roleS) return;
        message.member.roles.add(roleS);
        message.guild.owner.send(`Подозрительное сообщение от: ${message.author}\n\n${message.content}`);
    }
    blockInvites();
    delete res.User._id;
    delete res.Guild._id;
    delete res.Guild._id;
    delete res.User.UserId;
    delete res.Guild.GuildId;
    delete res.Member.GuildId;
    delete res.Member.UserId;
    res.User = await global.Collection.User.upsertOne({
        UserId: message.author.id
    }, res.User)
    res.Guild = await global.Collection.Guild.upsertOne({
        GuildId: message.guild.id
    }, res.Guild)
    if (!message.content.startsWith(res.Guild.Prefix)) return;
    const args = message.content.slice(res.Guild.Prefix.length).trim().split(" "),
     command = args.shift().toLowerCase(),
     arr = [];
    global.commands.forEach(e => arr.push(e));
    const cmd = arr.find(e => (e.help.aliases && e.help.aliases.some(a => a.toLowerCase() == command)) || e.help.name.toLowerCase() === command);
    if (cmd) {
      if (message.guild.ownerID != message.author.id && cmd.help.category != "18+" && message.channel.id != res.Guild.CmdChannel) {
        const channel = message.guild.channels.cache.get(res.Guild.CmdChannel);
        if (channel) return message.channel.send(new global.MessageEmbed().setColor("9640FF").addField(message.author.tag, `**Использование команд только в канале ${channel}**`));
        else res.Guild.CmdChannel = null;
    }
        if (cmd && cmd.help.owneronly && !global.config.owners.includes(message.author.id)) message.react("❌");
        else {
            cmd.run(global.bot, message, args, {
                User: res.User,
                Guild: res.Guild,
                Clan: res.Clan,
                Member: res.Member,
                command: `${res.Guild.Prefix}${command}`
            });
        }
    }
});