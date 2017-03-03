
class Location {

    constructor (bot, options) {

        Object.defineProperty(this, 'bot', { value: bot });
        this.longitude = options.longitude;
        this.latitude = options.latitude;

    }

    sendTo (chat_id, options, callback) {
        return this.bot.sendLocation(chat_id, this.latitude, this.longitude, options);
    }

}

module.exports = Location;
