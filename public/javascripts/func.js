//@ts-check

var diceModule = ( function(){
    var currentVal = 6;
    var rolled = false;

    return {
        getStatus: function() {
            return rolled;
        },
        setValue: function(value){
            console.log("value " + value);
            currentVal = value;
            if(currentVal === 1) document.querySelector(".diceImg").src = "dice/dice-six-faces-one.png";
            if(currentVal === 2) document.querySelector(".diceImg").src = "dice/dice-six-faces-two.png";
            if(currentVal === 3) document.querySelector(".diceImg").src = "dice/dice-six-faces-three.png";
            if(currentVal === 4) document.querySelector(".diceImg").src = "dice/dice-six-faces-four.png";
            if(currentVal === 5) document.querySelector(".diceImg").src = "dice/dice-six-faces-five.png";
            if(currentVal === 6) document.querySelector(".diceImg").src = "dice/dice-six-faces-six.png";
        },
        currentValue: function(){
            return currentVal;
        },
        rollDice: function(){
            currentVal = Math.ceil(Math.random()*6);
            rolled = true;
            if(currentVal === 1) document.querySelector(".diceImg").src = "dice/dice-six-faces-one.png";
            if(currentVal === 2) document.querySelector(".diceImg").src = "dice/dice-six-faces-two.png";
            if(currentVal === 3) document.querySelector(".diceImg").src = "dice/dice-six-faces-three.png";
            if(currentVal === 4) document.querySelector(".diceImg").src = "dice/dice-six-faces-four.png";
            if(currentVal === 5) document.querySelector(".diceImg").src = "dice/dice-six-faces-five.png";
            if(currentVal === 6) document.querySelector(".diceImg").src = "dice/dice-six-faces-six.png";
            console.log(currentVal);
            moveFig(currentVal);
            
            console.log(gs.getPlayerType() + " this is player type");
            console.log()
            let flag = false;
            if(gs.getPlayerType() === "A"){
                console.log("calling for a player");
                moveAvailability(p1, currentVal, 47, 50, 47);
                for(let i = 0; i < 4; i++){
                    if(p1.figures[i].canMove){
                        flag = true;
                    }
                }
            }

            if(gs.getPlayerType() === "B"){
                console.log("calling for b player");
                moveAvailability(p2, currentVal, 51, 54, 42);
                for(let i = 0; i < 4; i++){
                    if(p2.figures[i].canMove){
                        flag = true;
                    }
                }
            }
            
            
            let outgoingMsg = Messages.DICE_VALUE;
            outgoingMsg.data = currentVal;
            outgoingMsg.moveAvailability = flag;
            if(flag == false){
                gs.setTurn(false);
                updateGameState();
            }
            ws.send(JSON.stringify(outgoingMsg));
        }
    }
})();


function GameState() {
    this.playerType = null;
    //turn value, denotes if it's client's move
    this.turn = false;

    this.setPlayerType = function(type) {this.playerType = type};
    this.getPlayerType = function() {return this.playerType};
    this.setTurn = function(turn) {this.turn = turn};
    this.getTurn = function() {return this.turn};
}

/**
 * 
 * @param {*} name - name of the player
 * @param {*} figures - reference to a figures of a player 
 */
function Player(name, figures) {
    this.score = 0;
    this.name = name;
    this.figures = figures;

    
    this.incScore = function() { this.score++ };
    this.getScore = function() { return this.score};
    this.resetScore = function() { this.score = 0 };
    this.getName = function() { return this.name};
}

function resetFigState(){
    console.log("resetting...")
    for(let i = 0; i < 4; i++) {
        p1.figures[i].canMove = false;
        p1.figures[i].ref.style.animation = "none";
        p2.figures[i].canMove = false;
        p2.figures[i].ref.style.animation = "none";
    }
}

