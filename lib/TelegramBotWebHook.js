var https = require('https');
var http = require('http');
var util = require('util');
var fs = require('fs');

var TelegramBotWebhook = function (token, options, callback) {
    this.token = token;
    this.callback = callback;
    if (typeof options === 'boolean') {
        options = {};
    }
    options.port = options.port || 8443;
    var binded = this._requestListener.bind(this);
    if (options.key && options.cert) {
        var opts = {
            key: fs.readFileSync(options.key),
            cert: fs.readFileSync(options.cert)
        };
        this._webServer = https.createServer(opts, binded);
    } else {
        this._webServer = http.createServer(binded);
    }
    this._webServer.listen(options.port);
};

TelegramBotWebhook.prototype._requestListener = function (req, res) {
    var self = this;
    var regex = new RegExp(this.token);

    // If there isn't token on URL
    if (!regex.test(req.url)) {
        var body = 'invalid token';
        res.writeHead(200, {
            'Content-Length': body.length,
            'Content-Type': 'text/html'
        });
        res.statusCode = 401;
        res.end(body);
    } else if (req.method === 'POST') {
        var fullBody = '';
        req.on('data', function (chunk) {
            fullBody += chunk;
        });
        req.on('end', function (response) {
            console.log(fullBody);
            try {
                var data = JSON.parse(fullBody);
                self.callback(data);
            } catch (error) {
            }
            res.end('OK');
        });
    } else {
        res.statusCode = 418;
        res.end();
    }
};

TelegramBotWebhook.prototype.start = function () {
	this._webServer.listen(options.port);
};

TelegramBotWebhook.prototype.stop = function () {
	this._webServer.close();
};

module.exports = TelegramBotWebhook;