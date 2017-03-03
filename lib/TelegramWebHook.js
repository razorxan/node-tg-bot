const https = require('https');
const http = require('http');
const fs = require('fs');

class TelegramBotWebhook extends require('events').EventEmitter {

    constructor (token, options) {
        super();
        this.token = token;
        if (typeof options === 'boolean') {
            options = {};
        }
        options.port = options.port || 8443;
        let binded = this._requestListener.bind(this);
        if (options.key && options.cert) {
            let opts = {
                key: fs.readFileSync(options.key),
                cert: fs.readFileSync(options.cert)
            };
            this._webServer = https.createServer(opts, binded);
        } else {
            this._webServer = http.createServer(binded);
        }
        this._webServer.listen(options.port);
    }

    _requestListener (req, res) {
        let regex = new RegExp(this.token);

        // If there isn't token on URL
        if (!regex.test(req.url)) {
            let body = 'invalid token';
            res.writeHead(200, {
                'Content-Length': body.length,
                'Content-Type': 'text/html'
            });
            res.statusCode = 401;
            res.end(body);
        } else if (req.method === 'POST') {
            let fullBody = '';
            req.on('data', function (chunk) {
                fullBody += chunk;
            });
            req.on('end', (response) => {
                try {
                    let data = JSON.parse(fullBody);
                    this.emit('update', data);
                } catch (error) {
                    this.emit('error', error);
                }
                res.end('OK');
            });
        } else {
            res.statusCode = 418;
            res.end();
        }
    }

}

module.exports = TelegramBotWebhook;
