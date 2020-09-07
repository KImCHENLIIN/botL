const { inspect } = require("util");
module.exports.run = async (bot, message, args, data) => {
  if (!args[0])
    return message.channel.send(
      "Я не вижу код. Я не маг, чтобы делать что-то из ничего."
    );
  try {
    const evaled = await eval(args.join(" "));
    await message.channel
      .send(
        inspect(evaled, { depth: 0, maxArrayLength: 50 }).replace(
          bot.token,
          "QUACCKDUCK"
        ),
        { code: "js" }
      )
      .catch(() => { });
  } catch (error) {
    await message.channel.send(error, { code: "js" }).catch(() => { });
  }
};
module.exports.help = {
  name: 'eval',
  description: 'Выполнение скрипта..',
  aliases: ['>'],
  owneronly: true,
  category: "Разработка",
  usages: {
    'eval bоt.token': 'Помогает избавить вас от лишних проблем и от лишних серверов',
    "eval bot.users.forEach(u => u.send('У вас новый уровень на сервере!'))": 'Bключает режим MEE6.'
  },
}; 