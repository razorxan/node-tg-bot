var User = function (bot, options) {
	if (!(bot || options.id || options.first_name)) {
        return new Error('Invalid arguments');
    }
    this.bot = bot;
    this.id = options.id;
    this.first_name = options.first_name;
    this.last_name = options.last_name;
    this.username = options.username;
};

User.prototype.sendMessage = function (text, options, callback) {
    var callback = callback || function () {};
    this.bot.sendMessage(this.id, text, options, callback.bind(this));
};

User.prototype.forwardMessage = function (message, callback) {
    var callback = callback || function () {};
    this.bot.forwardMessage(this.id, message.chat.id, message.message_id, callback.bind(this));
};

User.prototype.sendPhoto = function (photo, options, callback) {
    var callback = callback || function () {};
    this.bot.sendPhoto(this.id, photo, options, callback.bind(this));
};

User.prototype.sendAudio = function (audio, options, callback) {
    var callback = callback || function () {};
    this.bot.sendAudio(this.id, audio, options, callback.bind(this));
};

User.prototype.sendDocument = function (document, options, callback) {
    var callback = callback || function () {};
    this.bot.sendDocument(this.id, document, options, callback.bind(this));
};

User.prototype.sendSticker = function (sticker, options, callback) {
    var callback = callback || function () {};
    this.bot.sendSticker(this.id, sticker, options, callback.bind(this));
};

User.prototype.sendVideo = function (video, options, callback) {
    var callback = callback || function () {};
    this.bot.sendVideo(this.id, video, options, callback.bind(this));
};

User.prototype.sendVoice = function (voice, options, callback) {
    var callback = callback || function () {};
    this.bot.sendVoice(this.id, voice, options, callback.bind(this));
};

User.prototype.sendLocation = function (latitude, longitude, options, callback) {
    var callback = callback || function () {};
    this.bot.sendLocation(this.id, latitude, longitude, options, callback.bind(this));
};

User.prototype.sendVenue = function (latitude, longitude, title, address, options, callback) {
    var callback = callback || function () {};
    this.bot.sendVenue(this.id, latitude, longitude, title, address, options, callback.bind(this));
};

User.prototype.sendChatAction = function (chat_action, callback) {
    var callback = callback || function () {};
    this.bot.sendChatAction(this.id, chat_action, callback.bind(this));
};

User.prototype.getUserProfilePhotos = function (offset, limit, callback) {
    var callback = callback || function () {};
    if (arguments.length === 2) {
        callback = limit;
        limit = offset;
        offset = undefined;
    } else if (arguments.length === 1) {
        callback = offset;
        offset = undefined;
        limit = undefined;
    }
    this.bot.getUserProfilePhotos(this.id, offset, limit, callback.bind(this));
};

User.prototype.kickFromChat = function (chat_id, callback) {
	var callback = callback || function () {};
	this.bot.kickChatMember(chat_id, this.id, callback.bind(this));
};

User.prototype.unbanFromChat = function (chat_id, callback) {
	var callback = callback || function () {};
	this.bot.unbanChatMember(chat_id, this.id, callback.bind(this));
};

module.exports = User;