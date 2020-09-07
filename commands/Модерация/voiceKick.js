module.exports.run = async (bot, message, args) => {
    if (!message.member.hasPermission('MOVE_MEMBERS')) return;
    const embed = new global.MessageEmbed().setColor("FF8A14").setTitle("Блокировка в голосовом чате."),
        rUser = await message.mentions.members.first() || message.guild.members.cache.get(bot.toNum(args[0]));
    if (!rUser) return bot.sendErrEmbed(embed, 'Пользователь не найден | Укажите пользователя через @', message)
    if (rUser.id == message.author.id) return bot.sendErrEmbed(embed, 'Вы не можете кикнуть самого себя.', message)
    if (!rUser.voice.channel) return bot.sendErrEmbed(embed, `${rUser.user.tag} не в голосовом канале.`, message)
    rUser.voice.setChannel(null);
    let reason = args.slice(1).join(' ');
    if (!reason) reason = 'Не указана';
    embed.addField(`**Администратор ${message.author.tag}**`, `**Выгнал с голосового канала \`${rUser.user.tag}\`**
    **Причина: \`${reason}\`**`)
    message.channel.send(embed).catch(err => err)
    rUser.send(embed).catch(err => err)
}

module.exports.help = {
    name: 'voicekick',
    aliases: ['vk', 'войскик', 'киквойс', 'уберисьчорт'],
    description: 'Выгоняет участника с голосового канала.',
    usages: { 'voicekick @User#0001 ': 'Выгоняет участника с голосового канала.' },
    category: 'Модерирование'
}