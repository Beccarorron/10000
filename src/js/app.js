/*app*/
import { Game } from './game.js';
export let game = new Game(2, 0);

const rollBtn = document.querySelector('.roll');
rollBtn.addEventListener('click', () => {
	game.rollButtonFirstOrMore();
});
