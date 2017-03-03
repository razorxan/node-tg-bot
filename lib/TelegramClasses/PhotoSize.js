const FileType = require('./FileType');

class PhotoSize extends FileType{

    constructor (bot, options) {

        super(bot, options.file_id);
        this.width = options.width;
        this.height = options.height;
        this.file_size = options.file_size;

    }

}

module.exports = PhotoSize;
