var PhotoSize = require('./PhotoSize');
var FileType = require('./FileType');

var Audio = function (bot, options) {
    if (!(bot && options.file_id && options.duration)) {
        new Error('Invalid Arguments');
    }
    this.bot = bot;
    this.file_id = options.file_id;
    this.duration = options.duration;
    this.performer = options.performer;
    this.title = options.title;
    this.mime_type = options.mime_type;
    this.file_size = options.file_size;
};

Audio.prototype = Object.create(FileType.prototype);
Audio.prototype.constructor = Audio;

Audio.prototype.sendTo = function (chat_id, options, callback) {
    var callback = callback || function () {};
    this.bot.sendAudio(chat_id, this.file_id, options, callback.bind(this));
};

module.exports = Audio;