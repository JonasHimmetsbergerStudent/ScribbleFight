let spawnTimer = 3;
let youAreDead = false;
let gameOver;
let alivePlayerCount = 0;
let respawnTime = false;
function deathCheck() {
    if ((myPlayer.sprite.position.y - player_height / 2) > windowHeight + pixelWidth * 15 && !respawnTime) {
        youDied();
       // resetPlayer();
    }
}

function resetPlayer() {
    myPlayer.sprite.position.x = xCoordinates[Math.floor(Math.random() * xCoordinates.length)];
    myPlayer.sprite.position.y = 0;
}

function youDied() {
    progressBar.width = 0;
    if (myPlayer.item != undefined && myPlayer.item.sprite != undefined) {
        myPlayer.item.sprite = undefined;
        myPlayer.item = undefined;
    }

    deathUpdate();
    respawnTime = true;
    let data = {
        deadPlayer: myPlayer.id,
        damagedBy: myPlayer.damagedBy
    }
    if (myPlayer.damagedBy != null && myPlayer.damagedBy != socket.id) {
        socket.emit("kill", data);
    }
    socket.emit("death", data);

    setTimeout(() => {
        if (myPlayer.death < 3) {
            myPlayer.sprite.position.x = xCoordinates[Math.floor(Math.random() * xCoordinates.length)];
            myPlayer.sprite.position.y = 0;
            respawnTime = false;
            myPlayer.visible = false;
        }
    }, 3000);
}

function someoneDied(data) {
    players[data.id].sprite.remove();
    if (data.id == myPlayer.id) {
        youAreDead = true;
        myPlayer.sprite.remove();
        alert("You died!\nYour kills: " + myPlayer.kills + "\n" + "Your damage: " + myPlayer.dmgDealt + "\n" + "Your knockback: " + myPlayer.knockback);
        noLoop();
    }
}

function fatalHit() {
    updateUI();
    if (myPlayer.knockback > MAX_KNOCKBACK) {
        myPlayer.sprite.position.y = -10000;
        youDied();
    }
}

function win(data) {
    if (myPlayer.id != data) {
        alert("You won!\nYour kills: " + myPlayer.kills + "\n" + "Your damage: " + myPlayer.dmgDealt + "\n" + "Your knockback: " + myPlayer.knockback + "\n" + "Your deaths: " + myPlayer.death);
    }
}

function deathUpdate() {
    // myPlayer.dmgDealt = 0;
    //myPlayer.kills = 0;
    myPlayer.knockback = 1;
    myPlayer.death++;
}