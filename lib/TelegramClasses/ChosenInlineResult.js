
const User = require('./User');
const Location = require('./Location');

class ChosenInlineResult {

    constructor (bot, options) {

        Object.defineProperty(this, 'bot', { value: bot });
        this.result_id = options.result_id;
        this.from = new User(this.bot, options.from);
    	this.location = options.location ? new Location(this.bot, options.location) : undefined;
    	this.inline_message_id = options.inline_message_id;
        this.query = options.query;

    }

}

module.exports = ChosenInlineResult;
