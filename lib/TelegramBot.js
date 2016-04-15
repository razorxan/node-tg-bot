var TelegramBotPolling = require('./TelegramBotPolling.js');
var TelegramBotWebhook = require('./TelegramBotWebhook.js');

var Update = require('./TelegramClasses/Update.js');
var Message = require('./TelegramClasses/Message.js');
var User = require('./TelegramClasses/User.js');
var UserProfilePhotos = require('./TelegramClasses/UserProfilePhotos.js');
var File = require('./TelegramClasses/File.js');

var REQUEST = require("request");
var PATH = require('path');
var URL = require('url');
var FS = require('fs');
var MIME = require('mime');
var STREAM = require('stream');
var UTIL = require('util');
var EVENT_EMITTER = require('events').EventEmitter;

/**
    TelegramBot Class
    * @see https://core.telegram.org/bots/api
*/
var TelegramBot = function (token, options) {
    options = options || {};
    this.token = token;
    if (options.polling) {
        this.polling = new TelegramBotPolling(token, options.polling, this.processUpdate.bind(this));
    }
    if (options.webhook) {
        this.webhook = new TelegramBotWebhook(token, options.webhook, this.processUpdate.bind(this));
    }
};

UTIL.inherits(TelegramBot, EVENT_EMITTER);

TelegramBot.prototype._parseCommand = function (str, lookForQuotes) {
    var args = [];
    var readingPart = false;
    var part = '';
    for(var i=0; i < str.length; i++) {
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
        var type = update.message.getType();
        this.emit(update.message.getType(), update.message);
        if (update.message.getType() === 'text') {
            if (update.message.text.substring(0, 1) === '/') {
                var params = this._parseCommand(update.message.text, true);
                if (params[0].length > 1) {
                    var command = params.shift().substring(1).toLowerCase();
                    if (!this._events[command]) {
                        this.emit('*', command, params, update.message);
                    }
                    this.emit(command, params, update.message);
                }
            } else {
				this.emit('text_only', update.message);
			}
        }
    } else if (update.inline_query) {
        this.emit('inline_query', update.inline_query);
    } else if (update.chosen_inline_result) {
        this.emit('chosen_inline_result', update.chosen_inline_result);
    } else if (update.callback_query) {
		this.emit('callback_query', update.callback_query);
		this.emit('callback_query.message.' + update.callback_query.message.message_id, update.callback_query);
	}
};

TelegramBot.prototype.formatSendRemoteData = function (type, url, callback) {
    var self = this;
    REQUEST(url)
        .on('error', function () {})
        .on('response', function (response) {
            var contentType = response.headers['content-type'];
            var extension = MIME.extension(contentType);
            var fileName = Date.now() + '.' + extension;
            var formData = {};
            formData[type] = {
                value: response,
                options: {
                    filename: fileName,
                    contentType: contentType
                }
            };
            callback.apply(self, [[formData, null]]);
        });
};

TelegramBot.prototype.formatSendData = function (type, data, callback) {
    var formData;
    var fileName;
    var fileId = data;
    var self = this;
    if (typeof data === 'object') {
        fileId = data.file_id;
    }
    if (data instanceof STREAM.Stream) {
        fileName = URL.parse(PATH.basename(data.PATH)).pathname;
        formData = {};
        formData[type] = {
            value: data,
            options: {
                filename: fileName,
                contentType: MIME.lookup(fileName)
            }
        };
        callback.apply(this, [[formData, fileId]]);
    } else if (FS.existsSync(data)) {
        fileName = PATH.basename(data);
        formData = {};
        formData[type] = {
            value: FS.createReadStream(data),
            options: {
                filename: fileName,
                contentType: MIME.lookup(fileName)
            }
        };
        callback.apply(this, [[formData, fileId]]);
    } else {
        try {
            REQUEST({
                url: data,
                method: 'HEAD'
            }).on('response', function (response) {
                self.formatSendRemoteData(type, data, callback);
            }).on('error', function (error) {
                callback.apply(self, [[null, null]]);
            });
        } catch (e) {
            callback.apply(this, [[formData, fileId]]);
        }
    }
};

