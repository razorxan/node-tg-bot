var PhotoSize = require('./PhotoSize');
var FileType = require('./FileType');

class Video extends FileType {

    constructor (bot, options) {

        super(bot, options.file_id);
        this.width = options.width;
        this.height = options.height;
        this.duration = options.duration;
        this.thumb = (options.thumb) ? (new PhotoSize(this.bot, options.thumb)) : undefined;
        this.mime_type = options.mime_type;
        this.file_size = options.file_size;

    }

    sendTo (chat_id, options) {
        return this.bot.sendVideo(chat_id, this.file_id, options);
    }

}

module.exports = Video;
