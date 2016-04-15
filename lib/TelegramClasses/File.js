var File = function (bot, options) {
    if (!(bot && options)) {
        return new Error('Invalid argument');
    }
    this.bot = bot;
    this.file_id = options.file_id;
    this.file_size = options.file_size;
    this.file_path = options.file_path;
    this.url = (options.file_path) ? ('https://api.telegram.org/file/bot' + this.bot.token + '/' + this.file_path) : undefined;
};

module.exports = File;