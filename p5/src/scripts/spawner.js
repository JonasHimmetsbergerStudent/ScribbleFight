// it takes 10 seconds for a new item to spawn
var timer = 5;
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
        timer = 5;
    }
    if (spawning) {
        if(items.length < xCoordinates.length) {        
            x = xCoordinates[Math.floor(Math.random() * xCoordinates.length)]; 
           while(xCoordinatesUsed.includes(x)) {
                x = xCoordinates[Math.floor(Math.random() * xCoordinates.length)];
            } 
            i = createSprite(x, 0, 50, 50);
            i.addImage(itemImg);
            console.log(i.position.x);
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
                console.log(items);
                console.log(xCoordinatesUsed);
                item.remove();
                
            }
        });

    }
 
}

function getRandomInt(num) {
    return Math.floor(Math.random() * num + 1);
}

function removeA(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
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
