const commandFolder = "commands";
let i = 0;
let iError = 0;
if (!global.fs.existsSync(`./${commandFolder}/`)) {
  console.error(
    `Команды не были загружены из-за отсутствия папки ${commandFolder}!`
  );
} else {
  function check(file, name) {
    if (file != null && !("run" in file))
      console.error(
        `В команде ${name} отсутствует экспорт run. Команда не загружена.`
      );
    if (file != null && !("help" in file))
      console.error(
        `В команде ${name} отсутствует экспорт help. Команда не загружена.`
      );
    if (
      (file != null && !("run" in file)) ||
      (file != null && !("help" in file))
    ) {
      iError++;
      i--;
      return;
    }
    if (file != null && file && "help" in file && "run" in file) {
      try {
        global.commands.set(file.help, file);
      } catch (err) {
        console.error(err.stack);
      }
    }
  }
  global.fs.readdirSync(`./${commandFolder}`).forEach(folder => {
    if (folder.endsWith(".js")) i++;
    check(
      folder.endsWith(".js") ? require(`../${commandFolder}/${folder}`) : null,
      folder
    );
    try {
      global.fs
        .readdirSync(`./${commandFolder}/${folder}/`)
        .filter(file => file.endsWith(".js"))
        .forEach(file => {
          i++;
          try {
            check(require(`../${commandFolder}/${folder}/${file}`), file);
          } catch (err) {
            if (
              err.message.slice(0, 33) != `ENOTDIR: not a directory, scandir`
            ) {
              i--;
              iError++;
              console.error(err.stack);
            }
          }
        });
    } catch (err) {
      if (err.message.slice(0, 33) != `ENOTDIR: not a directory, scandir`) {
        i--;
        iError++;
        console.error(err.stack);
      }
    }
  });
  console.log(
    `Был${i == 1 ? "a" : "o"} загружен${i == 1 ? "a" : "o"} ${global.uts(
      i,
      "команда",
      "команды",
      "команд"
    )}!`
  );
  if (iError)
    console.log(
      `Не был${iError == 1 ? "a" : "o"} загружен${
        iError == 1 ? "a" : "o"
      } из-за ошибок ${global.uts(iError, "команда", "команды", "команд")}!`
    );
}
