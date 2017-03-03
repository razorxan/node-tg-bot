const TelegramPolling = require('./TelegramPolling');
const TelegramWebhook = require('./TelegramWebhook');
const TelegramRequest = require('./TelegramRequest');
const TelegramCommand = require('./TelegramCommand');


const Update = require('./TelegramClasses/Update');
const Message = require('./TelegramClasses/Message');
const User = require('./TelegramClasses/User');
const UserProfilePhotos = require('./TelegramClasses/UserProfilePhotos');
const File = require('./TelegramClasses/File');

const path = require('path');
const url = require('url');
const fs = require('fs');
const mime = require('mime');
const stream = require('stream');
const EventEmitter = require('events').EventEmitter;

/**
    TelegramBot Class
    * @see https://core.telegram.org/bots/api
*/


class TelegramBot extends EventEmitter {
    constructor (token, options) {
        super();
        options = options || {};
        this.prefix = options.prefix || '/';
        this.token = token;

        if (options.polling) {
            //this.polling = new TelegramBotPolling(token, options.polling, this.processUpdate.bind(this));
            this.polling = new TelegramPolling(token, options.polling);
            this.polling.on('update', update => {
                this.processUpdate.call(this, update);
            }).on('error', error => {

            }).on('start', () => {

            }).on('stop', () => {

            });
        }
        if (options.webhook) {
            this.webhook = new TelegramWebhook(token, options.webhook);
            this.webhook.on('update', update => {
                 this.processUpdate.call(this, update);
            })
        }
    }
};

TelegramBot.prototype.deferEvent = function (event) {
    let promise = new Promise((resolve, reject) => {
        this.once(event, function () {
            let args = Array.prototype.slice.call(arguments);
            let value = {
                event: event,
                args: args
            };
            if (args.length === 1) {
                value = args[0];
            }
            resolve.call(this, value);
        });
    });
    return promise;

};

TelegramBot.prototype.registerCommandsIn = function (directory) {
    fs.readdir(directory, (err, files) => {
        files.forEach(file => {
            let c = new require(directory + '/' + file);
            let command = new c(this);
        });
    });
};

TelegramBot.prototype._parseCommand = function (str, lookForQuotes) {
    let args = [];
    let readingPart = false;
    let part = '';
    for(let i = 0; i < str.length; i++) {
        if(str.charAt(i) === ' ' && !readingPart) {
            args.push(part);
            part = '';
        } else {
            if(str.charAt(i) === '\"' && lookForQuotes) {
                readingPart = !readingPart;
            } else {
                part += str.charAt(i);
            }
        }
    }
    args.push(part);
    return args;
};


TelegramBot.prototype.processUpdate = function (update) {
    update = new Update(this, update);
    this.emit('update', update);
    if (update.message) {
        this.emit('from.' + update.message.from.id, update.message);
        //TODO is let type really used????
        let type = update.message._getType();
        this.emit(update.message._getType(), update.message);
        if (update.message._getType() === 'text') {
            if (update.message.text.substring(0, 1) === this.prefix) {
                let params = this._parseCommand(update.message.text, true);
                if (params[0].length > 1) {
                    let command = params.shift().substring(1).toLowerCase();
                    if (!this._events[command]) {
                        this.emit('*', command, params, update.message);
                    }
                    this.emit(command, params, update.message);
                }
            } else {
				this.emit('text_only', update.message);
			}
        }
    } else if (update.edited_message) {
        this.emit('edited_message', update.edited_message);
    } else if (update.channel_post) {
        this.emit('channel_post', update.channel_post);
    } else if (update.edited_channel_post) {
        this.emit('edited_channel_post', update.edited_channel_post);
    } else if (update.inline_query) {
        this.emit('inline_query', update.inline_query);
    } else if (update.chosen_inline_result) {
        this.emit('chosen_inline_result', update.chosen_inline_result);
    } else if (update.callback_query) {
		this.emit('callback_query', update.callback_query);
		this.emit('callback_query.message.' + update.callback_query.message.message_id, update.callback_query);
	}
};

