global.bot.on("ready", async () => {
  let Collection;
  try {
    Collection = await global.Collection.Member.getData();
  } catch (err) {
    console.error("Производится установка модуля, процесс может занимать до 5 минут!\nВ течении этого времени, НЕ ПЕРЕЗАГРУЖАЙТЕ И НЕ РЕДАКТИРУЙТЕ КОД!")
    let Console =
      (await require("child_process")
        .execSync("npm uninstall discore.js && npm i zargovv/discore.js -S")
        .toString("utf8")) + "";
    console.log(
      `Переустановка модуля discore.js
${Console}
`
    );
    console.log("Модуль установлен!")
    process.exit();
  }
  Collection.forEach(data => {
    const { GuildId, UserId } = data;
    if (data.Mute) global.handlerMute(data, data.Mute - Date.now());
    if (data.Ban) global.handlerBan(data, data.Ban - Date.now());
  });
});
