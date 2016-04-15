var REQUEST = require('request');
var URL = require('url');

var TelegramBotPolling = function (token, options, callback) {
    options = options || {};
    if (typeof options === "function") {
        callback = options;
        options = {};
    }
    this.offset = 0;
    this.limit = 100;
    this.token = token;
    this.callback = callback;
    this.timeout = options.timeout || 0;
    this.interval = options.interval || 5000;
    this.counter = 0;
	this.timeout_var;
    this.polling();
};

TelegramBotPolling.prototype.polling = function () {
    var self = this;
    this.getUpdates(function (error, updates) {
        if (!error) {
            updates.forEach(function (update, index) {
                if (update.update_id > self.offset) {
                    self.offset = update.update_id;
                }
                self.callback(update);
            });
        }
        this.timeout_var = setTimeout(self.polling.bind(self), self.interval);
    });
};

TelegramBotPolling.prototype.getUpdates = function (callback) {
    var self = this;
    var opts = {
        qs: {
            offset  : this.offset + 1,
            limit   : this.limit,
            timeout : this.timeout
        },
        url: URL.format({
            protocol : 'https',
            host     : 'api.telegram.org',
            pathname : '/bot' + this.token + '/getUpdates'
        })
    };
    
    REQUEST(opts, function(error, response, body) {
        if (error) {
            callback.apply(self, [error]);
            return;
        }
        if (response.statusCode !== 200) {
            callback.apply(self, [new Error(response)]);
            return;
        }
        try{
            var data = JSON.parse(body);
        } catch (e) {
            callback.apply(self, [new Error('Malformed Json')]);
            return;
        }
        if (data.ok) {
            
        } else {
            
        }
        callback.apply(self, [error, data.result]);
    });
};

TelegramBotPolling.prototype.stop = function () {
	clearTimeout(this.timeout_var);
};

TelegramBotPolling.prototype.start = function () {
	this.polling();
};

module.exports = TelegramBotPolling;
