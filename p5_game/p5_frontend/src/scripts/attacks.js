var projectile;
var projectiles = [];
var bombs = [];
var blackHoles = [];
var pianos = [];
var mines = [];
// is he flying?
var flying = false;
// how long is he flying away
var flyingDuration;
// how long has he been flying
var timeFlying;
var noGravity = false;
var diffDirection = false;
var testKnockback = 3;
var projectileIndex;

function defaultAttack(x, y) {

  if (players[socket.id].direction == "right") {
    projectile = createSprite(players[socket.id].sprite.position.x, players[socket.id].sprite.position.y, 20, 20);
  } else {
    projectile = createSprite(players[socket.id].sprite.position.x, players[socket.id].sprite.position.y, 20, 20);
  }

  let id = (Date.now() - getRandomInt(1000) + getRandomInt(1000)).toString();

  projectile.life = 100;
  projectile.velocity.x = (x - players[socket.id].sprite.position.x) * 100;
  projectile.velocity.y = (y - players[socket.id].sprite.position.y) * 100;
  projectile.limitSpeed(25);
  projectile.me = true;
  projectile.id = id;
  projectile.playerId = socket.id;

  projectiles.push(projectile);
  let data = {
    id: id,
    type: "default",
    x: projectile.position.x,
    y: projectile.position.y,
    velX: projectile.velocity.x,
    velY: projectile.velocity.y,
    playerId: socket.id
  }
  socket.emit("attack", data);

}

function defaultAttackPhysics() {
  // if a projectile exists
  if (projectiles.length > 0) {
    projectiles.forEach(projectile => {
      projectileIndex = projectiles.indexOf(projectile);
      //and hits the map, destroy it
      if (projectile.overlap(environment)) {
        projectile.remove();
        if (projectileIndex > -1) {
          projectiles.splice(projectileIndex, 1);
        }
      }
      // and flies outside of the map, destroy it
      if (projectile.life == 0) {
        if (projectileIndex > -1) {
          projectiles.splice(projectileIndex, 1);
        }
      }
      if (!projectile.me) {
        if (projectile.collide(players[socket.id].sprite)) {
          if (players[socket.id].sprite.velocity.x > 0 && projectile.velocity.x > 0 || players[socket.id].sprite.velocity.x < 0 && projectile.velocity.x < 0) {
            diffDirection = false;
          } if (players[socket.id].sprite.velocity.y < 2 && players[socket.id].sprite.velocity.y != 1 && projectile.velocity.y <= 0) {
            diffDirection = false;
          }
          if (!diffDirection) {
            players[socket.id].sprite.velocity.x = projectile.velocity.x * 100;
            players[socket.id].sprite.velocity.y = projectile.velocity.y * testKnockback * 100;
          } else {
            players[socket.id].sprite.velocity.x = -projectile.velocity.x * 100;
            players[socket.id].sprite.velocity.y = -projectile.velocity.y * 100;
          }
          players[socket.id].sprite.limitSpeed(2 * testKnockback);
          let data = {
            playerId: socket.id,
            id: projectile.id,
            type: "default"
          }
          
          players[socket.id].damagedBy = projectile.playerId;
          cookieArr["knockback"] +=1;

          flying = true;
          flyingDuration = 10;
          timeFlying = flyingDuration;
          projectile.remove();
          projectiles.splice(projectileIndex, 1);

          socket.emit("deleteAttack", data);
        }
      }

    });
  }
  sendHimFlying();
}


function bombAttack() {
  if (players[socket.id].item["bomb"] !== undefined && players[socket.id].item["bomb"].ammo > 0) {
    // man kann nur eine bombe gleichzeitig aussenden
    if (players[socket.id].item["bomb"].sprite === undefined) {
      if (players[socket.id].direction == "right") {
        if (imSmall) {
          players[socket.id].item["bomb"].sprite = createSprite(players[socket.id].sprite.position.x + player_width / 2, players[socket.id].sprite.position.y - 25, 50, 50);
        } else {
          players[socket.id].item["bomb"].sprite = createSprite(players[socket.id].sprite.position.x + player_width, players[socket.id].sprite.position.y, 50, 50);
        }
        players[socket.id].item["bomb"].sprite.velocity.x += 5 * GAMESPEED;
        while ((environment.overlap(players[socket.id].item["bomb"].sprite))) {
          players[socket.id].item["bomb"].sprite.position.x -= 1;
        }

      } if (players[socket.id].direction == "left") {
        if (imSmall) {
          players[socket.id].item["bomb"].sprite = createSprite(players[socket.id].sprite.position.x - player_width / 2, players[socket.id].sprite.position.y - 25, 50, 50);
        } else {
          players[socket.id].item["bomb"].sprite = createSprite(players[socket.id].sprite.position.x - player_width, players[socket.id].sprite.position.y, 50, 50);
        }
        players[socket.id].item["bomb"].sprite.velocity.x -= 5 * GAMESPEED;
        while ((environment.overlap(players[socket.id].item["bomb"].sprite))) {
          players[socket.id].item["bomb"].sprite.position.x += 1;
        }
      }

      let id = (Date.now() - getRandomInt(1000) + getRandomInt(1000)).toString();
      players[socket.id].item["bomb"].sprite.addImage(bombImg);
      players[socket.id].item["bomb"].sprite.life = 1000;
      players[socket.id].item["bomb"].sprite.me = true;
      players[socket.id].item["bomb"].sprite.id = id;
      players[socket.id].item["bomb"].sprite.playerId = socket.id;
      bombs.push(players[socket.id].item["bomb"].sprite);
      let data = {
        id: id,
        playerId: socket.id,
        type: "bomb",
        x: players[socket.id].item["bomb"].sprite.position.x,
        y: players[socket.id].item["bomb"].sprite.position.y,
        v: players[socket.id].item["bomb"].sprite.velocity.x
      }
      socket.emit('attack', data);
    }
  }
}

