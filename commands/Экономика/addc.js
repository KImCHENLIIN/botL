module.exports.run = async (bot, message, args, data) => {
    if (message.guild.owner.id !== message.author.id) return;
    let clan = await global.Collection.Clan.findOne(data => data.Name === args.slice(0, -1).join(" ") && data.GuildId === message.guild.id);
        embed = new global.MessageEmbed()
            .setColor("80EB52")
            .setTitle("Добавление");
    if (!args[1]) return bot.sendErrEmbed(embed, `Используйте \`${data.command} <Clan Name> <Сумма>\``, message);
    if (!clan) return bot.sendErrEmbed(embed, `Клан не найден.`, message);
    const sum = args.slice(-1)[0];
    if (!sum) return bot.sendErrEmbed(embed, `Используйте \`${data.command} <Clan Name> <Сумма>\``, message);
    await global.Collection.Clan.upsertOne({ GuildId: message.guild.id, ClanId: clan.ClanId }, { Coins: res.Coins + sum })
    embed.addField(
        `${message.author.tag} добавил клану "${clan.name}" ${bot.locale(sum)} $`,
        `**Баланс кланa "${clan.name}" составляет: ${bot.locale(res.Coins + sum)} $**`
    );
    message.channel.send(embed);
};
module.exports.help = {
    name: "addc",
    aliases: [],
    description: "Изменение баланса у клана. (На вашем сервере.)",
    usages: { "addc Clan_Name 1000": "Добавить 1.000$ на клан Clan_Name" },
    category: "Экономика"
};