module.exports.run = async (bot, message, args) => {
    const server = bot.servers[message.guild.id],
        embed = new global.MessageEmbed()
            .setColor('#8F00FF')
    if (!server || !server.queue || !server.queue[0]) return bot.sendErrEmbed(embed, 'Треков не обнаружено.', message);
    if (message.member.voice.channel.id != message.guild.me.voice.channel.id) return bot.sendErrEmbed(embed, 'Вы не можете управлять музыкой с другого канала.', message);
    let volume = bot.toNum(args[0]) || 0
    if (volume <= 0) return bot.sendErrEmbed(embed, 'Укажите громкость от 0 до ∞', message);
    bot.servers[message.guild.id].dispatcher.setVolume(volume / 100);
    message.channel.send(embed.setTitle(`🎵 | Вы установили громкость музыки на ${volume} %`))
}
module.exports.help = {
    name: 'volume',
    aliases: ['звук', 'громкость', 'чикибамбони'],
    description: 'Изменить громкость музыки.',
    usages: { 'volume <Громкость>': 'Изменяет громкость музыки.', 'volume 50': "Установить громкость на 50." },
    category: 'Музыка'
};