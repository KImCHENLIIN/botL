module.exports.run = async(bot, message, args, data) => {
    const embed = new global.MessageEmbed().setColor('#36393f').setTitle('🏓 Ping!')
    const msg = await message.channel.send(embed);
    embed.setTitle(`🏓 Pong! (Время отправки: ${msg.createdTimestamp - message.createdTimestamp}ms. )`)
    msg.edit(embed);
    global.addMark(true, '⁉️', data.User, message);
}
module.exports.help = {
    name: 'ping',
    aliases: ['пинг'],
    description: 'Пинг бота',
    usages: {
        'ping': `Покажет пинг бота`
    },
    category: 'Информация о боте'
};