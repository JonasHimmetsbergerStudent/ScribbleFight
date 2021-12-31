let spawnTimer = 3;
let youAreDead = false;
let gameOver;
let alivePlayerCount = 0;
function deathCheck() {
    if (myPlayer.sprite.position.y > windowHeight) {
        youDied();
    }
}

function resetPlayer() {
    myPlayer.sprite.position.x = xCoordinates[Math.floor(Math.random() * xCoordinates.length)];
    myPlayer.sprite.position.y = 0;
}

function youDied() {
    if (myPlayer.item != undefined && myPlayer.item.sprite != undefined) {
        myPlayer.item.sprite = undefined;
        myPlayer.item = undefined;
    }
    if (frameCount % 60 == 0 && spawnTimer > 0) { // if the frameCount is divisible by 60, then a second has passed. it will stop at 0
        spawnTimer--;
    }
    if (spawnTimer == 0) {
       // deathUpdate();
       myPlayer.death++;
        let data = {
            deadPlayer: myPlayer.id,
            damagedBy: myPlayer.damagedBy
        }
        if (myPlayer.damagedBy != null && myPlayer.damagedBy != socket.id) {
            socket.emit("kill", data);
        }
       socket.emit("death", data);
        
        if (myPlayer.death < 3) {
            myPlayer.sprite.position.x = xCoordinates[Math.floor(Math.random() * xCoordinates.length)];
            myPlayer.sprite.position.y = 0;
            spawnTimer = 3;
        } 
    }
}

function someoneDied(data) {
    players[data.id].sprite.remove();
    if (data.id == myPlayer.id) {
        youAreDead = true;
        myPlayer.sprite.remove();
        alert("You died!\nYour kills: " + myPlayer.kills + "\n" + "Your damage: " + myPlayer.dmgDealt + "\n" + "Your knockback: " + myPlayer.knockback   );
        stop();
    } 
}

function fatalHit() {
    if (myPlayer.knockback >= 100) {
        youDied();
    }
}

function win(data) {
    if (myPlayer.id != data) {
        alert("You won!\nYour kills: " + myPlayer.kills + "\n" + "Your damage: " + myPlayer.dmgDealt + "\n" + "Your knockback: " + myPlayer.knockback + "\n" + "Your deaths: " + myPlayer.death);
    }
}

function deathUpdate() {
    myPlayer.dmgDealt = 0;
    myPlayer.kills = 0;
    myPlayer.knockback = 1;
    myPlayer.death++;
}