"use strict"

class TelegramCommand {

	constructor (bot, options) {

		Object.defineProperty(this, 'bot', { value: bot });
		this.timeout = options.timeout || 30;
		this.args = options.args;
		this.name = options.name;
		this.group = options.group;
		this.description = options.description;
		this.examples = options.examples;
		this.timer = null;
		this.provided_args = [];
		this.message = undefined;
		this.bot.on(this.name, this._listener.bind(this));

	}

	_reset () {
		for (let i in this.args) {
			this.args[i].value = undefined;
			clearTimeout(this.timer);
		}
		this.provided_args = [];
		this.message = undefined;
	}

	_listener (args, message) {
		this._reset();
		this.message = message;
		this._setArguments(args);
		if (this._checkArguments(this.message)) {
			this._run(this.message, args).then(value => {
				this.complete(this.message, args);
			});
		}

	}

	_setArguments (args) {
		this.provided_args = args;
		for (let i in this.args) {
			this.args[i].validate = this.args[i].validate ? this.args[i].validate : () => {return true};

			if (this.provided_args[i] !== undefined && this.args[i].validate(this.provided_args[i])) {
				//TODO check type too
				//NOTE arg validated
				this.args[i].value = this.provided_args[i];
			}
		}
	}

	_checkArguments () {
		for (let i in this.args) {
			if (this.args[i].value !== undefined) {

			} else {
				this._requestArgument(i);
				return false;
			}
		}
		return true;
	}

	_requestArgument (index, force_prompt = null) {
		let prompt = this.args[index].prompt;
		if (force_prompt) prompt = force_prompt;
		if (prompt.length > 0) {
			this.message.chat.sendMessage(prompt).catch(error => {
				console.log(error);
			});
		}
		this.bot.once('from.' + this.message.from.id, (message) => {
			this._argListener.call(this, index, message);
		});
	}

	_checkArgument (index, value) {
		return this.args[index].validate(value) && (this._guessType(index));
	}

	cancel () {
		this.message.replyToUser('Cancelled');
		this._reset();
	}

	_argListener (index, message) {
		if (message.text === 'cancel' || message.text === this.bot.prefix + this.name) {
			this.cancel();
		} else {
			if (this._checkArgument(index, message.text)) {
				this.args[index].value = message.text;
				this.args[index].value = this._convertTo(this._guessType(index), this.args[index].value);
			} else {
				this._requestArgument(index, 'Invalid ' + this.args[index].key + ' value (' + this.args[index].type + '). Try again. Type cancel to cancel this command');
				return;
			}
			if (this._checkArguments()) {
				this._run().then(value => {
					this.complete(this.message, this.args);
				});
			}
		}
	}

	_convertTo (type, value) {
		if (type === 'float') return parseFloat(value);
		if (type === 'integer') return parseInt(value);
		if (type === 'string') return value;
	}

	_guessType (index) {
		let type = 'string';
		let value = this.args[index].value;
		if((parseFloat(value) == parseInt(value)) && !isNaN(value))
			type = 'integer';
		if (!isNaN(value) && value.toString().indexOf('.') != -1)
			type = 'float';
		if (isNaN(value))
			type = 'string';
		return type;
	}

	async _run () {
		let t = await this.run(this.message, this.args);
		return t;
	}

	//Astract methods

	async run () {

	}

	complete () {

	}

}

module.exports = TelegramCommand;
