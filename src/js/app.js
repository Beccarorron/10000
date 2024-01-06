/*app*/
import { Game } from './game.js';

class Control {
	constructor(game) {
		this.game = game;
		this.score;
		this.score;
		this.rollBtn = document.querySelector('.roll');
		this.score = this.game.getCurrentPlayer().score;
	}
	async scoreboard() {
		this.score = await this.game.getScore();
		if (this.score === 0) {
			console.log(`You rolled a Farkle!`);
		} else if (this.score > 0) {
			console.log(`you scored ${this.score} points`);
		} else {
			console.log(`You must only select die that score`);
		}
	}
	currentState() {
		this.rollBtn.addEventListener('click', () => {
			this.scoreboard();
		});
	}
}

let game = new Game(2, 0);
let control = new Control(game);

control.currentState();
