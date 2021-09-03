function addAttack(data) {
    switch (data.type) {
        case "default": addDefaultAttack(data);
            break;
        case "bomb": addBomb(data);
            break;
        case "blackHole": addBlackHole(data);
    }
}

function deleteAttack(data) {
    switch (data.type) {
        case "default":
        projectiles.forEach(p => {
            if(p.id === data.id) {
                p.remove();
                projectiles.splice(projectiles.indexOf(p),1);
            }
        });
            break;
        case "bomb":
            bombs.forEach(b => {
                if (b.id === data.id) {
                    b.remove();
                    bombs.splice(bombs.indexOf(b), 1);
                    if (data.playerId == socket.id) {
                        players[socket.id].item["bomb"].sprite = undefined;
                        ammoCheck("bomb");
                    }
                }
            });
            break;
    }
}

function addBomb(data) {
    let bomb = createSprite(data.x, data.y, 50, 50);
    bomb.velocity.x = data.v;
    bomb.addImage(bombImg);
    bomb.life = 1000;
    bomb.me = false;
    bomb.id = data.id;
    bomb.playerId = data.playerId;
    bombs.push(bomb);
}

function addDefaultAttack(data) {
    projectile = createSprite(data.x, data.y, 20, 20);
    projectile.life = 100;
    projectile.velocity.x = data.velX;
    projectile.velocity.y = data.velY;
    projectile.limitSpeed(25);
    projectile.id = data.id;
    projectiles.push(projectile);
}

function addBlackHole(data) {
    let b = createSprite(data.x,data.y,50,50);
    b.velocity.x = data.v;
    b.addImage(boogieBombImg);
    b.life = 500;
    b.debug = true;
    b.maxSpeed = 20;
    b.me = false;
    blackHoles.push(b);
}