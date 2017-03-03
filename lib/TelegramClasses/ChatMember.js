
const User = require('./User.js');

class ChatMember {

    constructor (bot, options) {

        Object.defineProperty(this, 'bot', { value: bot });
        this.user = options.user ? new User(this.bot, options.user) : undefined;
        this.status = options.status;

    }

}

module.exports = ChatMember;
