/*
Экспорт различных функций.
*/

const colors = {
  "ID Эмоджи": "733683445598781510",
  "ID Эмодзи 2": "733685031599603722", // И так далее.
};
const channelID = "719453344376291328",
   messageID = "733691112203747450";

// Внимание, данное действие нужно выполнять в ready ивенте. Тобишь тогда, когда бот запустится.
global.bot.on.channels.cache.get(channelID).messages.fetch(messageID); // Добавляем сообщение в коллекцию.

global.bot.on("messageReactionAdd", (r, user) => {
  if (user.bot || r.message.id != mesageID || (!(r.emoji.id in colors) && !(r.emoji.name in colors))) return; 
  r.message.guild.member(user.id).roles.add(colors[(r.emoji.id in colors) ? r.emoji.id : r.emoji.name]);
});

global.bot.on("messageReactionRemove", (r, user) => {
  if (user.bot || r.message.id != mesageID || (!(r.emoji.id in colors) && !(r.emoji.name in colors))) return;
  r.message.guild.member(user.id).roles.remove(colors[(r.emoji.id in colors) ? r.emoji.id : r.emoji.name]);


global.bot.isNumeric = n => {
  return !isNaN(parseFloat(n)) && isFinite(n); // Проверяет на число.
};

global.bot.locale = num => {
  // Разделяет число | Пример: 4001294 => 4.001.294.
  return parseInt(num)
    .toLocaleString()
    .replace(/,/g, ".");
};

global.bot.sendErrEmbed = function (embed, text, message, prefix) {
  // Выводит ошибку с текстом.
  if(!prefix) prefix = message.prefix
  embed.setColor("FF305A");
  embed.setTitle(`${text}`);
  embed.setDescription(`Получить синтаксис \`${prefix}help <Kоманда>\``);
  if (message) message.channel.send(embed);
};

global.bot.toNum = text => {
  // Получает число из строки | Пример: dj82f1 => 821
  if (!text) return;
  return parseInt(text.replace(/[^\d]/g, ""));
};

global.bot.play = async function (ytdl, message, voiceConnection) {
  global.bot.servers[
    message.guild.id
  ].dispatcher = await voiceConnection
    .play(
      ytdl(
        `https://www.youtube.com/watch?v=${global.bot.servers[message.guild.id].queue[0].url}}`
      ),
      { filter: "audioonly" }
    );
  
    global.bot.servers[message.guild.id].dispatcher.on("finish", async () => {
      if (global.bot.servers[message.guild.id].queue[0]) global.bot.servers[message.guild.id].queue.shift();
      if (global.bot.servers[message.guild.id].queue[0]) {
        global.bot.play(ytdl, message, voiceConnection);
        let channel = message.guild.channels.cache.get(
          global.bot.servers[message.guild.id].channel
        );
        let videoinfo = await ytdl.getInfo(
          `https://www.youtube.com/watch?v=${global.bot.servers[message.guild.id].queue[0].url}`
        );
        channel.send(
          new global.MessageEmbed()
            .setColor("#8F00FF")
            .setTitle("🎵 | Музыка:")
            .addField("Сейчас играет: ", `**${videoinfo.title}**`, true)
            .addField(
              "Трек поставил:",
              `**${global.bot.servers[message.guild.id].queue[0].author}**`,
              true
            )
        );
      } else {
        message.guild.me.voice.channel.leave();
        delete global.bot.servers[message.guild.id]
      }
    });
};

global.uts = function (UT, one, two, five) {
  if (`${UT}`.split("").reverse()[1] === "1") return `${UT} ${five}`;
  if (`${UT}`.split("").reverse()[0] === "1") return `${UT} ${one}`;
  if (
    +`${UT}`.split("").reverse()[0] >= 2 &&
    +`${UT}`.split("").reverse()[0] <= 4
  )
    return `${UT} ${two}`;
  return `${UT} ${five}`;
};

global.ArrayElementDelete = function (arr, num) {
  if (!num) {
    arr.shift();
    return arr;
  }
  arr.splice(num, num);
  return arr;
};

global.addMark = async function (condition, mark, user, message) {
  if (condition && !user.Marks.includes(mark)) {
    user.Marks.push(mark);
    await global.Collection.User.upsertOne(
      { UserId: message.author.id },
      { Marks: user.Marks }
    );
    message.channel.send(
      new global.MessageEmbed()
        .setColor("RANDOM")
        .addField(
          `${message.author.tag} | Достижение разблокировано!`,
          ` ** __${mark} ${global.config.Marks[mark].name}__ ${global.config.Marks[mark].description} ** `
        )
    );
  }
};
global.clanTrigger = async function (clan, message) {
  if (!clan.ClanId) return;
  const chance = global.random(1, 100);
  if (chance <= 90) return;
  if (clan.Xp >= clan.Level * 1000) {
    clan.Level += 1;
    clan.Xp = 0;
    await message.react("🤞");
  }
  if (chance >= 95) clan.Coins += global.random(0, 10);
  global.Collection.Clan.upsertOne(
    { ClanId: clan.ClanId, GuildId: message.guild.id },
    { Level: clan.Level, Xp: clan.Xp + 1, Coins: clan.Coins }
  );
};
global.random = function (arg, arg2) {
  function randomInteger(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  }
  if (Array.isArray(arg))
    return arg[this.Math.floor(Math.random() * arg.length)];
  return randomInteger(arg, arg2);
};

global.handlerMute = function (data, time) {
  const { UserId, GuildId } = data;
  setTimeout(async() => {
    global.Collection.Member.upsertOne({ UserId, GuildId }, { Mute: null });
    const guild = global.bot.guilds.cache.get(GuildId);
    if (!guild) return;
    const member = guild.member(UserId);
    if (!member) return;
    const res = await global.Collection.Guild.getOne(data => data.GuildId == GuildId);
    if (!res.MuteRole) return;
    const role = guild.roles.cache.get(res.MuteRole);
    if (!role) {
      global.MongoDB.Guild.upsertOne({ GuildId }, { MuteRole: null });
    } else member.roles.remove(role);
  }, time);
}
global.handlerBan = function (data, time) {
  const { UserId, GuildId } = data;
  setTimeout(() => {
    global.Collection.Member.upsertOne({ UserId, GuildId }, { Ban: null });
    const guild = global.bot.guilds.cache.get(GuildId);
    if (guild) guild.members.unban(UserId);
  }, time);
}
