module.exports.run = async (bot, message, args, data) => {
    const rUser = await message.mentions.members.first() || message.guild.members.cache.get(bot.toNum(args[0])),
        sum = bot.toNum(args[1]),
        embed = new global.MessageEmbed().setColor('80EB52').setTitle('Изменение уровня.');
    if (!args[1] || !rUser || !sum) return bot.sendErrEmbed(embed, `Используйте \`${data.command} @User#0001 <Cумма>\``, message)
    await global.Collection.User.upsertOne({ UserId: rUser.id }, { Level: sum })
    embed.addField(`${message.author.tag} изменил уровень ${rUser.user.tag}`, `**Уровень ${rUser.user.tag} составляет: ${bot.locale(sum)}**`)
    message.channel.send(embed)
};
module.exports.help = {
    name: 'setlevel',
    aliases: ['setlvl', 'slvl', 'установитьуровень', 'сетлвл'],
    description: 'Изменение уровня.',
    usages: {
        'setlevel @User#0001 12': 'Уровень @User#0001 будет 12.'
    },
    category: 'Настройка',
    owneronly: true
};