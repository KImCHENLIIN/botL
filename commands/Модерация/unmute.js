module.exports.run = async (bot, message, args, data) => {
    if (!message.member.hasPermission("BAN_MEMBERS") || !message.guild.me.permissions.has("MANAGE_ROLES")) return;
    const embed = new global.MessageEmbed().setColor("FF8A14").setTitle("Блокировка."),
        rUser = await message.mentions.members.first() || message.guild.members.cache.get(bot.toNum(args[0]));
    if (!rUser) return bot.sendErrEmbed(embed, "Пользователь не найден | Укажите пользователя через @", message);
    const role = message.guild.roles.cache.get(data.Guild.MuteRole);
    if (!role) return bot.sendErrEmbed(embed, 'Роль не найдена!', message);
    if (!rUser.roles.cache.has(role.id)) return bot.sendErrEmbed(embed, 'Пользователь уже может писать.', message)
    await rUser.roles.remove(role);
    let reason = args.slice(1).join(' ');
    if (!reason) reason = 'Не указана.';
    embed.addField(`**Администратор ${message.author.tag} снял запрет писать сообщения ${rUser.user.tag}**`, `**Причина: ${reason}**`)
    await message.channel.send(embed).catch(err => err);
    rUser.send(embed).catch(err => err);
}
module.exports.help = {
    name: 'unmute',
    aliases: ['untempmute', 'размут', 'размьют', 'снятьмут', 'воскреситьчтобыслетеласосальня'],
    description: 'Снимает с участника запрет писать сообщения.',
    usages: { 'unmute @User#0001': 'Снимает запрет писать сообщения с @User#0001.' },
    category: 'Модерирование'
}