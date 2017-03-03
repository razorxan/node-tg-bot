
const Location = require('./Location');

class Venue {

	constructor (bot, options) {

		Object.defineProperty(this, 'bot', { value: bot });
		this.location = new Location(options.location);
		this.title = options.title;
		this.address = options.address;
		this.foursquare_id = options.foursquare_id;

	}

	sendTo (chat_id, options) {

	    let opt = options || {};
		opt.foursquare_id = this.foursquare_id;
	    return this.bot.sendLocation(chat_id, this.location.latitude, this.location.longitude, this.title, this.address, opt);

	}

}

module.exports = Venue;
