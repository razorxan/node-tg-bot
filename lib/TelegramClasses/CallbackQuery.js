var User = require('./User.js');
var Message = require('./Message.js');

var CallbackQuery = function (bot, options) {
	if (!(bot && options.id && options.from && options.data)) {
        return new Error('Invalid arguments');
    }
	this.bot = bot;
	this.from = new User(this.bot, options.from);
	this.message = options.message ? new Message(this.bot, options.message) : undefined;
	this.inline_message_id = options.inline_message_id;
	this.data = options.data;
};

module.exports = CallbackQuery;