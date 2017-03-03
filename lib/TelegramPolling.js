"strict mode"

const request = require('request');
const url = require('url');


class TelegramBotPolling extends require('events').EventEmitter {

    constructor (token, options = {}) {

        super();
        this.offset = 0;
        this.limit = 100;
        this.token = token;
        this.timeout = options.timeout || 0;
        this.interval = options.interval || 5000;
        this.counter = 0;
    	this.timeout_var;
        this.polling();

    }

    polling () {
        this.getUpdates().then(updates => {
            updates.forEach((update, index) => {
                this.emit('update', update);
                if (update.update_id > this.offset) {
                    this.offset = update.update_id;
                }
            });
            this.timeout_var = setTimeout(this.polling.bind(this), this.interval);
        }).catch(error => {
            this.emit('error', error);
            this.timeout_var = setTimeout(this.polling.bind(this), this.interval);
        });
        return this;
    }

    getUpdates () {
        let opts = {
            qs: {
                offset  : this.offset + 1,
                limit   : this.limit,
                timeout : this.timeout
            },
            url: url.format({
                protocol : 'https',
                host     : 'api.telegram.org',
                pathname : '/bot' + this.token + '/getUpdates'
            })
        };
        let promise = new Promise((resolve, reject) => {
            request(opts, function(error, response, body) {
                if (error) {
                    reject(error);
                } else if (response.statusCode !== 200) {
                    reject(new Error(response));
                } else {
                    try{
                        var data = JSON.parse(body);
                        if (data.ok) {
                            resolve(data.result);
                        } else {
                            reject(data.result);
                        }
                    } catch (e) {
                        reject(new Error('Malformed Json'));
                    }
                }
            });
        });
        return promise;
    }

    stop () {
        clearTimeout(this.timeout_var);
        this.emit('stop');
        return this;
    }

    start () {
        clearTimeout(this.timeout_var);
        this.polling();
        this.emit('start');
        return this;
    }

}

module.exports = TelegramBotPolling;
