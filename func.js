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

var playerOneModule = (function(nameInput) {

    var score = 0;
    var name = nameInput;
    var figure1 = new Figure();
    var figure2 = new Figure();
    var figure3 = new Figure();
    var figure4 = new Figure();
    return{
          incScore: function(){
              score++;
          },
          getScore: function(){
              return score;
          }
    }
});

// usage new (Player())();


