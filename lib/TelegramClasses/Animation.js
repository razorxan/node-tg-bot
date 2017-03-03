const PhotoSize = require('./PhotoSize.js');
const FileType = require('./FileType');

class Animation extends FileType {

    constructor (bot, options) {
        super(bot, options.file_id);
        this.thumb = (options.thumb) ? new PhotoSize(this.bot, options.thumb) : undefined;
        this.file_name = options.file_name;
        this.mime_type = options.mime_type;
        this.file_size = options.file_size;

    }

}

module.exports = Animation;
