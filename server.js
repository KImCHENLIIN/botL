global.timeRun = Date.now();
require("./exports.js");
require("./functions.js");
if (!global.config.START) return;
console.log("Запуск проекта...");
if (global.config.glitch) {
  const http = require("http"),
    express = require("express"),
    app = express();

  app.get("/", (request, response) => {
    console.log(Date.now() + " пинг получен");
    response.sendStatus(200);
  });

  app.listen(process.env.PORT);
  setInterval(() => {
    https.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
  }, 280000);
}
try {
  if (!global.fs.existsSync("./Functions/")) {
    console.error(
      "Процедура запуска отменена из-за отсутствия папки Functions!"
    );
  } else {
    new Promise(async resolve => {
      // Все это
      if (!global.fs.existsSync("./Models/")) {
        console.error(
          "Процедура подключения к MongoDB прервана из-за отсутствия папки Models!"
        );
        return resolve();
      }
      await MongoDB.open(); //Подключение к базе, а после него идёт загрузка...моделей и ивентов.
      let files = global.fs
        .readdirSync("./Models/") // Обращение к папке.
        .filter(file => file.endsWith(".js")); // Фильтрация файлов.
      let i = files.length;
      let iErr = 0;
      await files.forEach(file => {
        // Перечисление.
        try {
          require("./Models/" + file);
        } catch (err) {
          i--;
          iErr++;
          console.error(err.stack);
        }
      });
      console.log(
        `Загружен${i >= 2 || !i ? "о" : ""} ${global.uts(
          i,
          "модель",
          "модели",
          "моделей"
        )}!${
          iErr >= 1
            ? `\n${global.uts(iErr, "модель", "модели", "модель")} с ошибками.`
            : ""
        }`
      );

      global.Collection = {
        User: await global.MongoDB.getCollection("User"),
        Guild: await global.MongoDB.getCollection("Guild"),
        Clan: await global.MongoDB.getCollection("Clan"),
        Member: await global.MongoDB.getCollection("Member")
      };
      resolve();
    }).then(() => {
      let files = global.fs
        .readdirSync("./Functions/") // Обращение к папке.
        .filter(file => file.endsWith(".js")); // Фильтрация файлов.
      let i = files.length;
      let iErr = 0;
      files.forEach(file => {
        // Перечисление.
        try {
          require("./Functions/" + file);
        } catch (err) {
          i--;
          iErr++;
          console.error(err.stack);
        }
      });
      console.log(
        `Загружен${i >= 2 || !i ? "о" : ""} ${global.uts(
          i,
          "файл",
          "файла",
          "файлов"
        )}!${
          iErr >= 1
            ? `\n${global.uts(iErr, "файл", "файла", "файлов")} с ошибками.`
            : ""
        }`
      );
    });
  }
} catch (err) {
  console.error(err.stack);
}
