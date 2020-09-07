module.exports.run = async (bot, message) => {
  const { body } = await global.superagent.get(`https://random.dog/woof.json`);
  message.channel.send(new global.MessageEmbed().setColor("#fadbc8").setImage(body.url));
};
module.exports.help = {
  name: "dog",
  aliases: ["собака", "пес", "щенок"],
  description: "Получить рандомную фотку собаки.",
  usages: { "dog": "Выдает вам самую крутую собачку." },
  category: "Развлечения"
};