function bombPhysics() {
  diffDirection = false;
  if (bombs.length >= 1) {
    bombs.forEach(bomb => {
      if (bomb.velocity.y <= 20) {
        bomb.velocity.y -= GRAVITY * GAMESPEED;
      }
      bomb.bounce(environment);

      let data = {
        type: "bomb",
        id: bomb.id,
        playerId: bomb.playerId
      }
      if (bomb.collide(players[socket.id].sprite)) {
        console.log(bomb.me);
        if (players[socket.id].sprite.velocity.x > 0 && bomb.velocity.x > 0 || players[socket.id].sprite.velocity.x < 0 && bomb.velocity.x < 0) {
          diffDirection = true;
        } if (players[socket.id].sprite.velocity.y < 2 && players[socket.id].sprite.velocity.y != 1 && bomb.velocity.y <= 0) {
          diffDirection = true;
        }
        if (!diffDirection) {
          players[socket.id].sprite.velocity.x = bomb.velocity.x * 100;
          players[socket.id].sprite.velocity.y = bomb.velocity.y * testKnockback * 100;
        } else {
          players[socket.id].sprite.velocity.x = -bomb.velocity.x * 100;
          players[socket.id].sprite.velocity.y = -bomb.velocity.y * 100;
        }
        players[socket.id].sprite.limitSpeed(30 * GAMESPEED);

        flying = true;
        flyingDuration = 50 / GAMESPEED;
        timeFlying = flyingDuration;
        bomb.remove();


        // zum überprüfen ob ich die Bombe erzeugt habe
        if (bomb.me) {
          players[socket.id].item["bomb"].sprite = undefined;
          ammoCheck("bomb");
        }
        bombs.splice(bombs.indexOf(bomb), 1);
        players[socket.id].damagedBy = bomb.playerId;
        socket.emit("deleteAttack", data);
        cookieArr["knockback"] +=1;

      } else if (bomb.position.x > windowWidth || bomb.position.y > windowHeight || bomb.life == 0) {
        bomb.remove();

        // zum überprüfen ob ich die Bombe erzeugt habe
        if (bomb.me) {
          players[socket.id].item["bomb"].sprite = undefined;
          ammoCheck("bomb");
        }
        bombs.splice(bombs.indexOf(bomb), 1);
      }
      sendHimFlying();
    });
  }
}


