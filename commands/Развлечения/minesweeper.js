const Minesweeper = require('discord.js-minesweeper');
const configCoins = global.config.Coins;
module.exports.run = async (bot, message, args, data) => {
    if (data.User.Coins < 5) return bot.sendErrEmbed(new global.MessageEmbed(), `У вас недостаточно ${configCoins.Format[3]}! ${
        configCoins.Value
        } Для этого действия требуется 5 ${configCoins.Format[3]}`, true, message);
    let rows = 10,
        columns = 10,
        mines = Math.floor(Math.random() * (((rows * columns) / 2 - 1) - (rows > columns ? rows : columns))) + (rows > columns ? rows : columns);
    if (args[0] && bot.toNum(args[0]))
        if (bot.toNum(args[0]) <= 12 && bot.toNum(args[0]) >= 3) rows = bot.toNum(args[0])
        else return bot.sendErrEmbed(new global.MessageEmbed(), 'Укажите высоту от 3 до 12.', message);
    if (args[1] && bot.toNum(args[1]))
        if (bot.toNum(args[1]) <= 12 && bot.toNum(args[1]) >= 3) columns = bot.toNum(args[1])
        else return bot.sendErrEmbed(new global.MessageEmbed(), 'Укажите ширину от 3 до 12.', message);
    if (args[2] && bot.toNum(args[2]))
        if (bot.toNum(args[2]) <= Math.floor((rows * columns) / 2 - 1) && bot.toNum(args[2]) >= 1) mines = bot.toNum(args[2])
        else return bot.sendErrEmbed(new global.MessageEmbed(), `Укажите количество мин от 1 до ${Math.floor((rows * columns) / 2 - 1)}.`, message);
    const minesweeper = new Minesweeper({
        rows,
        columns,
        mines
    });
    const matrix = minesweeper.start();
    if (!matrix) return bot.sendErrEmbed(new global.MessageEmbed(), `Произошла неизвестная ошибка.`, true, message);
    await global.Collection.User.upsertOne({ UserId: message.author.id }, { Coins: data.User.Coins - 5 })
    message.channel.send(`**${message.author} Ваша игра готова! Поле ${rows}x${columns} минут: ${mines}**\n` + matrix);
};
module.exports.help = {
    name: 'minesweeper',
    aliases: ['ms', 'сапер', 'минер'],
    description: 'Поиграть в игру "Сапер", стоимость 5 бананов',
    usages: {
        'ms': 'Запускает игру сапер. Поле \`10x10\` <Mинут>.',
        'ms 8 6 15': 'Запускает игру сапер. Поле 8x6, минут: 15.',
        'Синтаксис': 'ms {Высота} {Ширина} {Мины}'
    },
    category: "Развлечения"
};