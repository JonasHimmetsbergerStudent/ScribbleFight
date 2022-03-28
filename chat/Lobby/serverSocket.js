const http = require("http");
const app = require("express")();
app.listen(9091, () => console.log("Listening on 9091"));
app.get("/", (req, res) => res.sendFile(__dirname + "/socketIndex.html"));
const websocketServer = require("websocket").server
const httpServer = http.createServer();
httpServer.listen(9090, () => console.log("Listening.. on 9090"))

app.get("/jquery.min.js", (req, res) => res.sendFile(__dirname + "/jquery.min.js"));
app.get("/qrcode.html/:gameId/:clientId", function (req, res) {
    res.sendFile(__dirname + "/qrcode.html")
});
var path = require('path');
//app.get("/rafi", (req, res) => res.sendFile(path.resolve(__dirname + 
//  "/../../../Trash/ScribbleFight/p5_game_Ben/p5_frontend/src/index.html")));

app.get("/amogusss.png", (req, res) => res.sendFile(__dirname + "/amogusss.png"));
app.get("/qrcode.js", (req, res) => res.sendFile(__dirname + "/qrcode.js"));
app.get("/chart.js", (req, res) => res.sendFile(__dirname + "/chart.js"));
app.get("/qrcode.html", (req, res) => res.sendFile(__dirname + "/qrcode.html"));
app.get("/socketIndex.html", (req, res) => res.sendFile(__dirname + "/socketndex.html"));
app.get("/index.css", (req, res) => res.sendFile(__dirname + "/index.css"));

const clients = {};
let base64;
let games = {};
let picGames = {};
let voteGames = {};
let playerVotes = {};


// Chat
const io = require("socket.io")(3001, {
    cors: {
        origin: "*",
    },
});
const users = {}
const gameChats = {}


