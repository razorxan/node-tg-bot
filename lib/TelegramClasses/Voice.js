const PhotoSize = require('./PhotoSize');
const FileType = require('./FileType');

class Voice extends FileType {

    constructor(bot, options) {
        //TODO check mandatory params
        super(bot, options.file_id);
        this.duration = options.duration;
        this.mime_type = options.mime_type;
        this.file_size = options.file_size;

    }

    sendTo (chat_id, options) {
        return this.bot.sendVoice(chat_id, this.file_id, options);
    }
}

module.exports = Voice;