TelegramBot.prototype.formatSendData = function (type, data) {
    let formData;
    let fileName;
    let fileId = data;
    if (typeof data === 'object') {
        fileId = data.file_id;
    }
    if (data instanceof stream.Stream) {
        fileName = url.parse(path.basename(data.path)).pathname;
        formData = {};
        formData[type] = {
            value: data,
            options: {
                filename: fileName,
                contentType: mime.lookup(fileName)
            }
        };
        return [formData, fileId];
    } else if (fs.existsSync(data)) {
        fileName = path.basename(data);
        formData = {};
        formData[type] = {
            value: fs.createReadStream(data),
            options: {
                filename: fileName,
                contentType: mime.lookup(fileName)
            }
        };
        return [formData, fileId];
    } else {
        formData = null;
        fileId = data;
        return [formData, fileId];
    }
};


TelegramBot.prototype.request = function (path, options) {
    let req = new TelegramRequest(this, path, options);
    return req.start();
};

/**
    * Specify an url to receive incoming updates via an outgoing webhook.
    * @see https://core.telegram.org/bots/api#setwebhook
*/
TelegramBot.prototype.setWebhook = function (url, certificate) {
    let opts = {
        qs: {
            url: url
        }
    };
    let content = this.formatSendData('certificate', certificate);
    opts.formData = content[0];
    return this.request('setWebhook', opts);
};

/**
    * Remove webhook.
    * @see https://core.telegram.org/bots/api#deletewebhook
*/
TelegramBot.prototype.deleteWebhook = function () {
    return this.request('setWebhook');
};

/**
    * Gets current webhook status.
    * @see https://core.telegram.org/bots/api#getwebhookinfo
**/
TelegramBot.prototype.getWebhookInfo = function () {
    return this.request('getWebhookInfo');
};

/**
    * Use this method to receive incoming updates using long polling
    * @see https://core.telegram.org/bots/api#getupdates
*/
TelegramBot.prototype.getUpdates = function (timeout, limit, offset) {
    //TODO allowed_updates parameters
    //TODO fix methods arguments (soemthing like options object over single args)
    let query = {
        offset    : offset,
        limit     : limit,
        timeout   : timeout
    };
    return this.request('getUpdates', {qs: query});
};

/**
    * Returns basic information about the bot in form of a `User` object.
    * @see https://core.telegram.org/bots/api#getme
*/
TelegramBot.prototype.getMe = function () {
    let path = 'getMe';
    return this.request(path, null);
};

/**
    * Send Text message.
    * @see https://core.telegram.org/bots/api#sendmessage
*/
TelegramBot.prototype.sendMessage = function (recipientId, text, options) {
    let query = options || {};
    query.chat_id = recipientId;
    query.text = text;
    return this.request('sendMessage', {qs: query});
};

/**
    * Forward messages of any kind.
    * @see https://core.telegram.org/bots/api#forwardmessage
*/
TelegramBot.prototype.forwardMessage = function (recipientId, fromChatId, messageId) {
    let query = {
        chat_id      : recipientId,
        from_chat_id : fromChatId,
        message_id   : messageId
    };
    return this.request('forwardMessage', {qs: query});
};

/**
    * Send Photo
    * @see https://core.telegram.org/bots/api#sendphoto
*/
TelegramBot.prototype.sendPhoto = function (chatId, photo, options) {
    let opts = {
        qs: options || {}
    };
    opts.qs.chat_id = chatId;
    let content = this.formatSendData('photo', photo);
    opts.formData = content[0];
    opts.qs.photo = content[1];
    return this.request('sendPhoto', opts);
};

/**
    * Send Audio
    * @see https://core.telegram.org/bots/api#sendaudio
*/
TelegramBot.prototype.sendAudio = function (chatId, audio, options) {
    let opts = {
        qs: options || {}
    };
    opts.qs.chat_id = chatId;
    let content = this.formatSendData('audio', audio);
    opts.formData = content[0];
    opts.qs.audio = content[1];
    return this.request('sendAudio', opts);
};

/**
    * Send Document
    * @see https://core.telegram.org/bots/api#senddocument
*/
TelegramBot.prototype.sendDocument = function (chatId, doc, options) {
    let opts = {
        qs: options || {}
    };
    opts.qs.chat_id = chatId;
    let content = this.formatSendData('document', doc);
    opts.formData = content[0];
    opts.qs.document = content[1];
    return this.request('sendDocument', opts);
};

/**
    * Send .webp stickers.
    * @see https://core.telegram.org/bots/api#sendsticker
*/
TelegramBot.prototype.sendSticker = function (chatId, sticker, options) {
    let opts = {
        qs: options || {}
    };
    opts.qs.chat_id = chatId;
    let content = this.formatSendData('sticker', sticker);
    opts.formData = content[0];
    opts.qs.sticker = content[1];
    return this.request('sendSticker', opts);
};

