// it takes 10 seconds for a new item to spawn
var timer = 15;
var spawning;
var xCoordinates = [];
var xCoordinatesUsed = [];
var items = [];
var x;
var i;


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
            i = createSprite(x, 0, 50, 50);
            i.addImage(itemImg);
            items.push(i);
            xCoordinatesUsed.push(x);
        }
    }
   itemPickUp();
}

function itemPickUp() {
    if (items.length > 0) {
        items.forEach(item => {
            if (item.velocity.y <= 10) {
                item.velocity.y -= GRAVITY;
            }
            item.collide(environment);
            if(item.overlapPixel(player.sprite.position.x + player_width / 2 ,player.sprite.position.y)
            || item.overlapPixel(player.sprite.position.x - player_width / 2 ,player.sprite.position.y)
            || item.overlapPixel(player.sprite.position.x,player.sprite.position.y + player_height / 2)
            || item.overlapPixel(player.sprite.position.x,player.sprite.position.y - player_height / 2)) {
                player.item = new Item("bomb");
                items.splice(items.indexOf(item),1);
                xCoordinatesUsed.splice(xCoordinatesUsed.indexOf(item.position.x),1);
                item.remove();
            }
        });

    }
 
}

function getRandomInt(num) {
    return Math.floor(Math.random() * num + 1);
}

function getXCoordinates() {
    let sprite;
    for (let i = 0; i < sprite_pixels.length; i++) {
        for (let j = 0; j < sprite_pixels[i].length; j++) {
            sprite = sprite_pixels[i][j];
            if (sprite !== undefined && sprite.width >= 100) {
                    for (let index = 0; index < sprite.width / 2; index+=50) {
                        if(sprite.position.x + index < sprite.position.x + sprite.width/2) {
                            xCoordinates.push((sprite.position.x + index));                        
                        }
                    }
                    for (let index = sprite.width; index > sprite.width / 2; index-=50) {
                        if(sprite.position.x + index > sprite.position.x + sprite.width/2) {
                            xCoordinates.push((sprite.position.x + index-sprite.width));                        
                        }
                    }
                   
                  
                   
                // doing this eliminates duplicates
                xCoordinates = Array.from(new Set(xCoordinates));
                console.log(xCoordinates);
            }
        }
    }
}
