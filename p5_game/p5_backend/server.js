var express = require("express");

var app = express();
var server = app.listen(3000);

app.use(express.static('../p5_frontend/src'));

console.log("my server is running");

var socket = require('socket.io');

var io = socket(server);

var players = new Map();
var xCoordinates;
var xCoordinatesUsed = [];
var items = [];


io.sockets.on('connection', newConnection);

function newConnection(socket) {
    console.log("New connection: " + socket.id);

    if (players.size > 0) {
        players.forEach((values, keys) => {
            let data = {
                id: values.id
            }
            socket.emit('newPlayer', data);
        })
    }

    socket.on('newPlayer', createPlayer);
    socket.on('update', updatePosition);
    socket.on('updateDirection',updateDirection);
    socket.on('deleteItem',deleteItem);
    socket.on('xCoordinates',function(data) {
        xCoordinates = data;
    })

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
    }

    function deleteItem(data) {
        items.forEach(i => {
            if(i == data.id) {
                items.splice(items.indexOf(i),1);
                xCoordinatesUsed.splice(xCoordinatesUsed.indexOf(data.x), 1);
                socket.broadcast.emit('deleteItem',data);
            }
        });
    }
}

setInterval(() => {
    if(players.size>0) {
       let x = getItemSpawnPoint();
       let data = {
           id: Date.now(),
           x : x,
           num : getRandomInt(5)
       }
       items.push(data.id);
       io.emit('spawnItem',data);
    }
}, 10000);

function getItemSpawnPoint() {
    if (items.length < xCoordinates.length) {
        xCoordinate = xCoordinates[Math.floor(Math.random() * xCoordinates.length)];
        while (xCoordinatesUsed.includes(xCoordinate)) {
            xCoordinate = xCoordinates[Math.floor(Math.random() * xCoordinates.length)];
        }
        xCoordinatesUsed.push(xCoordinate);
        return xCoordinate;
    }
}

function getRandomInt(num) {
    return Math.floor(Math.random() * num + 1);
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