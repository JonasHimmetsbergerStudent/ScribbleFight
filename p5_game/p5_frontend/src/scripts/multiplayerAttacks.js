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

function addBomb(data) {
    let bomb = createSprite(data.x, data.y, pixelWidth * 2, pixelWidth * 2);
    bomb.velocity.x = data.v;
    bomb.addImage(bombImg);
    bomb.life = 1000;
    bomb.setDefaultCollider();
    bomb.me = false;
    bomb.id = data.id;
    bomb.playerId = data.playerId;
    bombs.push(bomb);
}

function addDefaultAttack(data) {
    projectile = createSprite(data.x, data.y, pixelWidth, pixelWidth);
    projectile.life = 100;
    projectile.velocity.x = data.velX;
    projectile.velocity.y = data.velY;
    projectile.limitSpeed(pixelWidth - pixelWidth/5);
    projectile.setDefaultCollider();
    projectile.id = data.id;
    projectile.playerId = data.playerId;
    projectile.me = false;
    projectiles.push(projectile);
}

function addBlackHole(data) {
    let b = createSprite(data.x, data.y, pixelWidth * 2, pixelWidth * 2);
    b.velocity.x = data.v;
    b.addImage(boogieBombImg);
    b.life = 500;
    b.setDefaultCollider();
    b.debug = true;
    b.maxSpeed = pixelWidth - pixelWidth / 5;
    b.me = false;
    blackHoles.push(b);
}


function addPiano(data) {
    let piano = createSprite(data.x, 10, pixelWidth * 4, pixelWidth * 4);
    piano.addImage(pianoImg);
    piano.rotation = data.rotation;
    piano.setCollider("rectangle", 0, 0, 100, 100);
    piano.id = data.id;
    piano.playerId = data.playerId;
    pianos.push(piano);
}

function addMine(data) {
    let mine = createSprite(data.x, data.y, pixelWidth * 2, pixelWidth * 2);
    mine.addImage(mineImg);
    mine.setDefaultCollider();
    mine.maxSpeed = pixelWidth / 5;
    mine.debug = true;
    mine.me = false;
    mine.playerId = data.playerId;
    mines.push(mine);
}

function addSmall(data) {
    players[data.playerId].sprite.addImage(amogus_supreme);
    players[data.playerId].sprite.scale = 0.6;
}