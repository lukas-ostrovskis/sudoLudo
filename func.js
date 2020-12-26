//@ts-check

var diceModule = ( function(){
    var currentVal = 6;

    return {
        currentValue: function(){
            return currentVal;
        },
        rollDice: function(){
            currentVal = Math.ceil(Math.random()*6);
            console.log(currentVal);
        }
    }
})();

function Player(name) {
    this.score = 0;
    this.name = name;
    
    this.incScore = function() { this.score++ };
    this.getScore = function() { return this.score};
    this.resetScore = function() { this.score = 0 };
}

let p1 = new Player("Test1");
let p2 = new Player("Test2");

const diceRef = document.querySelector(".dice");
diceRef.addEventListener('click', diceModule.rollDice);
