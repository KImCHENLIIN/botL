module.exports.run = async (bot, message) => {
    if (!message.guild.me.permissions.has('MANAGE_CHANNELS')) return bot.sendErrEmbed(new global.MessageEmbed(), 'Мне нужно право `Управление каналами` для выполнения этой команды!');
    const category = await message.guild.channels.create('Приватные каналы', { type: 'category' }),
        channel = await message.guild.channels.create('Создать канал', {
            type: 'voice',
            parent: category
        });
    await channel.setUserLimit(2);
    global.Collection.Guild.upsertOne({
        GuildId: message.guild.id
    }, {
        privateChannel: channel.id
    })
};
module.exports.help = {
    name: 'rooms',
    aliases: ['room', 'комнаты', 'privaterooms', 'приватныекомнаты', 'voicerooms', 'voiceroom'],
    description: 'Создание канала для создания приватных комнат.',
    usages: {
        'rooms': 'Создаст канал для создания приватных комнат.'
    },
    category: 'Настройка'
};