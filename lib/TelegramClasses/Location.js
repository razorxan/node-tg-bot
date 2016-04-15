var Location = function (bot, options) {
    if (!(bot && options.longitude && options.latitude)) {
        return new Error('Invalid Argument');
    }
    this.bot = bot;
    this.longitude = options.longitude;
    this.latitude = options.latitude;
};

Location.prototype.sendTo = function (chat_id, options, callback) {
    var callback = callback || function () {};
    this.bot.sendLocation(chat_id, this.latitude, this.longitude, options, callback.bind(this));
};

module.exports = Location;