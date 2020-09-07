module.exports.run = async (bot, message, args, data) => {
  const embedObj = {
    title: "Помощь.",
    description: `**Если хотите узнать поподробнее о команде напишите: \`${data.command}\` __\`Kоманда\`__**`,
    color: "#36393f"
  };
  async function sendCommandList() {
    let fields = [];
    global.commands.forEach(e => {
      if (fields.some(a => a.category == e.help.category)) {
        fields[
          fields.indexOf(fields.find(f => f.category == e.help.category))
        ].commands.push(e.help);
      } else {
        fields.push({ category: e.help.category, commands: [e.help] });
      }
    });
    let embeds = [];
    let i = 0;
    let noCategory;
    fields.forEach(e => {
      if (!e.category)
        return (noCategory = e.commands.map(a =>
          a.owneronly ? `~~**\`${a.name}\`**~~` : `**\`${a.name}\`**`
        ));
      let embed = new global.MessageEmbed(embedObj).addField(
        e.category,
        e.commands
          .map(a =>
            a.owneronly ? `~~**\`${a.name}\`**~~` : `**\`${a.name}\`**`
          )
          .join(" ")
      );
      if (!embeds.length) {
        embeds.push(embed);
      } else if (embeds.slice(-1)[0].fields.length == 4) {
        i++;
        embeds.push(embed);
      } else
        embeds
          .slice(-1)[0]
          .addField(
            e.category,
            e.commands
              .map(a =>
                a.owneronly ? `~~**\`${a.name}\`**~~` : `**\`${a.name}\`**`
              )
              .join(", ")
          );
    });
    if (noCategory && embeds.slice(-1)[0].fields.length == 4)
      embeds.push(
        new global.MessageEmbed(embedObj).addField(
          "Не сортированая команда.",
          noCategory.join(" ")
        )
      );
    else if (noCategory)
      embeds
        .slice(-1)[0]
        .addField("Не сортированая команда.", noCategory.join(" "));
    let i2 = 0;
    let msg = await message.channel.send(
      embeds[0].setFooter(`Страница 1 из ${embeds.length}`)
    );
    if (embeds.length > 1) {
      await msg.react("⏪");
      await msg.react("⏩");
      const backwardsFilter = (reaction, user) =>
        reaction.emoji.name === "⏪" && user.id === message.author.id;
      const forwardsFilter = (reaction, user) =>
        reaction.emoji.name === "⏩" && user.id === message.author.id;
      const backwards = msg.createReactionCollector(backwardsFilter);
      const forwards = msg.createReactionCollector(forwardsFilter);
      setTimeout(() => {
         backwards.stop();
         forwards.stop();
         msg.delete();
         message.delete();
    }, 90000);
      forwards.on("collect", r => {
        msg.reactions.cache.forEach(e => e.users.remove(message.author.id));
        if (i2 + 1 == embeds.length) return;
        i2++;
        msg.edit(
          embeds[i2].setFooter(`Страница ${i2 + 1} из ${embeds.length}`)
        );
      });
      backwards.on("collect", r => {
        msg.reactions.cache.forEach(e => e.users.remove(message.author.id));
        if (i2 == 0) return;
        i2--;
        msg.edit(
          embeds[i2].setFooter(`Страница ${i2 + 1} из ${embeds.length}`)
        );
      });
    }
  }
  async function sendCommandInfo(commandName) {
    const arr = [];
    global.commands.forEach(e => arr.push(e.help));
    const cmd = arr.find(
      e =>
        (e.aliases && e.aliases.some(a => a.toLowerCase() == commandName)) ||
        e.name.toLowerCase() === commandName
    );
    if (!cmd) return bot.sendErrEmbed(new global.MessageEmbed(), `Такой команды нет.`, message, data.Guild.Prefix);
    let usages = [];
    if (!cmd.usages) usages = `${data.Guild.Prefix}${cmd.name}`;
    else
      Object.keys(cmd.usages).forEach(e => {
        usages.push(`**${data.Guild.Prefix}${e}** => ${cmd.usages[e]}`);
      });
    message.channel.send(
      new global.MessageEmbed()
        .setTitle(`Информация о \`${data.Guild.Prefix}${cmd.name}\``)
        .setDescription(
          `**${!cmd.description ? "Не указана." : cmd.description}**`
        )
        .addField(
          "Алиасы",
          `${cmd.aliases.map(e => `**\`${e}\`**`).join(", ") ||
          "**Отсутствуют.**"}`,
          false
        )
        .addField(
          "Использования",
          `${usages.join(`\n`)}`
        )
        .setColor("FF7A47")
    );
  }
  if (!args[0]) sendCommandList();
  else sendCommandInfo(args[0]);
};
module.exports.help = {
  name: "help",
  aliases: ["хелп", "помощь"],
  description: "Показать список команд || Показать описание команды.",
  usages: {
    "help": "Показать весь список команд.",
    "help kick": "Показать информацию о команде **`kick`**"
  },
  category: "Информация о боте"
};