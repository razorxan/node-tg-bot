
# node-tg-bot

node-tg-bot is a node module for implementing Telegram bots in Nodejs using Telegram Bot Api 2.0

## How to install

```js
npm install node-tg-bot
```

## Getting Started

```js
var TelegramBot = require('node-tg-bot');
```

Then to create a bot (the polling way)

```js
var token = 'YOUR BOT TOKEN';
var bot = new TelegramBot(token, {polling: {
        interval: 1000,
        timeout: 4000
    }
});
```

Or the webhook way (see [https://core.telegram.org/bots/self-signed](https://core.telegram.org/bots/self-signed) to create your self signed ssl cert/key)

```js
var bot = new TelegramBot(token, {
    webHook: {
        key: 'your_private.key',
        cert: 'your_public.pem'
    }
});
```

Then if you are using a webhook

```js
bot.setWebHook('https://yourdomain.com:port/' + token, 'your_public.pem', function (error) {
    if (!error) {
        console.log('webhook estabilished');
    } else {
        console.log('error:', error);
    }
});
```

## Commands

Since node-tg-bot is an event emitter you can listen for events to be fired when commands with the same name are sent

```js
bot.on('foo', function (params, message) {
    //on /foo command
    bot.sendMessage(message.chat.id, 'Bar!');
}).on('bar', function (params, message) {
    //on bar command
    this.sendMessage(message.chat.id, 'Foo!');
    //'this' is the node-tg-bot instance itself
}).on('hello', function (params, message) {
    this.sendMessage(message.chat.id, 'What do you like the most?', {
        reply_markup: {
            keyboard: [
                ['\uD83D\uDC31', '\uD83D\uDC36'],
                ['\uD83D\uDC30', '\uD83D\uDC39']
            ],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    }, function () {
        bot.once('from.' + message.from.id, function (m) {
            if (m.text === '\uD83D\uDC31') bot.sendMessage(m.from.id, 'Ok... :)!');
            else if (m.text === '\uD83D\uDC36') bot.sendMessage(m.from.id, 'Me too!!!!');
            else if (m.text === '\uD83D\uDC30') bot.sendMessage(m.from.id, 'Ok... :)!');
            else if (m.text === '\uD83D\uDC39') bot.sendMessage(m.from.id, 'Ok... :)!');
            else bot.sendMessage(m.from.id, 'Bye.. :(');
        });
    });
});

```

Command parameters are passed in the params argument

```js
/*
    we send "/hello world"
*/
bot.on('hello', function (params, message) {
    this.sendMessage(msg.chat.id, 'Hi, ' + params[0]);
});
/*
    bot sends "Hi, world"
*/
```

Some events are emitted by default by node-tg-bot such as 'update'. This event is called everytime an update is available

```js
bot.on('update', function(update) {
    console.log(update);
});
```

or the '' event, called whenever an unknown command is sent
and 'photo', fired whene a photo is uploaded to our bot

```js
bot.on('', function (params, msg) {
    console.log('uknown command, ' + params[0]);
}).on('photo', function (message) {
    console.log('photo recieved', message.photo);
}).on('audio', function (message) {
    console.log('audio recieved', message.audio);
}).on('video', function (message) {
    console.log('video recieved', message.video);
});
```
## default events

|Event Name|Returns|Event Details|
|---|---|---|
|update|Istance of Update|An update has been recieved|
|*|Command as String, Array of parameters, Instance of Message|Unknown command recieved|
|text_only|Instance of Message|Text only message. (only available when setprivacy is disabled)|
|from.|Instance of Message|A message from a specific user has been recieved|
|text|Instance of Message|A text message has been recieved|
|audio|Instance of Message|An audio has been recieved|
|document|Instance of Message|A document has been recieved|
|photo|Instance of Message|A photo has been recieved|
|sticker|Instance of Message|A sticker has been recieved|
|video|Instance of Message|A video has been recieved|
|voice|Instance of Message|A voice message has been recieved|
|contact|Instance of Message|A contact has been recieved|
|location|Instance of Message|A location has been recieved|
|venue|Instance of Message|A venue has been recieved|
|new_chat_member|Instance of Message|A new member joined the chat|
|left_chat_member|Instance of Message|A chat member left the chat|
|new_chat_title|Instance of Message|A chat title was changed|
|new_chat_photo|Instance of Message|The chat photo was changed|
|delete_chat_photo|Instance of Message|The chat photo has been deleted|
|group_chat_created|Instance of Message|The group has been created|
|supergroup_chat_created|Instance of Message|The supergroup has been created|
|channel_chat_created|Instance of Message|The channel has been created|
|migrate_to_chat_id|Instance of Message|The chat has been migrated to a chat|
|migrate_from_chat_id|Instance of Message|The chat has been migrated from a chat|
|inline_query|Instance of Inline Query|An inline query has been sent|
|chosen_inline_result|Instance of ChosenInlineResult|An inline result has been chosen by a user|
|callback_query|Instance of CallbackQuery|A callback query has been sent by a user by pressing an inline keyboard button|

Here is how you can use your Message Instance

```js
bot.on('location', function (message) {
    //message.chat.sendLocation(message.location.latitude, message.location.longitude);
    //or
    //message.from.sendLocation(message.location.latitude, message.location.longitude);
    //or
    //message.location.sendTo(message.from);
    //or
    message.location.sendTo(message.chat);
}).on('', function ());
```

## Classes, methods and properties

Each of the [available types](https://core.telegram.org/bots/api#available-types) (most of them) are implemented as Classes.
Properties, when possible, are Instances of available types as well.
As an example when we have an incoming update or photo we get

```js
bot.on('update', function (update) {
    //update is an instance of Update class
    //update.message is an instance of Message class which has a sendTo method
    //so we can do something like this
    update.message.sendTo('@agroup');
}).on('photo', function (message) {
    //photo is an array of Instance of PhotoSize
    //PhotoSize class has inherits get method from FileType so we can do
    message.photo[message.photo.length - 1].get(function (error, file) {
        message.from.sendMessage(file.url);
    });
});
```
For further details for properties refer to https://core.telegram.org/bots/api#available-types

### List of available Classes

#### Update

#### Message

##### Methods

- ```message.forwardTo(recipient_id[, callback])```
- ```message.editText(text[, options, callback])```
- ```message.editCaption(options[, callback])```
- ```message.editReplyMarkup(options[, callback])```
- ```message.getType(void)```

#### User

##### Methods

- ```user.sendMessage(text[,options, callback])```
- ```user.forwardMessage(message[, callback])```
- ```user.sendPhoto(photo[, options, callback])```
- ```user.sendAudio(audio[, options, callback])```
- ```user.sendDocument(document[, options[, callback])```
- ```user.sendSticker(sticker[, options, callback])```
- ```user.sendVideo(video[, options, callback])```
- ```user.sendVoice(voice[, options, callback])```
- ```user.sendLocation(latitude, longitude[, options, callback])```
- ```user.sendVenue(latitude, longitude, title, address[, options, callback])```
- ```user.sendChatAction(chat_action[, callback])```
- ```user.getUserProfilePhotos(offset, limit[, callback])```
- ```user.kickFromChat(chat_id[, callback])```
- ```user.unbanFromChat(chat_id[, callback])```

#### Chat

##### Methods

- ```chat.sendMessage(text[,options, callback])```
- ```chat.forwardMessage(message[, callback])```
- ```chat.sendPhoto(photo[, options, callback])```
- ```chat.sendAudio(audio[, options, callback])```
- ```chat.sendDocument(document[, options[, callback])```
- ```chat.sendSticker(sticker[, options, callback])```
- ```chat.sendVideo(video[, options, callback])```
- ```chat.sendVoice(voice[, options, callback])```
- ```chat.sendLocation(latitude, longitude[, options, callback])```
- ```chat.sendVenue(latitude, longitude, title, address[, options, callback])```
- ```chat.sendChatAction(chat_action[, callback])```
- ```chat.getUserProfilePhotos(offset, limit[, callback])```
- ```chat.kickMember(user_id[, callback])```
- ```chat.unbanMember(user_id[, callback])```

## Methods

### setWebHook

### getMe

### sendMessage

### forwardMessage

### sendPhoto

### sendAudio

### sendVoice

### sendVideo

### sendDocument

### sendSticker

### sendChatAction

### sendLocation

### sendVenue

### answerInlineQuery