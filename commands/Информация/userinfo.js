module.exports.run = async (bot, message, args) => {
    const rUser = await message.mentions.members.first() || bot.users.cache.get(bot.toNum(args[0])) || message.author;
    await message.channel.send(
        new global.MessageEmbed()
            .setColor('#36393f')
            .setThumbnail(rUser.displayAvatarURL({ format: "png", dynamic: true, size: 2048 }))
            .setTitle(`Информация о ${rUser.tag}`)
            .addField('ID:', `**${rUser.id}**`, true)
            .addField('Имя пользователя:', `**${rUser.username}**`, true)
            .addField('Дискриминатор:', `**${rUser.discriminator}**`, true)
            .addField('Бот?', `**${rUser.bot ? 'Да' : 'Нет'}.**`, true)
            .addField('Создание аккаунта:', `**${rUser.createdAt}**`)
            .setTimestamp()
    ).catch(err => err)
}
module.exports.help = {
    name: 'userinfo',
    aliases: ['я', 'он'],
    description: 'Выдаст информацию о пользователе.',
    usages: { 'userinfo': 'Покажет информацию о вас.', 'userinfo @User#0001': 'Покажет информацию о @User#0001.' },
    category: 'Информация'
}