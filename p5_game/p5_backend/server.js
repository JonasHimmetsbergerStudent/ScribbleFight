var express = require("express");

var app = express();
var server = app.listen(3000);

app.use(express.static('../p5_frontend/src'));

console.log("my server is running");

var socket = require('socket.io');

var io = socket(server);

var players = [];

io.sockets.on('connection', newConnection);

function newConnection(socket) {
    console.log("New connection: " + socket.id);
    // if there are existing players
        players.forEach(p => {
            let data = {
                id: p.id
            }
            socket.broadcast.emit('newPlayer', data);
            console.log("erstellt");
        });
    

    socket.on('newPlayer', createPlayer);
    socket.on('update', updatePosition);

    function updatePosition(data) {
        let dataWithId = {
            x: data.x,
            y: data.y,
            id: socket.id
        }
        socket.broadcast.emit('update', dataWithId);
    }

    function createPlayer() {
        let data = {
            id: socket.id
        }
        socket.broadcast.emit('newPlayer', data);
        players[socket.id] = new Player(socket.id);
        console.log(players);
    }

}

class Player {
    constructor(id) {
        this.id = id;
        this.knockback = 1;
        this.life = 3;
        this.item = [];
        this.direction = "";
    }
}