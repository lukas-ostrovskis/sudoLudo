//@ts-check
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

let fig1 = initFigures(figRef1, homePos, 1, 0);
let fig2 = initFigures(figRef2, homePos, 19, 4);

