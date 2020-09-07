module.exports.run = async (bot, message) => {
    const regions = {
        'russia': "Россия",
        'europe': 'Европа',
        'brazil': 'Бразилия',
        'hongkong': 'Хонг Конг',
        'india': 'Индия',
        'japan': 'Япония',
        'singapore': 'Сигнапор',
        'southafrica': 'Западная африка',
        'sydney': 'Сидней',
        'us-central': 'США(центарльная)',
        'us-east': 'США(восточная)',
        'us-south': 'США(южная)',
        'us-west': 'США(западная)'
    }
    const levels = {
      NONE: "Ничего не требуется.",
      LOW: "Нужно иметь верифицированую почтy.",
      MEDIUM: "Вы должны быть зарегистрированы больше 5-и минут.",
      HIGH: "Вы должны быть на сервере больше 10-и минут.",
      VERY_HIGH:"Вы должны иметь верифицированный телефон!"
    }
    message.channel.send(new global.MessageEmbed()
        .setTitle(`Информация о сервере ${message.guild.name}`)
        .setThumbnail(message.guild.iconURL({
            format: "png",
            size: 2048,
            dynamic: true
        }))
        .addField('Количество пользователей', `**${message.guild.memberCount}**`, true)
        .addField('Индефикатор (ID)', `**${message.guild.id}**`, true)
        .addField('Уровень верификации', `**${levels[message.guild.verificationLevel]}**`, true)
        .addField('Сервер большой?', message.guild.large ? '**Да**' : '**Нет**', true)
        .addField('Количество ботов', `**${message.guild.members.cache.filter(m => m.user.bot).size}**`, true)
        .addField('Регион', `**${regions[message.guild.region]}**`, true));
};
module.exports.help = {
    name: 'serverinfo',
    aliases: ['серверинфо', 'ыукмукштащ'],
    description: 'Получить информацию о сервере',
    usages: {
        'serverinfo': 'Получить информацию о сервере'
    },
    category: 'Информация'
};