TelegramBot.prototype.formatRecieveData = function (path, data) {
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
		case "editMessageText":
		case "editMessageCaption":
		case "editMessageReplyMarkup":
            return new Message(this, data);
            break;
        case "getMe":
            return new User(this, data);
            break;
        case "getUserProfilePhotos":
            return new UserProfilePhotos(this, data);
            break;
        case 'getFile':
            return new File(this, data);
            break;
        case 'getUpdates':
            return new Update(this, data);
            break;
        default:
            return data;
    }
};

TelegramBot.prototype.request = function (path, options, callback) {
    var self = this;
    callback = callback || function() {};
    if (typeof options.qs.chat_id === 'object') options.qs.chat_id = options.qs.chat_id.id;
    if (typeof options.qs.user_id === 'object') options.qs.chat_id = options.qs.user_id.id;
    if (typeof options.qs.reply_markup === 'object') options.qs.reply_markup = JSON.stringify(options.qs.reply_markup);
    if (typeof options.qs.results === 'object') options.qs.results = JSON.stringify(options.qs.results);
    if (typeof options.qs.inline_keyboard === 'object') options.qs.inline_keyboard = JSON.stringify(options.qs.inline_keyboard);
    if (!this.token) {
        callback.apply(this, [new Error('Telegram Bot Token not provided!')]);
    }
    options = options || {};
    options.url = URL.format({
        protocol : 'https',
        host     : 'api.telegram.org',
        pathname : '/bot' + this.token + '/' + path
    });
    REQUEST(options, function (error, response, body) {
        if (error) {
            return callback.apply(this, [new Error(error)]);
        }
        if (response.statusCode !== 200) {
            callback.apply(this, [new Error(response.statusCode + ' ' + body)]);
        }
        try{
            var data = JSON.parse(body);
        } catch (e) {
            callback.apply(self, [new Error('Malformed Json' + body)]);
            return false;
        }
        if (data.ok) {
            data = self.formatRecieveData(path, data.result);
            callback.apply(self, [null, data]);
        } else {
            return callback.apply(this, [new Error(data.error_code + ' ' + data.description)]);
        }
    });
};

/**
    * Specify an url to receive incoming updates via an outgoing webhook.
    * @see https://core.telegram.org/bots/api#setwebhook
*/
TelegramBot.prototype.setWebhook = function (url, certificate, callback) {
    var opts = {
        qs: {
            url: url
        }
    };
    this.formatSendData('certificate', certificate, function (content) {
        opts.formData = content[0];
        this.request('setWebhook', opts, callback);
    });
};

/**
    * Use this method to receive incoming updates using long polling
    * @see https://core.telegram.org/bots/api#getupdates
*/
TelegramBot.prototype.getUpdates = function (timeout, limit, offset, callback) {
    var query = {
        offset    : offset,
        limit     : limit,
        timeout   : timeout
    };
    this.request('getUpdates', {qs: query}, callback);
};

/**
    * Returns basic information about the bot in form of a `User` object.
    * @see https://core.telegram.org/bots/api#getme
*/
TelegramBot.prototype.getMe = function (callback) {
    var path = 'getMe';
    this.request(path, null, callback);
};

/**
    * Send Text message.
    * @see https://core.telegram.org/bots/api#sendmessage
*/
TelegramBot.prototype.sendMessage = function (recipientId, text, options, callback) {
    if (typeof options === 'function') {
        callback = options;
        options = undefined;
    }
    var query = options || {};
    query.chat_id = recipientId;
    query.text = text;
    this.request('sendMessage', {qs: query}, callback);
};

/**
    * Forward messages of any kind.
    * @see https://core.telegram.org/bots/api#forwardmessage
*/
TelegramBot.prototype.forwardMessage = function (recipientId, fromChatId, messageId, callback) {
    var query = {
        chat_id      : recipientId,
        from_chat_id : fromChatId,
        message_id   : messageId
    };
    this.request('forwardMessage', {qs: query}, callback);
};

/**
    * Send Photo
    * @see https://core.telegram.org/bots/api#sendphoto
*/
TelegramBot.prototype.sendPhoto = function (chatId, photo, options, callback) {
    if (typeof options === 'function') {
        callback = options;
        options = undefined;
    }
    var opts = {
        qs: options || {}
    };
    opts.qs.chat_id = chatId;
    this.formatSendData('photo', photo, function (content) {
        opts.formData = content[0];
        opts.qs.photo = content[1];
        this.request('sendPhoto', opts, callback);
    });
};

