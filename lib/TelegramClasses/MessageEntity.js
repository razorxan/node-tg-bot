const User = require('./User');

class MessageEntity {

	constructor (bot, options) {

		Object.defineProperty(this, 'bot', { value: bot });
		this.type = options.type;
		this.offset = options.offset;
		this.length = options.length;
		this.url = options.url;
		this.user = options.user ? new User(this.bot, options.user) : undefined;

	}

}

module.exports = MessageEntity;
