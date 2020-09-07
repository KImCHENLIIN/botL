
module.exports.run = async (bot, message, args) => {
  
  
var item = "";
var time;
var winnerCount
let messageArray = message.content.split(" ");

for (var i = 3; i < messageArray.length; i++){
  item += (messageArray[i] + " ");
}
winnerCount = Number(messageArray[1]);
time = Number(messageArray[2]);


var giveEmbed = new global.MessageEmbed();
giveEmbed.setTitle("🎉 Розыгрыш 🎉");
giveEmbed.setDescription(`\n**Приз: ${item}** \n\n**Создал розыгрыш: ${message.author}**`)
let embedSent = await message.channel.send(giveEmbed);
let react = await embedSent.react("🎉");
setTimeout(async function() {
var reactFetch = await react.fetch("🎉");
var peopleReacted = reactFetch.users.cache.array().filter(us => !us.bot);
  var winners = [];

  if (peopleReacted.length >= winnerCount) {
    winners = peopleReacted;
  } else {
    for (var i = 0; i < winnerCount; i++){
      var index = Math.floor(Math.random() * peopleReacted.length);
      winners.push(peopleReacted[index]);
      peopleReacted.splice(index, 1);
    }
  }
  var winnerMsg = "Участник(и) ";
  for (var i = 0; i < winners.length; i++){
       if(!winners[i]) continue
    winnerMsg += ('<' + '@' + winners[i] + '>' + " ");
  }
  var Embed = new global.MessageEmbed();
  Embed.setTitle("🎉 Розыгрыш завершён! 🎉")
  Embed.setColor(bot.color)
  Embed.setDescription(`**${winnerMsg} выиграл(и) ${item}**`)
  message.channel.send(Embed); //мне нужно главное сообщение, едитировать на Embed
}, time * 1000);
}
module.exports.help= {
    name: 'giveaway',
   aliases: ['конкурс'],
description: 'Можно устроить конкурс, розыгрыш по реакции',
    usages: {
        'giveaway 2 60 test': `2 победителя 60c приз: тест`
    },
    category: 'Бот'
}