/**
    * Send Audio
    * @see https://core.telegram.org/bots/api#sendaudio
*/
TelegramBot.prototype.sendAudio = function (chatId, audio, options, callback) {
    if (typeof options === 'function') {
        callback = options;
        options = undefined;
    }
    var opts = {
        qs: options || {}
    };
    opts.qs.chat_id = chatId;
    this.formatSendData('audio', audio, function (content) {
        opts.formData = content[0];
        opts.qs.audio = content[1];
        this.request('sendAudio', opts, callback);
    });
};

/**
    * Send Document
    * @see https://core.telegram.org/bots/api#senddocument
*/
TelegramBot.prototype.sendDocument = function (chatId, doc, options, callback) {
    if (typeof options === 'function') {
        callback = options;
        options = undefined;
    }
    var opts = {
        qs: options || {}
    };
    opts.qs.chat_id = chatId;
    this.formatSendData('document', doc, function (content) {
        opts.formData = content[0];
        opts.qs.document = content[1];
        this.request('sendDocument', opts, callback);
    });
};

/**
    * Send .webp stickers.
    * @see https://core.telegram.org/bots/api#sendsticker
*/
TelegramBot.prototype.sendSticker = function (chatId, sticker, options, callback) {
    if (typeof options === 'function') {
        callback = options;
        options = undefined;
    }
    var opts = {
        qs: options || {}
    };
    opts.qs.chat_id = chatId;
    this.formatSendData('sticker', sticker, function (content) {
        opts.formData = content[0];
        opts.qs.sticker = content[1];
        this.request('sendSticker', opts, callback);
    });
};

/**
    * Send video files, Telegram clients support mp4 videos (other formats may be sent whith 'sendDocument')
    * @see https://core.telegram.org/bots/api#sendvideo
*/
TelegramBot.prototype.sendVideo = function (chatId, video, options, callback) {
    if (typeof options === 'function') {
        callback = options;
        options = undefined;
    }
    var opts = {
        qs: options || {}
    };
    opts.qs.chat_id = chatId;
    var content = this.formatSendData('video', video, function (content) {
        opts.formData = content[0];
        opts.qs.video = content[1];
        this.request('sendVideo', opts, callback);
    });
};

/**
    * Send Audio
    * @see https://core.telegram.org/bots/api#sendvoice
*/
TelegramBot.prototype.sendVoice = function (chatId, voice, options, callback) {
    if (typeof options === 'function') {
        callback = options;
        options = undefined;
    }
    var opts = {
        qs: options || {}
    };
    
    opts.qs.chat_id = chatId;
    this.formatSendData('voice', voice, function (content) {
        opts.formData = content[0];
        opts.qs.voice = content[1];
        this.request('sendVoice', opts, callback);
    });
};

/**
* Send location.
    * Use this method to send point on the map.
    * @see https://core.telegram.org/bots/api#sendlocation
*/
TelegramBot.prototype.sendLocation = function (chatId, latitude, longitude, options, callback) {
    if (typeof options === 'function') {
        callback = options;
        options = undefined;
    }
    var query = options || {};
    query.chat_id = chatId;
    query.latitude = latitude;
    query.longitude = longitude;
    this.request('sendLocation', {qs: query}, callback);
};

/**
* Send location.
    * Use this method to send information about a venue. On success, the sent Message is returned.
    * @see https://core.telegram.org/bots/api#sendvenue
*/
TelegramBot.prototype.sendVenue = function (chatId, latitude, longitude, title, address, options, callback) {
    if (typeof options === 'function') {
        callback = options;
        options = undefined;
    }
    var query = options || {};
    query.chat_id = chatId;
    query.latitude = latitude;
    query.longitude = longitude;
	query.title = titile;
	query.address = address;
    this.request('sendVenue', {qs: query}, callback);
};

/**
* Send Contact.
    * Use this method to send phone contacts. On success, the sent Message is returned.
    * @see https://core.telegram.org/bots/api#sendcontact
*/
TelegramBot.prototype.sendContact = function (chatId, phone_number, first_name, options, callback) {
	if (typeof options === 'function') {
        callback = options;
        options = undefined;
    }
	var query = options || {};
    query.chat_id = chatId;
    query.phone_number = phone_number;
    query.first_name = first_name;
    this.request('sendContact', {qs: query}, callback);
};

