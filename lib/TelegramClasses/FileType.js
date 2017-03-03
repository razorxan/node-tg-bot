const File = require('./File');

class FileType {

    constructor (bot, file_id) {

        Object.defineProperty(this, 'bot', { value: bot });
        this.file_id = file_id;

    }

    getFile (callback) {

        //TODO Promise getFile
        var callback = callback || function () {};
        let self = this;
        this.bot.getFile(this.file_id, function (error, data) {
            let f = new File(self.bot, data);
            if (!error) {
                callback.apply(self, [null, new File(self.bot, data)]);
            } else {
                callback.apply(self, [error, data]);
            }
        });
    }
}


module.exports = FileType;