function checkCollisions(figure) {
    for(let i = 0; i < 4; i++) {
        if(p1.figures[i] != figure && p1.figures[i].startPos != figure.startPos && p1.figures[i].getCurrPos() == figure.getCurrPos()) {
            p1.figures[i].setCurrPos(p1.figures[i].homePos);
            let outgoingMsg = Messages.O_FIG_RETURN_BASE; // If a figure that can be moved was clicked - send figure to the server
            // also send turn change.
            outgoingMsg.data = p1.figures[i];
            ws.send(JSON.stringify(outgoingMsg));
        }
        if(p2.figures[i] != figure && p2.figures[i].startPos != figure.startPos && p2.figures[i].getCurrPos() == figure.getCurrPos()) {
            p2.figures[i].setCurrPos(p2.figures[i].homePos);
            let outgoingMsg = Messages.O_FIG_RETURN_BASE; // If a figure that can be moved was clicked - send figure to the server
            // also send turn change.
            outgoingMsg.data = p2.figures[i];
            ws.send(JSON.stringify(outgoingMsg));
        }
    }
}


/**
 * 
 * @param {*} homePos - home position of the figure (position in the base)
 * @param {*} startPos - first position after the base position
 * @param {*} ref - reference of the figure.
 * @param {*} id - figure id
 */
function Figure(homePos, startPos, ref, id) {
    this.id = id; // Figure id to easily find the right figure object when it's passed through the websocket
    this.homePos = homePos;
    this.ref = ref;
    this.startPos = startPos;
    this.canMove = false;
    this.currPos = homePos;

    this.getId = function() { return this.id };
    this.getHomePos = function() {return this.homePos};
    this.leaveBase = function() {
        // @ts-ignore
        gridContainer.querySelector('.div' + startPos).appendChild(this.ref);
        this.currPos = startPos;
    }
    this.setCurrPos = function(pos){   
        // @ts-ignore
        gridContainer.querySelector('.div' + pos).appendChild(this.ref);
        // checkAlreadyOccupied(pos);
        this.currPos = pos;
    };
    // Calculates the right setCurrPos position for the figure based on the dice value
    this.calculatePos = function() {
        if(this.currPos == this.homePos) this.leaveBase();
        else if(this.startPos == 19) {
            if(this.currPos >= 19 && this.currPos <= 36 && this.currPos + diceModule.currentValue() > 36) this.setCurrPos(this.currPos + diceModule.currentValue() - 36);
            else if(this.currPos >= 1 && this.currPos <= 17 && this.currPos + diceModule.currentValue() > 17) this.setCurrPos(36 + diceModule.currentValue() - (17-this.currPos));
            else this.setCurrPos(this.currPos + diceModule.currentValue());

            if(this.currPos == 42) {
                this.ref.style.display = "none";
                p2.incScore();
                score2.innerHTML = '<span style="color: #74c234">Player2@covm</span><span style="color: white">:</span><span style="color: #6692be">~/sudoLudo</span><br>' + p2.getScore() + '/4';
                let scoreObj = Messages.O_PLAYER_SCORE;
                scoreObj.data = p2.getScore();
                if(p2.getScore() === 4){
                    gameWonBool = true;
                    document.getElementById("dice").style.pointerEvents = "none";
                    let info = document.querySelector(".info");
                    if(gs.getPlayerType === "B"){
                        info.innerHTML = "You Won!";
                    } else {
                        info.innerHTML = "You Lost!"
                    }
                    info.style.display = "auto";
                    ws.close(3050);
                }
                ws.send(JSON.stringify(scoreObj));

            } 
        } 
        else if(this.startPos == 1) {
            if(this.currPos <= 35 && this.currPos + diceModule.currentValue() > 35) this.setCurrPos(41 + diceModule.currentValue() - (35-this.currPos));
            else this.setCurrPos(this.currPos + diceModule.currentValue());

            if(this.currPos == 47) {
                this.ref.style.display = "none";
                p1.incScore();
                score1.innerHTML = '<span style="color: #74c234">Player1@covm</span><span style="color: white">:</span><span style="color: #6692be">~/sudoLudo</span><br>' + p1.getScore() + '/4';
                let scoreObj = Messages.O_PLAYER_SCORE;
                scoreObj.data = p1.getScore();
                ws.send(JSON.stringify(scoreObj));
                if(p1.getScore() === 4){
                    gameWonBool = true;
                    document.getElementById("dice").style.pointerEvents = "none";
                    let info = document.querySelector(".info");
                    if(gs.getPlayerType === "A"){
                        info.innerHTML = "You Won!";
                    } else {
                        info.innerHTML = "You Lost!"
                    }
                    info.style.display = "auto";
                    ws.close(3050);
                }
            }
        }
    }
    this.getCurrPos = function(){ return this.currPos };
    this.getRef = function() { return this.ref };
    this.receivedMove = function() { this.canMove = true }; // Manually makes canMove true for figure moves received from the server

    //if can move, 
    this.action = function() {
        var that = this;
        this.ref.addEventListener("click", function(){
            if(diceModule.getStatus()){
                document.getElementById("dice").style.pointerEvents = "auto";
            }
            if(that.canMove){
                console.log(that.currPos);
                console.log(diceModule.currentValue());
                that.calculatePos(); // moved the logic from this event listener to calculatePos
                checkCollisions(that);
                resetFigState();
                let outgoingMsg = Messages.O_CLICKED_FIG_REF; // If a figure that can be moved was clicked - send figure to the server
                // also send turn change.
                outgoingMsg.data = that;
                if(diceModule.currentValue() != 6){
                    gs.setTurn(false); // sets turn to false after player clicked on the fig.
                    updateGameState(); // Updates dice according to player's turn
                }
                ws.send(JSON.stringify(outgoingMsg));
            }
        });
    
    }
}

