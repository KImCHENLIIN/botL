global.bot.on("ready", async () => {
    console.log("----------------------------------");
    console.log(`Подключён к аккаунту ${global.bot.user.tag} | ${global.bot.user.id}`);
    console.log(`Ссылка для приглашения бота: ${
        global.config.linked
            ? "\n" + (await global.bot.generateInvite(["ADMINISTRATOR"]))
            : "Отключена."
        }`);
    console.log(`Задержка запуска: ${global.uts(
        Math.floor((Date.now() - global.timeRun) / 1000),
        "секунда",
        "секунды",
        "секунд"
    )}.`);
    console.log(`Серверов: ${global.bot.guilds.cache.size}.`);
    console.log("----------------------------------");
    delete global.timeRun;
    global.bot.user.setStatus(global.config.Status.Status);
    const shtyka = process.openStdin();
    shtyka.addListener("data", r => {
        let x = r.toString().trim().split(/ +/g);
        global.bot.channels.cache.get("538659773864738816").send(x.join(" "));
    });
    const config = global.config.Status;
    let i = 0;
    setInterval(() => {
        if (config.Games.length == i) i = 0;
        global.bot.user.setActivity(config.Games[i].name.replace("{0}", global.uts(global.bot.guilds.cache.size, "сервер", "сервера", "серверов")).replace("{1}", global.uts(global.bot.users.cache.size, "участник", "участника", "участников")), {
            type: config.Games[i].type
        });
        i++;
    }, global.config.Status.Interval);
});
global.bot.login(process.env.TOKEN).catch(err => {
    if (err.message.toLowerCase().includes("incorrect login")) console.log(`Ошибка: Токен бота указан не правильно!

Укажите корректный токен вашего бота в файле .env
Токен не должен содержать пробелов после '='
Пример: TOKEN=abc43389u34fjfakdsfj4fj`);
});