module.exports.run = async (bot, message, args, data) => {
  const MarryEmbed = new global.MessageEmbed()
    .setColor("#F430FF")
    .setTitle(`Партнер.`);
  data.User.Senders = data.User.Senders.filter(e => bot.users.cache.has(e));
  const senders = await global.Collection.User.filter(
    data => data.Sender == message.author.id
  );
  switch (args[0]) {
    case "send":
      if (data.User.Level < 15)
        return bot.sendErrEmbed(
          new global.MessageEmbed(),
          "Отправлять предложения можно с 15 уровня.",
          message
        );
      if (data.User.Partner)
        return bot.sendErrEmbed(
          new global.MessageEmbed(),
          "У вас уже есть партнер.",
          message
        );
      const rUser =
        (await message.mentions.members.first()) ||
        message.guild.members.cache.get(bot.toNum(args[0]));
      if (!rUser)
        return bot.sendErrEmbed(
          new global.MessageEmbed(),
          "Укажите пользователя.",
          message
        );
      const res = await global.Collection.User.getOne(
        data => data.UserId == rUser.id
      );
      if (res.Partner)
        return bot.sendErrEmbed(
          new global.MessageEmbed(),
          "У пользователя уже есть партнер.",
          message
        );
      if (data.User.Coins < 15000)
        return bot.sendErrEmbed(
          new global.MessageEmbed(),
          "Для отправки предложения надо 15.000.",
          message
        );
      if (data.User.Sender)
        return bot.sendErrEmbed(
          new global.MessageEmbed(),
          `Вы уже отправили запрос! Для отмены используйте \`${data.command} cancel\``,
          message
        );
      if (res.Senders.length >= 5)
        return bot.sendErrEmbed(
          new global.MessageEmbed(),
          "Пользователь уже имеет максимальное количество предложений.",
          message
        );
      if (res.Senders.length <= 2) res.Senders.push(message.author.id);
      await global.Collection.User.upsertOne(
        { UserId: message.author.id },
        { Sender: rUser.id }
      );
      await global.Collection.User.upsertOne(
        { UserId: rUser.id },
        { Senders: res.Senders }
      );
      await global.Collection.Member.upsertOne(
        { UserId: rUser.id, GuildId: message.guild.id },
        { Coins: data.Member.Coins - 15000 }
      );
      MarryEmbed.setTitle(
        `Вы успешно отправили предложение: **\`${rUser.user.tag}\`**`
      );
      break;
    case "cancel":
      if (!data.User.Sender)
        return bot.sendErrEmbed(
          new global.MessageEmbed(),
          "Вы не отправляли предложений.",
          message
        );
      await global.Collection.User.upsertOne(
        { UserId: message.author.id },
        { Sender: false }
      );
      await global.Collection.User.upsertOne(
        { UserId: data.User.Sender },
        {
          Senders: global.ArrayElementDelete(
            data.User.Senders,
            data.User.Senders.indexOf(message.author.id)
          )
        }
      );
      MarryEmbed.setTitle("Вы успешно отменили предложение.");
      break;
    case "senders":
      if (!data.User.Senders.length)
        return bot.sendErrEmbed(
          new global.MessageEmbed(),
          "Вам никто не отправлял предложение.",
          message
        );
      let i = 0;
      MarryEmbed.addField(
        "Список предложений:",
        data.User.Senders.map(e => {
          i++;
          return `${i}. ${bot.users.cache.get(e).tag}`;
        }).join("\n")
      );
      MarryEmbed.setFooter(
        `Для принятия введите: **\`${data.command} accept Hомер\`**`
      );
      break;
    case "clear":
      if (!data.User.Senders.length)
        return bot.sendErrEmbed(
          new global.MessageEmbed(),
          "Вам никто не отправлял предложение.",
          message
        );
      senders.forEach(
        async e =>
          await global.Collection.User.upsertOne(
            { UserId: e.UserId },
            { Sender: false }
          )
      );
      await global.Collection.User.upsertOne(
        { UserId: message.author.id },
        { Senders: [] }
      );
      MarryEmbed.setTitle("Вы успешно очистили список предложений.");
      break;
    case "accept":
      if (!data.User.Senders.length)
        return bot.sendErrEmbed(
          new global.MessageEmbed(),
          "У вас нет предложений.",
          message
        );
      let acceptNum = bot.toNum(args[1]);
      if(data.User.Senders.length == 1) acceptNum = 1;
      if (!acceptNum || acceptNum > data.User.Senders.length)
        return bot.sendErrEmbed(
          new global.MessageEmbed(),
          `Укажите число от 1 до ${data.User.Senders.length}. Чтобы посмотреть список партнеров введите: **\`${data.command} senders\`**`,
          message
        );
      data.User.Senders.filter(e => e != data.User.Senders[acceptNum - 1]).forEach(
        async e =>
          await global.Collection.User.upsertOne(
            { UserId: e },
            { Sender: false }
          )
      );
      const sendersRuser = await global.Collection.User.filter(dat => dat.Sender == data.User.Senders[acceptNum - 1]);
      await global.Collection.User.upsertOne(
        { UserId: data.User.Senders[acceptNum - 1] },
        { Partner: message.author.id, Senders: [] }
      );
      await global.Collection.User.upsertOne(
        { UserId: message.author.id },
        { Partner: data.User.Senders[acceptNum - 1], Senders: [] }
      );
      MarryEmbed.setTitle(
        `Вы успешно приняли предложение от \`${
          bot.users.cache.get(data.User.Senders[acceptNum - 1]).tag
        }\``
      );
      break;
    case "divorce":
      await global.Collection.User.upsertOne(
        { UserId: message.author.id },
        { Partner: null }
      );
      await global.Collection.User.upsertOne(
        { UserId: data.User.Partner },
        { Partner: null }
      );
      MarryEmbed.setTitle(
        "Как жаль, но вы развелись с своим партнером! Будем надеятся вы найдете себе лучше."
      );
      break;
    default:
      if (!data.User.Partner || !bot.users.cache.has(data.User.Partner))
        MarryEmbed.setTitle("У вас нет партнера.");
      else
        MarryEmbed.addField(
          "Ваш партнер:",
          `**${bot.users.cache.get(data.User.Partner).tag}**`
        );
  }
  message.channel.send(MarryEmbed);
};
module.exports.help = {
  name: "marry",
  aliases: ["свадьба", "пожениться", "замуж", "жена", "муж", "гейскаясвадьба"],
  description: "Ваш партнер",
  usages: {
    marry: "Покажет вашего партнера.",
    "marry send @user#0001": "Предложить стать партнером @User#0001.",
    "marry senders": "Посмотреть список предложений.",
    "marry accept [num]": "Принять предложение от пользователя.",
    "marry cancel": "Отменяет текущий запрос.",
    "marry clear": "Очистить список предложений.",
    "marry divorce": "Развестись с вашим любимым, наилучшим партнером."
  },
  category: "Развлечения"
};
