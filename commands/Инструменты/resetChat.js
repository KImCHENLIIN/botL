module.exports.run = async (bot, message) => {
    if (!message.member.hasPermission('MANAGE_CHANNELS')) return;
    const embed = new global.MessageEmbed().setColor('4DFFD4'),
        channelslowmode = message.channel.rateLimitPerUser,
        channelpos = message.channel.calculatedPosition,
        channelparent = message.channel.parentID;
    await message.channel.clone().then(async channel => {
        if (message.channel.parentID) await channel.setParent(channelparent)
        await channel.setPosition(channelpos)
        await channel.setRateLimitPerUser(channelslowmode);
        embed.setTitle('Канал был успешно пересоздан.')
        await channel.send(embed)
    }).catch(err => console.error(err));
    message.channel.delete()
};
module.exports.help = {
    name: 'resetChat',
    aliases: ['rc'],
    category: 'Инструменты',
    description: "Пересоздать канал."
};