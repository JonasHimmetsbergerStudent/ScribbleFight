const http = require("http");
const app = require("express")();
app.listen(9091, () => console.log("Listening on 9091"));
app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));
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
app.get("/index.html", (req, res) => res.sendFile(__dirname + "/index.html"));
app.get("/index.css", (req, res) => res.sendFile(__dirname + "/index.css"));

const clients = {};
let base64;
let games = {};
let picGames = {};
let voteGames = {};
let playerVotes = {};
const wsServer = new websocketServer({
    "httpServer": httpServer
})




wsServer.on("request", request => {

    const connection = request.accept(null, request.origin);
    connection.on("open", () => console.log("opened!"))
    connection.on("close", () => console.log("closed!"))

    connection.on("message", message => {
        const result = JSON.parse(message.utf8Data)
        // console.log(result)


        if (result.method === "create") {
            const clientId = result.clientId;
            const gameId = guid();
            games[gameId] = {
                "id": gameId,
                "clients": []
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
            const con = clients[clientId.connection]
            connection.send(JSON.stringify(payLoad))


        }

        if (result.method === "join") {

            if (games[result.gameId]) {
                console.log("Game exists")
                const clientId = result.clientId;
                const gameId = result.gameId;
                const game = games[gameId];
                if (game.clients.length >= 8) {
                    console.log("Maximal 8 Spieleer")
                    const payLoad = {
                        "method": "error",
                        "message": "Too many players in lobby"
                    }
                    connection.send(JSON.stringify(payLoad))
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
                    const payLoadNew = {
                        "method": "newClient",
                        "newClient": clientId,
                        "gameId": games[gameId].id
                    }
                    clients[clientId].connection.send(JSON.stringify(payLoadNew))
                    const payLoad = {
                        "method": "join",
                        "game": games[gameId]
                    }

                    games[gameId].clients.forEach(c => {
                        clients[c.clientId].connection.send(JSON.stringify(payLoad))
                    })
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
        }
        if (result.method === "picUploaded") {
            // picGames = Dummy für games wo alle die hochgeladen haben entfernt werden
            const gameId = result.gameId;
            const game = games[gameId];
            const img = result.img;
            //console.log(result.img)
            //console.log(picGames[result.gameId].clients[0].clientId)
            //console.log(picGames[result.gameId])
            var i = 0;
            picGames[result.gameId].clients.forEach(c => {
                if (picGames[result.gameId].clients[i].clientId == result.clientId) {
                    console.log("yesss")
                    picGames[result.gameId].clients.splice(i, 1)
                }
                i++;
            })
            //console.log(picGames[result.gameId])
            game.clients.forEach(c => {
                if (c.clientId == result.clientId) {
                    c.img = img;
                    console.log("passt so")
                } else {
                    console.log("noooo")
                }
            })

            // Wenn User upgeloaded hat dann sollen alle genotified werden?
            const payLoad = {
                "method": "picUploaded",
                "game": games[gameId],
                "picGame": picGames[gameId],
            }
            games[gameId].clients.forEach(c => {
                clients[c.clientId].connection.send(JSON.stringify(payLoad))
            })
        }
        if (result.method === "startVoting") {
            // Wenn ein alle mit Upload fertig sind und jemand auf start Voting gedrückt hat :thumbsup:
            const gameId = result.gameId;
            const game = games[gameId];
            console.log("testt")

            games[gameId].clients.forEach(c => {
                var payLoad = {
                    "method": "startVoting",
                    "game": games[gameId],
                    "myClient": c.clientId
                }
                clients[c.clientId].connection.send(JSON.stringify(payLoad))
            })
        }
        if (result.method === "rafi_game") {
            const gameId = result.gameId;
            const game = games[gameId];
            const img = game.winner;
            console.log("Image: " + img)
            console.log("Request ist angekommen")
            const payLoad = {
                "method": "rafi_game",
                "img": img
            }
            connection.send(JSON.stringify(payLoad))
        }
        if (result.method === "rafi") {
            const game = games[result.game.id]
            console.log(game.id);
            var i;
            console.log("Bis zu rafi")
            for (i = 0; i < game.clients.length; i++) {
                if (game.clients[i].winner != null) {
                    //console.log("Gewinner ist: " + game.clients[i].clientId + ", " + game.clients[i].winner)
                    games[game.id].winner = result.img;
                    // console.log(games[game.id].winner);
                } else {
                    console.log("Testt")
                }
                console.log("I: " + i);
            }
            console.log("Winner" + games[game.id].winner)

            const payLoad = {
                "method": "linked",
                "gameId": game.id
            }
            games[game.id].clients.forEach(c => {
                clients[c.clientId].connection.send(JSON.stringify(payLoad))
            })
            /*  game.clients.forEach(c => {
                  if(game.clients[i].winner != null){
                      console.log("Gewinner ist: " + c.clientId + ", " + c.winner)
                  } else {
                      console.log("Nicht Gewinner: " + c.clientId)
                  }
                  i++;
                  console.log("I: " + i);
              })*/

        }

        if (result.method === "voted") {
            const gameId = result.gameId;
            const game = games[gameId];
            //Player der gevoted wurde
            const votedPlayer = result.votedPlayer;
            const voteGame = voteGames[gameId];
            // Player der gevoted hat
            const player = result.player;
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
                games[gameId].clients.forEach(c => {
                    clients[c.clientId].connection.send(JSON.stringify(payLoad))
                    //console.log("thsjhaldsladjs")
                })
                if (!playerVotes[gameId].clients[0]) {
                    var arr = [];
                    for (var i = 0; i < voteGame.votes.length; i++) {
                        arr[i] = voteGame.votes[i].amount;
                    }
                    //console.log("Array: " + arr)
                    var winner = arr.reduce((iMax, x, i, a) => x > a[iMax] ? i : iMax, 0);
                    //console.log("Gewinner: " + winner)
                    games[gameId].clients[winner].winner = true;
                    var payLoad2 = {
                        "method": "startGame",
                        "game": game,
                        "winner": winner
                    }
                    games[gameId].clients.forEach(c => {
                        clients[c.clientId].connection.send(JSON.stringify(payLoad2))
                        //console.log("geschickt!")
                    })
                } else {
                    console.log("Still Players remaining")
                }
            } else {
                var payLoad2 = {
                    "method": "error",
                    "message": "user has already voted"
                }
                games[gameId].clients.forEach(c => {
                    clients[c.clientId].connection.send(JSON.stringify(payLoad2))
                    //console.log("geschickt!")
                })
            }
        }

    })

    const clientId = guid();
    clients[clientId] = {
        "connection": connection
        // Nickname!!!
    }

    const payLoad = {
        "method": "connect",
        "clientId": clientId
    }

    connection.send(JSON.stringify(payLoad))

})

function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

//const guid = () => (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
const guid = () => Math.floor(Math.random() * 10000);


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

    socket.on('new-user', name => {
        users[socket.id] = name
        console.log("test")
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