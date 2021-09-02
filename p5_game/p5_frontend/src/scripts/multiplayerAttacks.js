function addAttack(data) {
    switch(data.type) {
        case "bomb": addBomb(data);
        break;
    }
}

function deleteAttack(data) {
    switch(data.type) {
        case "bomb": 
        bombs.forEach(b => {
            if(b.id == data.id) {
                b.remove();
                bombs.splice(bombs.indexOf(b), 1);
                console.log(data.playerId + "," + socket.id);
                if(data.playerId == socket.id) {
                    players[socket.id].item["bomb"].sprite = undefined;
                    ammoCheck("bomb");
                }
            }
        });
        break;
    }
}

function addBomb(data) {
    let bomb = createSprite(data.x,data.y,50,50);
    bomb.velocity.x = data.v;
    bomb.addImage(bombImg);
    bomb.life = 1000;
    bomb.me = false;
    bomb.id = data.id;
    bomb.playerId = data.playerId;
    bombs.push(bomb);
}