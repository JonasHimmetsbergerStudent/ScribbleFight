let spawnTimer = 3;
let youAreDead = false;
let gameOver;
let alivePlayerCount = 0;
function deathCheck() {
    if (player.sprite.position.x > screenWidth || player.sprite.position.y > screenHeight) {
        if(player.item != undefined && player.item.sprite != undefined) {
            player.item.sprite = undefined;
        }
        if (frameCount % 60 == 0 && spawnTimer > 0) { // if the frameCount is divisible by 60, then a second has passed. it will stop at 0
            spawnTimer--;
        } 
        if(spawnTimer==0) {
            player.life--;
            console.log("now");
            player.sprite.position.x = xCoordinates[Math.floor(Math.random() * xCoordinates.length)];
            player.sprite.position.y = 10;
            spawnTimer = 3;
        }
    }
    if(player.life==0){
        youAreDead = true;
        alert("You died!");
        player.sprite.remove();
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