
class Contact {

    constructor (bot, options) {

        Object.defineProperty(this, 'bot', { value: bot });
        this.phone_number = options.phone_number;
        this.first_name = options.first_name;
        this.last_name = options.last_name;

    }

    sendTo (chat_id, options) {
    	return this.bot.sendContact(chat_id, this.phone_number, this.first_name, this.last_name, options);
    }

}

module.exports = Contact;
