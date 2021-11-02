let spawnTimer = 3;
let youAreDead = false;
let gameOver;
let alivePlayerCount = 0;
function deathCheck() {
    if (myPlayer.sprite.position.y > windowHeight) {
        if(myPlayer.item != undefined && myPlayer.item.sprite != undefined) {
            myPlayer.item.sprite = undefined;
        }
        if (frameCount % 60 == 0 && spawnTimer > 0) { // if the frameCount is divisible by 60, then a second has passed. it will stop at 0
            spawnTimer--;
        } 
        if(spawnTimer==0) {
            deathUpdate();
            let data = {
                deadPlayer: myPlayer.id,
                damagedBy : myPlayer.damagedBy
            }
            if(myPlayer.damagedBy != null && myPlayer.damagedBy != socket.id) {
                socket.emit("kill",data);
            }
            socket.emit("death",data);
            if(myPlayer.death<3) {
                myPlayer.sprite.position.x = xCoordinates[Math.floor(Math.random() * xCoordinates.length)];
                myPlayer.sprite.position.y = 0;
                spawnTimer = 3;
            }
        }
    }
    
}

function someoneDied(data) {
    console.log(data.id + "died");
    players[data.id].sprite.remove();
    if(data.id == myPlayer.id) {
        youAreDead = true;
        myPlayer.sprite.remove();
        alert("You died!");
        myPlayer.sprite.remove();
        stop();
    }
}

function win(data) {
    if(myPlayer.id != data) {
        alert("You won!");
    }
}

function deathUpdate() {
    myPlayer.dmgDealt = 0;
    myPlayer.kills= 0;
    myPlayer.knockback = 1;
    myPlayer.death++;
}