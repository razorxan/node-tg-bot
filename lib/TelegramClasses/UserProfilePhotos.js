var PhotoSize = require('./PhotoSize.js');

var UserProfilePhotos = function (bot, options) {
    if (!(bot && options.total_count && options.photos)) {
        return new Error('Invalid Arguments');
    }
    this.bot = bot;
    this.total_count = options.total_count;
    this.photos = [];
    for (var i in options.photos) {
        this.photos[i] = [];
        for (var j in options.photos[i]) {
            this.photos[i].push(new PhotoSize(this.bot, options.photos[i][j]));
        }
    }
};

module.exports = UserProfilePhotos;