io.on('connection', socket => {


    /*socket.on('new-room', data => {
       // gameChats[socket.id] = data.gameId;
        console.log("Neuer Raum: " + gameChats[socket.id])
        io.to(gameChats[socket.id]).emit("room-created", data.gameId)
    })*/
    console.log("ID: " + socket.id)
    io.on('connection', socket => {

        const clientId = guid();
        socket.id.clientId = clientId;
        socket.clientId = clientId;
        const payLoad = {
            "clientId": clientId
        }
        //connection.send(JSON.stringify(payLoad))


        socket.emit("connecting", payLoad)
    });


    socket.on('create', message => {
        const clientId = message.clientId;
        console.log(clientId)
        const gameId = guid();
        games[gameId] = {
            "id": gameId,
            "clients": [],
            // ??
        }
        picGames[gameId] = {
            "id": gameId,
            "clients": []
            // ??
        }
        voteGames[gameId] = {
            "id": gameId,
            "clients": [],
            "votes": []
        }
        playerVotes[gameId] = {
            "id": gameId,
            "clients": [],
        }
        //console.log(games)

        const payLoad = {
            "method": "create",
            "game": games[gameId]
        }
        //  console.log("Testy" + JSON.stringify(payLoad))
        socket.emit("create", payLoad)
    });



    socket.on('join', message => {
        if (games[message.gameId]) {
            const clientId = message.clientId;
            console.log("ClientID" + clientId)
            const gameId = message.gameId;
            const game = games[gameId];
            const clients = io.sockets.adapter.rooms.get(gameId);

            if (game.clients.length >= 8) {
                console.log("Maximal 8 Spieleer")
                const payLoad = {
                    "method": "error",
                    "message": "Too many players in lobby"
                }
                io.to(gameId).emit(payLoad)
            } else {
                games[gameId].clients.push({
                    "clientId": clientId
                })
                picGames[gameId].clients.push({
                    "clientId": clientId
                })
                voteGames[gameId].clients.push({
                    "clientId": clientId,
                })
                voteGames[gameId].votes.push({
                    "amount": 0,
                })
                playerVotes[gameId].clients.push({
                    "clientId": clientId,
                })
                console.log("Clients" + games[gameId].clients)
                const payLoadNew = {
                    "method": "newClient",
                    "newClient": clientId,
                    "gameId": games[gameId].id
                }
                socket.emit('newClient', payLoadNew)
                //clients[clientId].connection.send(JSON.stringify(payLoadNew))
                const payLoad = {
                    "method": "join",
                    "game": games[gameId]
                }

                // MUSS STRING SEIN XDDXDXDXDXD
                let gameString = "" + gameId
                console.log(gameString);
                socket.join(gameString, () => console.log("RoomID: " + socket.rooms))
                io.in(gameString).emit('join', payLoad)
                //io.in(gameId).emit('join', payLoad)
                /*socket.join(gameId, () => {
                    console.log(socket.rooms);
                    socket.in(gameId).emit('join', payLoad);
                  });*/
                /*  games[gameId].clients.forEach(c => {
                      clients[c.clientId].connection.send(JSON.stringify(payLoad))
                  })*/
                //console.log(games)
            }
        } else {
            console.log("error")
            const payLoad = {
                "method": "error",
                "message": "Gamecode does not exist!"
            }
            connection.send(JSON.stringify(payLoad))
        }
    })

    socket.on('picUploaded', message => {
        const gameId = message.gameId;
        const game = games[gameId];
        const img = message.img;
        const map = message.map;
        const clientId = message.clientId;
        //console.log("Image:" + message.img)
        //console.log(picGames[message.gameId].clients[0].clientId)
        //console.log(picGames[message.gameId])
        var i = 0;
        picGames[message.gameId].clients.forEach(c => {
            if (picGames[message.gameId].clients[i].clientId == message.clientId) {
                console.log("yesss")
                picGames[message.gameId].clients.splice(i, 1)
            }
            i++;
        })
        //console.log(picGames[message.gameId])
        i = 0;
        game.clients.forEach(c => {
            if (c.clientId == message.clientId) {
                //c.img = img;
                games[gameId].clients[i].img = img;
                games[gameId].clients[i].map = map;
              //  console.log("DAS IMAGE" + games[gameId].clients[i].img)
                console.log("passt so")
            } else {
                console.log("noooo")
            }
            i++;
        })

        // Wenn User upgeloaded hat dann sollen alle genotified werden?
        const payLoad = {
            "method": "picUploaded",
            "game": games[gameId],
            "picGame": picGames[gameId],
        }

        let gameString = "" + gameId
        console.log(gameString);
        io.in(gameString).emit('picUploaded', payLoad)
    })

    socket.on('startVoting1', message => {

        // Wenn ein alle mit Upload fertig sind und jemand auf start Voting gedrückt hat :thumbsup:


        // console.log("testt")
        const gameId = message.gameId;
        const game = games[gameId];
       // console.log("Game:   " + game)
        /* games[gameId].clients.forEach(c => {
             var payLoad = {
                 "method": "startVoting",
                 "game": games[gameId],
                 "myClient": c.clientId
             }
             //clients[c.clientId].connection.send(JSON.stringify(payLoad))
         }) */
        var payLoad = {
            "method": "startVoting1",
            "game": games[gameId],
            "gameId": gameId
        }
        let gameString = "" + gameId
        console.log(gameString);
        io.in(gameString).emit('startVoting1', payLoad)
    });

    socket.on('startVoting2', message => {
        // const gameId = message.gameId;
        const game = message.game;
     //   console.log("Game2: " + game)
        const myClient = socket.clientId;
        /*games[gameId].clients.forEach(c => {
            var payLoad = {
                "method": "startVoting",
                "game": games[gameId],
                "myClient": myClient
            }
            
        })*/
        const payLoad = {
            "method": "startVoting2",
            "game": game,
            "myClient": myClient
        }
        socket.emit('startVoting2', payLoad)
    })


    socket.on('voted', message => {
        const gameId = message.gameId;
        const game = games[gameId];
    //    console.log("game: " + game)
        //Player der gevoted wurde
        const votedPlayer = message.votedPlayer;
        const voteGame = voteGames[gameId];
        // Player der gevoted hat
        const player = message.player;
        var i = 0;
        //console.log("Votedplayer: " + votedPlayer)
        //console.log("Player: " + player)
        var bool = false;
        playerVotes[gameId].clients.forEach(c => {
            //console.log("Aktueller Playervotes[i]: " + playerVotes[gameId].clients[i].clientId)
            if (playerVotes[gameId].clients[i].clientId == player) {
                //console.log("Player wurde gespliced: " + playerVotes[gameId].clients[i].clientId)
                bool = true
            }
            i++;
        })
        if (bool) {
            i = 0;
            playerVotes[gameId].clients.forEach(c => {
                //console.log("Aktueller Playervotes[i]: " + playerVotes[gameId].clients[i].clientId)
                if (playerVotes[gameId].clients[i].clientId == player) {
                    //console.log("Player wurde gespliced: " + playerVotes[gameId].clients[i].clientId)
                    playerVotes[gameId].clients.splice(i, 1)
                }
                i++;
            })
            voteGame.votes[votedPlayer].amount++;
            //console.log("VotedPlayer:" + votedPlayer)
            //console.log("VotedPlayer Amount: " + voteGame.votes[votedPlayer].amount);
            const payLoad = {
                "method": "voted",
                "voteGame": voteGames[gameId],
                "game": game,
                "votedPlayer": votedPlayer
            }
            let gameString = "" + gameId
            console.log(gameString);
            io.in(gameString).emit('voted', payLoad)
            if (!playerVotes[gameId].clients[0]) {
                var arr = [];
                for (var i = 0; i < voteGame.votes.length; i++) {
                    arr[i] = voteGame.votes[i].amount;
                }
                //console.log("Array: " + arr)
                var winner = arr.reduce((iMax, x, i, a) => x > a[iMax] ? i : iMax, 0);
                //console.log("Gewinner: " + winner)
                games[gameId].clients[winner].winner = true;
               // console.log("Winner: " + winner);
               // console.log("Gewinner: " + games[gameId].clients[winner].img)
                let gewinner = games[gameId].clients[winner].img;
                let gewinnerMap = games[gameId].clients[winner].map
                games[gameId].winner = gewinner;
                games[gameId].winnerMap = gewinnerMap;
                //console.log("BRUHDER DU HAST GEWONNEN" + gewinnerMap)
                var payLoad2 = {
                    "method": "startGame",
                    "game": game,
                  //  "winner": gewinner,
                   // "gewinnerMap": gewinnerMap
                }
                let gameString = "" + gameId
                console.log(gameString);
                io.in(gameString).emit('startGame', payLoad2)
            } else {
                console.log("Still Players remaining")
            }
        } else {
            var payLoad2 = {
                "method": "error",
                "message": "user has already voted"
            }
            let gameString = "" + gameId
            console.log(gameString);
            io.in(gameString).emit('error', payLoad)
        }
    })

    /*  socket.on('rafi', message => {
          console.log("Bis zu rafi")
          const payLoad = {
              "method": "linked",
              "gameId": game.id
          }
      })*/

    socket.on('rafi_game', message => {
        const gameId = message.gameId;
        const game = games[gameId];
        //console.log("Gewinner: " + games[gameId].winner)
        const img = games[gameId].winner;
        const map = games[gameId].winnerMap;
        console.log("GameID: " + gameId)
     //  console.log("Image: " + img)
        console.log("Request ist angekommen")
        const payLoad = {
            "method": "rafi_game",
            "img": img,
            "map": map
        }
        socket.emit('rafi_game', payLoad)
        //connection.send(JSON.stringify(payLoad))
    })

    socket.on('new-user', name => {

        users[socket.id] = name

        socket.broadcast.emit('user-connected', name)
        //io.to(gameChats[data.gameId]).emit('user-connecetd', data.name)
    })
    //socket.emit('chat-message', 'Heyy')
    socket.on('send-chat-message', message => {
        socket.broadcast.emit('chat-message', {
            message: message,
            name: users[socket.id]
        })
    })


    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id])
        delete users[socket.id]
    })
})


function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

//const guid = () => (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
const guid = () => Math.floor(Math.random() * 10000);