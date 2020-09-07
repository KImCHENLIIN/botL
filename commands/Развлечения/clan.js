module.exports.run = async (bot, message, args, data) => {
  async function createClan() {
    if (!message.guild.me.permissions.has("MANAGE_ROLES")) return bot.sendErrEmbed(new global.MessageEmbed(), "У бота отсутствуют права на создание ролей!", message)
    let coins = data.Member.Coins
    if (coins < global.config.clanPrice) return bot.sendErrEmbed(new global.MessageEmbed(), `**Для создания клана требуется ${bot.locale(global.config.clanPrice)} $**`, message);
    if(!args[0]) return bot.sendErrEmbed(new global.MessageEmbed(), "Укажите цвет клана!", message)
    let clanName = args.slice(1).join(" ");
    if(!clanName) return bot.sendErrEmbed(new global.MessageEmbed(), "Укажите название клана!", message);
    let clan = await global.Collection.Clan.findOne(data => data.Name == clanName && data.GuildId == message.guild.id);
    if (!clan) {
      if (data.Member.ClanId) return bot.sendErrEmbed(new global.MessageEmbed(), "У вас уже есть клан.", message);
      
      const { id } = await message.guild.roles.create({ data: {
        name: clanName,
        color: args[0],
        mentionable: false
      }});
      await message.member.roles.add(id);
      await global.Collection.Clan.upsertOne(
        { ClanId: message.author.id, GuildId: message.guild.id },
        { Name: clanName, RoleID: id }
      );
      
      await global.Collection.Member.upsertOne(
        { UserId: message.author.id, GuildId: message.guild.id },
        { ClanId: message.author.id, Coins: coins - global.config.clanPrice }
      );
      
      return message.channel.send(
        new global.MessageEmbed()
          .setTitle("**Вы успешно создали клан!**")
          .setColor("#36393f")
      );
    } else bot.sendErrEmbed(new global.MessageEmbed(), "Клан с таким названием уже существует.", message);
  };
  async function getClanInfo() {
    if (!data.Member.ClanId) return bot.sendErrEmbed(new global.MessageEmbed(), "У вас нет клана!", message);
    let clanMembers = await global.Collection.Member.filterKeys(dat => dat.ClanId == data.Clan.ClanId && dat.GuildId == message.guild.id);
    message.channel.send(
      new global.MessageEmbed()
        .setTitle(`**Информация о клане \`${data.Clan.Name}\`**`)
        .setColor("#36393f")
        .addField(
          "Опыт клана:",
          `${data.Clan.Xp}/${data.Clan.Level * 1000} (осталось ${data.Clan.Level * 1000 - data.Clan.Xp} опыта до нового уровня)`
        )
        .addField("Описание клана:", data.Clan.Description)
        .addField(
          "Баланс клана:",
          global.uts(data.Clan.Coins, "монета", "монеты", "монет") + "."
        )
        .addField("Участников:", clanMembers.length)
    );
  }
  async function inviteMember() {
    if (data.Clan.ClanId != message.author.id) return bot.sendErrEmbed(new global.MessageEmbed(), "У вас нет своего клана!", message);
    const rUser = await message.mentions.members.first() || message.guild.members.cache.get(bot.toNum(args[0]));
    if (!rUser) return bot.sendErrEmbed(new global.MessageEmbed(), "Необходимо указать участника через @", message);
    if (rUser.id == message.author.id) return bot.sendErrEmbed(new global.MessageEmbed(), "Ты хочешь самого себя пригласить??", message)
    const resRuser = await global.Collection.Member.getOne(data => data.UserId == rUser.id && data.GuildId == message.guild.id);
    if (await global.Collection.Clan.findOne(resRuser.ClanId)) return bot.sendErrEmbed(new global.MessageEmbed(), "Этот пользователь уже в клане!", message);
    await message.channel.send(
      `${rUser}`,
      new global.MessageEmbed()
        .setTitle(`${message.author.tag} пригласил ${rUser.user.tag} в клан \`${data.Clan.Name}\``)
        .setDescription(`Для вступления напишите \`${data.Guild.Prefix}accept\``)
    );
    const collector = new global.Discord.MessageCollector(
      message.channel,
      m => m.author.id == rUser.id
    ),
      timeout = setTimeout(async () => {
        await collector.stop();
        bot.sendErrEmbed(new global.MessageEmbed(), "Пользователь не ответил на приглашение!", message);
      }, 1000 * 30);
    collector.on("collect", async msg => {
      if (
        msg.content
          .toLowerCase()
          .trim()
          .split(" ")[0] == `${data.Guild.Prefix}accept`
      ) {
        clearTimeout(timeout);
        await collector.stop();
        await global.Collection.Member.upsertOne(
          { UserId: rUser.id, GuildId: message.guild.id },
          { ClanId: message.author.id }
        );
        message.channel.send(
          new global.MessageEmbed()
            .setTitle(`${rUser.user.tag} Зашел в клан ${data.Clan.Name}!`)
            .setColor("#36393f")
        )
      }
    });
  }

  async function clanLeave() {
    if (!data.Member.ClanId) return bot.sendErrEmbed(new global.MessageEmbed(), "У вас нет клана!", message);
    let msg = await message.channel.send(
      new global.MessageEmbed()
        .setTitle(`**Ты точно хочешь выйти из клана \`${data.Clan.Name}\`? Если да тогда нажми на ✅**`)
    );
    const filter = (reaction, user) =>
      reaction.emoji.name === "✅" && user.id === message.author.id;
    await msg.react("✅");
    const collector = msg.createReactionCollector(filter),
      timeout = setTimeout(async () => {
        await collector.stop();
        bot.sendErrEmbed(new global.MessageEmbed(), "Время вышло!", message);
      }, 1000 * 30);
    collector.on("collect", async r => {
      clearTimeout(timeout);
            collector.stop();
      if (data.Clan.ClanId == message.author.id) {
        await global.Collection.Clan.deleteOne({ ClanId: message.author.id, GuildId: message.guild.id});
        message.guild.roles.delete(data.Clan.RoleID);
        const voiceChannel = message.guild.channels.cache.get(data.Clan.VoiceID);
        if (voiceChannel) voiceChannel.delete();
      }
      await global.Collection.Member.upsertOne(
        { UserId: message.author.id, GuildId: message.guild.id },
        { ClanId: null }
      );
      message.channel.send(
        new global.MessageEmbed()
          .setTitle(`**Вы успешно ушли из клана \`${data.Clan.Name}\`**`)
          .setColor("#36393f")
      );
    });
  }

  async function kickMember() {
    if (data.Clan.ClanId != message.author.id) return bot.sendErrEmbed(new global.MessageEmbed(), "У вас нет своего клана!", message);
    let rUser = await message.mentions.members.first() || message.guild.members.cache.get(bot.toNum(args[0]));
    if (rUser.id == message.author.id) return bot.sendErrEmbed(new global.MessageEmbed(), "Хмм... Хочешь кикнуть овнера клана? Логично...", message);
    if (!rUser) return bot.sendErrEmbed(new global.MessageEmbed(), "Необходимо указать участника через @", message);
    const clan = await global.Collection.Member.getOne(data => data.UserId == rUser.id && data.GuildId == message.guild.id);
    if (clan.ClanId != message.author.id) return bot.sendErrEmbed(new global.MessageEmbed(), "А это вообще участник этого клана?", message);
    await global.Collection.Member.upsertOne(
      { UserId: rUser.id, GuildId: message.guild.id },
      { ClanId: null }
    );
    rUser.roles.remove(data.Clan.RoleID);
    message.channel.send(
      new global.MessageEmbed()
        .setColor("#36393f")
        .setTitle(
          `**Вы успешно кикнули ${rUser.user.tag} из клана \`${data.Clan.Name}\`**`
        )
    );
  }

  async function editDescription() {
    if (data.Clan.ClanId != message.author.id) return bot.sendErrEmbed(new global.MessageEmbed(), "У вас нет своего клана!", message);
    let description = args.slice(1);
    if (!description.join(" ")) return bot.sendErrEmbed(new global.MessageEmbed(), "Вы не указали описание клана...", message);
    await global.Collection.Clan.upsertOne(
      { ClanId: message.author.id, GuildId: message.guild.id },
      { Description: description.join(" ") }
    );
    await message.channel.send(
      new global.MessageEmbed()
        .setColor("#36393f")
        .setTitle("**Вы успешно изменили описание клана!**")
    );
  };
  
  async function createVoice() {
    if (data.Clan.ClanId !== message.author.id) return bot.sendErrEmbed(new global.MessageEmbed(), "У вас нет своего клана!", message);
    const category = message.guild.channels.cache.find(c => c.type === "category" && c.name.toLowerCase() === "кланы");
    if (!message.guild.me.permissions.has("MANAGE_CHANNELS")) return bot.sendErrEmbed(new global.MessageEmbed(), "У бота отсутствуют права на создание каналов!", message);
    if (!category) return bot.sendErrEmbed(new global.MessageEmbed(), "Отсутствует категория \"Кланы\"", message);
    if (data.Clan.Coins < 5000) return bot.sendErrEmbed(new global.MessageEmbed(), "У клана недостаточно средств", message);
    
    const { id } = await message.guild.channels.create(data.Clan.Name, {
      type: "voice",
      parent: category,
      userLimit: 30,
      permissionOverwrites: [{
        id: data.Clan.RoleID,
        allow: ["VIEW_CHANNEL", "CONNECT"],
        type: "role"
      },
      {
        id: message.guild.roles.everyone.id,
        deny: ["CONNECT"],
        type: "role"
      }],
      reason: "Создание кланового Войса."
    });
    
    await global.Collection.Clan.upsertOne(
      { ClanId: message.author.id, GuildId: message.guild.id },
      { Coins: data.Clan.Coins - 5000, VoiceID: id }
    );
    
    await message.channel.send(
      new global.MessageEmbed()
        .setColor("#36393f")
        .setTitle("**Вы успешно создали клановый войс!**")
    );
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