/*dice class*/

export class Dice {
	constructor() {
		this.diceArray = [];
		this.keptDiceArray = [];
		this.valueOfEachDie = [];
		this.diceMap = new Map();
		this.diceId = 1;
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
		let promises = [];
		this.diceDivs.forEach((diceDiv, i) => {
			const randomNumber = Math.floor(Math.random() * 6) + 1;
			this.diceArray.push({ value: randomNumber, id: this.diceId });
			this.diceMap.set(diceDiv, {
				value: randomNumber,
				id: this.diceId,
			});
			this.diceId++;
			diceDiv.style.animation = 'rolling 4s';
			this.valueOfEachDie.push(randomNumber);
			let promise = new Promise((resolve) => {
				setTimeout(() => {
					const transforms = [
						'rotateX(0deg) rotateY(0deg)', // 1
						'rotateX(-90deg) rotateY(0deg)', // 2
						'rotateX(0deg) rotateY(90deg)', // 3
						'rotateX(0deg) rotateY(-90deg)', // 4
						'rotateX(90deg) rotateY(0deg)', // 5
						'rotateX(180deg) rotateY(0deg)', // 6
					];
					diceDiv.style.transform = transforms[randomNumber - 1];
					diceDiv.style.animation = 'none';
					resolve(this.valueOfEachDie);
				}, 4050);
			});
			promises.push(promise);
		});
		return promises;
	}

	onClick(diceDiv) {
		console.log(this.diceMap);
		const diceObject = this.diceMap.get(diceDiv);
		if (this.container.contains(diceDiv)) {
			this.container.removeChild(diceDiv);
			this.container2.appendChild(diceDiv);
			console.log(this.container);
			console.log(this.container2);
			console.log(diceObject);
			console.log(this.diceMap);
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
			console.log(this.diceMap);
		} else if (this.container2.contains(diceDiv)) {
			this.container2.removeChild(diceDiv);
			this.container.appendChild(diceDiv);
			const index = this.keptDiceArray.findIndex(
				(dice) => dice.id === diceObject.id
			);
			console.log(diceObject);
			console.log(this.diceMap);
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