/**
    * Send video files, Telegram clients support mp4 videos (other formats may be sent whith 'sendDocument')
    * @see https://core.telegram.org/bots/api#sendvideo
*/
TelegramBot.prototype.sendVideo = function (chatId, video, options) {
    let opts = {
        qs: options || {}
    };
    opts.qs.chat_id = chatId;
    let content = this.formatSendData('video', video);
    opts.formData = content[0];
    opts.qs.video = content[1];
    return this.request('sendVideo', opts);
};

/**
    * Send Audio
    * @see https://core.telegram.org/bots/api#sendvoice
*/
TelegramBot.prototype.sendVoice = function (chatId, voice, options) {
    let opts = {
        qs: options || {}
    };

    opts.qs.chat_id = chatId;
    let content = this.formatSendData('voice', voice);
    opts.formData = content[0];
    opts.qs.voice = content[1];
    return this.request('sendVoice', opts);
};

/**
* Send location.
    * Use this method to send point on the map.
    * @see https://core.telegram.org/bots/api#sendlocation
*/
TelegramBot.prototype.sendLocation = function (chatId, latitude, longitude, options) {
    let query = options || {};
    query.chat_id = chatId;
    query.latitude = latitude;
    query.longitude = longitude;
    return this.request('sendLocation', {qs: query});
};

/**
* Send location.
    * Use this method to send information about a venue. On success, the sent Message is returned.
    * @see https://core.telegram.org/bots/api#sendvenue
*/
TelegramBot.prototype.sendVenue = function (chatId, latitude, longitude, title, address, options) {
    let query = options || {};
    query.chat_id = chatId;
    query.latitude = latitude;
    query.longitude = longitude;
	query.title = titile;
	query.address = address;
    return this.request('sendVenue', {qs: query});
};

/**
* Send Contact.
    * Use this method to send phone contacts. On success, the sent Message is returned.
    * @see https://core.telegram.org/bots/api#sendcontact
*/
TelegramBot.prototype.sendContact = function (chatId, phone_number, first_name, options) {
	let query = options || {};
    query.chat_id = chatId;
    query.phone_number = phone_number;
    query.first_name = first_name;
    return this.request('sendContact', {qs: query});
};

/**
* Send Chat Action
    * (typing | upload_photo | record_video | upload_video | record_audio | upload_audio | upload_document | find_location)
    * @see https://core.telegram.org/bots/api#sendchataction
*/
TelegramBot.prototype.sendChatAction = function (chatId, action) {
    let query = {
        chat_id: chatId,
        action: action
    };
    return this.request('sendChatAction', {qs: query});
};

/**
    * Get User Profile Photos. Use this method to get a list of profile pictures for a user.
    * @see https://core.telegram.org/bots/api#getuserprofilephotos
*/
TelegramBot.prototype.getUserProfilePhotos = function (userId, options) {
    let query = options || {};
    query.user_id = userId;
    query.offset = options.offset;
    query.limit = options.limit;
    return this.request('getUserProfilePhotos', {qs: query});
};

/**
	*Get File form file_id.
	* @see https://core.telegram.org/bots/api#getfile
*/
TelegramBot.prototype.getFile = function (file_id) {
    let query = {
        file_id : file_id
    };
    return this.request('getFile', {qs: query});
};

/**
* Kick Chat Member
	*Use this method to kick a user from a group or a supergroup.
	* @see https://core.telegram.org/bots/api#kickchatmember
*/
TelegramBot.prototype.kickChatMember = function (chat_id, user_id) {
	let query = {
		chat_id: chat_id,
		user_id: user_id
	}
	return this.request('kickChatMember', {qs: query});
};

/**
* Leave Chat
    * Use this method for your bot to leave a group, supergroup or channel. Returns True on success.
    * @see https://core.telegram.org/bots/api/#leavechat
*/
TelegramBot.prototype.leaveChat = function (chat_id) {
    let query = {
        chat_id: chat_id
    }
    return this.request('leaveChat', {qs: query});
};

/**
* Unban Chat Member
	*Use this method to unban a previously kicked user in a supergroup.
	* @see https://core.telegram.org/bots/api#unbanchatmember
*/
TelegramBot.prototype.unbanChatMember = function (chat_id, user_id) {
	let query = {
		chat_id: chat_id,
		user_id: user_id
	}
	return this.request('unbanChatMember', {qs: query});
};

