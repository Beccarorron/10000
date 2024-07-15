/*app*/
import { Game } from "./game.js";

class Control {
  constructor(game) {
    this.game = game;
    this.keptScore;
    this.newRoll;

    this.rollBtn = document.querySelector(".roll");
  }
  async scoreboard() {
    [this.keptScore, this.newRoll] = await this.game.getScore();
    console.log(this.newRoll);

    if ((this.newRoll === 0) && (!this.game.getCurrentPlayer().dice.diceArray.length == 0)) {
      console.log(`You rolled a Farkle!`);
    } else if ((this.newRoll > 0) || (this.game.getCurrentPlayer().dice.diceArray.length == 0)) {
      console.log(`you rolled ${this.newRoll} points`);
      console.log(`the value of the dice you kept is ${this.keptScore} points`);
      this.game.getCurrentPlayer().totalScore =
        this.game.getCurrentPlayer().totalScore + this.keptScore;
      this.game.getCurrentPlayer().dice.valueOfEachDie = [];
      this.game.getCurrentPlayer().dice.keptDiceArray = [];
      console.log(
        `your total is ${this.game.getCurrentPlayer().totalScore} points`,
      );
    } else {
      console.log(`You must only select die that score`);
    }
  }
  currentState() {
    this.rollBtn.addEventListener("click", () => {
      this.checkPlayerRollEligibility();
      this.scoreboard();
    });
  }
  checkPlayerRollEligibility() {
    console.log(this.game.getCurrentPlayer().dice.diceArray.length);
    if (this.game.getCurrentPlayer().dice.diceArray.length == 0) {
      this.game.getCurrentPlayer().stillYourTurn = false;
      this.game.reset();
      this.game.getCurrentPlayer().dice.initializeDice(6);
    }
    return;
  }
}
let game = new Game(2, 0);
let control = new Control(game);

control.currentState();
