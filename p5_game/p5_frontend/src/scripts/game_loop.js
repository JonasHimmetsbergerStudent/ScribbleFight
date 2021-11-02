let spawnTimer = 3;
let youAreDead = false;
let gameOver;
let alivePlayerCount = 0;
function deathCheck() {
    if (myPlayer.sprite.position.x > newImageWidth || myPlayer.sprite.position.y > newImageHeight) {
        if(myPlayer.item != undefined && myPlayer.item.sprite != undefined) {
            myPlayer.item.sprite = undefined;
        }
        if (frameCount % 60 == 0 && spawnTimer > 0) { // if the frameCount is divisible by 60, then a second has passed. it will stop at 0
            spawnTimer--;
        } 
        if(spawnTimer==0) {
            myPlayer.death++;
            deathUpdate();
            let data = {
                damagedBy : myPlayer.damagedBy,
            }
            if(myPlayer.damagedBy != null && myPlayer.damagedBy != socket.id) {
                socket.emit("kill",data);
            }
            myPlayer.sprite.position.x = xCoordinates[Math.floor(Math.random() * xCoordinates.length)];
            myPlayer.sprite.position.y = 0;
            spawnTimer = 3;
        }
    }
    if(myPlayer.death==3){
        youAreDead = true;
        alert("You died!");
        myPlayer.sprite.remove();
        if(alivePlayerCount<=1) {
            gameOver = true;
            noLoop();
        }
    }
    
}

function deathUpdate() {
    myPlayer.dmgDealt = 0;
    myPlayer.kills= 0;
    myPlayer.knockback = 1;
    myPlayer.death++;
}