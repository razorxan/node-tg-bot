var PhotoSize = require('./PhotoSize');
var FileType = require('./FileType');

var Video = function (bot, options) {
    if (!(bot && options.file_id && options.width && options.height && options.duration)) {
        new Error('Invalid Arguments');
    }
    this.bot = bot;
    this.file_id = options.file_id;
    this.width = options.width;
    this.height = options.height;
    this.duration = options.duration;
    this.thumb = (options.thumb) ? (new PhotoSize(this.bot, options.thumb)) : undefined;
    this.mime_type = options.mime_type;
    this.file_size = options.file_size;
};

Video.prototype = Object.create(FileType.prototype);
Video.prototype.constructor = Video;

Video.prototype.sendTo = function (chat_id, options, callback) {
    var callback = callback || function () {};
    this.bot.sendVideo(chat_id, this.file_id, options, callback.bind(this));
};

module.exports = Video;