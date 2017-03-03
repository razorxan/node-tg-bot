const User = require('./User');
const Chat = require('./Chat');
const Audio = require('./Audio');
const Video = require('./Video');
const Voice = require('./Voice');
const Venue = require('./Venue');
const Contact = require('./Contact');
const Document = require('./Document');
const Location = require('./Location');
const PhotoSize = require('./PhotoSize');
const Sticker = require('./Sticker');
const Game = require('./Game');

class Message {

    //https://core.telegram.org/bots/api#message

    constructor (bot, options) {
        Object.defineProperty(this, 'bot', { value: bot });
        this.message_id = options.message_id;
        this.from = options.from ? new User(this.bot, options.from) : undefined;
        this.date = options.date;
        this.chat = options.chat ? new Chat(this.bot, options.chat) : undefined;
        this.forward_from = options.forward_from ? new User(this.bot, options.forward_from) : undefined;
        this.forward_from_chat = options.forward_from_chat ? new Chat(this.bot, options.forward_from_chat) : undefined;
        this.forward_from_message_id = options.forward_from_message_id;
        this.forward_date = options.forward_date;
        this.reply_to_message = options.reply_to_message ? new Message(this.bot, options.reply_to_message) : undefined;
        this.edit_date = options.edit_date;
        this.text = options.text;
        this.entities = undefined;
        this.audio = options.audio ? new Audio(this.bot, options.audio) : undefined;
        this.document = options.document ? new Document(this.bot, options.document) : undefined;
        this.game = options.game ? new Game(this.bot, options.game) : undefined;
        this.photo = undefined;
        this.sticker = options.sticker ? new Sticker(this.bot, options.sticker) : undefined;
        this.video = options.video ? new Video(this.bot, options.video) : undefined;
        this.voice = options.voice ? new Voice(this.bot, options.voice) : undefined;
        this.caption = options.caption;
        this.contact = options.contact ? new Contact(this.bot, options.contact) : undefined;
        this.location = options.location ? new Location(this.bot, options.location) : undefined;
    	this.venue = options.venue ? new Venue(this.bot, options.venue) : undefined;
        this.new_chat_member = options.new_chat_member ? new User(this.bot, options.new_chat_member) : undefined;
        this.left_chat_member = options.left_chat_member ? new User(this.bot, options.left_chat_member) : undefined;
        this.new_chat_title = options.new_chat_title;
        this.new_chat_photo = undefined;
        this.delete_chat_photo = options.delete_chat_photo;
    	this.group_chat_created = options.group_chat_created;
        this.supergroup_chat_created = options.supergroup_chat_created;
        this.channel_chat_created = options.channel_chat_created;
        this.migrate_to_chat_id = options.migrate_to_chat_id;
        this.migrate_from_chat_id = options.migrate_from_chat_id;
    	this.pinned_message = options.pinned_message ? new Message(this.bot, options.pinned_message) : undefined;
        if(options.entities) {
    		this.entities = [];
    		for (let i in options.entities) {
    			this.entities.push(options.entities[i]);
    		}
    	}
        if (options.new_chat_photo) {
            this.new_chat_photo = [];
            for (let i in options.new_chat_photo) {
                this.new_chat_photo.push(new PhotoSize(this.bot, options.new_chat_photo[i]));
            }
        }
        if (options.photo) {
            this.photo = [];
            for (let i in options.photo) {
                this.photo.push(new PhotoSize(this.bot, options.photo[i]));
            }
        }
    }

    _getType () {
        if (this.audio) return 'audio';
        if (this.document) return 'document';
        if (this.photo) return 'photo';
        if (this.sticker) return 'sticker';
        if (this.video) return 'video';
        if (this.text) return 'text';
        if (this.voice) return 'voice';
        if (this.contact) return 'contact';
        if (this.location) return 'location';
    	if (this.venue) return 'venue';
        if (this.new_chat_member) return 'new_chat_member';
        if (this.left_chat_member) return 'left_chat_member';
        if (this.new_chat_title) return 'new_chat_title';
        if (this.new_chat_photo) return 'new_chat_photo';
        if (this.delete_chat_photo) return 'delete_chat_photo';
        if (this.group_chat_created) return 'group_chat_created';
        if (this.supergroup_chat_created) return 'supergroup_chat_created';
        if (this.channel_chat_created) return 'channel_chat_created';
        if (this.migrate_to_chat_id) return 'migrate_to_chat_id';
        if (this.migrate_from_chat_id) return 'migrate_from_chat_id';
    }

    replyToUser (text, opt) {
        let options = opt || {};
        text = '@' + this.from.username + ' ' + text;
        return this.bot.sendMessage(this.chat.id, text, options);
    }

    reply (text, opt) {
        let options = opt || {};
        options.reply_to_message_id = this.message_id;
        return this.bot.sendMessage(this.chat.id, text, options);
    }

    forwardTo (chat_id) {
        return this.bot.forwardMessage(chat_id, this.chat.id, this.message_id);
    }

    editText (text, opt) {
    	let options = opt || {};
    	options.chat_id = this.chat.id;
    	options.message_id = this.message_id;
    	return this.bot.editMessageText(text, options);
    }

    editCaption (opt) {
    	let options = opt || {};
    	options.chat_id = this.chat.id;
    	options.message_id = this.message_id;
    	return this.bot.editMessageCaption(options);
    }

    editReplyMarkup (opt) {
    	let options = opt || {};
    	options.chat_id = this.chat.id;
    	options.message_id = this.message_id;
    	return this.bot.editMessageReplyMarkup(options);
    }

}

module.exports = Message;
