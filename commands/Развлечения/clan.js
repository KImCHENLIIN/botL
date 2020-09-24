module.exports.run = async(bot, message, args, data) => {
    const role = message.guild.roles.cache.get(data.Clan.RoleID);
    const embedModel = new global.MessageEmbed().setColor(role ? role.color : "#36393f");
    async function createClan() {
        if (data.Member.ClanId) return bot.sendErrEmbed(embedModel, "У вас уже есть клан.", message);
        if (!message.guild.me.permissions.has("MANAGE_ROLES")) return bot.sendErrEmbed(embedModel, "У бота отсутствуют права на создание ролей!", message)
        let coins = data.Member.Coins
        if (coins < global.config.clanPrice) return bot.sendErrEmbed(embedModel, `**Для создания клана требуется ${bot.locale(global.config.clanPrice)} $**`, message);
        let clanName = args.slice(1).join(" ");
        if (!clanName) return bot.sendErrEmbed(embedModel, "Укажите название клана!", message);
        let clan = await global.Collection.Clan.findOne(data => data.Name == clanName && data.GuildId == message.guild.id);
        if (!clan) {
            new Promise(async(resolve) => {
                const msg = await message.channel.send(embedModel .setTitle("**Указать цвет клана?**").setColor("#36393f"));
                await msg.react("✅"); await msg.react("⛔");
                const collectorYes = msg.createReactionCollector((reaction, user) => reaction.emoji.name === '✅' && user.id === message.author.id);
                const collectorNo = msg.createReactionCollector((reaction, user) => reaction.emoji.name === '⛔' && user.id === message.author.id);
              collectorYes.on("collect", () => {
                    msg.reactions.removeAll();
                    collectorYes.stop(); collectorNo.stop();
                    const collectorMsg = message.channel.createMessageCollector((msg) => msg.content && msg.author.id === message.author.id);
                    const timeout = setTimeout(() => {
                        collectorMsg.stop();
                        bot.sendErrEmbed(embedModel , `${message.author} не указал цвет клана! Создание клана отменяется.`, message);
                    }, 1000 * 30);
                    collectorMsg.on("collect", (c_msg) => {
                        collectorMsg.stop(); clearTimeout(timeout); resolve(c_msg);
                        msg.edit(msg.embeds[0].setTitle("**Вы успешно установили цвет клана!**").setColor(c_msg));
                    });
                });
              collectorNo.on("collect", () => {
                    msg.reactions.removeAll();
                    collectorYes.stop(); collectorNo.stop(); resolve();
                    msg.edit(msg.embeds[0].setTitle("**Цвет клана останется неопределённым.**"));
                })
            }).then((color) => {
            const { id } = await message.guild.roles.create({
                data: {
                    name: clanName,
                    color: args[0],
                    mentionable: false
                }
            });
            await message.member.roles.add(id);
            await global.Collection.Clan.upsertOne({
                ClanId: message.author.id,
                GuildId: message.guild.id
            }, { Name: clanName, RoleID: id });
            await global.Collection.Member.upsertOne({
                UserId: message.author.id,
                GuildId: message.guild.id
            }, { ClanId: message.author.id, Coins: coins - global.config.clanPrice });
            message.channel.send(embedModel .setTitle("**Вы успешно создали клан!**").setColor("#36393f"));
        })
    } else bot.sendErrEmbed(embedModel , "Клан с таким названием уже существует.", message);
};
async function getClanInfo() {
    if (!data.Member.ClanId) return bot.sendErrEmbed(embedModel , "У вас нет клана!", message);
    let clanMembers = await global.Collection.Member.filterKeys(dat => dat.ClanId == data.Clan.ClanId && dat.GuildId == message.guild.id);
    message.channel.send(embedModel .setTitle(`**Информация о клане \`${data.Clan.Name}\`**`).setColor("#36393f").addField("Опыт клана:", `${data.Clan.Xp}/${data.Clan.Level * 1000} (осталось ${data.Clan.Level * 1000 - data.Clan.Xp} опыта до нового уровня)`).addField("Описание клана:", data.Clan.Description).addField("Баланс клана:", global.uts(data.Clan.Coins, "монета", "монеты", "монет") + ".").addField("Участников:", clanMembers.length));
}
async function inviteMember() {
    if (data.Clan.ClanId != message.author.id) return bot.sendErrEmbed(embedModel , "У вас нет своего клана!", message);
    const rUser = await message.mentions.members.first() || message.guild.members.cache.get(bot.toNum(args[0]));
    if (!rUser) return bot.sendErrEmbed(embedModel , "Необходимо указать участника через @", message);
    if (rUser.id == message.author.id) return bot.sendErrEmbed(embedModel , "Ты хочешь самого себя пригласить??", message)
    const resRuser = await global.Collection.Member.getOne(data => data.UserId == rUser.id && data.GuildId == message.guild.id);
    if (await global.Collection.Clan.findOne(resRuser.ClanId)) return bot.sendErrEmbed(embedModel , "Этот пользователь уже в клане!", message);
    await message.channel.send(`${rUser}`, embedModel .setTitle(`${message.author.tag} пригласил ${rUser.user.tag} в клан \`${data.Clan.Name}\``).setDescription(`Для вступления напишите \`${data.Guild.Prefix}accept\``));
    const collector = new global.Discord.MessageCollector(message.channel, m => m.author.id == rUser.id),
        timeout = setTimeout(async() => {
            await collector.stop();
            bot.sendErrEmbed(embedModel , "Пользователь не ответил на приглашение!", message);
        }, 1000 * 30);
    collector.on("collect", async msg => {
        if (msg.content.toLowerCase().trim().split(" ")[0] == `${data.Guild.Prefix}accept`) {
            clearTimeout(timeout);
            await collector.stop();
            await global.Collection.Member.upsertOne({
                UserId: rUser.id,
                GuildId: message.guild.id
            }, { ClanId: message.author.id });
            if (role) rUser.roles.add(role).catch(err => message.channel.send(`Роль **\`${role.name}\`** не удалось выдать участнику **\`${rUser.user.tag}\`**\nВозможно, нет прав. Попросите Администраторов.`))
            message.channel.send(embedModel .setTitle(`${rUser.user.tag} Зашел в клан ${data.Clan.Name}!`).setColor("#36393f"))
        }
    });
}
async function clanLeave() {
    if (!data.Member.ClanId) return bot.sendErrEmbed(embedModel , "У вас нет клана!", message);
    let msg = await message.channel.send(embedModel .setTitle(`**Ты точно хочешь выйти из клана \`${data.Clan.Name}\`? Если да тогда нажми на ✅**`));
    const filter = (reaction, user) => reaction.emoji.name === "✅" && user.id === message.author.id;
    await msg.react("✅");
    const collector = msg.createReactionCollector(filter),
        timeout = setTimeout(async() => {
            await collector.stop();
            bot.sendErrEmbed(embedModel , "Время вышло!", message);
        }, 1000 * 30);
    collector.on("collect", async r => {
        clearTimeout(timeout);
        collector.stop();
        if (data.Clan.ClanId == message.author.id) {
            if (role) role.delete().catch(err => message.channel.send(`Не удалось удалить клановую роль **\`${role.name}\`**\nВозможно, недостаточно прав.`));
            await global.Collection.Clan.deleteOne({
                ClanId: message.author.id,
                GuildId: message.guild.id
            });
            const voiceChannel = message.guild.channels.cache.get(data.Clan.VoiceID);
            if (voiceChannel) voiceChannel.delete();
        } else if (role) message.member.roles.remove(role).catch(err => message.channel.send(`Не удалось снять клановую роль **\`${role.name}\`**\nВозможно, недостаточно прав.`));
        await global.Collection.Member.upsertOne({
            UserId: message.author.id,
            GuildId: message.guild.id
        }, {
            ClanId: null
        });
        message.channel.send(embedModel .setTitle(`**Вы успешно ушли из клана \`${data.Clan.Name}\`**`).setColor("#36393f"));
    });
}
async function kickMember() {
    if (data.Clan.ClanId != message.author.id) return bot.sendErrEmbed(embedModel , "У вас нет своего клана!", message);
    let rUser = await message.mentions.members.first() || message.guild.members.cache.get(bot.toNum(args[0]));
    if (rUser.id == message.author.id) return bot.sendErrEmbed(embedModel , "Хмм... Хочешь кикнуть овнера клана? Логично...", message);
    if (!rUser) return bot.sendErrEmbed(embedModel , "Необходимо указать участника через @", message);
    const clan = await global.Collection.Member.getOne(data => data.UserId == rUser.id && data.GuildId == message.guild.id);
    if (clan.ClanId != message.author.id) return bot.sendErrEmbed(embedModel , "А это вообще участник этого клана?", message);
    await global.Collection.Member.upsertOne({
        UserId: rUser.id,
        GuildId: message.guild.id
    }, {
        ClanId: null
    });
    if (role) message.member.roles.remove(role).catch(err => message.channel.send(`Не удалось снять клановую роль **\`${role.name}\`** с пользователя **\`${rUser.user.tag}\`**\nВозможно, недостаточно прав.`));
    message.channel.send(embedModel .setColor("#36393f").setTitle(`**Вы успешно кикнули ${rUser.user.tag} из клана \`${data.Clan.Name}\`**`));
}
async function editDescription() {
    if (data.Clan.ClanId != message.author.id) return bot.sendErrEmbed(embedModel , "У вас нет своего клана!", message);
    let description = args.slice(1);
    if (!description.join(" ")) return bot.sendErrEmbed(embedModel , "Вы не указали описание клана...", message);
    await global.Collection.Clan.upsertOne({
        ClanId: message.author.id,
        GuildId: message.guild.id
    }, {
        Description: description.join(" ")
    });
    await message.channel.send(embedModel .setColor("#36393f").setTitle("**Вы успешно изменили описание клана!**"));
};
async function createVoice() {
    if (data.Clan.ClanId !== message.author.id) return bot.sendErrEmbed(embedModel , "У вас нет своего клана!", message);
    const category = message.guild.channels.cache.find(c => c.type === "category" && c.name.toLowerCase() === "кланы");
    if (!message.guild.me.permissions.has("MANAGE_CHANNELS")) return bot.sendErrEmbed(embedModel , "У бота отсутствуют права на создание каналов!", message);
    if (!category) return bot.sendErrEmbed(embedModel , "Отсутствует категория \"Кланы\"", message);
    if (data.Clan.Coins < 5000) return bot.sendErrEmbed(embedModel , "У клана недостаточно средств", message);
    const {
        id
    } = await message.guild.channels.create(data.Clan.Name, {
        type: "voice",
        parent: category,
        userLimit: 30,
        permissionOverwrites: [{
            id: data.Clan.RoleID,
            allow: ["VIEW_CHANNEL", "CONNECT"],
            type: "role"
        }, {
            id: message.guild.roles.everyone.id,
            deny: ["CONNECT"],
            type: "role"
        }],
        reason: "Создание кланового Войса."
    });
    await global.Collection.Clan.upsertOne({
        ClanId: message.author.id,
        GuildId: message.guild.id
    }, {
        Coins: data.Clan.Coins - 5000,
        VoiceID: id
    });
    await message.channel.send(embedModel .setColor("#36393f").setTitle("**Вы успешно создали клановый войс!**"));
}
switch (args[0]) {
    case "create":
        await createClan();
        break;
    case "info":
        await getClanInfo();
        break;
    case "invite":
        await inviteMember();
        break;
    case "desc":
    case "описание":
    case "description":
        await editDescription();
        break;
    case "kick":
        await kickMember();
        break;
    case "exit":
    case "leave":
        await clanLeave();
        break;
    case "createvoice":
        createVoice();
        break;
    default:
        getClanInfo();
}
};
module.exports.help = {
    name: "clan",
    aliases: ["слан", "клун", "гильдия", "guild", "клан", "caln"],
    description: "Управление кланами.",
    usages: {
        "clan create lalka": "Создаст клан с именем `lalka`",
        "clan invite @User#0001": "Пригласить в клан пользователя `@User#0001`",
        "clan kick @User#0001": "Кикнуть участника `@User#0001` из клана.",
        "clan description Я люблю майнкрафт.": "Изменит описание клана на - `Я люблю майнкрафт.`",
        "clan info": "Покажет информацию о клане.",
        "clan createVoice": "Создать клановый войс. Цена 5000.",
        "clan": "Показать информацию о клане, в котором вы находитесь."
    },
    category: "Развлечения"
};
