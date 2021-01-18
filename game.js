// @ts-check
class Game {
    constructor(id){
        this.id = id;
        this.playerOne = null;
        this.playerTwo = null;

        /*
        * 0 - empty game
        * 1 - playerOne joined
        * 2 - game started (playerTwo joins implicitly)
        * 3 - playerOne won
        * 4 - playerTwo won
        * 5 - game aborted (one of the players disconnected)
        */
        this.gameState = 0;
    }

    
    addPlayer(p) {
        switch (this.gameState) {
            case 0:
                this.playerOne = p;
                this.gameState = 1;
                return "one";
            case 1:
                this.playerTwo = p;
                this.gameState = 2;
                return "two";
            default:
                return "Invalid call to AddPlayer";
                break;
        }
    }

    getGameState(){
        return this.gameState;
    }

    setGameState(state){
        this.gameState = state;
    }

    gameStarted() {
        return this.gameState == 2;
    }
    getPlayerOne(){
        return this.playerOne;
    }
    getPlayerTwo(){
        return this.playerTwo;
    }



}

module.exports = Game;