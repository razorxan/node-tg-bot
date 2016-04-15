var User = require('./User.js');
var Location = require('./Location.js');

var InlineQuery = function (bot, options) {
    if (!(bot && options.id)) {
        return new Error('Invalid arguments');
    }
	this.bot = bot;
    this.id = options.id;
    this.from = new User(this.bot, options.from);
	this.location = (options.location) ? new Location(this.bot, options.location) : undefined;
    this.query = options.query;
    this.offset = options.offset;
};

InlineQuery.prototype.answer = function (results, options, callback) {
    var callback = callback || function () {};
    this.bot.answerInlineQuery(this.id, results, options, callback);
};

module.exports = InlineQuery;