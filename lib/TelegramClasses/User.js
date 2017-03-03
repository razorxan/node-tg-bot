
class User {

    //https://core.telegram.org/bots/api#user

    constructor (bot, options) {

        Object.defineProperty(this, 'bot', { value: bot });
        this.id = options.id;
        this.first_name = options.first_name;
        this.last_name = options.last_name;
        this.username = options.username;
        this.display_name = this.last_name ? (this.first_name + ' ' + this.last_name) : (this.username ? (this.first_name + ' ' + this.username) : this.first_name);

    }

    sendMessage (text, options) {
        return this.bot.sendMessage(this.id, text, options);
    }

    forwardMessage (message) {
        return this.bot.forwardMessage(this.id, message.chat.id, message.message_id);
    }

    reply (chat_id, text, options) {
        text = '@' + this.username + ' ' + text;
        return this.bot.sendMessage(chat_id, text, options);
    }

    sendPhoto (photo, options) {
        return this.bot.sendPhoto(this.id, photo, options);
    }

    sendAudio (audio, options) {
        return this.bot.sendAudio(this.id, audio, options);
    }

    sendDocument (document, options) {
        return this.bot.sendDocument(this.id, document, options);
    }

    sendSticker (sticker, options) {
        return this.bot.sendSticker(this.id, sticker, options);
    }

    sendVideo (video, options) {
        return this.bot.sendVideo(this.id, video, options);
    }

    sendVoice (voice, options) {
        return this.bot.sendVoice(this.id, voice, options);
    }

    sendLocation (latitude, longitude, options) {
        return this.bot.sendLocation(this.id, latitude, longitude, options);
    }

    sendVenue (latitude, longitude, title, address, options) {
        return this.bot.sendVenue(this.id, latitude, longitude, title, address, options);
    }

    sendChatAction (chat_action) {
        return this.bot.sendChatAction(this.id, chat_action);
    }

    getUserProfilePhotos (offset, limit) {
        if (arguments.length === 1) {
            limit = offset;
        }
        return this.bot.getUserProfilePhotos(this.id, offset, limit);
    }

    kickFromChat (chat_id) {
    	return this.bot.kickChatMember(chat_id, this.id);
    }

    unbanFromChat (chat_id) {
    	return this.bot.unbanChatMember(chat_id, this.id);
    }

    sendGame (options) {
        return this.bot.sendGame(this.id, options);
    }

}

module.exports = User;
