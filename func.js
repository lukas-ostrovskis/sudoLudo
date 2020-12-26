//@ts-check


var diceModule = ( function(){
    var currentVal = 6;

    return {
        currentValue: function(){
            return currentVal;
        },
        rollDice: function(){
            currentVal = Math.ceil(Math.random()*6);
        }
    }
})();