/**
 * 
 * @param {*} gridContainer - div which contains grids
 * @param {*} figRef1 - array of references to html of figures of player 1
 * @param {*} figRef2 - array of references to html of figures of player 2
 */
function homePositions(gridContainer, figRef1, figRef2) {
    let figureHomePositions = [];

    for(let i = 0; i < 4; i++) {
        figureHomePositions.push(figRef1[i].parentNode.className.substring(3));
    }
    for(let i = 0; i < 4; i++) {
        figureHomePositions.push(figRef2[i].parentNode.className.substring(3));
    }
    
    return figureHomePositions;
}

/**
 * Initializes the figures, attaches homePosition to each figure, starting position.
 * @param {*} figRef - array of references to hrml of figures of player
 * @param {*} homePos - array of homePos. length 8
 * @param {*} startPos - starting position of figures
 * @param {*} offset - offset to distinguish between figures of player 1
 */
function initFigures(figRef, homePos, startPos, offset) {
    let fig = [];

    for(let i = 0; i < 4; i++) {
        fig.push(new Figure(homePos[i+offset], startPos, figRef[i], i+offset));
        fig[i].action();
    } 

    return fig;
}

function moveAvailability(p, currentVal, baseStart, baseEnd, gameEnd) {
    for(let i = 0; i < 4; i++) {
        // If Player figure is 'in the 'base' and the player rolls a 6 the figure can be moved
        if(p.figures[i].getCurrPos() >= baseStart && p.figures[i].getCurrPos() <= baseEnd && currentVal == 6) {
            p.figures[i].canMove = true;
        }
        // The limit within the Player figure can move
        else if(p.figures[i].getCurrPos()+currentVal <= gameEnd) {
            p.figures[i].canMove = true;
        }
        else p.figures[i].canMove = false;
    }
    
    document.getElementById("dice").style.pointerEvents = "auto";
    //If at least one of the figures can move don't allow another player to roll the dice.
    for(let i = 0; i < 4; i++){
        if(p.figures[i].canMove){
            document.getElementById("dice").style.pointerEvents = "none";
        }
    }

    // adds the animation on the figures that can move
    for(let i = 0; i < 4; i++) {
        if(p.figures[i].canMove) {
            console.log(p.getName());
            console.log(moveAvailability.caller);
            p.figures[i].ref.style.animation = "blink 1s infinite";
        }
    }
}

