var express = require("express");
var http = require("http");

const websocket = require("ws");
let stats = require("./stats");
let Game = require("./game");
let messages = require("./public/javascripts/messages");

var port = process.argv[2];
var app = express();
let server = http.createServer(app);
const wss = new websocket.Server({server});

var websockets = {};

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));


app.get("/", function(req, res){
    //res.sendFile("splash.html", {root: "./public"});
    res.render("splash", {
        gamesInit: stats.gamesInitialized,
        gamesOngoing: stats.onGoingGames,
    });
});

app.get("/play", function(req, res){
    res.sendFile("game.html", { root: "./public"});
});

console.log(stats.gamesInitialized);

let currentGame = new Game(stats.gamesInitialized++);
let connectionID = 0;






wss.on("connection", function connection(ws){
    //assign ws reference to connection
    let connection = ws;
    // give unique id to the ws connection
    connection.id = connectionID++;
    // add the player to the game
    let playerType = currentGame.addPlayer(connection);
    // add the game to the websockets dict.
    websockets[connection.id] = currentGame;
    console.log(stats);

    console.log(playerType);

    connection.send(playerType === "one" ? messages.S_PLAYER_A : messages.S_PLAYER_B);




    //if current game already started then leave it as it is and assign current game a new Game
    if(currentGame.gameStarted()){
        currentGame.getPlayerOne().send("gameStarted");
        currentGame.getPlayerTwo().send("gameStarted");
        stats.onGoingGames++;
        currentGame = new Game(stats.gamesInitialized++);

    }

    connection.on("message", function incoming(message) {
        let currentGameObject = websockets[connection.id];
        let isPlayerOne = currentGameObject.playerOne === connection ? true : false;
        // TODO a link between client and server.
        console.log(isPlayerOne);
        console.log(message);
        let msg = JSON.parse(message);
        switch (msg.type) {
            case messages.T_DICE_VALUE:
                if(isPlayerOne){
                    if(currentGameObject.getPlayerTwo() !== null){
                        currentGameObject.getPlayerTwo().send(message);
                    }
                    console.log(msg.data);
                }
                else{
                    if(currentGameObject.getPlayerOne() !== null){
                        currentGameObject.getPlayerOne().send(message);
                    }
                    console.log(msg.data);
                }
                break;
        
            case messages.T_CLICKED_FIG_REF:
                if(isPlayerOne){
                    if(currentGameObject.getPlayerTwo() !== null){
                        currentGameObject.getPlayerTwo().send(message);
                    }
                }
                else {
                    if(currentGameObject.getPlayerOne() !== null){
                        currentGameObject.getPlayerOne().send(message);
                    }
                }
                break;
                //if it got a dice roll and no legal move then change turn to another player,
                //if there are legal moves then wait for CLICKED FIG REF.
            case messages.T_PLAYER_SCORE:
                if(isPlayerOne){
                    if(msg.data === 4){
                        if(currentGameObject.getPlayerOne() !== null){
                            currentGameObject.getPlayerOne().send(message);
                        }
                        if(currentGameObject.getPlayerTwo() !== null){
                            currentGameObject.getPlayerTwo().send(message);
                        }
                    }
                } else {
                    if(msg.data === 4){
                        if(currentGameObject.getPlayerOne() !== null){
                            currentGameObject.getPlayerOne().send(message);
                        }
                        if(currentGameObject.getPlayerTwo() !== null){
                            currentGameObject.getPlayerTwo().send(message);
                        }
                    }
                }
                break;
            case "closing":
                if(currentGameObject.getPlayerOne() !== null){
                    currentGameObject.getPlayerOne().send(message);
                }
                if(currentGameObject.getPlayerTwo() !== null){
                    currentGameObject.getPlayerTwo().send(message);
                }
                break;

            case messages.T_FIG_RETURN_BASE:
                if(isPlayerOne){
                    if(currentGameObject.getPlayerTwo() !== null){
                        currentGameObject.getPlayerTwo().send(message);
                    }
                }
                else {
                    if(currentGameObject.getPlayerOne() !== null){
                        currentGameObject.getPlayerOne().send(message);
                    }
                }
                break;
                

            default:
                console.log("type not defined yet");
                console.log(msg.type);
                break;
        }
    });


    
    connection.on("close", function(code){
        console.log(code);
        // the game over close
        if(code === 3100 || code === "3100"){
            console.log("shutdownscreen");
        }
        if(code == 3050 || code === "3050"){
            console.log("game over");
            let currentGameObject = websockets[connection.id];
            

            if(currentGameObject.getGameState() < 5 && currentGameObject.getGameState() > 1){
                currentGameObject.setGameState(5);
                stats.onGoingGames--;
            }
            try{
                if(currentGameObject.playerOne !== null){
                    currentGameObject.playerOne.close();
                    currentGameObject.playerOne === null;
                }
            } catch(e){
                console.log("A: " + e);
            }
            try{
                if(currentGameObject.getPlayerTwo() !== null){
                    currentGameObject.getPlayerTwo().close();
                    currentGameObject.playerTwo === null;
                }
            } catch(e){
                console.log("B: " + e);
            }
        }

        if(code == "1001"){
            let currentGameObject = websockets[connection.id];
            

            if(currentGameObject.getGameState() < 5 && currentGameObject.getGameState() > 1){
                currentGameObject.setGameState(5);
                stats.onGoingGames--;
            }
            try{
                if(currentGameObject.playerOne !== null){
                    currentGameObject.playerOne.close();
                    currentGameObject.playerOne === null;
                }
            } catch(e){
                console.log("A: " + e);
            }
            try{
                if(currentGameObject.getPlayerTwo() !== null){
                    currentGameObject.getPlayerTwo().close();
                    currentGameObject.playerTwo === null;
                }
            } catch(e){
                console.log("B: " + e);
            }
        }
    });


});

server.listen(port);
