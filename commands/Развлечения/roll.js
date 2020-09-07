module.exports.run = async (bot, message, args) => {
    const num1 = bot.toNum(args[0]) || 1,
        num2 = bot.toNum(args[1]) || 100;
    message.channel.send(
        new global.MessageEmbed()
            .setColor("#36393f")
            .setTitle(`Рандомное число: ${global.random(num1, num2)}`)
    );
};
module.exports.help = {
    name: 'roll',
    aliases: ['рол', 'ролл', 'рандом', 'число', 'решитьспор', 'заролить', 'хахахядединсайд'],
    description: 'Генерирует рандомное число.',
    usages: {
        'roll': 'Выдаст число от 1 до 100.',
        'roll 50': 'Выдаст число от 1 до 50.',
        'roll 40 5000': 'Выдаст число от 40 до 5000.'
    },
    category: "Инструменты"
};