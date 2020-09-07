/*
Экспорт модулей.
*/
try {
global.Discord = require("discord.js");
require("dotenv").config();
global.superagent = require("superagent");
global.moment = require("moment");
global.Mongo = require("discore.js").Mongo
global.fs = require("fs"); // Для работы с файлами.
} catch (err) {
  console.error("Производится установка модуля, процесс может занимать до 5 минут!\nВ течении этого времени, НЕ ПЕРЕЗАГРУЖАЙТЕ И НЕ РЕДАКТИРУЙТЕ КОД!");
  let log =
      (require("child_process")
        .execSync("npm i && npm uninstall discore.js && npm i zargovv/discore.js -S")
        .toString("utf8")) + "";
  console.log(`Логи установки модулей:\n${log}`)
}
global.bot = new global.Discord.Client({ disableEveryone: true }); // Клиент Дискорд бота.
global.commands = new Map(); // Коллекция в которую записывается команды.
global.bot.servers = []; // Массив с серверами где играет музыка.
global.config = require("./config.js"); // Настройка бота.
global.MongoDB = new global.Mongo(process.env.MongoDBurl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
global.MessageEmbed = global.Discord.MessageEmbed; // Имбед бота.