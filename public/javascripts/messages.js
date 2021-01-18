// dice Value
exports.T_DICE_VALUE = "DICE-VALUE";

// data null, because data needs to be set
exports.DICE_VALUE = {
    type: exports.T_DICE_VALUE,
    data: null
};


// moves: client to server or server to client
exports.T_CLICKED_FIG_REF = "CLICKED_FIG_REF";
exports.O_CLICKED_FIG_REF = {
    type: exports.T_CLICKED_FIG_REF,
    data: null
};

//game won by
exports.T_GAME_WON_BY = "GAME-WON-BY";
exports.O_GAME_WON_BY = {
    type: exports.T_GAME_WON_BY,
    data: null
};


// aborted: server to client
exports.O_GAME_ABORTED = {
    type: "GAME-ABORTED"
  };
exports.S_GAME_ABORTED = JSON.stringify(exports.O_GAME_ABORTED); // kam sito reik?


// set as player A/B
/*
* Server to client: set as player A
*/
exports.T_PLAYER_TYPE = "PLAYER-TYPE";
exports.O_PLAYER_A = {
type: exports.T_PLAYER_TYPE,
data: "A"
};
exports.S_PLAYER_A = JSON.stringify(exports.O_PLAYER_A);

/*
* Server to client: set as player B
*/
exports.O_PLAYER_B = {
type: exports.T_PLAYER_TYPE,
data: "B"
};
exports.S_PLAYER_B = JSON.stringify(exports.O_PLAYER_B);



