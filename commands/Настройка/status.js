module.exports.run = async (bot, message, args) => {
    const embed = new global.MessageEmbed().setColor('#36393f').setTitle('Статус.');
    if (!args[0]) return bot.sendErrEmbed(embed, "Укажите статус!", message);
    if (message.content.includes("discord.gg/" || "discordapp.com/invite/")) {
        message.delete();
        return bot.sendErrEmbed(embed, `${message.author}, реклама в статусах запрещена!`, message);
    }
    if (args.join(" ").length >= 200) return bot.sendErrEmbed(embed, "Текст должен быть меньше 200 символов!", message);
    await global.Collection.User.upsertOne({ UserId: message.author.id }, { Status: args.join(" ") })
    message.channel.send(embed.setDescription("Вы успешно установили себе статус!"));
};
module.exports.help = {
    name: "status",
    category: 'Информация',
    aliases: ['статус', 'описание'],
    descripion: "Установить статус, который будет отображаться в команде profile",
    usages: {
        "status Привет мир!": "Установить статус: `Привет мир!`"
    }
};