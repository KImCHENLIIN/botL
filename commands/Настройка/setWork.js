module.exports.run = async (bot, message, args, data) => {
    const rUser = await message.mentions.members.first() || message.guild.members.cache.get(bot.toNum(args[0])),
        sum = bot.toNum(args[1]),
        embed = new global.MessageEmbed().setColor('80EB52').setTitle('Изменение работы.');
    if (!args[1] || !rUser || !sum) return bot.sendErrEmbed(embed, `Используйте \`${data.command} @User#0001 <Число>\``, message)
    if (sum > global.config.works.length) return bot.sendErrEmbed(embed, `Укажите число меньше ${global.config.works.length}.`, message)
    await global.Collection.User.upsertOne({ UserId: rUser.id }, { WorkLevel: sum - 1 })
    embed.addField(`${message.author.tag} изменил уровень работы ${rUser.user.tag}.`,
                   `**Теперь ${rUser.user.tag} работает работой: \`${global.config.works[sum - 1].name}\`**`)
    message.channel.send(embed)
}
module.exports.help = {
    name: 'setwork',
    aliases: ['sw', 'установитьработу', 'изменитьработу', '+работа'],
    description: 'Устанавливает уровень работы пользователю (Только для создателей)',
    usages: {
        'setwork @User#0001 3': 'Изменит уровень работы @User#0001 на 3.'
    },
    category: 'Экономика',
    owneronly: true
};