/**
* Get Chat
    * Use this method to get up to date information about the chat (current name of the user for one-on-one conversations, current username of a user, group or channel, etc.). Returns a Chat object on success.
    * @see https://core.telegram.org/bots/api/#getchat
*/
TelegramBot.prototype.getChat = function (chat_id) {
    let query = {
        chat_id: chat_id
    }
    return this.request('getChat', {qs: query});
};

/**
    * Get Chat Administrator
    *
*/

TelegramBot.prototype.getChatAdministrators = function (chat_id) {
    let query = {
        chat_id: chat_id
    }
    return this.request('getChatAdministrators', {qs: query});
};


/**
* Get Chat Members
    *
    *
*/
TelegramBot.prototype.getChatMembersCount = function (chat_id) {
    let query = {
        chat_id: chat_id
    }
    return this.request('getChatMembersCount', {qs: query});
};

/**
    * Get Chat Member
*/
TelegramBot.prototype.getChatMember = function (chat_id, user_id) {
    let query = {
        chat_id: chat_id,
        user_id: user_id
    }
    return this.request('getChatMember', {qs: query});
};

/**
* Answer Callback Query
	Use this method to send answers to callback queries sent from inline keyboards.
	@see https://core.telegram.org/bots/api#answercallbackquery
*/

TelegramBot.prototype.answerCallbackQuery = function (callback_query_id, options) {
	let query = options || {};
    query.callback_query_id = callback_query_id;
	return this.request('answerCallbackQuery', {qs: query});
};

/**
* Answer Inline Query.
    * Use this method to send answers to an inline query. On success, True is returned. No more than 50 results per query are allowed.
    * @see https://core.telegram.org/bots/api#answerinlinequery
*/
TelegramBot.prototype.answerInlineQuery = function (inline_query_id, results, options) {
    let qs = options || {};
    qs.inline_query_id = inline_query_id;
    qs.results = results;
    return this.request('answerInlineQuery', {qs: qs});
};

/**
	Updating messages
*/

/**
* Edit Message Text
	* Use this method to edit text messages sent by the bot or via the bot (for inline bots).
	* @see https://core.telegram.org/bots/api#editmessagetext
*/
TelegramBot.prototype.editMessageText = function (text, options) {
	let qs = options || {};
	qs.text = text;
	return this.request('editMessageText', {qs: qs});
};

/**
* Edit Message Caption
	* Use this method to edit captions of messages sent by the bot or via the bot (for inline bots).
	* @see https://core.telegram.org/bots/api#editmessagecaption
*/
TelegramBot.prototype.editMessageCaption = function (options) {
	let qs = options || {};
	return this.request('editMessageCaption', {qs: qs});
};

/**
* Edit Message Reply Markup
	* Use this method to edit only the reply markup of messages sent by the bot or via the bot (for inline bots).
	* @see https://core.telegram.org/bots/api#editmessagereplymarkup
*/
TelegramBot.prototype.editMessageReplyMarkup = function (options) {
	let qs = options || {};
	return this.request('editMessageReplyMarkup', {qs: qs});
};


/**
    Games
*/
/**
    * Send Game
    * Use this method to send a game. On success, the sent Message is returned.
    * @see https://core.telegram.org/bots/api/#sendgame
*/
TelegramBot.prototype.sendGame = function (chat_id, options) {
    let qs = options || {};
    qs.chat_id = chat_id;
    return this.request('sendGame', {qs: qs});
};

/**
    * Set Game Score
    * Use this method to set the score of the specified user in a game. On success, if the message was sent by the bot, returns the edited Message, otherwise returns True. Returns an error, if the new score is not greater than the user's current score in the chat.
    * @see https://core.telegram.org/bots/api/#setgamescore
*/
TelegramBot.prototype.setGameScore = function (user_id, score, options) {
    let qs = options || {};
    qs.user_id = user_id;
    qs.score = score;
    return this.request('setGameScore', {qs: qs});
};

/**
    * Get Game High Score
    * Use this method to get data for high score tables. Will return the score of the specified user and several of his neighbors in a game. On success, returns an Array of GameHighScore objects.
    **/
TelegramBot.prototype.getGameHighScores = function (user_id, options) {
    let qs = options || {};
    qs.user_id = user_id;
    qs.score = score;
    return this.request('getGameHighScores', {qs: qs});
};

TelegramBot.prototype.stop = function () {
	if (this.polling) this.polling.stop();
	if (this.webhook) this.webhook.stop();
};



module.exports = {Bot: TelegramBot, Command: TelegramCommand};
