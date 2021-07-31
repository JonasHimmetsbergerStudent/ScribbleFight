// it takes 15 seconds for a new item to spawn
var timer = 15;
var spawning;
var xCoordinates = [];
var xCoordinatesUsed = [];
var items = [];
var xCoordinate;
var i;
var gameStart = true;
var num;


function spawn() {
    if (gameStart) {
        timer = 3;
        gameStart = false;
    }
    spawning = false;
    if (frameCount % 60 == 0 && timer > 0) { // if the frameCount is divisible by 60, then a second has passed. it will stop at 0
        timer--;
    }
    if (timer == 0) {
        spawning = true;
        timer = 15;
    }
    if (spawning) {
        if (items.length < xCoordinates.length) {
            xCoordinate = xCoordinates[Math.floor(Math.random() * xCoordinates.length)];
            while (xCoordinatesUsed.includes(xCoordinate)) {
                xCoordinate = xCoordinates[Math.floor(Math.random() * xCoordinates.length)];
            }
            createItem(xCoordinate);
            xCoordinatesUsed.push(xCoordinate);
        }
    }
    itemPickUp();
}


function createItem(x) {
    num = getRandomInt(4);
    num = 4;
    switch (num) {
        case 1:
            i = createSprite(x, 0, 50, 50);
            i.type = "bomb";
            i.addImage(itemImg);
            break;
        case 2:
            i = createSprite(x, 0, 50, 50);
            i.type = "black_hole";
            i.addImage(itemImgBlue);
            break;
        case 3:
            i = createSprite(x, 0, 50, 50);
            i.type = "piano";
            i.addImage(itemImgYellow);
            break;
        case 4:
            i = createSprite(x, 0, 50, 50);
            i.type = "mine";
            i.addImage(itemImgOrange);
            break;
    }
    i.maxSpeed = 10;
    items.push(i);
}

function itemPickUp() {
    if (items.length > 0) {
        items.forEach(item => {
            item.velocity.y -= GRAVITY;
            item.collide(environment);
            if (item.overlap(player.sprite)) {
                switch (item.type) {
                    case "bomb":
                        player.item["bomb"] = new Item("bomb");
                        break;
                    case "black_hole":
                        player.item["black_hole"] = new Item("black_hole");
                        break;
                    case "piano":
                        player.item["piano"] = new Item("piano");
                        break;
                    case "mine":
                        player.item["mine"] = new Item("mine");
                        break;
                }
                items.splice(items.indexOf(item), 1);
                xCoordinatesUsed.splice(xCoordinatesUsed.indexOf(item.position.x), 1);
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
                for (let index = 0; index < sprite.width / 2; index += 50) {
                    if (sprite.position.x + index < sprite.position.x + sprite.width / 2) {
                        xCoordinates.push((sprite.position.x + index));
                    }
                }
                for (let index = sprite.width; index > sprite.width / 2; index -= 50) {
                    if (sprite.position.x + index > sprite.position.x + sprite.width / 2) {
                        xCoordinates.push((sprite.position.x + index - sprite.width));
                    }
                }
                // doing this eliminates duplicates
                xCoordinates = Array.from(new Set(xCoordinates));
            }
        }
    }
}
