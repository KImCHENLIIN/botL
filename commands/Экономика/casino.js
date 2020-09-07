module.exports.run = async (bot, message, args, data) => {
  const embed = new global.MessageEmbed().setColor("8142EB").setTitle("Казино");
  if (!args.join(" ")) return bot.sendErrEmbed(embed, `Используйте \`${data.command} <Ставка>\``, message)
  const num = bot.toNum(args.join(" "));
  if (!num || num <= 0) return bot.sendErrEmbed(embed, `Используйте \`${data.command} <Ставка>\``, message)
  if (num > data.Member.Coins) return bot.sendErrEmbed(embed, `У вас недостаточно денег! Ваш баланс: ${bot.locale(data.Member.Coins)} $`, message);
  const fruits = ["🍋", "🍇", "🍓", "🍒", "🍌"]; // Чем больше фруктов тем меньше шанс.
  let bar = "";
  for (let i = 0; i < 3; i++) bar += global.random(fruits);
  data.Member.Coins -= num;
  function set(num) {
    global.Collection.Member.upsertOne(
      { UserId: message.author.id, GuildId: message.guild.id },
      { Coins: num }
    );
  }
  for (let i = 0; i < fruits.length; i++) {
    if (bar.includes(`${fruits[i]}${fruits[i]}${fruits[i]}`)) {
      embed.addField(
        `${message.author.tag}`,
        `🔸🎰🎰🎰🔸\n🎰${bar}🎰\n🔹🎰🎰🎰🔹\n\n**Вы выиграли ${bot.locale(
          num * 5
        )} $ (x5)**`
      );
      set(data.User.Coins + num * 5);
      global.addMark(num * 5 >= 100000, "💍", data.User, message);
      global.addMark(num * 5 >= 5000000, "👑", data.User, message);
      global.addMark(num * 5 >= 1000000000, "👨‍💼", data.User, message);
      return message.channel.send(embed);
    } else if (bar.includes(`${fruits[i]}${fruits[i]}`)) {
      embed.addField(
        `${message.author.tag}`,
        `🔸🎰🎰🎰🔸\n🎰${bar}🎰\n🔹🎰🎰🎰🔹\n\n**Вы выиграли ${bot.locale(
          num * 2
        )} $ (x2)**`
      );
      set(data.User.Coins + num * 2);
      global.addMark(num * 2 >= 100000, "💍", data.User, message);
      global.addMark(num * 2 >= 5000000, "👑", data.User, message);
      global.addMark(num * 2 >= 1000000000, "👨‍💼", data.User, message);
      return message.channel.send(embed);
    } else if (bar.startsWith(fruits[i]) && bar.endsWith(fruits[i])) {
      embed.addField(
        `${message.author.tag}`,
        `🔸🎰🎰🎰🔸\n🎰${bar}🎰\n🔹🎰🎰🎰🔹\n\n**Вы выиграли ${bot.locale(
          num * 2
        )} $ (x2)**`
      );
      set(data.User.Coins + num * 2);
      global.addMark(num * 2 >= 100000, "💍", data.User, message);
      global.addMark(num * 2 >= 5000000, "👑", data.User, message);
      global.addMark(num * 2 >= 1000000000, "👨‍💼", data.User, message);
      return message.channel.send(embed);
    }
  }
  set(data.Member.Coins);
  embed.addField(
    `${message.author.tag}`,
    `🔸🎰🎰🎰🔸\n🎰${bar}🎰\n🔹🎰🎰🎰🔹\n\n**Вы проиграли ${bot.locale(
      num
    )} $**`
  );
  return message.channel.send(embed);
};
module.exports.help = {
  name: "casino",
  aliases: ["cs", "казино", "слитьденьги"],
  description: "Играть в казино на доллары",
  usages: { "casino 5000": "Сделать ставку 5000 $" },
  category: "Экономика"
};