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

function defaultAttack() {

  if (player.direction == "right") {
    projectile = createSprite(player.sprite.position.x, player.sprite.position.y, 20, 20);
  } else {
    projectile = createSprite(player.sprite.position.x, player.sprite.position.y, 20, 20);
  }


  projectile.mass = 10;
  projectile.life = 100;
  projectile.velocity.x = (camera.mouseX - player.sprite.position.x) * 100;
  projectile.velocity.y = (camera.mouseY - player.sprite.position.y) * 100;
  projectile.limitSpeed(25);
  projectiles.push(projectile);

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
      // if you shoot the projectile, it needs about 5 frames to be outside of your own hitbox
      if (projectile.life <= 95) {
        if (projectile.collide(player.sprite)) {
          if (player.sprite.velocity.x > 0 && projectile.velocity.x > 0 || player.sprite.velocity.x < 0 && projectile.velocity.x < 0) {
            diffDirection = true;
          } if (player.sprite.velocity.y < 2 && player.sprite.velocity.y != 1 && projectile.velocity.y <= 0) {
            diffDirection = true;
          }
          if (!diffDirection) {
            player.sprite.velocity.x = projectile.velocity.x * 100;
            player.sprite.velocity.y = projectile.velocity.y * testKnockback * 100;
          } else {
            player.sprite.velocity.x = -projectile.velocity.x * 100;
            player.sprite.velocity.y = -projectile.velocity.y * 100;
          }
          player.sprite.limitSpeed(2 * testKnockback);

          flying = true;
          flyingDuration = 10;
          timeFlying = flyingDuration;
          projectile.remove();
          projectiles.splice(projectileIndex, 1);
        }
      }

    });
  }
  sendHimFlying();
}


function bombAttack() {
  if (player.item["bomb"] !== undefined && player.item["bomb"].ammo > 0) {
    // man kann nur eine bombe gleichzeitig aussenden
    if (player.item["bomb"].sprite === undefined) {
      if (player.direction == "right") {
        player.item["bomb"].sprite = createSprite(player.sprite.position.x + player_width, player.sprite.position.y, 50, 50);
        player.item["bomb"].sprite.velocity.x += 5;
        while ((environment.overlap(player.item["bomb"].sprite))) {
          player.item["bomb"].sprite.position.x -= 1;
        }

      } if (player.direction == "left") {
        player.item["bomb"].sprite = createSprite(player.sprite.position.x - player_width, player.sprite.position.y, 50, 50);
        player.item["bomb"].sprite.velocity.x -= 5;
        while ((environment.overlap(player.item["bomb"].sprite))) {
          player.item["bomb"].sprite.position.x += 1;
        }
      }

      player.item["bomb"].sprite.addImage(bombImg);
      player.item["bomb"].sprite.life = 1000;
      player.item["bomb"].sprite.me = true;
      bombs.push(player.item["bomb"].sprite);
    }
  }
}

function bombPhysics() {
  diffDirection = false;
  if (bombs.length >= 1) {
    bombs.forEach(bomb => {
      if (bomb.velocity.y <= 20) {
        bomb.velocity.y -= GRAVITY;
      }
      bomb.bounce(environment);

      if (bomb.collide(player.sprite)) {
        if (player.sprite.velocity.x > 0 && bomb.velocity.x > 0 || player.sprite.velocity.x < 0 && bomb.velocity.x < 0) {
          diffDirection = true;
        } if (player.sprite.velocity.y < 2 && player.sprite.velocity.y != 1 && bomb.velocity.y <= 0) {
          diffDirection = true;
        }
        if (!diffDirection) {
          player.sprite.velocity.x = bomb.velocity.x * 100;
          player.sprite.velocity.y = bomb.velocity.y * testKnockback * 100;
        } else {
          player.sprite.velocity.x = -bomb.velocity.x * 100;
          player.sprite.velocity.y = -bomb.velocity.y * 100;
        }
        player.sprite.limitSpeed(10 * testKnockback);

        flying = true;
        flyingDuration = 50;
        timeFlying = flyingDuration;
        bomb.remove();
        // zum überprüfen ob man gerade eine bombe im einsatz hat
        if (bomb.me) {
          player.item["bomb"].sprite = undefined;
        }
        bombs.splice(bombs.indexOf(bomb), 1);
        ammoCheck("bomb");

      } else if (bomb.position.x > screenWidth || bomb.position.y > screenHeight || bomb.life == 0) {
        bomb.remove();
        // zum überprüfen ob man gerade eine bombe im einsatz hat
        if (bomb.me) {
          player.item["bomb"].sprite = undefined;
        }
        bombs.splice(bombs.indexOf(bomb), 1);
        ammoCheck("bomb");
      }
      sendHimFlying();
    });
  }
}


function blackHoleAttack() {
  if (player.item["black_hole"] !== undefined && player.item["black_hole"].ammo > 0) {
    if (player.item["black_hole"].sprite === undefined) {
      if (player.direction == "right") {
        player.item["black_hole"].sprite = createSprite(player.sprite.position.x + player_width, player.sprite.position.y, 100, 100);
        player.item["black_hole"].sprite.velocity.x += 3;
        while ((environment.overlap(player.item["black_hole"].sprite))) {
          player.item["black_hole"].sprite.position.x -= 1;
        }
      } else if (player.direction == "left") {
        player.item["black_hole"].sprite = createSprite(player.sprite.position.x - player_width, player.sprite.position.y, 100, 100);
        player.item["black_hole"].sprite.velocity.x -= 3;
        while ((environment.overlap(player.item["black_hole"].sprite))) {
          player.item["black_hole"].sprite.position.x += 1;
        }
      }
      player.item["black_hole"].sprite.addImage(boogieBombImg);
      player.item["black_hole"].sprite.life = 500;
      player.item["black_hole"].sprite.debug = true;
      player.item["black_hole"].sprite.maxSpeed = 20;
      player.item["black_hole"].sprite.me = true;
      blackHoles.push(player.item["black_hole"].sprite);
    }
  }
}

