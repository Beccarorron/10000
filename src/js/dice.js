import { game } from './app.js';

export class Dice {
	constructor() {
		this.diceArray = [];
		this.keptDiceArray = [];
		this.valueOfEachDie = [];
		this.diceMap = new Map();
		this.diceid = 1;
		this.container = document.querySelector('.container');
		this.container2 = document.querySelector('.container2');
		this.rollDice = this.rollDice.bind(this);
		this.diceDiv = document.createElement('div');
		this.index = 0;
		let howManyDice = 6;
		this.faceClasses = ['front', 'back', 'left', 'right', 'top', 'bottom'];
		this.initializeDice(howManyDice);
	}
	initializeDice(howManyDice) {
		Array.from({ length: howManyDice }).forEach(() => {
			let diceDiv = document.createElement('div');

			diceDiv.classList.add('dice');
			diceDiv.addEventListener('click', () => this.onClick(diceDiv));
			this.faceClasses.forEach((faceClass, index) => {
				const faceDiv = document.createElement('div');
				faceDiv.classList.add('face', faceClass);
				diceDiv.appendChild(faceDiv);
			});
			this.container.appendChild(diceDiv);
		});
		this.diceDivs = this.container.querySelectorAll('.dice');
	}

	rollDice() {
		this.diceArray = [];
		console.log(this.diceDivs);
		this.diceDivs.forEach((diceDiv, i) => {
			console.log(diceDiv);
			const randomNumber = Math.floor(Math.random() * 6) + 1;
			this.diceArray.push({ value: randomNumber, id: this.diceid });
			this.diceMap.set(diceDiv, {
				value: randomNumber,
				id: this.diceid,
			});
			this.diceid++;
			diceDiv.style.animation = 'rolling 4s';

			this.valueOfEachDie.push(randomNumber);
			console.log(this.diceDivs[i]);
			setTimeout(() => {
				switch (randomNumber) {
					case 1:
						diceDiv.style.transform = 'rotateX(0deg) rotateY(0deg)';
						break;

					case 6:
						diceDiv.style.transform = 'rotateX(180deg) rotateY(0deg)';
						break;

					case 2:
						diceDiv.style.transform = 'rotateX(-90deg) rotateY(0deg)';
						break;

					case 5:
						diceDiv.style.transform = 'rotateX(90deg) rotateY(0deg)';
						break;

					case 3:
						diceDiv.style.transform = 'rotateX(0deg) rotateY(90deg)';
						break;

					case 4:
						diceDiv.style.transform = 'rotateX(0deg) rotateY(-90deg)';
						break;
					default:
						break;
				}
				console.log(this.diceMap);
				console.log(this.diceArray);
				diceDiv.style.animation = 'none';
			}, 4050);
		});
	}
	get keptArray() {
		return this.keptDiceArray;
	}
	onClick(diceDiv) {
		const diceObject = this.diceMap.get(diceDiv);
		if (this.container.contains(diceDiv)) {
			this.container.removeChild(diceDiv);
			this.container2.appendChild(diceDiv);
			console.log(this.container2);

			const index = this.diceArray.findIndex(
				(dice) => dice.id === diceObject.id
			);

			if (index !== -1) {
				const [dice] = this.diceArray.splice(index, 1);
				this.keptDiceArray.push(dice);
				console.log(this.keptDiceArray);
				console.log(this.diceArray);
				console.log(index);
			}
		} else if (this.container2.contains(diceDiv)) {
			this.container2.removeChild(diceDiv);
			this.container.appendChild(diceDiv);
			const index = this.keptDiceArray.findIndex(
				(dice) => dice.id === diceObject.id
			);
			if (index !== -1) {
				const [dice] = this.keptDiceArray.splice(index, 1);
				this.diceArray.push(dice);
				console.log(this.keptDiceArray);

				console.log(this.diceArray);
				console.log(index);
			}
		}
	}
}
