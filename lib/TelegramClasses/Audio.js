const FileType = require('./FileType');

class Audio extends FileType {

    constructor(bot, options) {

        super(bot, options.file_id);
        this.duration = options.duration;
        this.performer = options.performer;
        this.title = options.title;
        this.mime_type = options.mime_type;
        this.file_size = options.file_size;

    }

    sendTo (chat_id, options, callback) {

        //TODO promisify audio.sendTo
        var callback = callback || function () {};
        this.bot.sendAudio(chat_id, this.file_id, options, callback.bind(this));

    }

}

module.exports = Audio;