/**
 * Determines the move availability of each player by their turn.
 * @param {integer} currentVal - value by which the figure should be moved
 */
function moveFig(currentVal) {
    console.log(currentVal);
    console.log(moveFig.caller);
    console.log(p1Turn);
    if(p1Turn) {
        moveAvailability(p1, currentVal, 47, 50, 47);
        console.log("PLAYER 1");
        
    }
    else {
        moveAvailability(p2, currentVal, 51, 54, 42);
        console.log("PLAYER 2");
    }
    
    if(currentVal != 6) p1Turn = !p1Turn;
    
}

// Finds and returns the figure object matching the provided id
function findFig(id) {
    for(let i = 0; i < 4; i++){
        if(p1.figures[i].getId() == id){
            return p1.figures[i];
        }
        else if(p2.figures[i].getId() == id) {
            return p2.figures[i];
        }
    }
}

var timer = document.querySelector('.timer');


function timeFunction(){
    var seconds = 0;
    setInterval(function(){
        seconds++;
        timer.innerHTML = '<span style="color: #74c234">root@covm</span><span style="color: white">:</span><span style="color: #6692be">~/sudoLudo</span>\ngametime: ' + Math.floor(seconds / 3600)%24 + "." + Math.floor(seconds / 60)%60 + "." + seconds%60;
        // console.log(seconds);
        // console.log(Math.floor(seconds / 60));
    }, 1000);
}


let gameStartedBool = false;
let gameWonBool = false;
const game = document.querySelector('.game');
const gridContainer = game.querySelector('.grid-container');
const grid = gridContainer.querySelectorAll('div');
const figRef1 = gridContainer.querySelectorAll('.dot1');
const figRef2 = gridContainer.querySelectorAll('.dot2');

let homePos = homePositions(gridContainer, figRef1, figRef2);

let info = document.querySelector(".info");
const diceRef = document.querySelector(".dice");
//diceRef.addEventListener('click', diceModule.rollDice);
diceRef.addEventListener('click', function(){
    document.getElementById("dice").style.pointerEvents = "none";
    diceModule.rollDice();
    if(diceModule.currentValue() != 6){
        document.getElementById("dice").style.animation = "none";
    }
});


// TODO turn off pointerEvents on the figures of opponent. Done
function updateGameState(){
    console.log("haha");
    console.log(gs.getTurn());
    if(gs.getTurn() === false){
        document.getElementById("dice").style.pointerEvents = "none";
        console.log("turning off");
        for(let i = 0; i < 4; i++) {
            if(gs.getPlayerType() === "A"){
                p2.figures[i].ref.style.pointerEvents = "none";
            } else {
                p1.figures[i].ref.style.pointerEvents = "none";
            }
                 
        }
        if(gs.getPlayerType() === "A"){
            p1Turn = false;
        } else {
            p1Turn = true;
        }
        
    }
    if(gs.getTurn() === true){

        document.getElementById("dice").style.pointerEvents = "auto";
        if(gameStartedBool){
            document.getElementById("dice").style.animation = "blink 1s infinite";
        }
        console.log("turning on");
        for(let i = 0; i < 4; i++) {
            if(gs.getPlayerType() === "A"){
                p1.figures[i].ref.style.pointerEvents = "auto";
                p2.figures[i].ref.style.pointerEvents = "none";
            } else {
                p1.figures[i].ref.style.pointerEvents = "none";
                p2.figures[i].ref.style.pointerEvents = "auto";
            }
                 
        }
        if(gs.getPlayerType() === "A"){
            p1Turn = true;
        } else {
            p1Turn = false;
        }

    }
}


let mainMenu = document.querySelector('.mainMenu');
mainMenu.addEventListener("click", function(){
    console.log("go to main menu");
    ws.send(JSON.stringify({type: "closing"}));
    ws.close();
});





