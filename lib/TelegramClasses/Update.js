"use strict"

const Message = require('./Message.js');
const InlineQuery = require('./InlineQuery.js');
const CallbackQuery = require('./CallbackQuery.js');
const ChosenInlineResult = require('./ChosenInlineResult.js');



class Update {

    constructor (bot, options) {
        //TODO handle mandatory params
        /*
            https://core.telegram.org/bots/api#update
        */
        Object.defineProperty(this, 'bot', { value: bot });
        this.update_id = options.update_id;
        this.message = (options.message) ? new Message(this.bot, options.message) : undefined;
        this.edited_message = (options.edited_message) ? new Message(this.bot, options.edited_message) : undefined;;
        this.channel_post = options.channel_post ? new Message(this.bot, options.channel_post) : undefined;
        this.edited_channel_post = (options.edited_channel_post) ? new Message(this.bot, options.edited_channel_post) : undefined;
        this.inline_query = options.inline_query;
        this.chosen_inline_result = options.chosen_inline_result;
        this.callback_query = options.callback_query ? new CallbackQuery(this.bot, options.callback_query) : undefined;
        
    }

}


module.exports = Update;
