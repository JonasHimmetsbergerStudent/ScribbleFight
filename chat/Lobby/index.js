const http = require("http");
const app = require("express")();
app.listen(9091, () => console.log("Listening on 9091"));
app.get("/", (req,res) => res.sendFile(__dirname + "/index.html"));
const websocketServer = require("websocket").server
const httpServer = http.createServer();
httpServer.listen(9090, () => console.log("Listening.. on 9090"))

app.get("/jquery.min.js", (req,res) => res.sendFile(__dirname + "/jquery.min.js"));
app.get("/qrcode.html/:gameId/:clientId", function (req,res) {
    res.sendFile(__dirname + "/qrcode.html")
} );
app.get("/amogusss.png", (req,res) => res.sendFile(__dirname + "/amogusss.png"));
app.get("/qrcode.js", (req,res) => res.sendFile(__dirname + "/qrcode.js"));
app.get("/chart.js", (req,res) => res.sendFile(__dirname + "/chart.js"));
app.get("/qrcode.html", (req,res) => res.sendFile(__dirname + "/qrcode.html"));
app.get("/index.html", (req,res) => res.sendFile(__dirname + "/index.html"));

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

        if(result.method === "create") {
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

            if(games[result.gameId]){
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
        if(result.method === "picUploaded"){
            // picGames = Dummy für games wo alle die hochgeladen haben entfernt werden
            const gameId = result.gameId;
            const game = games[gameId];
            const img = result.img;
            //console.log(result.img)
            //console.log(picGames[result.gameId].clients[0].clientId)
            //console.log(picGames[result.gameId])
            var i = 0;
            picGames[result.gameId].clients.forEach( c => {
                if(picGames[result.gameId].clients[i].clientId == result.clientId){
                    console.log("yesss")
                    picGames[result.gameId].clients.splice(i,1)
                }
                i++;
            })
            //console.log(picGames[result.gameId])
            game.clients.forEach(c => {
                if(c.clientId == result.clientId){
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
        if(result.method === "startVoting"){
            // Wenn ein alle mit Upload fertig sind und jemand auf start Voting gedrückt hat :thumbsup:
            const gameId = result.gameId;
            const game = games[gameId];
            console.log("testt")
            const payLoad = {
                "method": "startVoting",
                "game": games[gameId],
            }
            games[gameId].clients.forEach(c => {
                clients[c.clientId].connection.send(JSON.stringify(payLoad))
            })
        }
        if(result.method === "voted"){

            
            const gameId = result.gameId;
            const game = games[gameId];
            const votedPlayer = result.votedPlayer;
            const voteGame = voteGames[gameId];
            const player = result.player;

            console.log("Player who voted: " + player);

            voteGame.votes[votedPlayer].amount++;
            console.log("VotedPlayer:" + votedPlayer)
            console.log("VotedPlayer Amount: " + voteGame.votes[votedPlayer].amount);
            const payLoad = {
                "method": "voted",
                "voteGame": voteGames[gameId],
                "game": game,
                "votedPlayer": votedPlayer
            }
            games[gameId].clients.forEach(c => {
                clients[c.clientId].connection.send(JSON.stringify(payLoad))
                console.log("thsjhaldsladjs")
            })

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
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
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

io.on('connection', socket => {
    socket.on('new-user', name => {
        users[socket.id] = name
        socket.broadcast.emit('user-connected', name)
    })
    socket.emit('chat-message', 'Heyy')
    socket.on('send-chat-message', message => {
        socket.broadcast.emit('chat-message', {message: message, name: users[socket.id]})
    })
    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id])
        delete users[socket.id]
    })
})