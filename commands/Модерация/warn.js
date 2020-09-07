module.exports.run = async (bot, message, args) => {
    if (!message.member.hasPermission('BAN_MEMBERS')) return;
    const rUser = await message.mentions.members.first() || message.guild.members.cache.get(bot.toNum(args[0])),
        embed = new global.MessageEmbed()
            .setColor('FE5B7A')
            .setTitle('Предупреждение.');
    if (!rUser) return bot.sendErrEmbed(embed, 'Пользователь не найден | Укажите пользователя через @', message)
    if (rUser.id == bot.user.id) return bot.sendErrEmbed(embed, 'Ты хочешь выдать предупреждение мне? Логично.', message)
    if (rUser.id == message.author.id) return bot.sendErrEmbed(embed, 'Нельзя выдать себе предупреждение!', message)
    const res = await global.Collection.Member.getOne(data => data.UserId == rUser.id && data.GuildId == message.guild.id);
    res.Warns++;
    let reason = args.slice(1).join(' ');
    if (!reason) reason = 'Не указана.';
    embed.addField(`**Администратор \`${message.author.tag}\`**`,
        `**Выдал предупреждение \`${rUser.user.tag}\` (${res.Warns}/5) ${res.Warns >= 5 ? '__Заблокирован!__' : ''}
        Причина: \`${reason}\`**`)
    if (res.Warns >= 5) {
        res.Warns = 0;
        message.guild.members.ban(rUser).catch(async err => {
            if (err.message.includes('Missing Permissions')) await message.channel.send(embed.setColor('000000').setTitle('Ошибка блокировки. (Недостаточно прав.)'))
        })
    }
    global.Collection.Member.upsertOne({ UserId: rUser.id, GuildId: message.guild.id }, { Warns: res.Warns });
    message.channel.send(embed).catch(err => err)
    rUser.send(embed).catch(err => err)
}
module.exports.help = {
    name: 'warn',
    aliases: ['варн', 'пред', 'предупреждение', 'пиупиу'],
    description: 'Выдает участнику предупреждение. При достижении 5 предупреждений участник получает бан.',
    usages: { 'warn @User#0001 <Причина>': 'Выдаст предупреждение @User#0001.' },
    category: 'Модерирование'
}