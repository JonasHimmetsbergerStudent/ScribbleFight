
function addAttack(data) {
    switch (data.type) {
        case "default": addDefaultAttack(data);
            break;
        case "bomb": addBomb(data);
            break;
        case "blackHole": addBlackHole(data);
            break;
        case "piano": addPiano(data);
            break;
        case "mine": addMine(data);
            break;
        case "small": addSmall(data);
            break;
    }
}

function deleteAttack(data) {
    switch (data.type) {
        case "default":
            projectiles.forEach(p => {
                if (p.id === data.id) {
                    p.remove();
                    projectiles.splice(projectiles.indexOf(p), 1);
                    if (p.playerId == socket.id) {
                        myPlayer.dmgDealt += 1;
                    }
                }
            });
            break;
        case "bomb":
            bombs.forEach(b => {
                if (b.id === data.id) {
                    b.remove();
                    bombs.splice(bombs.indexOf(b), 1);
                    if (b.playerId == socket.id) {
                        myPlayer.item["bomb"].sprite = undefined;
                        ammoCheck("bomb");
                        myPlayer.dmgDealt += 1;
                    }
                }
            });
            break;
        case "piano":
            pianos.forEach(p => {
                if (p.id == data.id) {
                    p.remove();
                    pianos.splice(pianos.indexOf(p), 1);
                    if (p.playerId == socket.id) {
                        myPlayer.item["piano"].sprite = undefined;
                        ammoCheck("piano");
                        myPlayer.dmgDealt += 1;
                    }
                }
            });
            break;
        case "mine":
            mines.forEach(m => {
                if (m.id == data.id) {
                    m.remove();
                    mines.splice(mines.indexOf(m), 1);
                    if (m.playerId == socket.id) {
                        myPlayer.dmgDealt += 1;
                    }
                }
            });
            break;
        case "small":
            players[data.playerId].sprite.addImage(amogus);
            players[data.playerId].sprite.scale = 1;
            break;
    }
}

function relCoordinates(x,y) {
    return data = {
        x: x * newImageWidth / obildbreite + (windowWidth - newImageWidth) / 2,
        y: y * newImageHeight / obildhoehe + (windowHeight - newImageHeight) / 2
    }
}


function addBomb(data) {
    let bomb = createSprite(relCoordinates(data.x,data.y).x, relCoordinates(data.x,data.y).y, pixelWidth * 2, pixelWidth * 2);
    bomb.velocity.x = pixelWidth/5 * data.vel;
    bomb.addImage(bombImg);
    bomb.life = 1000;
    bomb.setDefaultCollider();
    bomb.me = false;
    bomb.id = data.id;
    bomb.playerId = data.playerId;
    bombs.push(bomb);
}

function addDefaultAttack(data) {
    projectile = createSprite(relCoordinates(data.x,data.y).x, relCoordinates(data.x,data.y).y, pixelWidth, pixelWidth);
    projectile.life = 100;
    projectile.velocity.x = data.velX * 1000;
    projectile.velocity.y = data.velY * 1000;
    projectile.limitSpeed(pixelWidth - pixelWidth/2);
    projectile.setDefaultCollider();
    projectile.id = data.id;
    projectile.playerId = data.playerId;
    if(data.playerId == myPlayer.id) {
        projectile.me = true;
    } else {
        projectile.me = false;
    }
    projectiles.push(projectile);
}

function addBlackHole(data) {
    let b = createSprite(relCoordinates(data.x,data.y).x, relCoordinates(data.x,data.y).y, pixelWidth * 2, pixelWidth * 2);
    b.velocity.x =  pixelWidth / 5 * data.vel;
    b.addImage(boogieBombImg);
    b.life = 300;
    b.setDefaultCollider();
    b.debug = true;
    b.me = false;
    blackHoles.push(b);
}


function addPiano(data) {
    let piano = createSprite(relCoordinates(data.x,data.y).x, 0, pixelWidth * 5, pixelWidth * 5);
    piano.addImage(pianoImg);
    piano.rotation = data.rotation;
    piano.setCollider("rectangle", 0, 0, pixelWidth*5, pixelWidth*5);
    piano.id = data.id;
    piano.playerId = data.playerId;
    piano.maxSpeed = pixelWidth - pixelWidth / 5;
    pianos.push(piano);
}

function addMine(data) {
    let mine = createSprite(relCoordinates(data.x,data.y).x, relCoordinates(data.x,data.y).y, pixelWidth * 2, pixelWidth * 2);
    mine.addImage(mineImg);
    mine.setDefaultCollider();
    mine.maxSpeed = pixelWidth / 5;
    //mine.debug = true;
    mine.me = false;
    mine.playerId = data.playerId;
    mines.push(mine);
}

function addSmall(data) {
    players[data.playerId].sprite.addImage(amogus_supreme);
    players[data.playerId].sprite.scale = 0.6;
}