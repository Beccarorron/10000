/*game class*/
import { Player } from './player.js';
import { Dice } from './dice.js';
import { game } from './app.js';

export class Game {
	currentPlayerIndex;
	players;

	constructor(numPlayers, currentPlayerIndex) {
		this.dice = new Dice();
		this.currentPlayerIndex = currentPlayerIndex;

		this.players = Array(numPlayers)
			.fill(null)
			.map((_, index) => {
				return new Player(this.dice, this);
			});
	}

	//get the current player
	getCurrentPlayer() {
		return this.players[this.currentPlayerIndex];
	}

	//switch to the next player
	switchPlayer() {
		this.currentPlayerIndex =
			(this.currentPlayerIndex + 1) % this.players.length;
	}

	//switches the logic between the first roll and the additional rolls next player turn
	async getScore() {
		if (!this.getCurrentPlayer().stillYourTurn) {
			this.getCurrentPlayer().stillYourTurn = true;
			await Promise.all(this.getCurrentPlayer().dice.rollDice());
			let eachDie = this.getCurrentPlayer().dice.valueOfEachDie;
			return this.getCurrentPlayer().calculateScore(eachDie);
		} else {
			let roll = this.getCurrentPlayer().dice.keptDiceArray;
			let result = roll.map((id) => id.value);

			console.log(result);
			if (this.getCurrentPlayer().checkIfRollIsValid(result) === false) {
				// Calculate the score based on the dice the player chose to keep
				let keptScore = this.getCurrentPlayer().calculateScore(result);
				this.reset();
				await Promise.all(this.getCurrentPlayer().dice.rollDice());
				let newRoll = this.getCurrentPlayer().dice.valueOfEachDie;
				// Calculate the score based on the new roll
				let newScore = this.getCurrentPlayer().calculateScore(newRoll);
				// Return the total score
				return keptScore + newScore;
			} else return -1;
		}
	}
	overOneThousand() {
		let totalScore = this.getCurrentPlayer().totalScore;

		if (this.getCurrentPlayer().totalScore >= 1000) {
		}
	}
	reset() {
		while (this.getCurrentPlayer().dice.container.firstChild) {
			this.getCurrentPlayer().dice.container.removeChild(
				this.getCurrentPlayer().dice.container.firstChild
			);
		}
		while (this.getCurrentPlayer().dice.container2.firstChild) {
			this.getCurrentPlayer().dice.container2.removeChild(
				this.getCurrentPlayer().dice.container2.firstChild
			);
		}
		let diceArrayLength = this.getCurrentPlayer().dice.diceArray.length;

		this.getCurrentPlayer().stillYourTurn = true;
		this.getCurrentPlayer().dice.diceArray = [];
		this.getCurrentPlayer().dice.keptDiceArray = [];
		this.getCurrentPlayer().dice.valueOfEachDie = [];
		this.getCurrentPlayer().dice.diceMap = new Map();
		this.getCurrentPlayer().dice.diceId = 1;
		this.getCurrentPlayer().dice.index = 0;
		this.getCurrentPlayer().dice.diceDiv = 0;
		this.getCurrentPlayer().dice.diceDivs = [];
		this.getCurrentPlayer().dice.keptDiceArray = [];
		this.getCurrentPlayer().dice.diceOject = {};
		this.getCurrentPlayer().dice.initializeDice(diceArrayLength);
	}
}
