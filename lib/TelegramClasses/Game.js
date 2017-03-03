const Animation = require('./Animation');
const PhotoSize = require('./PhotoSize');
const MessageEntity = require('./MessageEntity');

class Game {

    constructor (bot, options) {

        Object.defineProperty(this, 'bot', { value: bot });
        this.title = options.title;
        this.description = options.description;
        this.photo = [];
        this.text = this.text;
        this.text_entities = [];
        this.animation = options.animation ? new Animation(this.bot, options.animation) : undefined;
        for (let i in options.photo) {
            this.photo.push(new PhotoSize(this.bot, options.photo[i]));
        }
        if (options.text_entities) {
            for (let i in options.text_entities) {
                this.text_entities.push(new MessageEntity(this.bot, options.text_entities[i]));
            }
        }
    }

    send (options) {
        return this.bot.sendGame(this.id, options);
    }

}

module.exports = Game;
