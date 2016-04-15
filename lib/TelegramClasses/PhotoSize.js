var PhotoSize = require('./PhotoSize');
var FileType = require('./FileType');

var PhotoSize = function (bot, options) {
    if (!(bot && options.file_id && options.width && options.height)) {
        return new Error('Invalid arguments');
    }
    this.bot = bot;
    this.file_id = options.file_id;
    this.width = options.width;
    this.height = options.height;
    this.file_size = options.file_size;
};

PhotoSize.prototype = Object.create(FileType.prototype);
PhotoSize.prototype.constructor = PhotoSize;

module.exports = PhotoSize;