module.exports.run = async (bot, message) => {
  const { body } = await global.superagent.get(`https://randomfox.ca/floof/`);
  message.channel.send(new global.MessageEmbed().setColor("#fadbc8").setImage(body.image));
};
module.exports.help = {
  name: "fox",
  aliases: [
    "лиса",
    "лис",
    "лисичка",
    "лисенок",
    "лисонька",
    "лисы",
    "лисеночки"
  ],
  description: "Получить рандомную фотку лисы.",
  usages: { fox: "Выдает вам самую красивую лисичку." },
  category: "Развлечения"
};
