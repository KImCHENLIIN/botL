module.exports.run = async (bot, message, args) => {
  /* Не обязательно для переноса строки использовать \n
  Можно делать так:
  .setDescription(`Текст,
Тут второй текст
Тут третий и так далее.`)
Работает это только с `` ковычками.А спасибо буду знать, просто я хотел сделать блок кода, а он делается только так '```\test```'
вот как сделать это с ``я не знаю 
\`\`\`Text\`\`\`
Или хитрым способом: ${"```Text```"} Спасибо, буду знать, я просто не знал как инвертировать
О таком способе знают очень немногие. А зря.
  */
  if (!args[0])
    return message.channel.send(
      new global.MessageEmbed()
       .setAuthor('Роли сервера')
        .setColor("#2f3136")

        .setDescription(`
<@&751048392263860358> — выдается при помощи [Nitro Server Boost.](https://discordapp.com/channels/708304878535049277/719453344376291328/719643782202523648)
<@&751155021474955265> — показатель адекватности, ламповости пользователя.[Подать заявку.](https://docs.google.com/forms/d/e/1FAIpQLSeksJkrS3aC4d8RwlUqZyV5Y6WX66FW_QnE-9H9yIykpLcLnQ/viewform?usp=sf_link)
<@&751155205806227547> — пользователи проявляющие активность ночью.


`)



    );


/*
  
Так же ты можешь получить нужные [роли](https://discordapp.com/channels/708304878535049277/719453344376291328/733691112203747450) нажав на реакцию

/*


          .setDescription(
**1.9** Нельзя вести коммерческую деятельность на сервере, без разршения Администрации <@&625260860801286155> <@&614731600625795072>
${"```"}Сначала предупреждение, затем наказание - мут до 120 минут${"```"}
**2.0** Запрещена реклама, пиар сторонних ресурсов, с целью раскрутки.
${"```"}Наказание - мут до 180 минут${"```"}
**2.1** Запрещенно намеренноое копирование профилей, никнеймов, ролей других участников сервера.
${"```"}Наказание - мут до 90 минут${"```"}
**2.2** Запрещен деанон учатсников сервера в любом виде
${"```"}Наказание - мут до 360 минут + варн${"```"}

**1.9** Запрещены раздражительные звуки мещающие разговору с черезмерным усилением, фоном, шипением.
\`\`\`Наказание — предупреждение/мут до 120 минут\`\`\`
**2.0** Использование программ для изменения голоса.
\`\`\`Наказание — предупреждение/мут до 40 минут\`\`\`
**2.1** Использование сторонних программ для воспроизведения звуков через микрофон.
\`\`\`Наказание — предупреждение/мут до 80 минут\`\`\`

**1.1** Ты обязан уметь доказать своё мнение, ты обязан уметь спорить или иди нахуй.
\`\`\`Наказание — бан навсегда\`\`\`

**1.2** Запрещено быть тупым долбоёбом.**
\`\`\`наказание — бан навсегда\`\`\`
        )
        */
};
module.exports.help = {
  name: "coci",
  aliases: ["ембуд", "ембед", "ембеде"],
  owneronly: true
};
