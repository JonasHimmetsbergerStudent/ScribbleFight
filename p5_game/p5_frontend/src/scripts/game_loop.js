let spawnTimer = 3;
let youAreDead = false;
let gameOver;
let alivePlayerCount = 0;
function deathCheck() {
    if (players[socket.id].sprite.position.x > windowWidth || players[socket.id].sprite.position.y > windowHeight) {
        if(players[socket.id].item != undefined && players[socket.id].item.sprite != undefined) {
            players[socket.id].item.sprite = undefined;
        }
        if (frameCount % 60 == 0 && spawnTimer > 0) { // if the frameCount is divisible by 60, then a second has passed. it will stop at 0
            spawnTimer--;
        } 
        if(spawnTimer==0) {
            players[socket.id].death++;
            cookieArrDeathUpdate();
            console.log(players[socket.id].damagedBy);
            let data = {
                damagedBy : players[socket.id].damagedBy,
            }
            if(players[socket.id].damagedBy != null && players[socket.id].damagedBy != socket.id) {
                socket.emit("kill",data);
            }
            players[socket.id].sprite.position.x = xCoordinates[Math.floor(Math.random() * xCoordinates.length)];
            players[socket.id].sprite.position.y = 0;
            spawnTimer = 3;
        }
    }
    if(players[socket.id].death==3){
        youAreDead = true;
        alert("You died!");
        players[socket.id].sprite.remove();
        if(alivePlayerCount<=1) {
            gameOver = true;
            noLoop();
        }
    }
    
}

function cookieArrDeathUpdate() {
    cookieArr["dmgDone"] = 0;
    cookieArr["kills"] = 0;
    cookieArr["knockback"] = 1;
    cookieArr["death"]++;
}