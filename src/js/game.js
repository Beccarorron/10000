/*game class*/
import { Player } from "./player.js";
import { Dice } from "./dice.js";
import { game } from "./app.js";

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
      let keptScore = 0;
      this.getCurrentPlayer().stillYourTurn = true;
      await Promise.all(this.getCurrentPlayer().dice.rollDice());
      let eachDie = this.getCurrentPlayer().dice.valueOfEachDie;
      return [keptScore,this.getCurrentPlayer().calculateScore(eachDie)];
    } else {
      let roll = [];
      let flattenedRoll = [];
      roll = this.getCurrentPlayer().dice.keptDiceArray;
      this.getCurrentPlayer().dice.keptDiceArray = [];
      flattenedRoll = roll.flat();
      let result = flattenedRoll.map((item) => item.value);
      console.log('this is the result')
      console.log(result)
      if (this.getCurrentPlayer().checkIfRollIsValid(result) === false) {
        // Calculate the score based on the dice the player chose to keep
        let keptScore = this.getCurrentPlayer().calculateScore(result);
        await Promise.all(this.getCurrentPlayer().dice.rollDice());
        let newRoll = this.getCurrentPlayer().dice.valueOfEachDie;
        console.log
        // Calculate the score based on the new roll
        let newScore = this.getCurrentPlayer().calculateScore(newRoll);
        // Return the total score
        return [keptScore, newScore];
      } 
      else return[0,-1];
    }
  }
  overOneThousand() {
    if (this.getCurrentPlayer().totalScore >= 1000) {
      this.getCurrentPlayer().overThousand = true;
    }
  }
  reset() {
    this.getCurrentPlayer().dice.diceMap = new Map();
    this.getCurrentPlayer().dice.diceId = 0;
    this.getCurrentPlayer().dice.diceOject = {};
  }
}
