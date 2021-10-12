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


function makeCordsRelative(x,y) {
  return data = {
    x: (x - (windowWidth - newImageWidth) / 2) * relFaktor.x,
    y: (y - (windowHeight - newImageHeight) / 2) * relFaktor.y
  }
}

function defaultAttack(x, y) {
 
  projectile = createSprite(myPlayer.sprite.position.x, myPlayer.sprite.position.y, pixelWidth, pixelWidth);

  let id = (Date.now() - getRandomInt(1000) + getRandomInt(1000)).toString();

  projectile.life = 100;
  projectile.velocity.x = (x - myPlayer.sprite.position.x) * 1000;
  projectile.velocity.y = (y - myPlayer.sprite.position.y) * 1000;
  // damit man den collider abrufen kann bei addSpriteToVisual
  projectile.setDefaultCollider();
  projectile.me = true;
  projectile.id = id;
  projectile.limitSpeed(pixelWidth - pixelWidth/2);
  projectile.playerId = socket.id;

  projectiles.push(projectile);
  let data = {
    id: id,
    type: "default",
    x: relPosData.x,
    y: relPosData.y,
    velX: projectile.velocity.x,
    velY: projectile.velocity.y,
    playerId: socket.id
  }
  socket.emit("attack", data);

}


/**
 * Default attack from angle relative to player
 * for AI to use
  * Mit freundlichen Grüßen :)
  * Jonas Himmetsberger ;)
 * @param {angle in which to shoot at in degree} angle 
 */
function shootAngle(angle) {
  let r = 30;

  angle *= Math.PI / 180

  let x = float(Math.cos(angle).toFixed(2)) * r + myPlayer.sprite.position.x;
  let y = float(Math.sin(angle).toFixed(2)) * r * -1 + myPlayer.sprite.position.y;

  defaultAttack(x, y)
}

