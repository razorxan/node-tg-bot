const User = require('./User');
const Location = require('./Location');

class InlineQuery {

    constructor (bot, options) {

        Object.defineProperty(this, 'bot', { value: bot });
        this.id = options.id;
        this.from = new User(this.bot, options.from);
    	this.location = (options.location) ? new Location(this.bot, options.location) : undefined;
        this.query = options.query;
        this.offset = options.offset;

    }

    answer (results, options) {
        return this.bot.answerInlineQuery(this.id, results, options);
    }

}

module.exports = InlineQuery;
