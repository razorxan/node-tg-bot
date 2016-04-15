var User = require('./User.js');
var Location = require('./Location.js');

var ChosenInlineResult = function (bot, options) {
    if (!(bot && options.result_id && options.from && options.query)) {
        return new Error('Invalid arguments');
    }
    this.bot = bot;
	this.result_id = options.result_id;
    this.from = new User(this.bot, options.from);
	this.location = options.location ? new Location(this.bot, options.location) : undefined;
	this.inline_message_id = options.inline_message_id;
    this.query = options.query;
};

module.exports = ChosenInlineResult;