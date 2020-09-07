const isgd = require('isgd');
module.exports.run = async (bot, message, args) => {
    const embed = new global.MessageEmbed()
    if (!args[0]) return bot.sendErrEmbed(embed, "Необходимо указать сайт!", message);
    const msg = await message.channel.send(embed.setTitle('Делаем запрос, ожидайте.'))
    isgd.shorten(args.join(" "), res => {
        msg.edit(embed.setTitle(res).setColor('RANDOM'))
    });
};
module.exports.help = {
    name: 'shorten',
    aliases: ['sh', 'ыр', 'сократитьссылку', 'дерьмоанессылка'],
    description: 'Сократить ссылку.',
    usages: {
        'shorten google.com': 'Cокращает ссылку **`google.com`**'
    },
    category: 'Инструменты'
};