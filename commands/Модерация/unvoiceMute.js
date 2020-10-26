module.exports.run = async (bot, message, args, data) => {
    if (!message.member.hasPermission("BAN_MEMBERS") || !message.guild.me.permissions.has("MANAGE_ROLES")) return;
    const embed = new global.MessageEmbed().setColor("FF8A14").setTitle("Блокировка."),
        rUser = message.mentions.members.first() || message.guild.members.cache.get(bot.toNum(args[0]));
    if (!rUser) return bot.sendErrEmbed(embed, "Пользователь не найден | Укажите пользователя через @", message);
    const role = message.guild.roles.cache.get(data.Guild.VoiceMuteRole);
    if (!role) return bot.sendErrEmbed(embed, 'Роль не найдена!', message);
    if (!rUser.roles.cache.has(role.id)) return bot.sendErrEmbed(embed, 'Пользователь уже может говорить.', message)
    await rUser.roles.remove(role);
    let reason = args.slice(1).join(' ');
    if (!reason) reason = 'Не указана.';
    embed.addField(`**Администратор ${message.author.tag} снял запрет говорить в войсе ${rUser.user.tag}**`, `**Причина: ${reason}**`)
    await message.channel.send(embed).catch(err => err);
    rUser.send(embed).catch(err => err);
}
module.exports.help = {
    name: 'unvoicemute',
    aliases: [],
    description: 'Снимает с участника запрет говорить в войсе.',
    usages: { 'unvoicemute @User#0001': 'Снимает запрет говорить в войсе с @User#0001.' },
    category: 'Модерирование'
}