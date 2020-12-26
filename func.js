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

function Player(name, figures) {
    this.score = 0;
    this.name = name;
    this.figures = figures;
    
    this.incScore = function() { this.score++ };
    this.getScore = function() { return this.score};
    this.resetScore = function() { this.score = 0 };
}

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

function initFigures(figRef, homePos, startPos, offset) {
    let fig = [];

    for(let i = 0; i < 4; i++) {
        fig.push(new Figure(homePos[i+offset], startPos, figRef[i]));
    } 

    return fig;
}

const game = document.querySelector('.game');
const gridContainer = game.querySelector('.grid-container');
const grid = gridContainer.querySelectorAll('div');
const figRef1 = gridContainer.querySelectorAll('.dot1');
const figRef2 = gridContainer.querySelectorAll('.dot2');

let homePos = homePositions(gridContainer, figRef1, figRef2);

let p1 = new Player("Test1", initFigures(figRef1, homePos, 1, 0));
let p2 = new Player("Test2", initFigures(figRef2, homePos, 19, 4));

const diceRef = document.querySelector(".dice");
diceRef.addEventListener('click', diceModule.rollDice);
