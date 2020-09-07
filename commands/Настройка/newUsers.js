module.exports.run = async (bot, message, args) => {
    if (!message.member.hasPermission('MANAGE_CHANNELS')) return;
    let embed = new global.MessageEmbed().setColor("7FFFD4").setTitle("Уведомления.");
    const channel = await message.mentions.channels.first() || message.guild.channels.cache.get(bot.toNum(args[0]));
    if (!channel) return bot.sendErrEmbed(embed, "Укажите канал.", message);
    await global.Collection.Guild.upsertOne({
        GuildId: message.guild.id
    }, { ChannelJoinleave: channel.id });
    embed.addField(message.author.tag, `**Канал ${channel} установлен как канал для уведомлений.**`);
    message.channel.send(embed);
}
module.exports.help = {
    name: 'newUsers',
    aliases: ['joinleave', 'участники', 'уведомления', 'welcome', 'wc'],
    description: 'Указать канал на который при входе участника будет отправляться сообщение.',
    category: 'Настройка',
    usages: {
        'wc #Channel': 'В канал `#channel` будут приходить уведомления о новых участниках.'
    }
};