
const PhotoSize = require('./PhotoSize');

class UserProfilePhotos {

    constructor (bot, options) {

        Object.defineProperty(this, 'bot', { value: bot });
        this.total_count = options.total_count;
        this.photos = [];
        for (let i in options.photos) {
            this.photos[i] = [];
            for (let j in options.photos[i]) {
                this.photos[i].push(new PhotoSize(this.bot, options.photos[i][j]));
            }
        }

    }

}

module.exports = UserProfilePhotos;
