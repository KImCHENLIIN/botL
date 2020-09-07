const YouTube = require('simple-youtube-api'),
    ytdl = require('ytdl-core'),
    tokens = require('../../keys.json');
let token = global.config.activetoken,
    youtube = new YouTube(token);
if (token == "0") {
    global.config.activetoken = tokens[0].key
    global.fs.writeFileSync('../../config.json', JSON.stringify(global.config, null, '\t'))
    token = tokens[0].key
}
module.exports.run = async (bot, message, args) => {
    let query = args.join(' '),
        res = [],
        msg;
    let musicEmbed = new global.MessageEmbed().setColor('#8F00FF').setTitle('🎵 | Поиск трека...')
    if (!query) {
        musicEmbed.setTitle('🎵 | Укажите название трека / Ссылку на YouTube трек.')
        return message.channel.send(musicEmbed);
    }
    let join;
    try {
        join = await message.member.voice.channel.join()
    } catch (err) {
        musicEmbed.setTitle('🎵 | Ошибка подключения к голосовому каналу');
        console.error(err);
        return message.channel.send(musicEmbed);
    }
    if (!bot.servers[message.guild.id]) {
        bot.servers[message.guild.id] = {
            queue: [],
            channel: message.channel.id,
        };
    }
    msg = await message.channel.send(musicEmbed);
    if (query.includes('://www.youtube.com/watch') == true) try {
        try {
            res.push(await youtube.getVideo(query));
        } catch (e) {
            let b = tokens.find(x => x.date < Date.now())
            for (let i = 0; i < tokens.length; i++) {
                if (tokens[i].key == global.config.activetoken) {
                    tokens[i].date = `${Date.now() + 1000 * 60 * 60 * 12}`
                    global.fs.writeFileSync('../../keys.json', JSON.stringify(tokens, null, '\t'))
                }
            }
            global.config.activetoken = b.key;
            global.fs.writeFileSync('../../config.json', JSON.stringify(global.config, null, '\t'))
            youtube = new YouTube(b.key);
            return bot.sendErrEmbed(new global.MessageEmbed(), 'Произошла ошибка. Попробуйте ввести команду еще раз.', true, message);
        }
    } catch (err) {
        musicEmbed.setTitle('🎵 | Видео по ссылке не найдено')
        return msg.edit(musicEmbed);
    } else try {
        res = await youtube.searchVideos(query, 1);
    } catch (e) {
        let b = tokens.find(x => x.date < Date.now())
        for (let i = 0; i < tokens.length; i++) {
            if (tokens[i].key == global.config.activetoken) {
                tokens[i].date = `${Date.now() + 1000 * 60 * 60 * 12}`
                global.fs.writeFileSync('../../keys.json', JSON.stringify(tokens, null, '\t'))
            }
        }
        global.config.activetoken = b.key;
        global.fs.writeFileSync('../../config.json', JSON.stringify(global.config, null, '\t'))
        youtube = new YouTube(b.key);
        return bot.sendErrEmbed(new global.MessageEmbed(), 'Произошла ошибка. Попробуйте ввести команду еще раз.', true, message);
    }
    if (!res[0]) {
        musicEmbed.setTitle('🎵 | Трек не найден.')
        return msg.edit(musicEmbed);
    }
    musicEmbed.setTitle('🎵 | Музыка')
    if (!bot.servers[message.guild.id].dispatcher) {
        musicEmbed.addField('Сейчас играет: ', `**${res[0].title}**`, true)
        musicEmbed.addField('Трек поставил:', `**${message.author.tag}**`, true)
        await bot.servers[message.guild.id].queue.push({
            url: `${res[0].id}`,
            author: `${message.author.tag}`
        })
        await bot.play(ytdl, message, join)
        msg.edit(musicEmbed);
    } else {
        if (bot.servers[message.guild.id].queue.length >= 5) return bot.sendErrEmbed(new global.MessageEmbed(), 'Достигнуто максимальное количество треков в очереди.', true, message);
        musicEmbed.addField('Трек успешно добавлен в очередь:', `**${res[0].title}**`, true)
        musicEmbed.addField('Трек поставил:', `**${message.author.tag}**`, true)
        await bot.servers[message.guild.id].queue.push({
            url: `${res[0].id}`,
            author: `${message.author.tag}`
        })
        msg.edit(musicEmbed);
    }
}
module.exports.help = {
    name: 'play',
    aliases: ['плей', 'музыка', 'хачюмузыку'],
    description: 'Включить музыку.',
    usages: {
        'play Название/Ссылка': 'Играть музыку.'
    },
    category: 'Музыка'
};