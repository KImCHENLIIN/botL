module.exports.run = async (bot, message, args, data) => {
    const embed = new global.MessageEmbed()
        .setColor('#36393f')
        .setTitle(`${message.author.tag} Ваши достижения:`)
    let x = 0, y = 0;
    for (let key in global.config.Marks) {
        if (data.User.Marks.includes(key)) x++
        y++
    }
    let gettedemoji = args.join(' ').replace(/ /g, '')
    if (!gettedemoji) embed.addField(message.author.tag, `**${data.User.Marks.join(", ")}**`)
    else {
        let emoji = global.config.Marks[gettedemoji];
        if (!emoji) return bot.sendErrEmbed(new global.MessageEmbed(), `Достижение не найдено.`, message);
        if (!data.User.Marks.includes(gettedemoji)) return bot.sendErrEmbed(new global.MessageEmbed(), `У вас нет этого достижения.`, message);
        embed.addField(`${gettedemoji} ${emoji.name}`, `**${emoji.description}**`)
    }
    embed.setFooter(`Разблокировано ${x} достижений из ${y}. Для подробностей: \`${data.command} [Достижение]\``)
    message.channel.send(embed)
};
module.exports.help = {
    name: 'marks',
    aliases: ['achievement', 'марки', 'достижения', 'achievements', 'mark'],
    description: 'Покажет ваши достижения',
    usages: { 'marks': 'Покажет все ваши достижения.', 'mark 🔰': 'Покажет информацию о достижении 🔰' },
    category: "Развлечения"
};