function blackHoleAttack() {
  if (players[socket.id].item["black_hole"] !== undefined && players[socket.id].item["black_hole"].ammo > 0) {
    if (players[socket.id].item["black_hole"].sprite === undefined) {
      if (players[socket.id].direction == "right") {
        if (imSmall) {
          players[socket.id].item["black_hole"].sprite = createSprite(players[socket.id].sprite.position.x + player_width / 2, players[socket.id].sprite.position.y - 25, 50, 50);
        } else {
          players[socket.id].item["black_hole"].sprite = createSprite(players[socket.id].sprite.position.x + player_width, players[socket.id].sprite.position.y, 50, 50);
        }
        players[socket.id].item["black_hole"].sprite.velocity.x += 3 * GAMESPEED;
        while ((environment.overlap(players[socket.id].item["black_hole"].sprite))) {
          players[socket.id].item["black_hole"].sprite.position.x -= 1;
        }
      } else if (players[socket.id].direction == "left") {
        if (imSmall) {
          players[socket.id].item["black_hole"].sprite = createSprite(players[socket.id].sprite.position.x - player_width / 2, players[socket.id].sprite.position.y - 25, 50, 50);
        } else {
          players[socket.id].item["black_hole"].sprite = createSprite(players[socket.id].sprite.position.x - player_width, players[socket.id].sprite.position.y, 50, 50);
        }
        players[socket.id].item["black_hole"].sprite.velocity.x -= 3 * GAMESPEED;
        while ((environment.overlap(players[socket.id].item["black_hole"].sprite))) {
          players[socket.id].item["black_hole"].sprite.position.x += 1;

        }
      }
      let id = (Date.now() - getRandomInt(1000) + getRandomInt(1000)).toString();
      players[socket.id].item["black_hole"].sprite.addImage(boogieBombImg);
      players[socket.id].item["black_hole"].sprite.life = 500;
      players[socket.id].item["black_hole"].sprite.debug = true;
      players[socket.id].item["black_hole"].sprite.maxSpeed = 20;
      players[socket.id].item["black_hole"].sprite.me = true;
      blackHoles.push(players[socket.id].item["black_hole"].sprite);
      let data = {
        id: id,
        playerId: socket.id,
        type: "blackHole",
        x: players[socket.id].item["black_hole"].sprite.position.x,
        y: players[socket.id].item["black_hole"].sprite.position.y,
        v: players[socket.id].item["black_hole"].sprite.velocity.x
      }
      socket.emit('attack', data);
    }
  }
}

function attraction(b) {
  if (players[socket.id].sprite.overlap(b)) {
    noGravity = true;
    var angle = atan2(players[socket.id].sprite.position.y - b.position.y, players[socket.id].sprite.position.x - b.position.x);
    if (players[socket.id].sprite.velocity.y >= -25 && players[socket.id].sprite.velocity.y <= 25) {
      players[socket.id].sprite.velocity.x -= cos(angle);
    }
    players[socket.id].sprite.velocity.y -= sin(angle);
  }
}

function blackHolePhysics() {
  noGravity = false;
  if (blackHoles.length >= 1) {
    blackHoles.forEach(b => {
      if (b.life <= 400) {
        b.setCollider("circle", 0, 0, 175);
        attraction(b);
        b.velocity.y = 0;
        b.velocity.x = 0;
      }

      if (b.life > 400) {
        b.velocity.y -= GRAVITY;
        b.bounce(environment);
      }

      if (b.position.x > windowWidth || b.position.y > windowHeight || b.life == 0) {
        b.remove();
        // zum überprüfen ob man gerade ein schwarzes loch im einsatz hat
        if (b.me) {
          players[socket.id].item["black_hole"].sprite = undefined;
          ammoCheck("black_hole");
        }
        blackHoles.splice(blackHoles.indexOf(b), 1);
      }
    });
  }
}


function pianoTime() {
  let xPos = players[socket.id].sprite.position.x;
  setTimeout(() => {
    if (players[socket.id].item["piano"] !== undefined && players[socket.id].item["piano"].ammo > 0) {
      if (players[socket.id].item["piano"].sprite === undefined) {
        let id = (Date.now() - getRandomInt(1000) + getRandomInt(1000)).toString();
        players[socket.id].item["piano"].sprite = createSprite(xPos, 10, 100, 100);
        players[socket.id].item["piano"].sprite.addImage(pianoImg);
        players[socket.id].item["piano"].sprite.setCollider("rectangle", 0, 0, 100, 100);
        players[socket.id].item["piano"].sprite.debug = true;
        players[socket.id].item["piano"].sprite.maxSpeed = 20;
        players[socket.id].item["piano"].sprite.rotation = getRandomInt(360);
        players[socket.id].item["piano"].sprite.me = true;
        players[socket.id].item["piano"].sprite.id = id;
        players[socket.id].item["piano"].sprite.playerId = socket.id;
        pianos.push(players[socket.id].item["piano"].sprite);
        let data = {
          id: id,
          playerId: socket.id,
          type: "piano",
          x: players[socket.id].item["piano"].sprite.position.x,
          rotation: players[socket.id].item["piano"].sprite.rotation
        }
        socket.emit('attack', data);
      }
    }
  }, 500);
}


