var File = require('./File.js');

var FileType = function (bot, file_id) {
    if (!(bot && file_id)) {
        return new Error('Invalid arguments');
    }
    this.bot = bot;
    this.file_id = file_id;
};

FileType.prototype.get = function (callback) {
    var callback = callback || function () {};
    var self = this;
    this.bot.getFile(this.file_id, function (error, data) {
        var f = new File(self.bot, data);
        if (!error) {
            callback.apply(self, [null, new File(self.bot, data)]);
        } else {
            callback.apply(self, [error, data]);
        }
    });
};

module.exports = FileType;