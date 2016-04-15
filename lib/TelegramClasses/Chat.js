var Chat = function (bot, options) {
    if (!(bot && options.id && options.type)) {
        return new Error('invalid arguments');
    }
    this.bot = bot;
    this.id = options.id;
    this.type = options.type;
    this.title = options.title;
    this.username = options.username;
    this.first_name = options.first_name;
    this.last_name = options.last_name;
};

Chat.prototype.forwardMessage = function (message, callback) {
    var callback = callback || function () {};
    this.bot.forwardMessage(this.id, message.chat.id, message.message_id, callback.bind(this));
};

Chat.prototype.sendMessage = function (text, options, callback) {
    var callback = callback || function () {};
    this.bot.sendMessage(this.id, text, options, callback.bind(this));
};

Chat.prototype.sendPhoto = function (photo, options, callback) {
    var callback = callback || function () {};
    this.bot.sendPhoto(this.id, photo, options, callback.bind(this));
};

Chat.prototype.sendAudio = function (audio, options, callback) {
    var callback = callback || function () {};
    this.bot.sendAudio(this.id, audio, options, callback.bind(this));
};

Chat.prototype.sendDocument = function (document, options, callback) {
    var callback = callback || function () {};
    this.bot.sendDocument(this.id, document, options, callback.bind(this));
};

Chat.prototype.sendSticker = function (sticker, options, callback) {
    var callback = callback || function () {};
    this.bot.sendSticker(this.id, sticker, options, callback.bind(this));
};

Chat.prototype.sendVideo = function (video, options, callback) {
    var callback = callback || function () {};
    this.bot.sendVideo(this.id, video, options, callback.bind(this));
};

Chat.prototype.sendVoice = function (voice, options, callback) {
    var callback = callback || function () {};
    this.bot.sendVoice(this.id, voice, options, callback.bind(this));
};

Chat.prototype.sendLocation = function (latitude, longitude, options, callback) {
    var callback = callback || function () {};
    this.bot.sendLocation(this.id, latitude, longitude, options, callback.bind(this));
};

Chat.prototype.sendVenue = function (latitude, longitude, title, address, options, callback) {
    var callback = callback || function () {};
    this.bot.sendVenue(this.id, latitude, longitude, title, address, options, callback.bind(this));
};

Chat.prototype.sendChatAction = function (chat_action, callback) {
    var callback = callback || function () {};
    this.bot.sendChatAction(this.id, chat_action, callback.bind(this));
};

Chat.prototype.kickMember = function (user_id) {
	var callback = callback || function () {};
	this.bot.kickChatMember(this.id, user_id, callback.bind(this));
};

Chat.prototype.unbanMember = function (user_id) {
	var callback = callback || function () {};
	this.bot.unbanChatMember(this.id, user_id, callback.bind(this));
};

module.exports = Chat;