let score1 = document.getElementById("score1");
let score2 = document.getElementById("score2");

let p1Turn = true;

let p1 = null;
let p2 = null;
let p1_flag = true;

let ws = new WebSocket("ws://localhost:3000");
p1 = new Player("Test1", initFigures(figRef1, homePos, 1, 0));
p2 = new Player("Test2", initFigures(figRef2, homePos, 19, 4));

let gs = new GameState();

window.onunload = function(){
    ws.send(JSON.stringify({type: "closing"}));
    ws.close(3100);
}


//ws for local connections

ws.onopen = function(event){
    console.log("game started");
}

ws.onerror = () => {
    console.log("failed");
};

ws.onclose = function(event){
    
}

ws.onmessage = (message) => {
    if(message.data === "gameStarted"){
        timeFunction();
        gameStartedBool = true;
        updateGameState();
        let info = document.querySelector(".info");
        info.innerHTML = "";
        info.style.display = "none";
        if(gs.getPlayerType() === "A"){
            diceRef.style.pointerEvents = "auto";
        }
        
    }
    console.log(message);
    let msg = JSON.parse(message.data);
    switch (msg.type)  {
        case Messages.T_PLAYER_TYPE:
            // if(message.data == "A") {
            //     console.log(message.data);
            // }
            gs.setPlayerType(msg.data);
            console.log(gs.getPlayerType());
            if(msg.data === "A"){
                gs.setTurn(true);
                updateGameState();
                let info = document.querySelector(".info");
                info.innerHTML = "Wait for your opponent";
                info.style.display = "inline";
                let player_ref = document.querySelector(".player");
                player_ref.innerHTML = "You are Green player";
            }
            else {
                console.log(msg.data);
            }
            if(msg.data === "B"){
                gs.setTurn(false);
                updateGameState();
                let player_ref = document.querySelector(".player");
                player_ref.innerHTML = "You are Blue player";
            }
            break;
        case Messages.T_DICE_VALUE:
            diceModule.setValue(msg.data);
            if(msg.moveAvailability === false && msg.data != 6){
                gs.setTurn(true); // if another player had no legal moves after dice roll then another player gets a turn to roll a dice
                updateGameState();
            }
            break;
        case Messages.T_CLICKED_FIG_REF:
            let fig = findFig(msg.data.id); // Find the received figure by its id 
            fig.receivedMove(); // Workaround, canMove disabled when move is received from the server so we need to manually enable it for this fig
            fig.calculatePos(); // Update position of the received figure
            if(diceModule.currentValue() != 6){
                gs.setTurn(true); // if another player clicked figure set its turn to true
                updateGameState(); // update dice
            }
            
            console.log(fig);
            break;

        case Messages.T_PLAYER_SCORE:
            let playerType = gs.getPlayerType();
            console.log(msg.data);
            if(playerType === "A"){
                if(p1.getScore() === 4){
                    // you won
                }
                if(p2.getScore() === 4){
                    // player 2 won
                }
            }
            if(playerType === "B"){
                if(p1.getScore() === 4){
                    // p1 won
                }
                if(p2.getScore() === 4){
                    // you won
                }
            }
            break;
        case "closing":
            let info = document.querySelector(".info");
            if(!gameWonBool){
                info.innerHTML = "Your opponent left";
                info.style.display = "inline";
            }
            
            diceRef.style.pointerEvents = "none";
            diceRef.style.animation = "none";
            break;
        case Messages.T_FIG_RETURN_BASE:
            let fig_xy = findFig(msg.data.id); // Find the received figure by its id 
            fig_xy.setCurrPos(fig_xy.getHomePos());
            console.log("haiahasd");
            
            break;
        default:
            break;
    }
}


// ws.onmessage = function (event) {
//     var msg = JSON.parse(event.data);
//     switch (msg.type) {
//         case "something":
            
//             break;
    
//         default:
//             break;
//     }
//     console.log(event.data);
// }



    