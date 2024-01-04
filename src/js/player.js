import { game } from './app.js';
import { dice } from './game.js';
export class Player {
	constructor(dice, game) {
		this.counts = [];

		this.dice = dice;
		this.game = game;
		this.stillYourTurn = false;
		this.score = 0;
		this.rollDuplicate = 0;
		this.rollHistory = [];
		this.getDiceArray = [];
	}
	//calculates the score for each roll
	calculateScore(roll) {
		let score = 0;

		console.log(roll);
		let counts = [];
		counts = new Array(7).fill(0);
		for (let i = 0; i < roll.length; i++) {
			counts[roll[i]] += 1;
			console.log(counts);
		}

		// Check for a straight
		if (counts.slice(1, 7).every((count) => count === 1)) {
			console.log(counts);
			score += 1500;
			counts = counts.map((count, i) => (i >= 1 && i <= 6 ? count - 1 : count));
			console.log(counts);
		}

		// Check for three pairs
		if (counts.filter((count) => count === 2).length === 3) {
			score += 1500;
			counts = counts.map((count) => (count === 2 ? 0 : count));
			console.log(counts);
		}

		// Score triples or more
		for (let i = 1; i <= 6; i++) {
			if (counts[i] >= 3) {
				if (i === 1) {
					score += 1000 * Math.pow(2, counts[i] - 3);
				} else {
					score += i * 100 * Math.pow(2, counts[i] - 3);
				}
				counts[i] %= 3;
			}
		}

		score += counts[1] * 100 + counts[5] * 50;
		this.score = +score;
		return this.score;
	}

	//each player's first roll
	playTurn(roll) {
		this.rollHistory.push(roll);

		let score = this.calculateScore(roll);
		if (score === 0) {
			console.log('Farkle! you rolled 0 points!');
			return;
		} else console.log(`You scored ${score} points!`);
		console.log(`your roll history is: ${this.rollHistory}`);
	}

	//looking for non-scoring dice after the first roll

	//helper straight method for checkIfRollIsValid method
	straightOrNot(counts) {
		for (let i = 1; i <= 6; i++) {
			if (counts[i] !== 1) {
				return false;
			}
		}
		return true;
	}
	checkIfRollIsValid(roll) {
		this.rollDuplicate = roll;
		let counts = new Array(7).fill(0);
		roll.forEach((die) => {
			counts[die] += 1;
		});
		console.log(counts);

		//checks for a straight
		if (this.straightOrNot(counts)) {
			return true;
		}

		//checks for three pairs
		let pairs = counts.filter((count) => count === 2);
		if (pairs.length === 3) {
			return true;
		}

		//checks for non-scoring dice
		for (let i = 1; i <= 6; i++) {
			// If the die is a 1 or a 5, it contributes to the score even if there's only one
			if (i === 1 || i === 5) {
				continue;
			}
			// If there are less than three of any other die, they don't contribute to the score
			if (counts[i] > 0 && counts[i] < 3) {
				return false;
			}
		}

		return true;
	}
}