function attraction(b) {
  if (player.sprite.overlap(b)) {
    noGravity = true;
    var angle = atan2(player.sprite.position.y - b.position.y, player.sprite.position.x - b.position.x);
    if (player.sprite.velocity.y >= -25 && player.sprite.velocity.y <= 25) {
      player.sprite.velocity.x -= cos(angle);
    }
    player.sprite.velocity.y -= sin(angle);
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

      if (b.position.x > screenWidth || b.position.y > screenHeight || b.life == 0) {
        b.remove();
        // zum überprüfen ob man gerade ein schwarzes loch im einsatz hat
        if (b.me) {
          player.item["black_hole"].sprite = undefined;
        }
        blackHoles.splice(blackHoles.indexOf(b), 1);
        ammoCheck("black_hole");
      }
    });
  }
}


function pianoTime() {
  let xPos = player.sprite.position.x;
  setTimeout(() => {
    if (player.item["piano"] !== undefined && player.item["piano"].ammo > 0) {
      if (player.item["piano"].sprite === undefined) {
        player.item["piano"].sprite = createSprite(xPos, 10, 100, 100);
        player.item["piano"].sprite.addImage(pianoImg);
        player.item["piano"].sprite.setCollider("rectangle", 0, 0, 100, 100);
        player.item["piano"].sprite.debug = true;
        player.item["piano"].sprite.maxSpeed = 20;
        player.item["piano"].sprite.rotation = getRandomInt(360);
        player.item["piano"].sprite.me = true;
        pianos.push(player.item["piano"].sprite);
      }
    }
  }, 500);
}


function pianoPhysics() {
  if (pianos.length >= 1) {
    pianos.forEach(p => {
      p.rotation += 2;
      if (p.collide(environment)) {
        p.remove();
        if (p.me) {
          player.item["piano"].sprite = undefined;
        }
        pianos.splice(pianos.indexOf(p), 1);
        ammoCheck("piano");
      } else if (p.overlap(player.sprite)) {
        p.remove();
        if (p.me) {
          player.item["piano"].sprite = undefined;
        }
        pianos.splice(pianos.indexOf(p), 1);
        ammoCheck("piano");
        if (p.position.x <= player.sprite.position.x) {
          player.sprite.velocity.x += 5;
        } else {
          player.sprite.velocity.x -= 5;
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
  if (player.item["mine"] != undefined && player.item["mine"].ammo > 0) {
    let mine;
    if (player.direction == "right") {
      mine = createSprite(player.sprite.position.x - player_width, player.sprite.position.y, 50, 50);
    } else {
      mine = createSprite(player.sprite.position.x + player_width, player.sprite.position.y, 50, 50);
    }

    mine.addImage(mineImg);
    mine.maxSpeed = 5;
    mine.debug = true;
    mine.me = true;
    player.item["mine"].sprite.push(mine);
    mines.push(mine);
    ammoCheck("mine");
  }
}

function minePhysics() {
  if (mines.length >= 1) {
    mines.forEach(m => {
      if (m.collide(environment) && m.touching.bottom) {
        m.set = true;
      }
      if (m.overlap(player.sprite) && m.set) {
        player.sprite.velocity.y = -30;
        player.sprite.velocity.x *= -1;
        flying = true;
        flyingDuration = 25;
        timeFlying = flyingDuration;
        mines.splice(mines.indexOf(m), 1);
        m.remove();
        if (m.me && player.item["mine"] != undefined) {
          player.item["mine"].sprite.splice(player.item["mine"].sprite.indexOf(m), 1);
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
  if (player.item["small"] != undefined) {
    imSmall = true;
    smallTimer = 10;
  }
}


function smallChecker() {
  if (imSmall) {
    if (smallTimer == 10) {
      player.sprite.addImage(amogus_supreme);
      player.sprite.setCollider("rectangle", 0, 0, player_width / 2 - 15, player_height / 2);
    }

    if (frameCount % 60 == 0 && smallTimer > 0) {
      smallTimer--;
    }
    if (smallTimer == 0) {
      player.sprite.addImage(amogus);
      player.sprite.setCollider("rectangle", 0, 0, player_width - 15, player_height);
      smallTimer = 10;
      player.item["small"] = undefined;
      imSmall = false;
    }
  }

}






function sendHimFlying() {
  if (flying) {
    timeFlying--;
    //slowdown 
    if (timeFlying <= flyingDuration / 2 && timeFlying > 0) {
      if (player.sprite.velocity.x > 0) { player.sprite.velocity.x -= 0.3; }
      if (player.sprite.velocity.x < 0) { player.sprite.velocity.x += 0.3; }
      if (player.sprite.velocity.y > 0) { player.sprite.velocity.y -= 0.3; }
      if (player.sprite.velocity.y < 0) { player.sprite.velocity.y += 0.3; }
    }
    if (timeFlying == 0) {
      timeFlying = flyingDuration;
      flying = false;
    }
  }
}


function ammoCheck(weapon) {
  player.item[weapon].ammo--;
  if (player.item[weapon].ammo == 0) {
    player.item[weapon] = undefined;
  }
}



