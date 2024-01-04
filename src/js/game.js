/*game class*/
import { Player } from './player.js';
import { Dice } from './dice.js';
export { Dice };
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

	//switches the logic between the first roll and the additional rolls until full reroll
	rollButtonFirstOrMore() {
		console.log(this.getCurrentPlayer().stillYourTurn);
		if (!this.getCurrentPlayer().stillYourTurn) {
			this.getCurrentPlayer().stillYourTurn = true;
			this.getCurrentPlayer().dice.rollDice();
			setTimeout(() => {
				const eachDie = this.getCurrentPlayer().dice.valueOfEachDie;
				this.getCurrentPlayer().playTurn(eachDie);
			}, 4400);
			return;
		} else {
			let roll = this.getCurrentPlayer().dice.keptDiceArray.map((diceDiv) =>
				this.getCurrentPlayer().dice.diceMap.get(diceDiv)
			);
			this.checkSecondRollOrMore(roll);
		}
	}
	checkSecondRollOrMore(roll) {
		if (this.getCurrentPlayer().checkIfRollIsValid(roll) === true) {
			this.reset(roll);
		} else {
			console.log('You cannot take non scoring dice!');
		}
	}
	reset(roll) {
		console.log(roll);

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
		this.getCurrentPlayer().dice.diceid = 1;
		this.getCurrentPlayer().dice.index = 0;
		this.getCurrentPlayer().dice.diceDiv = 0;
		this.getCurrentPlayer().dice.diceDivs = [];
		this.getCurrentPlayer().dice.keptDiceArray = [];
		this.getCurrentPlayer().dice.initializeDice(diceArrayLength);
		this.getCurrentPlayer().calculateScore(roll);
		setTimeout(() => this.getCurrentPlayer().dice.rollDice(), 1000);
	}
}
