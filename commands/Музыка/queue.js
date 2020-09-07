const YTDL = require('ytdl-core');
module.exports.run = async (bot, message) => {
    const server = bot.servers[message.guild.id],
        embed = new global.MessageEmbed().setColor('#8F00FF').setTitle('🎵 | Очередь треков.');
    if (!server || !server.queue || !server.queue[0] || !server.dispatcher) return bot.sendErrEmbed(embed, 'Нет треков в очереди.', message);
    for (let i = 0; i < server.queue.length; i++) {
        const info = await YTDL.getInfo(server.queue[i].url);
        embed.addField(server.queue[i].author, `**${info.title}**`, true);
    }
    message.channel.send(embed);
};
module.exports.help = {
    name: 'queue',
    aliases: ['очередь', 'очередб',],
    description: 'Показать очередь.',
    usages: {
        'queue': 'Показать список песен в очереди.'
    },
    category: 'Музыка',
};