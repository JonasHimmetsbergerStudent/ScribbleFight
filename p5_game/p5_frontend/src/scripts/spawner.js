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
    // scaling
    let x = relCoordinates(data.x, 0).x;
    let y = (windowHeight - newImageHeight) / 2;
    let itemSize = 2 * pixelWidth;
    if (x != -1) {
        switch (num) {
            case 1:
                i = createSprite(x, y, itemSize, itemSize);
                i.type = "bomb";
                itemImg.resize(itemSize, itemSize);
                i.addImage(itemImg);
                break;
            case 2:
                i = createSprite(x, y, itemSize, itemSize);
                i.type = "black_hole";
                i.addImage(itemImgBlue);
                itemImgBlue.resize(itemSize, itemSize);
                break;
            case 3:
                i = createSprite(x, y, itemSize, itemSize);
                i.type = "piano";
                i.addImage(itemImgYellow);
                itemImgYellow.resize(itemSize, itemSize);
                break;
            case 4:
                i = createSprite(x, y, itemSize, itemSize);
                i.type = "mine";
                i.addImage(itemImgOrange);
                itemImgOrange.resize(itemSize, itemSize);
                break;
            case 5:
                i = createSprite(x, y, itemSize, itemSize);
                i.type = "small";
                i.addImage(itemImgGreen);
                itemImgGreen.resize(itemSize, itemSize);
                break;
        }
        i.maxSpeed = pixelWidth / 2;
        i.setDefaultCollider();
        i.debug = true;
        i.id = data.id;
        i.dropped = false;
        items.push(i);
    }


}

let itemString;
function itemPickUp() {
    if (items.length > 0) {
        items.forEach(item => {

            switch (item.type) {
                case "bomb":
                    itemString = "bomb";
                   // addSpriteToVisual(item, 6);
                    break;
                case "black_hole":
                    itemString = "black_hole";
                    //addSpriteToVisual(item, 7);
                    break;
                case "piano":
                    itemString = "piano";
                    //addSpriteToVisual(item, 10);
                    break;
                case "mine":
                    itemString = "mine";
                    //addSpriteToVisual(item, 9);
                    break;
                case "small":
                    itemString = "small";
                    //addSpriteToVisual(item, 8);
                    break;
            }


            if(item.collide(environment)) {
                item.dropped = true;
            };
            if(!item.dropped) {
                item.velocity.y -= GRAVITY;
            }

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
    let transferXCoordinates = [];
    for (let i = 0; i < sprite_pixels.length; i++) {
        for (let j = 0; j < sprite_pixels[i].length; j++) {
            sprite = sprite_pixels[i][j];

            if (sprite !== undefined && sprite.width >= pixelWidth * 4) {
                for (let index = 0; index < sprite.width / 2; index += pixelWidth * 2) {
                    if (sprite.position.x + index < sprite.position.x + sprite.width / 2) {
                        let x = sprite.position.x + index;
                        xCoordinates.push(x);
                        transferXCoordinates.push(makeCordsRelative(x, 0).x);
                    }
                }
                for (let index = sprite.width; index > sprite.width / 2; index -= pixelWidth * 2) {
                    if (sprite.position.x + index > sprite.position.x + sprite.width / 2) {
                        let x = sprite.position.x + index - sprite.width;
                        xCoordinates.push(x);
                        transferXCoordinates.push(makeCordsRelative(x, 0).x);
                    }
                }
                // doing this eliminates duplicates
                xCoordinates = Array.from(new Set(xCoordinates));
                transferXCoordinates = Array.from(new Set(transferXCoordinates));
            }
        }
    }
    console.log(xCoordinates);
    socket.emit('xCoordinates', transferXCoordinates);
}