function defaultAttackPhysics() {
  // if a projectile exists
  if (projectiles.length > 0) {
    projectiles.forEach(projectile => {
      projectileIndex = projectiles.indexOf(projectile);
      if (projectile.me) {
        addSpriteToVisual(projectile, 4);
      } else {
        addSpriteToVisual(projectile, 5);
      }

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
        if (projectile.overlap(myPlayer.sprite)) {
          if (myPlayer.sprite.velocity.x > 0 && projectile.velocity.x > 0 || myPlayer.sprite.velocity.x < 0 && projectile.velocity.x < 0) {
            diffDirection = false;
          } if (myPlayer.sprite.velocity.y < 2 && myPlayer.sprite.velocity.y != 1 && projectile.velocity.y <= 0) {
            diffDirection = false;
          }
          if (!diffDirection) {
            myPlayer.sprite.velocity.x = projectile.velocity.x;
            myPlayer.sprite.velocity.y = projectile.velocity.y;
          } else {
            myPlayer.sprite.velocity.x = -projectile.velocity.x;
            myPlayer.sprite.velocity.y = -projectile.velocity.y;
          }
          let data = {
            playerId: socket.id,
            id: projectile.id,
            type: "default"
          }

          myPlayer.damagedBy = projectile.playerId;
          myPlayer.knockback += 1;

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
  let vel;
  if (myPlayer.item["bomb"] !== undefined && myPlayer.item["bomb"].ammo > 0) {
    // man kann nur eine bombe gleichzeitig aussenden
    if (myPlayer.item["bomb"].sprite === undefined) {
      if (myPlayer.direction == "right") {
        if (imSmall) {
          myPlayer.item["bomb"].sprite = createSprite(myPlayer.sprite.position.x + player_width / 2, myPlayer.sprite.position.y - pixelWidth, pixelWidth * 2, pixelWidth * 2);
        } else {
          myPlayer.item["bomb"].sprite = createSprite(myPlayer.sprite.position.x + player_width, myPlayer.sprite.position.y, pixelWidth * 2, pixelWidth * 2);
        }
        myPlayer.item["bomb"].sprite.velocity.x += pixelWidth/5 * GAMESPEED;
        vel = 1;
        while ((environment.overlap(myPlayer.item["bomb"].sprite))) {
          myPlayer.item["bomb"].sprite.position.x -= 1;
        }

      } if (myPlayer.direction == "left") {
        if (imSmall) {
          myPlayer.item["bomb"].sprite = createSprite(myPlayer.sprite.position.x - player_width / 2, myPlayer.sprite.position.y - pixelWidth, pixelWidth, pixelWidth);
        } else {
          myPlayer.item["bomb"].sprite = createSprite(myPlayer.sprite.position.x - player_width, myPlayer.sprite.position.y, pixelWidth, pixelWidth);
        }
        myPlayer.item["bomb"].sprite.velocity.x -=  pixelWidth/5 * GAMESPEED;
        vel = -1;
        while ((environment.overlap(myPlayer.item["bomb"].sprite))) {
          myPlayer.item["bomb"].sprite.position.x += 1;
        }
      }
      

      let id = (Date.now() - getRandomInt(1000) + getRandomInt(1000)).toString();
      myPlayer.item["bomb"].sprite.addImage(bombImg);
      myPlayer.item["bomb"].sprite.life = 1000;
      myPlayer.item["bomb"].sprite.me = true;
      myPlayer.item["bomb"].sprite.setDefaultCollider();
      myPlayer.item["bomb"].sprite.id = id;
      myPlayer.item["bomb"].sprite.playerId = socket.id;
      bombs.push(myPlayer.item["bomb"].sprite);
      let data = {
        id: id,
        playerId: socket.id,
        type: "bomb",
        x: makeCordsRelative(myPlayer.item["bomb"].sprite.position.x,myPlayer.item["bomb"].sprite.position.y).x ,
        y: makeCordsRelative(myPlayer.item["bomb"].sprite.position.x,myPlayer.item["bomb"].sprite.position.y).y,
        vel: vel
      }
      socket.emit('attack', data);
    }
  }
}

function bombPhysics() {
  diffDirection = false;
  if (bombs.length >= 1) {
    bombs.forEach(bomb => {
      if (bomb.velocity.y <= pixelWidth-pixelWidth/5) {
        bomb.velocity.y -= GRAVITY * GAMESPEED;
      }
      bomb.bounce(environment);
      addSpriteToVisual(bomb, 5);
      let data = {
        type: "bomb",
        id: bomb.id,
        playerId: bomb.playerId
      }
      if (bomb.overlap(myPlayer.sprite)) {
        if (myPlayer.sprite.velocity.x > 0 && bomb.velocity.x > 0 || myPlayer.sprite.velocity.x < 0 && bomb.velocity.x < 0) {
          diffDirection = true;
        } if (myPlayer.sprite.velocity.y < 2 && myPlayer.sprite.velocity.y != 1 && bomb.velocity.y <= 0) {
          diffDirection = true;
        }
        if (!diffDirection) {
          myPlayer.sprite.velocity.x = bomb.velocity.x * pixelWidth / 5;
          myPlayer.sprite.velocity.y = bomb.velocity.y * pixelWidth / 5;
        } else {
          myPlayer.sprite.velocity.x = -bomb.velocity.x * pixelWidth/5;
          myPlayer.sprite.velocity.y = -bomb.velocity.y * pixelWidth/5;
        }
        flying = true;
        flyingDuration = 50 / GAMESPEED;
        timeFlying = flyingDuration;
        bomb.remove();


        // zum überprüfen ob ich die Bombe erzeugt habe
        if (bomb.me) {
          myPlayer.item["bomb"].sprite = undefined;
          ammoCheck("bomb");
        }
        bombs.splice(bombs.indexOf(bomb), 1);
        myPlayer.damagedBy = bomb.playerId;
        socket.emit("deleteAttack", data);
        myPlayer.knockback += 1;

      } else if (bomb.position.x > windowWidth || bomb.position.y > windowHeight || bomb.life == 0) {
        bomb.remove();

        // zum überprüfen ob ich die Bombe erzeugt habe
        if (bomb.me) {
          myPlayer.item["bomb"].sprite = undefined;
          ammoCheck("bomb");
        }
        bombs.splice(bombs.indexOf(bomb), 1);
      }
      sendHimFlying();
    });
  }
}


function blackHoleAttack() {
  let vel;
  if (myPlayer.item["black_hole"] !== undefined && myPlayer.item["black_hole"].ammo > 0) {
    if (myPlayer.item["black_hole"].sprite === undefined) {
      if (myPlayer.direction == "right") {
        vel = 1;
        if (imSmall) {
          myPlayer.item["black_hole"].sprite = createSprite(myPlayer.sprite.position.x + player_width / 2, myPlayer.sprite.position.y - pixelWidth, pixelWidth * 2, pixelWidth * 2);
        } else {
          myPlayer.item["black_hole"].sprite = createSprite(myPlayer.sprite.position.x + player_width, myPlayer.sprite.position.y, pixelWidth * 2, pixelWidth * 2);
        }
        myPlayer.item["black_hole"].sprite.velocity.x += pixelWidth / 5 * GAMESPEED;
        while ((environment.overlap(myPlayer.item["black_hole"].sprite))) {
          myPlayer.item["black_hole"].sprite.position.x -= 1;
        }
      } else if (myPlayer.direction == "left") {
        vel = -1;
        if (imSmall) {
          myPlayer.item["black_hole"].sprite = createSprite(myPlayer.sprite.position.x - player_width / 2, myPlayer.sprite.position.y - pixelWidth, pixelWidth * 2, pixelWidth * 2);
        } else {
          myPlayer.item["black_hole"].sprite = createSprite(myPlayer.sprite.position.x - player_width, myPlayer.sprite.position.y, pixelWidth * 2, pixelWidth * 2);
        }
        myPlayer.item["black_hole"].sprite.velocity.x -= pixelWidth / 5 * GAMESPEED;
        while ((environment.overlap(myPlayer.item["black_hole"].sprite))) {
          myPlayer.item["black_hole"].sprite.position.x += 1;

        }
      }
      let id = (Date.now() - getRandomInt(1000) + getRandomInt(1000)).toString();
      myPlayer.item["black_hole"].sprite.addImage(boogieBombImg);
      myPlayer.item["black_hole"].sprite.life = 500;
      myPlayer.item["black_hole"].sprite.debug = true;
      myPlayer.item["black_hole"].sprite.me = true;
      blackHoles.push(myPlayer.item["black_hole"].sprite);
      let data = {
        id: id,
        playerId: socket.id,
        type: "blackHole",
        x: makeCordsRelative(myPlayer.item["black_hole"].sprite.position.x,myPlayer.item["black_hole"].sprite.position.y).x,
        y: makeCordsRelative(myPlayer.item["black_hole"].sprite.position.x,myPlayer.item["black_hole"].sprite.position.y).y,
        vel: vel
      }
      socket.emit('attack', data);
    }
  }
}

function attraction(b) {
  if (myPlayer.sprite.overlap(b)) {
    noGravity = true;
    var angle = atan2(myPlayer.sprite.position.y - b.position.y, myPlayer.sprite.position.x - b.position.x);
    if (myPlayer.sprite.velocity.y >= -pixelWidth && myPlayer.sprite.velocity.y <= pixelWidth) {
      myPlayer.sprite.velocity.x -= cos(angle);
    }
    myPlayer.sprite.velocity.y -= sin(angle);
  }
}

function blackHolePhysics() {
  noGravity = false;
  if (blackHoles.length >= 1) {
    blackHoles.forEach(b => {
      if (b.life <= 400) {
        b.setCollider("circle", 0, 0, pixelWidth*8);
        attraction(b);
        b.velocity.y = 0;
        b.velocity.x = 0;
      }

      if (b.life > 400) {
        b.velocity.y -= GRAVITY;
        b.bounce(environment);
      }
      addSpriteToVisual(b, 5);

      if (b.position.x > windowWidth || b.position.y > windowHeight || b.life == 0) {
        b.remove();
        // zum überprüfen ob man gerade ein schwarzes loch im einsatz hat
        if (b.me) {
          myPlayer.item["black_hole"].sprite = undefined;
          ammoCheck("black_hole");
        }
        blackHoles.splice(blackHoles.indexOf(b), 1);
      }
    });
  }
}


function pianoTime() {
  let xPos = myPlayer.sprite.position.x;
  setTimeout(() => {
    if (myPlayer.item["piano"] !== undefined && myPlayer.item["piano"].ammo > 0) {
      if (myPlayer.item["piano"].sprite === undefined) {
        let id = (Date.now() - getRandomInt(1000) + getRandomInt(1000)).toString();
        myPlayer.item["piano"].sprite = createSprite(xPos, 0, pixelWidth * 5, pixelWidth * 5);
        myPlayer.item["piano"].sprite.addImage(pianoImg);
        myPlayer.item["piano"].sprite.setCollider("rectangle", 0, 0, pixelWidth*5, pixelWidth*5);
        myPlayer.item["piano"].sprite.debug = true;
        myPlayer.item["piano"].sprite.maxSpeed = pixelWidth-pixelWidth/5;
        myPlayer.item["piano"].sprite.rotation = getRandomInt(360);
        myPlayer.item["piano"].sprite.me = true;
        myPlayer.item["piano"].sprite.id = id;
        myPlayer.item["piano"].sprite.playerId = socket.id;
        pianos.push(myPlayer.item["piano"].sprite);
        let data = {
          id: id,
          playerId: socket.id,
          type: "piano",
          x: makeCordsRelative(myPlayer.item["piano"].sprite.position.x,0).x,
          rotation: myPlayer.item["piano"].sprite.rotation
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
      //p.rotation += 2;
      if (p.collide(environment)) {
        p.remove();
        if (p.me) {
          myPlayer.item["piano"].sprite = undefined;
          ammoCheck("piano");
        }
        pianos.splice(pianos.indexOf(p), 1);
      } else if (p.overlap(myPlayer.sprite)) {
        p.remove();
        socket.emit("deleteAttack", data);
        myPlayer.damagedBy = p.playerId;
        myPlayer.knockback += 1;
        if (p.me) {
          myPlayer.item["piano"].sprite = undefined;
          ammoCheck("piano");
        }
        pianos.splice(pianos.indexOf(p), 1);

        if (p.position.x <= myPlayer.sprite.position.x) {
          myPlayer.sprite.velocity.x += pixelWidth/10;
        } else {
          myPlayer.sprite.velocity.x -= pixelWidth/10;
        }
        flying = true;
        flyingDuration = 20;
        timeFlying = flyingDuration;
        sendHimFlying();
      }
      p.velocity.y -= GRAVITY;
      addSpriteToVisual(p, 5);
    });
  }
}

function placeMine() {
  if (myPlayer.item["mine"] != undefined && myPlayer.item["mine"].ammo > 0) {
    let mine;
    if (myPlayer.direction == "right") {
      mine = createSprite(myPlayer.sprite.position.x - player_width, myPlayer.sprite.position.y, pixelWidth * 2, pixelWidth * 2);
    } else {
      mine = createSprite(myPlayer.sprite.position.x + player_width, myPlayer.sprite.position.y, pixelWidth * 2, pixelWidth * 2);
    }

    let id = (Date.now() - getRandomInt(1000) + getRandomInt(1000)).toString();
    mine.addImage(mineImg);
    mine.maxSpeed = pixelWidth/5;
    mine.debug = true;
    mine.me = true;
    mine.playerId = socket.id;
    myPlayer.item["mine"].sprite.push(mine);
    mines.push(mine);
    ammoCheck("mine");
    let data = {
      id: id,
      playerId: socket.id,
      type: "mine",
      x:  makeCordsRelative(mine.position.x,0).x,
      y:  makeCordsRelative(0,mine.position.y).y
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
      if (m.overlap(myPlayer.sprite) && m.set) {
        myPlayer.sprite.velocity.y = -pixelWidth * 7;
        myPlayer.sprite.velocity.x *= -1;
        flying = true;
        flyingDuration = 50;
        timeFlying = flyingDuration;
        sendHimFlying();
        mines.splice(mines.indexOf(m), 1);
        m.remove();
        myPlayer.damagedBy = m.playerId;
        socket.emit("deleteAttack", data);
        myPlayer.knockback += 1;
        if (m.me && myPlayer.item["mine"] != undefined) {
          myPlayer.item["mine"].sprite.splice(myPlayer.item["mine"].sprite.indexOf(m), 1);
        }
      }
      m.velocity.y -= GRAVITY;
      addSpriteToVisual(m, 5);
    });
  }
}


var imSmall;
let smallTimer;
function makeMeSmall() {
  if (myPlayer.item["small"] != undefined) {
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
      myPlayer.sprite.addImage(amogus_supreme);
      myPlayer.sprite.scale = 0.6;
    }

    if (frameCount % 60 == 0 && smallTimer > 0) {
      smallTimer--;
    }
    if (smallTimer == 0) {
      myPlayer.sprite.addImage(amogus);
      myPlayer.sprite.scale = 1;
      smallTimer = 10;
      myPlayer.item["small"] = undefined;
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
      if (myPlayer.sprite.velocity.x > 0) { myPlayer.sprite.velocity.x -= 0.3; }
      if (myPlayer.sprite.velocity.x < 0) { myPlayer.sprite.velocity.x += 0.3; }
      if (myPlayer.sprite.velocity.y > 0) { myPlayer.sprite.velocity.y -= 0.3; }
      if (myPlayer.sprite.velocity.y < 0) { myPlayer.sprite.velocity.y += 0.3; }
    }
    if (timeFlying == 0) {
      timeFlying = flyingDuration;
      flying = false;
    }
  }
}


function ammoCheck(weapon) {
  myPlayer.item[weapon].ammo--;
  console.log("-1");
  if (myPlayer.item[weapon].ammo == 0) {
    console.log("dff");
    myPlayer.item[weapon] = undefined;
  }
}



