// it takes 10 seconds for a new item to spawn
var timer = 10;
var spawning;
var xCoordinates = [];
var xCoordinatesUsed = [];
var items = [];
var x;

function spawn() {
    spawning = false;
    if (frameCount % 60 == 0 && timer > 0) { // if the frameCount is divisible by 60, then a second has passed. it will stop at 0
        timer--;
    }
    if (timer == 0) {
        spawning = true;
        timer = 10;
    }
    if (spawning) {
        if(items.length < xCoordinates.length) {        
            x = xCoordinates[Math.floor(Math.random() * xCoordinates.length)]; 
           while(xCoordinatesUsed.includes(x)) {
                x = xCoordinates[Math.floor(Math.random() * xCoordinates.length)];
            } 
            items.push(createSprite(x, 0, 50, 50));
            xCoordinatesUsed.push(x);
            if(xCoordinatesUsed.length == xCoordinates.length && xCoordinatesUsed.length != items.length) {
                xCoordinatesUsed = [];
            }
        }
    }
    if (items.length > 0) {
        items.forEach(item => {
            i = items.indexOf(items);
            item.addImage(itemImg);
            if (item.velocity.y <= 20) {
                item.velocity.y -= GRAVITY;
            }
            item.collide(environment);
            if(item.collide(player.sprite)) {
                player.item = new Item("bomb");
                item.remove();
                items.splice(i,1);
            }
        });

    }

}

function getRandomInt(num) {
    return Math.floor(Math.random() * num + 1);
}

function getXCoordinates() {
    for (let i = 0; i < sprite_pixels.length; i++) {
        for (let j = 0; j < sprite_pixels[i].length; j++) {
            if (sprite_pixels[i][j] !== undefined && sprite_pixels[i][j].overlapPoint(sprite_pixels[i][j].position.x - 25, sprite_pixels[i][j].position.y)) {
                xCoordinates.push(j * 25 - sprite_pixels[i][j].width / 2);
                // doing this eliminates duplicates
                xCoordinates = Array.from(new Set(xCoordinates));
            }
        }
    }
}
