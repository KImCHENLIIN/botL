module.exports.run = async (bot, message, args, data) => {
    const shop = [];
  var embed = new global.MessageEmbed().setColor('#36393f').setTitle('Магазин ролей.');
    data.Guild.Shop = data.Guild.Shop.filter(e => message.guild.roles.cache.has(e.id));
    if (!args[0]) {
        if (data.Guild.Shop.length > 0) {
            let x = 0, y = 0;
            for (let i = 0; i < data.Guild.Shop.length; i++) {
                const role = await message.guild.roles.cache.get(data.Guild.Shop[i].id)
                if (!shop[x]) shop.push(embed)
                if (y == 8) {
                    y = 0;
                    x++
                    shop.push(embed)
                }
                shop[x] = shop[x].addField(
                    `__**${i + 1}**__ | **Цена: ${bot.locale(data.Guild.Shop[i].coin) == 0 ? 'Бесплатно' : bot.locale(data.Guild.Shop[i].coin)} $**`,
                    `**${role}**`, true)
                y++;
            }
        } else {
            embed.addField('Ваш магазин еще не настроен.', `**Для добавления роли в магазин используйте: \`${data.command} add @role <Цена>\`**`)
            message.channel.send(embed)
            return
        }
        let page = 1;
        if (shop.length > 1) shop[0].setFooter(`Страница ${page} из ${shop.length}`)
        let msg = await message.channel.send(shop[0]);
        if (shop.length > 1) {
            await msg.react("⏪")
            await msg.react("⏩");
            const backwardsFilter = (reaction, user) => reaction.emoji.name === "⏪" && user.id === message.author.id;
            const forwardsFilter = (reaction, user) => reaction.emoji.name === "⏩" && user.id === message.author.id;
            const backwards = msg.createReactionCollector(backwardsFilter);
            const forwards = msg.createReactionCollector(forwardsFilter);
            backwards.on("collect", r => {
                msg.reactions.cache.forEach(e => e.users.remove(message.author.id));
                if (page === 1) return;
                page--;
                msg.edit(shop[page - 1].setFooter(`Страница ${page} из ${shop.length}`))
            })
            forwards.on("collect", r => {
                msg.reactions.cache.forEach(e => e.users.remove(message.author.id));
                if (page === shop.length) return;
                page++;
                msg.edit(shop[page - 1].setFooter(`Страница ${page} из ${shop.length}`))
            })
        }
    }
    if (bot.toNum(args[0])) {
        if (!data.Guild.Shop.length) {
            embed.addField('Ваш магазин еще не настроен', `**Для добавления роли в магазин используйте: \`${data.command} add @role <Цена>\`**`)
            return message.channel.send(embed)
        }
        const num = bot.toNum(args[0]);
        if (num <= 0 || num > data.Guild.Shop.length) return bot.sendErrEmbed(embed, `Укажите число от 1 до ${data.Guild.Shop.length}.`, message);
        const price = data.Guild.Shop[num - 1];
        if (data.Member.Coins < price.coin) return bot.sendErrEmbed(embed, `У вас недостаточно денег! Для покупки этой роли требуется ${bot.locale(price.coin)} $`, message);
        if (message.member.roles.cache.has(price.id)) return bot.sendErrEmbed(embed, `У вас уже есть эта роль!`, message);
        const role = message.guild.roles.cache.get(price.id);
        if (!role) return bot.sendErrEmbed(embed, "Произошла ошибка, роль не найдена на сервере!", message);
        await global.Collection.Member.upsertOne({ UserId: message.author.id, GuildId: message.guild.id }, { Coins: data.Member.Coins - price.coin });
        await message.member.roles.add(role);
        embed.addField(`${message.author.tag}`, `**Вы успешно купили роль ${role}**`);
        return message.channel.send(embed)
    }
    if (message.member.hasPermission('ADMINISTRATOR')) {
      if(!args[0]) return
        if (args[0].toLowerCase() == 'add') {
            if (!args[1] || !args[2]) return bot.sendErrEmbed(embed, `Использование: **\`${data.command} add @role <Цена>\`**`, message);
            const role = message.mentions.roles.first() || message.guild.roles.cache.get(bot.toNum(args[1])),
                price = bot.toNum(args.slice(2).join(' '))
            if (!role || (!price && price != 0)) return bot.sendErrEmbed(embed, `Использование: **\`${data.command} add @role <Цена>\`**`, message);
            if (data.Guild.Shop.includes(role.id)) return bot.sendErrEmbed(embed, "Данная роль уже есть в магазине!", message);
            if (data.Guild.Shop.length >= 21) return bot.sendErrEmbed(embed, `Максимальное количество ролей в магазине: 21`, message);
            data.Guild.Shop.push({ id: role.id, coin: price });
            await global.Collection.Guild.upsertOne({ GuildId: message.guild.id }, { Shop: data.Guild.Shop });
            embed.addField('Добавление роли.', `**Роль ${role} добавлена в магазин!**`);
            message.channel.send(embed);
        } else if (args[0].toLowerCase() == 'remove') {
            const num = bot.toNum(args[1]);
            if (!args[1] || !num) return bot.sendErrEmbed(embed, `Использование: **\`${data.command} remove <Hомер>\`**`, message);
            if (num <= 0 || num > data.Guild.Shop.length) return bot.sendErrEmbed(embed, `Укажи число от 1 до ${data.Guild.Shop.length}.`, message);
            await global.Collection.Guild.upsertOne({ GuildId: message.guild.id }, { Shop: global.ArrayElementDelete(data.Guild.Shop, num - 1) });
            embed.addField('Удаление роли.', `**Роль ${num} удалена из магазина.**`);
            message.channel.send(embed);
        }
        if (args[0].toLowerCase() == 'clear') {
            await global.Collection.Guild.upsertOne({ GuildId: message.guild.id }, { Shop: [] })
            embed.addField('Очистка магазина.', `**Ваш магазин был полностью очищен.**`)
            message.channel.send(embed)
        }
    }
};
module.exports.help = {
    name: 'shop',
    aliases: ['магазин', 'магаз', 'роли', 'магазинролей', 'roleshop'],
    description: 'Магазин ролей.',
    usages: {
        'shop': 'Показать список продаваемых ролей на этом сервере.',
        'shop <Hомер>': 'Купить роль под каким либо номером.',
        'shop add @role <Цена>': 'Добавить роль @role в магазин.',
        'shop remove <Номер>': 'Удалить роль из магазина.',
        'shop clear': 'Очистить магазин.'
    },
    category: 'Экономика'
};