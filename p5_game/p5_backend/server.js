var express = require("express");

var app = express();
var server = app.listen(3000);

app.use(express.static('../p5_frontend/src'));

console.log("my server is running");

var socket = require('socket.io');

var io = socket(server);

io.sockets.on('connection',newConnection);

function newConnection(socket) {
    console.log("New connection: " + socket.id);

socket.on('update',updatePosition);

function updatePosition(data) {
    socket.broadcast.emit('update',data);
}

}