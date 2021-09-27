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
    let itemSize = 3 * pixelWidth;
    if (x != -1) {
        switch (num) {
            case 1:
                i = createSprite(x, 0, itemSize, itemSize);
                i.type = "bomb";
                itemImg.resize(itemSize,itemSize);
                i.addImage(itemImg);
                
                break;
            case 2:
                i = createSprite(x, 0, itemSize, itemSize);
                i.type = "black_hole";
                i.addImage(itemImgBlue);
                itemImgBlue.resize(itemSize,itemSize);
                break;
            case 3:
                i = createSprite(x, 0, itemSize, itemSize);
                i.type = "piano";
                i.addImage(itemImgYellow);
                itemImgYellow.resize(itemSize,itemSize);
                break;
            case 4:
                i = createSprite(x, 0, itemSize, itemSize);
                i.type = "mine";
                i.addImage(itemImgOrange);
                itemImgOrange.resize(itemSize,itemSize);
                break;
            case 5:
                i = createSprite(x, 0, itemSize, itemSize);
                i.type = "small";
                i.addImage(itemImgGreen);
                itemImgGreen.resize(itemSize,itemSize);
                break;
        }
        i.maxSpeed = 10;
        i.setDefaultCollider();
        i.id = data.id;
        console.log(items);
        items.push(i);
    }


}

let itemString;
function itemPickUp() {
    if (items.length > 0) {
        items.forEach(item => {
            item.velocity.y -= GRAVITY;
            
            switch (item.type) {
                case "bomb":
                    itemString = "bomb";
                    addSpriteToVisual(item, 6);
                    break;
                case "black_hole":
                    itemString = "black_hole";
                    addSpriteToVisual(item, 7);
                    break;
                case "piano":
                    itemString = "piano";
                    addSpriteToVisual(item, 10);
                    break;
                case "mine":
                    itemString = "mine";
                    addSpriteToVisual(item, 9);
                    break;
                case "small":
                    itemString = "small";
                    addSpriteToVisual(item, 8);
                    break;
            }
            item.collide(environment);
            if (item.overlap(myPlayer.sprite)) {
                myPlayer.item[itemString] = new Item(itemString);
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
