module.exports.run = async(bot, message, args, data) => {
    const embed = new global.MessageEmbed().setColor('#36393f').setTitle('Пропуск песни.'),
        server = bot.servers[message.guild.id];
    if (!server || !server.dispatcher) return bot.sendErrEmbed(embed, 'Нет треков в очереди!', message);
    if (!server.queue[0]) return message.react('❌');
    await server.dispatcher.end();
    embed.setDescription("Вы успешно пропустили песню!")
    message.channel.send(embed)
    global.addMark(true, '⏩', data.User, message);

};
module.exports.help = {
    name: 'skip',
    aliases: ['s', 'ы', 'скип', 'скипнуть'],
    description: 'Пропустить трек',
    usages: { 'skip': 'Пропустить трек' },
    category: 'Музыка'
};