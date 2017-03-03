
# node-tg-bot

node-tg-bot is a node module for implementing Telegram bots in Nodejs using Telegram Bot Api 2.3.1

## Installing

```js
npm install node-tg-bot --save
```

## Getting Started

```js
const Telegram = require('node-tg-bot');
```

Then to create a bot (the polling way)

```js
const token = 'YOUR BOT TOKEN';
const bot = new Telegram.Bot(token, {
    polling: {
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
bot.on('foo', (params, message) => {
    //on /foo command
    bot.sendMessage(message.chat.id, 'Bar!');
}).on('bar', function (params, message) {
    //on bar command
    this.sendMessage(message.chat.id, 'Foo!');
    //'this' is the Telegram.Bot instance itself
}).on('hello', (params, message) => {
    bot.sendMessage(message.chat.id, 'What\'s your favorite animal?', {
        reply_markup: {
            keyboard: [
                ['\uD83D\uDC31', '\uD83D\uDC36'],
                ['\uD83D\uDC30', '\uD83D\uDC39']
            ],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    }).then(message => {
        bot.once('from.' + message.from.id, m => {
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
bot.on('hello', (params, message) => {
    bot.sendMessage(message.chat.id, 'Hi, ' + params[0]);
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
and 'photo', fired when a photo is uploaded in a chat / conversation

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


Here is how you can use your Message Instance

```js
bot.on('location', function (message) {
    //message.chat.sendLocation(message.location.latitude, message.location.longitude);
    //or
    //message.from.sendLocation(message.location.latitude, message.location.longitude);
    //or
    //message.location.sendTo(message.from);
    //or
    message.location.sendTo(message.chat).then(message => {
        //do something with message
    }).catch(error => {
        console.log(error);
    });
}).on('', () => {

});
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
For further details on types properties refer to https://core.telegram.org/bots/api#available-types

### List of available Classes

#### Telegram.Bot

setWebhook
getUpdates
getMe
sendMessage
sendPhoto
sendAudio
sendDocument
sendSticker
sendVideo
sendVoice
sendLocation
sendVenue
sendContact
sendChatAction
getUserProfilePhotos
getFile
kickChatMember
leaveChat
unbanChatMember
getChat
getChatAdministrators
getChatMembersCount
getChatMember
answerCallbackQuery
answerInlineQuery
editMessageText
editMessageCaption
editMessageReplyMarkup
sendGame
setGameScore
getGameHighScores
[create an anchor](#anchors-in-markdown)
* ```.setWebhook(url<String>, certificate<InputFile>)```
    * ```Returns: Promise<Boolean>```
* ```.getUpdates(offset<Integer>, limit<Integer>, timeout<Integer>, allowed_updates<Array<String>>)```
    * ```Returns: Promise<Array<Update>>```
* ```.getMe()```
    * ```Returns: Promise<User>```

#### Update

##### Properties

- Refer to https://core.telegram.org/bots/api#update

#### Message

##### Properties

- Refer to https://core.telegram.org/bots/api#message

##### Methods

- ```message.forwardTo(recipient_id)```
- ```message.editText(text[, options)```
- ```message.editCaption(options)```
- ```message.editReplyMarkup(options)```
- ```message.getType(void)```

#### User

##### Properties

- Refer to https://core.telegram.org/bots/api#user

##### Methods

- ```user.sendMessage(text[,options)```
- ```user.forwardMessage(message)```
- ```user.sendPhoto(photo[, options)```
- ```user.sendAudio(audio[, options)```
- ```user.sendDocument(document[, options)```
- ```user.sendSticker(sticker[, options)```
- ```user.sendVideo(video[, options)```
- ```user.sendVoice(voice[, options)```
- ```user.sendLocation(latitude, longitude[, options)```
- ```user.sendVenue(latitude, longitude, title, address[, options)```
- ```user.sendChatAction(chat_action)```
- ```user.getUserProfilePhotos(offset, limit)```
- ```user.kickFromChat(chat_id)```
- ```user.unbanFromChat(chat_id)```

#### Chat

##### Properties

- Refer to https://core.telegram.org/bots/api#chat

##### Methods

- ```chat.sendMessage(text[,options)```
- ```chat.forwardMessage(message)```
- ```chat.sendPhoto(photo[, options)```
- ```chat.sendAudio(audio[, options)```
- ```chat.sendDocument(document[, options)```
- ```chat.sendSticker(sticker[, options)```
- ```chat.sendVideo(video[, options)```
- ```chat.sendVoice(voice[, options)```
- ```chat.sendLocation(latitude, longitude[, options)```
- ```chat.sendVenue(latitude, longitude, title, address[, options)```
- ```chat.sendChatAction(chat_action)```
- ```chat.getUserProfilePhotos(offset, limit)```
- ```chat.kickMember(user_id)```
- ```chat.unbanMember(user_id)```

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
