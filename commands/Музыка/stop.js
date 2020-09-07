module.exports.run = async (bot, message) => {
    const server = bot.servers[message.guild.id];
    if (!server || !server.dispatcher) return bot.sendErrEmbed(new global.MessageEmbed(), 'Нет треков в очереди!', message);
    server.dispatcher.end()
    server.queue = []
    server.dispatcher = ''
    message.channel.send(new global.MessageEmbed().setColor('#8F00FF').setTitle('🎵 | Музыка остановлена.'))
};
module.exports.help = {
    name: 'stop',
    aliases: ['st', 'ые', 'стоп', 'стопнуть'],
    description: 'Выключить музыку.',
    usages: { 'stop': 'Остановить музыку.' },
    category: 'Музыка'
};