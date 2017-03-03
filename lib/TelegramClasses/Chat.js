
class Chat {

    //https://core.telegram.org/bots/api#chat

    constructor (bot, options) {

        Object.defineProperty(this, 'bot', { value: bot });
        this.id = options.id;
        this.type = options.type;
        this.title = options.title;
        this.username = options.username;
        this.first_name = options.first_name;
        this.last_name = options.last_name;
        this.all_members_are_administrators = options.all_members_are_administrators;

    }

    forwardMessage (message) {
        return this.bot.forwardMessage(this.id, message.chat.id, message.message_id);
    }

    sendMessage (text, options) {
        return this.bot.sendMessage(this.id, text, options);
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

    sendLocation(latitude, longitude, options) {
        return this.bot.sendLocation(this.id, latitude, longitude, options);
    }

    sendVenue (latitude, longitude, title, address, options) {
        return this.bot.sendVenue(this.id, latitude, longitude, title, address, options);
    }

    sendChatAction (chat_action) {
        return this.bot.sendChatAction(this.id, chat_action);
    }

    leave () {
        return this.bot.leaveChat(this.id);
    }

    getMember (user_id) {
        return this.bot.getChatMember(this.id, user_id);
    }

    getMembersCount () {
        return this.bot.getChatMembersCount(this.id);
    }

    getAdministrators () {
        return this.bot.getChatAdministrators(this.id);
    }

    kickMember (user_id) {
    	return this.bot.kickChatMember(this.id, user_id);
    }

    unbanMember (user_id) {
    	return this.bot.unbanChatMember(this.id, user_id);
    }

    sendGame (options) {
        return this.bot.sendGame(this.id, options);
    }

}

module.exports = Chat;
