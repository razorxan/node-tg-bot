var Location = require('./Location.js');

var Venue = function (bot, options) {
	if (!(bot && options.location && options.title && options.address)) {
        return new Error('Invalid arguments');
    }
	this.bot = options.bot;
	this.location = new Location(options.location);
	this.title = options.title;
	this.address = options.address;
	this.foursquare_id = options.foursquare_id;
};

Venue.prototype.sendTo = function (chat_id, options, callback) {
    var callback = callback || function () {};
	var options = options || {};
	options.foursquare_id = this.foursquare_id;
    this.bot.sendLocation(chat_id, this.location.latitude, this.location.longitude, this.title, this.address, options, callback.bind(this));
};

module.exports = Venue;