/**
* Send Chat Action
    * (typing | upload_photo | record_video | upload_video | record_audio | upload_audio | upload_document | find_location)
    * @see https://core.telegram.org/bots/api#sendchataction
*/
TelegramBot.prototype.sendChatAction = function (chatId, action, callback) {
    var query = {
        chat_id: chatId,
        action: action
    };
    this.request('sendChatAction', {qs: query}, callback);
};

/**
    * Get User Profile Photos. Use this method to get a list of profile pictures for a user.
    * @see https://core.telegram.org/bots/api#getuserprofilephotos
*/
TelegramBot.prototype.getUserProfilePhotos = function (userId, offset, limit, callback) {
    if (arguments.length === 3) {
        callback = limit;
        limit = offset;
        offset = undefined;
    } else if (arguments.length === 2) {
        callback = offset;
        offset = undefined;
        limit = undefined;
    }
    var query = {
        user_id : userId,
        offset  : offset,
        limit   : limit
    };
    this.request('getUserProfilePhotos', {qs: query}, callback);
};

/**
	*Get File form file_id.
	* @see https://core.telegram.org/bots/api#getfile
*/
TelegramBot.prototype.getFile = function (file_id, callback) {
    var query = {
        file_id : file_id
    };
    this.request('getFile', {qs: query}, callback);
};

/**
* Kick Chat Member
	*Use this method to kick a user from a group or a supergroup.
	* @see https://core.telegram.org/bots/api#kickchatmember
*/
TelegramBot.prototype.kickChatMember = function (chat_id, user_id, callback) {
	var query = {
		chat_id: chat_id,
		user_id: user_id
	}
	this.request('kickChatMember', {qs: query}, callback);
};

/**
* Unban Chat Member
	*Use this method to unban a previously kicked user in a supergroup.
	* @see https://core.telegram.org/bots/api#unbanchatmember
*/
TelegramBot.prototype.unbanChatMember = function (chat_id, user_id, callback) {
	var query = {
		chat_id: chat_id,
		user_id: user_id
	}
	this.request('unbanChatMember', {qs: query}, callback);
};

/**
* Answer Callback Query
	Use this method to send answers to callback queries sent from inline keyboards.
	@see https://core.telegram.org/bots/api#answercallbackquery
*/

TelegramBot.prototype.answerCallbackQuery = function (callback_query_id, options, callback) {
	if (typeof options === 'function') {
        callback = options;
        options = undefined;
    }
	var query = options || {};
    query.callback_query_id = callback_query_id;
	this.request('answerCallbackQuery', {qs: query}, callback);
};

/**
* Answer Inline Query.
    * Use this method to send answers to an inline query. On success, True is returned. No more than 50 results per query are allowed.
    * @see https://core.telegram.org/bots/api#answerinlinequery
*/
TelegramBot.prototype.answerInlineQuery = function (inline_query_id, results, options, callback) {
	if (typeof options === 'function') {
        callback = options;
        options = undefined;
    }
    var qs = options || {};
    qs.inline_query_id = inline_query_id;
    qs.results = results;
    this.request('answerInlineQuery', {qs: qs}, callback);
};

/**
	Updating messages
*/

/**
* Edit Message Text
	* Use this method to edit text messages sent by the bot or via the bot (for inline bots).
	* @see https://core.telegram.org/bots/api#editmessagetext
*/
TelegramBot.prototype.editMessageText = function (text, options, callback) {
	var qs = options || {};
	qs.text = text;
	this.request('editMessageText', {qs: qs}, callback);
};

/**
* Edit Message Caption
	* Use this method to edit captions of messages sent by the bot or via the bot (for inline bots).
	* @see https://core.telegram.org/bots/api#editmessagecaption
*/
TelegramBot.prototype.editMessageCaption = function (options, callback) {
	var qs = options || {};
	this.request('editMessageCaption', {qs: qs}, callback);
};

/**
* Edit Message Reply Markup
	* Use this method to edit only the reply markup of messages sent by the bot or via the bot (for inline bots).
	* @see https://core.telegram.org/bots/api#editmessagereplymarkup
*/
TelegramBot.prototype.editMessageReplyMarkup = function (options, callback) {
	var qs = options || {};
	this.request('editMessageReplyMarkup', {qs: qs}, callback);
};

TelegramBot.prototype.stop = function () {
	if (this.polling) this.polling.stop();
	if (this.webhook) this.webhook.stop();
};

module.exports = TelegramBot;