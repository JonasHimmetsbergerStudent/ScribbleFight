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
            players[socket.id].life--;
            players[socket.id].sprite.position.x = xCoordinates[Math.floor(Math.random() * xCoordinates.length)];
            players[socket.id].sprite.position.y = 10;
            spawnTimer = 3;
        }
    }
    if(players[socket.id].life==0){
        youAreDead = true;
        alert("You died!");
        players[socket.id].sprite.remove();
        otherPlayers.forEach(p => {
            if(p.life>0) {
               alivePlayerCount++;
            }
        });
        if(alivePlayerCount<=1) {
            gameOver = true;
            noLoop();
        }
    }
    
}