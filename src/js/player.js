/*player class*/

export class Player {
	constructor(dice, game) {
		this.dice = dice;
		this.game = game;
		this.stillYourTurn = false;
		this.score = 0;
		this.totalScore = 0;
		this.overThousand = false;
	}
	//calculates the score for each roll
	calculateScore(roll) {
		let score = 0;

		console.log(roll);

		let counts = new Array(7).fill(0);
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
		this.score = score;

		return this.score;
	}

	//looking for non-scoring dice after the first roll

	checkIfRollIsValid(roll) {
		let counts = new Array(7).fill(0);
		for (let i = 0; i < roll.length; i++) {
			counts[roll[i]] += 1;
		}

		//checks for a straight
		let isStraight = true;
		for (let i = 1; i <= 6; i++) {
			if (counts[i] !== 1) {
				isStraight = false;
				break;
			}
		}
		if (isStraight) {
			return false;
		}

		//checks for three pairs
		let pairs = counts.filter((count) => count === 2);
		if (pairs.length === 3) {
			return false;
		}

		//checks for any 1's or 5's
		if (counts[1] > 0 || counts[5] > 0) {
			return false;
		}

		//checks for three of any number
		for (let i = 1; i <= 6; i++) {
			if (counts[i] === 3) {
				return false;
			}
		}

		// If none of the conditions are met, the roll is valid
		return true;
	}
}
