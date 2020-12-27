//@ts-check

var diceModule = ( function(){
    var currentVal = 6;

    return {
        currentValue: function(){
            return currentVal;
        },
        rollDice: function(){
            currentVal = Math.ceil(Math.random()*6);
            moveFig(currentVal);
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
}

/**
 * 
 * @param {*} homePos - home position of the figure (position in the base)
 * @param {*} startPos - first position after the base position
 * @param {*} ref - reference of the figure.
 */
function Figure(homePos, startPos, ref) {
    this.homePos = homePos;
    this.ref = ref;
    this.startPos = startPos;

    this.currPos = homePos;
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
    this.getCurrPos = function(){ return this.currPos};
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
        fig.push(new Figure(homePos[i+offset], startPos, figRef[i]));
    } 

    return fig;
}

/**
 * Moves the figure by the currentVal if the move is legal
 * @param {} currentVal - value by which the figure should be moved
 */
function moveFig(currentVal) {
    console.log(currentVal);
    if(p1Turn) {
        console.log("PLAYER 1");
        for(let i = 0; i < 4; i++) {
            // If Player1 figure is 'in the 'base' and the player rolls a 6 the figure can be moved
            if(p1.figures[i].getCurrPos() >= 47 && p1.figures[i].getCurrPos() <= 50 && currentVal == 6) {
                console.log(i + " can move");
            }
            // The limit within the Player1 figure can move
            else if(p1.figures[i].getCurrPos()+currentVal <= 47) {
                console.log(i + " can move");
            }
            else console.log(i + " can't move");
        }
    }
    else {
        console.log("PLAYER 2");
        for(let i = 0; i < 4; i++) {
            // If Player2 figure is 'in the 'base' and the player rolls a 6 the figure can be moved
            if(p2.figures[i].getCurrPos() >= 51 && p2.figures[i].getCurrPos() <= 54 && currentVal == 6) {
                console.log(i + " can move");
            }
            // The limit within the Player2 figure can move
            else if(p2.figures[i].getCurrPos()+currentVal <= 42) {
                console.log(i + " can move");
            }
            else console.log(i + " can't move");
        }
    }
    
    if(currentVal != 6) p1Turn = !p1Turn;
}

function 


var timer = document.querySelector('.timer');
timeFunction();

function timeFunction(){
    var seconds = 0;
    setInterval(function(){
        seconds++
        timer.innerHTML = "time:" + Math.floor(seconds / 3600) + "." + Math.floor(seconds / 60) + "." + seconds;
        console.log(seconds);
        console.log(Math.floor(seconds / 60));
    }, 1000);
}


const game = document.querySelector('.game');
const gridContainer = game.querySelector('.grid-container');
const grid = gridContainer.querySelectorAll('div');
const figRef1 = gridContainer.querySelectorAll('.dot1');
const figRef2 = gridContainer.querySelectorAll('.dot2');

let homePos = homePositions(gridContainer, figRef1, figRef2);

const diceRef = document.querySelector(".dice");
diceRef.addEventListener('click', diceModule.rollDice);

let p1 = new Player("Test1", initFigures(figRef1, homePos, 1, 0));
let p2 = new Player("Test2", initFigures(figRef2, homePos, 19, 4));

let p1Turn = true;





    