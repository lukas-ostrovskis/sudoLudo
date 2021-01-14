var express = require("express");
var http = require("http");

const websocket = require("ws");
let stats = require("./stats");
let Game = require("./game");

var port = process.argv[2];
var app = express();
let server = http.createServer(app);
const wss = new websocket.Server({port: 3030});

console.log(wss);
// console.log(app);
// console.log(server);
var websockets = {};

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
//http.createServer(app).listen(port);

app.get("/", function(req, res){
    //res.sendFile("splash.html", {root: "./public"});
    res.render("splash", {
        gamesInit: stats.gamesInitialized,
        gamesOngoing: stats.onGoingGames
    });
});

app.get("/play", function(req, res){
    res.sendFile("game.html", { root: "./public"});
});

let currentGame = new Game(stats.gamesInitialized++);
let connectionID = 0;

wss.on("connection", function(ws){
    console.log("connected");
});

// wss.on("connection", function connection(ws){
//     //assign ws reference to connection
//     let connection = ws;
//     // give unique id to the ws connection
//     connection.id = connectionID++;
//     // add the player to the game
//     let playerType = currentGame.addPlayer(connection);
//     // add the game to the websockets dict.
//     websockets[connection.id] = currentGame;

//     connection.send(playerType === "one" ? "You are Green player" : "You are Blue player");

//     //if current game already started then leave it as it is and assign current game a new Game
//     if(currentGame.gameStarted()){
//         stats.onGoingGames++;
//         currentGame = new Game(stats.gamesInitialized++);
//     }

//     con.on("message", function incoming(message) {
//         let currentGameObject = websockets[connection.id];
//         let isPlayerOne = currentGameObject.playerOne === connection ? true : false;
//         // TODO a link between client and server.
//     });


    
//     con.on("close", function(code){
//         if(code == "1001"){
//             let currentGameObject = websockets[connection.id];
            

//             if(currentGameObject.getGameState() < 5){
//                 currentGameObject.setGameState(5);
//                 stats.onGoingGames--;
//             }
            
//             if(currentGameObject.playerOne != null){
//                 currentGameObject.playerOne.close();
//                 currentGameObject.playerOne === null;
//             }
//             if(currentGameObject.playerTwo != null){
//                 currentGameObject.playerTwo.close();
//                 currentGameObject.playerTwo === null;
//             }
            
//         }
//     });


// });

