module.exports.run = async (bot, message, args, data) => {
    if (!message.member.hasPermission('ADMINISTRATOR')) return;
    let rUser = await message.mentions.members.first() || message.guild.members.cache.get(bot.toNum(args[0])),
        embed = new global.MessageEmbed().setColor('80EB52').setTitle('Изменение баланса.')
    let sum = bot.toNum(args[1]) || (rUser ? null : bot.toNum(args[0]));
  if(!rUser) rUser = message.author;
    if (!args[1] || !rUser || !sum) return bot.sendErrEmbed(embed, `Используйте \`${data.command} @User#0001 <Cумма>\``, message)
    await global.Collection.Member.upsertOne({
        UserId: rUser.id,
        GuildId: message.guild.id
    }, { Coins: sum });
    embed.addField(`${message.author.tag} установил ${rUser.id == message.author.id ? "себе" : rUser.user.tag} баланс в ${bot.locale(sum)} $`,
        `**Баланс ${rUser.user.tag} составляет: ${bot.locale(sum)} $**`)
    message.channel.send(embed);
};
module.exports.help = {
    name: 'set',
    aliases: ['установить', 'сет',],
    description: 'Изменение баланса долларов. (На вашем сервере.)',
    usages: {
        'set @User#0001 1006': 'Баланс @User#0001 будет 1.006$'
    },
    category: 'Экономика',
};