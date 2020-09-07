module.exports.run = async (bot, message, args) => {
    if (!message.member.hasPermission('BAN_MEMBERS')) return;
    const embed = new global.MessageEmbed().setColor("FE5B7A").setTitle("Предупреждение."),
        rUser = await message.mentions.members.first() || message.guild.members.cache.get(bot.toNum(args[0]));
    if (!rUser) return bot.sendErrEmbed(embed, "Пользователь не найден | Укажите пользователя через @", message);
    if (rUser.id == message.author.id) return bot.sendErrEmbed(embed, `Вы не можете снять варн себе.`, message);
    const res = await global.Collection.Member.getOne(data => data.UserId == rUser.id && data.GuildId == message.guild.id);
    if (res.Warns <= 0) return bot.sendErrEmbed(embed, `У данного пользователя 0 предупреждений!`, message);
    res.Warns--;
    let reason = args.slice(1).join(' ');
    if (!reason) reason = 'Не указана.';
    await global.Collection.Member.upsertOne({ UserId: rUser.id, GuildId: message.guild.id }, { Warns: res.Warns })
    embed.addField(`**Администратор ${message.author.tag}**`,
        `**Снял предупреждение ${rUser.user.tag} (${res.Warns}/5)**
        **Причина: ${reason}**`)
    await message.channel.send(embed).catch(err => err)
    rUser.send(embed).catch(err => err)
}
module.exports.help = {
    name: 'unwarn',
    aliases: ['снятьварн', 'снятьпред', 'убратьпредупреждение', 'непиупиу'],
    description: 'Снимает участнику предупреждение.',
    usages: { 'unwarn @User#0001': 'Выдаст предупреждение @User#0001.' },
    category: 'Модерирование'
}