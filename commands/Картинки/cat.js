module.exports.run = async (bot, message) => {
  const { body } = await global.superagent.get(`http://aws.random.cat//meow`);
  message.channel.send(new global.MessageEmbed().setColor("#fadbc8").setImage(body.file));
};
module.exports.help = {
  name: "cat",
  aliases: ["кошка", "кот"],
  description: "Получить рандомную фотку котика.",
  usages: { "cat": "Выдает вам самого милого котика." },
  category: "Развлечения"
};
