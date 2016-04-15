var Contact = function (bot, options) {
    if (!(bot && options.phone_number && options.first_name)) {
        return new Error('Invalid argument');
    }
    this.bot = bot;
    this.phone_number = options.phone_number;
    this.first_name = options.first_name;
    this.last_name = options.last_name;
};

Contact.prototype.sendTo = function (chat_id, options, callback) {
    //chatId, phone_number, first_name, options, callback
	var callback = callback || function () {};
	this.bot.sendContact(chat_id, this.phone_number, this.first_name, this.last_name, options, callback.bind(this));
};

module.exports = Contact;