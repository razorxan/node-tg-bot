var PhotoSize = require('./PhotoSize');
var FileType = require('./FileType');

var Voice = function (bot, options) {
    if (!(bot && options.file_id && options.duration)) {
        new Error('Invalid Arguments');
    }
    this.bot = bot;
    this.file_id = options.file_id;
    this.duration = options.duration;
    this.mime_type = options.mime_type;
    this.file_size = options.file_size;
};

Voice.prototype = Object.create(FileType.prototype);
Voice.prototype.constructor = Voice;

Voice.prototype.sendTo = function (chat_id, options, callback) {
    var callback = callback || function () {};
    this.bot.sendVoice(chat_id, this.file_id, options, callback.bind(this));
};

module.exports = Voice;