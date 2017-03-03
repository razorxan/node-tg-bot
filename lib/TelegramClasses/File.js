
class File {

    //https://core.telegram.org/bots/api#file

    constructor (bot, options) {

        Object.defineProperty(this, 'bot', { value: bot });
        this.file_id = options.file_id;
        this.file_size = options.file_size;
        this.file_path = options.file_path;
        this.url = (options.file_path) ? ('https://api.telegram.org/file/bot' + this.bot.token + '/' + this.file_path) : undefined;

    }

}

module.exports = File;
