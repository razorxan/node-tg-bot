var Message = require('./Message.js');
var InlineQuery = require('./InlineQuery.js');
var CallbackQuery = require('./CallbackQuery.js');
var ChosenInlineResult = require('./ChosenInlineResult.js');

var Update = function (bot, options) {
    if (!(bot && options.update_id)) {
        return new Error('Invalid arguments');
    }
    this.bot = bot;
    this.update_id = options.update_id;
    this.message = (options.message) ? (new Message(this.bot, options.message)) : undefined;
    this.inline_query = (options.inline_query) ? new InlineQuery(this.bot, options.inline_query) : undefined;
    this.chosen_inline_result = (options.chosen_inline_result) ? new ChosenInlineResult(this.bot, options.chosen_inline_result) : undefined;
	this.callback_query = options.callback_query ? new CallbackQuery(this.bot, options.callback_query) : undefined;
    this.total_count = (options.total_count) ? options.total_count : undefined;
    this.photos = undefined;
    if (options.photos) {
        this.photos = [];
        for (var i in options.photos) {
            this.photos.push(new UserProfilePhotos(this.bot, options.photos[i]));
        }
    }
};

module.exports = Update;