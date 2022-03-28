var express = require("express");
var app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http, {
    cors: {
        origin: '*',
    }
});

const path = require('path');

app.use(express.static(path.join(__dirname, '/../p5_frontend/src')));
app.get("/:gameId/", (req,res) => res.sendFile(path.join(__dirname, '/../p5_frontend/src/index.html')));


/*app.get('/', (req, res) => {
    res.send('Hello World');
  }); */

//var server = app.listen(PORT);
http.listen(3000);


//var kiServer = app.listen(3001);

console.log("my server is running");


var players = new Map();
var xCoordinates = [];
var xCoordinatesUsed = [];
var items = [];


io.sockets.on('connection', newConnection);

function newConnection(socket) {
    console.log("New connection: " + socket.id);

    function sendPlayers() {
        if (players.size > 0) {
            players.forEach((values, keys) => {
                let data = {
                    id: values.id,
                }
                if(values.id!=socket.id) {
                    socket.emit('newPlayer', data);
                }
            })
        }
    }
  

    socket.on('disconnect', function () {
        console.log('user disconnected: ' + socket.id);
        players.delete(socket.id);
        console.log(players);
        socket.broadcast.emit("deletePlayer", socket.id);
        if (players.size < 1) {
            xCoordinates = [];
            xCoordinatesUsed = [];
            items = [];
        }
    });
    socket.on('newPlayer', createPlayer);
    socket.on('getPlayers',sendPlayers);
    socket.on('update', updatePosition);
    socket.on('updateDirection', updateDirection);
    socket.on('deleteItem', deleteItem);
    socket.on('attack', syncAttacks);
    socket.on('kill', kill);
    socket.on('deleteAttack', deleteAttack);
    socket.on('death', death);
    socket.on('xCoordinates', function (data) {
        xCoordinates = data;
    })
    //for KI
    /*
    socket.on('visCopy', sendVisCopy);
*/

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
        if (players.get(socket.id) != undefined) {
            if (data == "left") {
                dataWithId.direction = "left";
                players.get(socket.id).direction = "left";
                socket.broadcast.emit('updateDirection', dataWithId);
            } else if (data == "right") {
                dataWithId.direction = "right";
                if (players.get(socket.id) == undefined) {
                    console.log(players + socket.id);
                }
                players.get(socket.id).direction = "right";
                socket.broadcast.emit('updateDirection', dataWithId);
            }
        }
    }

    function createPlayer() {
        if(!players.has(socket.id)) {
            players.set(socket.id, new Player(socket.id));
            let data = {
                id: socket.id,
            }
            // damit es auch an mich sendet, benutze ich io.emit
            io.emit('newPlayer', data);
        }
    }

    function deleteItem(data) {
        items.forEach(i => {
            if (i == data.id) {
                items.splice(items.indexOf(i), 1);
                xCoordinatesUsed.splice(xCoordinatesUsed.indexOf(data.x), 1);
                socket.broadcast.emit('deleteItem', data);
            }
        });
        console.log(items.length);
    }

    function syncAttacks(data) {
        socket.broadcast.emit('attack', data);
    }

    function deleteAttack(data) {
        players.get(socket.id).knockback += 1;
        console.log(players.get(socket.id));
        console.log(players);
        socket.broadcast.emit("deleteAttack", data);
    }

    function death(data) {
        if (players.get(data.deadPlayer) != undefined) {
            players.get(data.deadPlayer).death++;
            if (players.get(data.deadPlayer).death >= 3) {
                players.delete(data.deadPlayer);
                let transferData = {
                    id: data.deadPlayer
                }
                io.emit('death', transferData);
                socket.disconnect();
            }
            if (players.size <= 1) {
                socket.broadcast.emit("win", data.deadPlayer);
            }
        }
    }

    function kill(data) {
        io.to(data.damagedBy).emit('kill', 1);
        // player could leave before getting the kill
        if (players.get(data.damagedBy) != undefined) {
            players.get(data.damagedBy).kill += 1;
        }

    }

}

setInterval(() => {
    if (players.size > 0) {
        let x = getItemSpawnPoint();
        let data = {
            id: Date.now(),
            x: x,
            num: getRandomInt(5)
        }
        // too many items on the field
        if (x != -1) {
            items.push(data.id);
        }
        io.emit('spawnItem', data);
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
    } else {
        return -1;
    }
}



function getRandomInt(num) {
    return Math.floor(Math.random() * num + 1);
}

class Player {
    constructor(id) {
        this.id = id;
        this.knockback = 1;
        this.death = 0;
        this.item = [];
        this.direction = "";
        this.kill = 0;
    }
}

//// FOR KI
/*
var idTable = new Map();
const io2 = require('socket.io')(kiServer, {
    cors: {
        origin: '*',
    }
});

io2.sockets.on("connection", function (socket) {
    console.log("moin");

    socket.on("clientId", function (clientId) {
        idTable.set(socket.id, clientId);
    })

    socket.on("disconnect", function () {
        idTable.delete(socket.id);
    })

})

function sendVisCopy(data) {
    idTable.forEach((value, key) => {
        if (data.id == value) {
            io2.to(key).emit('visCopyToPython', data.visCopy);
        }
    })
} */
