const url = require('url');
const request = require('request');
const Message = require('./TelegramClasses/Message');
const User = require('./TelegramClasses/User');
const Chat = require('./TelegramClasses/Chat');
const Update = require('./TelegramClasses/Update');
const UserProfilePhotos = require('./TelegramClasses/UserProfilePhotos');
const ChatMember = require('./TelegramClasses/ChatMember');
const File = require('./TelegramClasses/File');

class TelegramRequest extends require('events').EventEmitter {

	constructor (bot, endpoint, options = {}) {
		super();
		Object.defineProperty(this, 'bot', { value: bot });
		this.token = this.bot.token;
		this.endpoint = endpoint;
		//TODO handle object to id translation in a separate method
		if (options.qs) {
			if (typeof options.qs.message_id === 'object') options.qs.message_id = options.qs.message.message_id;
			if (typeof options.qs.chat_id === 'object') options.qs.chat_id = options.qs.chat_id.id;
			if (typeof options.qs.user_id === 'object') options.qs.chat_id = options.qs.user_id.id;
			if (typeof options.qs.reply_markup === 'object') options.qs.reply_markup = JSON.stringify(options.qs.reply_markup);
			if (typeof options.qs.results === 'object') options.qs.results = JSON.stringify(options.qs.results);
			if (typeof options.qs.inline_keyboard === 'object') options.qs.inline_keyboard = JSON.stringify(options.qs.inline_keyboard);
		}
		this.options = options || {};
	}


	start () {
		let promise = new Promise((resolve, reject) => {
	        if (!this.token) {
	            reject('Telegram Bot Token not provided!');
	        }
	        this.options = this.options || {};
	        this.options.url = url.format({
	            protocol : 'https',
	            host     : 'api.telegram.org',
	            pathname : '/bot' + this.token + '/' + this.endpoint
	        });
			//TODO fix request to know when error and when ok
	        let r = request(this.options, (error, response, body) => {
	            if (error) {
	                reject(error);
	            } else {
	                try{
	                    var data = JSON.parse(body);
	                    if (data.ok) {
	                        data = this.formatRequestResponse(this.endpoint, data.result);
	                        resolve(data);
	                    } else {
	                        reject(data.description);
	                    }
	                } catch (e) {
	                    reject({description: 'Malformed Json', body: body, error: e});
	                }
	            }
	        });
	    });
	    return promise;
	}

	formatRequestResponse (path, data) {
	    switch (path) {
	        case "sendMessage":
	        case "forwardMessage":
	        case "sendPhoto":
	        case "sendAudio":
	        case "sendDocument":
			case "sendSticker":
	        case "sendVideo":
			case "sendVoice":
	        case "sendLocation":
			case "sendVenue":
	        case "sendContact":
			case "editMessageText":
			case "editMessageCaption":
			case "editMessageReplyMarkup":
	            return new Message(this.bot, data);
	            break;
	        case "getMe":
	            return new User(this.bot, data);
	            break;
	        case "getUserProfilePhotos":
	            return new UserProfilePhotos(this.bot, data);
	            break;
	        case 'getFile':
	            return new File(this.bot, data);
	            break;
	        case 'getUpdates':
	            return new Update(this.bot, data);
	            break;
	        case 'getChat':
	            return new Chat(this.bot, data);
	            break;
	        case 'getChatMember':
	            return new ChatMember(this.bot, data);
	            break;
			case 'getChatAdministrators':
				for (let i in data) {
					data[i] = new ChatMember(this.bot, data[i]);
				}
				return data;
				break;
			case "setWebhook":
			case "deleteWebhook":
			case "sendChatAction":
			case "kickChatMember":
			case "leaveChat":
			case "unbanChatMember":
			case "setGameScore":
				// boolean
				return data;
				break;
			default:
	            return data;
	            break;
	    }
	}

}

module.exports = TelegramRequest;
