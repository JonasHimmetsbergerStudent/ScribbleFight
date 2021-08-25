var express = require("express");

var app = express();
var server = app.listen(3000);

app.use(express.static('../p5_frontend/src'));

console.log("my server is running");

var socket = require('socket.io');

var io = socket(server);

var players = new Map();

io.sockets.on('connection', newConnection);

function newConnection(socket) {
    console.log("New connection: " + socket.id);

    if (players.size > 0) {
        players.forEach((values, keys) => {
            let data = {
                id: values.id
            }
            socket.emit('newPlayer', data);
            console.log("erstellt" + socket.id);
        })
    }



    socket.on('newPlayer', createPlayer);
    socket.on('update', updatePosition);
    socket.on('updateDirection',updateDirection);

    function updatePosition(data) {
        let dataWithId = {
            x: data.x,
            y: data.y,
            id: socket.id
        }
        socket.broadcast.emit('update', dataWithId);
    }

    function updateDirection(data) {
        let dataWithId = {
            id: socket.id,
            direction: ""
        }
        if(data == "left") {
            dataWithId.direction = "left";
            players.get(socket.id).direction = "left";
            socket.broadcast.emit('updateDirection',dataWithId);
        } else if(data == "right") {
            dataWithId.direction = "right";
            players.get(socket.id).direction = "right";
            socket.broadcast.emit('updateDirection',dataWithId);
        }
    }

    function createPlayer() {
        let data = {
            id: socket.id
        }
        // damit es auch an mich sendet, benutze ich io.emit
        io.emit('newPlayer', data);
        players.set(socket.id, new Player(socket.id));
        console.log(players.size);
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