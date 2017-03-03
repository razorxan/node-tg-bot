const User = require('./User');
const Message = require('./Message');

class CallbackQuery {

	constructor (bot, options) {

		Object.defineProperty(this, 'bot', { value: bot });
		this.id = options.id;
		this.from = new User(this.bot, options.from);
		this.message = options.message ? new Message(this.bot, options.message) : undefined;
		this.inline_message_id = options.inline_message_id;
		this.chat_instance = options.chat_instance;
		this.data = options.data;
		this.game_short_name = options.game_short_name;

	}

	answer (options) {
		return this.bot.answerCallbackQuery(this.id, options);
	}

}

module.exports = CallbackQuery;
