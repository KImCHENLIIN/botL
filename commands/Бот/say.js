module.exports.run = (bot, message, args) => {
    message.delete();
    message.channel.send(args.join(" ")).catch(err => err)
};
module.exports.help = {
    name: 'say',
    aliases: ['сказать', 'скажи', 'сей', 'сау', 'скажиплиз'],
    description: 'Отправить сообщение от имени бота',
    usages: {
        'say Сообщение': 'Бот скажет: Сообщение'
    },
    category: 'Инструменты'
};