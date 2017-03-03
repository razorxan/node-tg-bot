
class GameHighScore {

    constructor (bot, options) {

        Object.defineProperty(this, 'bot', { value: bot });
		this.position = options.position;
		this.user = new User(options.user);
		this.score = options.score;

    }

}

module.exports = GameHighScore;
