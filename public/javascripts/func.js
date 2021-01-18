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
            let outgoingMsg = Messages.DICE_VALUE;
            outgoingMsg.data = currentVal;
            ws.send(JSON.stringify(outgoingMsg));
        }
    }
})();

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
        }
        if(p2.figures[i] != figure && p2.figures[i].startPos != figure.startPos && p2.figures[i].getCurrPos() == figure.getCurrPos()) {
            p2.figures[i].setCurrPos(p2.figures[i].homePos);
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
                score2.innerHTML = "Player 2 score: " + p2.getScore() + "/4";

            } 
        } 
        else if(this.startPos == 1) {
            if(this.currPos <= 35 && this.currPos + diceModule.currentValue() > 35) this.setCurrPos(41 + diceModule.currentValue() - (35-this.currPos));
            else this.setCurrPos(this.currPos + diceModule.currentValue());

            if(this.currPos == 47) {
                this.ref.style.display = "none";
                p1.incScore();
                score1.innerHTML = "Player 1 score: " + p1.getScore() + "/4";
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
                outgoingMsg.data = that;
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
            p.figures[i].ref.style.animation = "blink 1s infinite";
        }
    }
}

/**
 * Determines the move availability of each player by their turn.
 * @param {} currentVal - value by which the figure should be moved
 */
function moveFig(currentVal) {
    console.log(currentVal);
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
timeFunction();

function timeFunction(){
    var seconds = 0;
    setInterval(function(){
        seconds++;
        timer.innerHTML = '<span style="color: #74c234">root@covm</span><span style="color: white">:</span><span style="color: #6692be">~/sudoLudo</span>\ngametime: ' + Math.floor(seconds / 3600)%24 + "." + Math.floor(seconds / 60)%60 + "." + seconds%60;
        // console.log(seconds);
        // console.log(Math.floor(seconds / 60));
    }, 1000);
}


const game = document.querySelector('.game');
const gridContainer = game.querySelector('.grid-container');
const grid = gridContainer.querySelectorAll('div');
const figRef1 = gridContainer.querySelectorAll('.dot1');
const figRef2 = gridContainer.querySelectorAll('.dot2');

let homePos = homePositions(gridContainer, figRef1, figRef2);

const diceRef = document.querySelector(".dice");
//diceRef.addEventListener('click', diceModule.rollDice);
diceRef.addEventListener('click', function(){
    document.getElementById("dice").style.pointerEvents = "none";
    diceModule.rollDice();
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


//ws for local connections

ws.onopen = function(event){
    console.log("game started");
}

ws.onerror = () => {
    console.log("failed");
};

ws.onmessage = (message) => {
    console.log(message);
    let data = JSON.parse(message.data);
    switch (data.type) {
        case Messages.T_PLAYER_TYPE:
            if(message.data == "A") {
                console.log(message.data);
            }
            else {
                console.log(message.data);
            }
        case Messages.T_DICE_VALUE:
            diceModule.setValue(data.data);
            break;
        case Messages.T_CLICKED_FIG_REF:
            let fig = findFig(data.data.id); // Find the received figure by its id 
            fig.receivedMove(); // Workaround, canMove disabled when move is received from the server so we need to manually enable it for this fig
            fig.calculatePos(); // Update position of the received figure
            console.log(fig);
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



    