const colors = {
    "733683445598781510": "733663188725530797",
    "733685031599603722": "733663241007267941", // И так далее.
  };
  global.bot.on("ready", () => {
  const channelID = "719453344376291328",
     messageID = "733691112203747450";
  
  // Внимание, данное действие нужно выполнять в ready ивенте. Тобишь тогда, когда бот запустится.
  global.bot.channels.cache.get(channelID).messages.fetch(messageID); // Добавляем сообщение в коллекцию.
  
  global.bot.on("messageReactionAdd", (r, user) => {
    if (user.bot || r.message.id != messageID || (!(r.emoji.id in colors) && !(r.emoji.name in colors))) return; 
    r.message.guild.member(user.id).roles.add(colors[(r.emoji.id in colors) ? r.emoji.id : r.emoji.name]);
  });
  
  global.bot.on("messageReactionRemove", (r, user) => {
    if (user.bot || r.message.id != messageID || (!(r.emoji.id in colors) && !(r.emoji.name in colors))) return;
    r.message.guild.member(user.id).roles.remove(colors[(r.emoji.id in colors) ? r.emoji.id : r.emoji.name]);
  });
  })
