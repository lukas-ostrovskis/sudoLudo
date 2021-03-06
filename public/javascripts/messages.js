(function(exports) {
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
        data: null,
        moveAvailability: null
    };

    exports.T_FIG_RETURN_BASE = "FIG-RETURN-BASE";
    exports.O_FIG_RETURN_BASE = {
        type: exports.T_FIG_RETURN_BASE,
        data: null,
    };

    exports.T_MOVE_AVAILABILITY_A = "MOVE-AVAIL-A";
    exports.O_MOVE_AVAILABILITY_A = {
        type: exports.T_MOVE_AVAILABILITY_A,
        data:null
    }

    exports.T_MOVE_AVAILABILITY_B = "MOVE-AVAIL-B";
    exports.O_MOVE_AVAILABILITY_B = {
        type: exports.T_MOVE_AVAILABILITY_B,
        data: null
    }

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

    // exports.T_GAME_CLOSING = "GAME-CLOSING";
    // exports.O_GAME_CLOSING = {
    //     type: T_GAME_CLOSING,
    // };

    

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

    /*
    * Client to server or server to client: score of player
    */

    exports.T_PLAYER_SCORE = "PLAYER-SCORE";
    exports.O_PLAYER_SCORE = {
        type: exports.T_PLAYER_SCORE,
        data: null
    }
})(typeof exports === "undefined" ? (this.Messages = {}) : exports);





