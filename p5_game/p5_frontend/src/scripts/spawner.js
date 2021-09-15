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
    /* if (gameStart) {
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
     } */
    itemPickUp();
}


function createItem(data) {
    let num = data.num;
    let x = data.x;
    num = 5;
    if (x != -1) {
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
            case 5:
                i = createSprite(x, 0, 50, 50);
                i.type = "small";
                i.addImage(itemImgGreen);
                break;
        }
        i.maxSpeed = 10;
        i.id = data.id;
        console.log(items);
        items.push(i);
    }


}

function itemPickUp() {
    if (items.length > 0) {
        items.forEach(item => {
            item.velocity.y -= GRAVITY;
            item.collide(environment);
            if (item.overlap(players[socket.id].sprite)) {
                switch (item.type) {
                    case "bomb":
                        players[socket.id].item["bomb"] = new Item("bomb");
                        break;
                    case "black_hole":
                        players[socket.id].item["black_hole"] = new Item("black_hole");
                        break;
                    case "piano":
                        players[socket.id].item["piano"] = new Item("piano");
                        break;
                    case "mine":
                        players[socket.id].item["mine"] = new Item("mine");
                        break;
                    case "small":
                        players[socket.id].item["small"] = new Item("small");
                        break;
                }
                deleteItem(item);
            }
        });

    }

}

function deleteItem(item) {
    // sending the whole item object, including the sprite, would be unnecessary
    let data = {
        id: item.id,
        x: item.position.x,
        index: items.indexOf(item)
    }
    items.splice(items.indexOf(item), 1);
    item.remove();
    socket.emit('deleteItem', data);
}

function syncItems(data) {
    items[data.index].remove();
    items.splice(items.indexOf(items[data.index]), 1);
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
    console.log(xCoordinates);
    socket.emit('xCoordinates', xCoordinates);
}
