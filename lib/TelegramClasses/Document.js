const FileType = require('./FileType');
const PhotoSize = require('./PhotoSize');

class Document extends FileType {

    constructor (bot, options) {

        super(bot, options.file_id);
        this.thumb = (options.thumb) ? new PhotoSize(this.bot, options.thumb) : undefined;
        this.file_name = options.file_name;
        this.mime_type = options.mime_type;
        this.file_size = options.file_size;

    }

    sendTo (chat_id, options) {
        //TODO promisify document.sendTo
        return this.bot.sendDocument(chat_id, this.file_id, options);

    }

}

/*
var Document = function (bot, options) {
    if (!(bot && options.file_id)) {
        return new Error('Invalid arguments');
    }
    this.bot = bot;
    this.file_id = options.file_id;
    this.thumb = (options.thumb) ? (new PhotoSize(this.bot, options.thumb)) : undefined;
    this.file_name = options.file_name;
    this.mime_type = options.mime_type;
    this.file_size = options.file_size;
};

Document.prototype = Object.create(FileType.prototype);
Document.prototype.constructor = Document;

Document.prototype.sendTo = function (chat_id, options, callback) {
    var callback = callback || function () {};
    this.bot.sendDocument(chat_id, this.file_id, options, callback.bind(this));
};
*/
module.exports = Document;
