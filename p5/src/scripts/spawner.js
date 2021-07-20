// it takes 20 seconds for a new item to spawn
var timer = 20;
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
        timer = 20;
    }
    if (spawning) {
        if(items.length < xCoordinates.length) {        
            x = xCoordinates[Math.floor(Math.random() * xCoordinates.length)]; 
           while(xCoordinatesUsed.includes(x)) {
                x = xCoordinates[Math.floor(Math.random() * xCoordinates.length)];
            } 
            items.push(createSprite(x, 0, 25, 25));
            xCoordinatesUsed.push(x);
        }
    }
    if (items.length > 0) {
        items.forEach(item => {
            if (item.velocity.y <= 20) {
                item.velocity.y -= GRAVITY;
            }
            item.collide(environment);
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
    console.log(xCoordinates);
}