function pianoPhysics() {
  if (pianos.length >= 1) {
    pianos.forEach(p => {
      let data = {
        id: p.id,
        playerId: p.playerId,
        type: "piano"
      }
      p.rotation += 2;
      if (p.collide(environment)) {
        p.remove();
        if (p.me) {
          players[socket.id].item["piano"].sprite = undefined;
          ammoCheck("piano");
        }
        pianos.splice(pianos.indexOf(p), 1);
      } else if (p.overlap(players[socket.id].sprite)) {
        p.remove();
        socket.emit("deleteAttack", data);
        players[socket.id].damagedBy = p.playerId;
        cookieArr["knockback"] +=1;
        if (p.me) {
          players[socket.id].item["piano"].sprite = undefined;
          ammoCheck("piano");
        }
        pianos.splice(pianos.indexOf(p), 1);

        if (p.position.x <= players[socket.id].sprite.position.x) {
          players[socket.id].sprite.velocity.x += 5;
        } else {
          players[socket.id].sprite.velocity.x -= 5;
        }
        flying = true;
        flyingDuration = 20;
        timeFlying = flyingDuration;
        sendHimFlying();
      }
      p.velocity.y -= GRAVITY;
    });
  }
}

function placeMine() {
  if (players[socket.id].item["mine"] != undefined && players[socket.id].item["mine"].ammo > 0) {
    let mine;
    if (players[socket.id].direction == "right") {
      mine = createSprite(players[socket.id].sprite.position.x - player_width, players[socket.id].sprite.position.y, 50, 50);
    } else {
      mine = createSprite(players[socket.id].sprite.position.x + player_width, players[socket.id].sprite.position.y, 50, 50);
    }

    let id = (Date.now() - getRandomInt(1000) + getRandomInt(1000)).toString();
    mine.addImage(mineImg);
    mine.maxSpeed = 5;
    mine.debug = true;
    mine.me = true;
    mine.playerId = socket.id;
    players[socket.id].item["mine"].sprite.push(mine);
    mines.push(mine);
    ammoCheck("mine");
    let data = {
      id: id,
      playerId: socket.id,
      type: "mine",
      x: mine.position.x,
      y: mine.position.y
    }
    socket.emit("attack", data);
  }
}

function minePhysics() {
  if (mines.length >= 1) {
    mines.forEach(m => {
      let data = {
        id: m.id,
        playerId: m.playerId,
        type: "mine"
      }
      if (m.collide(environment) && m.touching.bottom) {
        m.set = true;
      }
      if (m.overlap(players[socket.id].sprite) && m.set) {
        players[socket.id].sprite.velocity.y = -30;
        players[socket.id].sprite.velocity.x *= -1;
        flying = true;
        flyingDuration = 25;
        timeFlying = flyingDuration;
        mines.splice(mines.indexOf(m), 1);
        m.remove();
        players[socket.id].damagedBy = m.playerId;
        console.log(m.playerId);
        socket.emit("deleteAttack", data);
        cookieArr["knockback"] +=1;
        if (m.me && players[socket.id].item["mine"] != undefined) {
          players[socket.id].item["mine"].sprite.splice(players[socket.id].item["mine"].sprite.indexOf(m), 1);
        }
      }
      m.velocity.y -= GRAVITY;
      sendHimFlying();
    });
  }
}


let imSmall;
let smallTimer;
function makeMeSmall() {
  if (players[socket.id].item["small"] != undefined) {
    imSmall = true;
    smallTimer = 10;
    let data = {
      type: "small",
      playerId: socket.id
    }
    socket.emit("attack", data);
  }
}


function smallChecker() {
  if (imSmall) {
    if (smallTimer == 10) {
      players[socket.id].sprite.addImage(amogus_supreme);
      players[socket.id].sprite.scale = 0.7;
    }

    if (frameCount % 60 == 0 && smallTimer > 0) {
      smallTimer--;
    }
    if (smallTimer == 0) {
      players[socket.id].sprite.addImage(amogus);
      players[socket.id].sprite.scale = 1;
      smallTimer = 10;
      players[socket.id].item["small"] = undefined;
      imSmall = false;
      let data = {
        type: "small",
        playerId: socket.id
      }
      socket.emit("deleteAttack", data);
    }
  }

}


function sendHimFlying() {
  if (flying) {
    timeFlying--;
    //slowdown 
    if (timeFlying <= flyingDuration / 2 && timeFlying > 0) {
      if (players[socket.id].sprite.velocity.x > 0) { players[socket.id].sprite.velocity.x -= 0.3; }
      if (players[socket.id].sprite.velocity.x < 0) { players[socket.id].sprite.velocity.x += 0.3; }
      if (players[socket.id].sprite.velocity.y > 0) { players[socket.id].sprite.velocity.y -= 0.3; }
      if (players[socket.id].sprite.velocity.y < 0) { players[socket.id].sprite.velocity.y += 0.3; }
    }
    if (timeFlying == 0) {
      timeFlying = flyingDuration;
      flying = false;
    }
  }
}


function ammoCheck(weapon) {
  players[socket.id].item[weapon].ammo--;
  console.log("-1");
  if (players[socket.id].item[weapon].ammo == 0) {
    console.log("dff");
    players[socket.id].item[weapon] = undefined;
  }
}



