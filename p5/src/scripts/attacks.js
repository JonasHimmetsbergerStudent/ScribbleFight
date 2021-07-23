var projectile;
var projectiles = [];
// is he flying?
var flying = false;
// how long is he flying away
var flyingDuration;
// how long has he been flying
var timeFlying;
var diffDirection = false;
var testKnockback = 3;
var projectileIndex;
var stillAlive = false;

function defaultAttack() {

  if (player_direction == "right") {
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
          console.log(diffDirection);
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
  if (player.item !== undefined && player.item.type == "bomb" && player.item.ammo > 0) {
    if (player.item.sprite === undefined) {
      if (player_direction == "right") {
        player.item.sprite = createSprite(player.sprite.position.x + player_width, player.sprite.position.y, 100, 100);
      } else if (player_direction == "left") {
        player.item.sprite = createSprite(player.sprite.position.x - player_width, player.sprite.position.y, 100, 100);
      }
      player.item.ammo--;
      player.item.sprite.addImage(bombImg);
      player.item.sprite.life = 1000;
      if (player_direction == "left") {
        player.item.sprite.velocity.x -= 5;
      } else if (player_direction == "right") {
        player.item.sprite.velocity.x += 5;
      }
    }
  }
}

function bombPhysics() {
  diffDirection = false;
 
  if (player.item !== undefined && player.item.sprite !== undefined) {
    if (player.item.sprite.velocity.y <= 20) {
      player.item.sprite.velocity.y -= GRAVITY;
    }
    player.item.sprite.bounce(environment);

    if (player.item.sprite.collide(player.sprite)) {
      if (player.sprite.velocity.x > 0 && player.item.sprite.velocity.x > 0 || player.sprite.velocity.x < 0 && player.item.sprite.velocity.x < 0) {
        diffDirection = true;
      } if (player.sprite.velocity.y < 2 && player.sprite.velocity.y != 1 && player.item.sprite.velocity.y <= 0) {
        diffDirection = true;
      }
      if (!diffDirection) {
        player.sprite.velocity.x = player.item.sprite.velocity.x * 100;
        player.sprite.velocity.y = player.item.sprite.velocity.y * testKnockback * 100;
      } else {
        player.sprite.velocity.x = -player.item.sprite.velocity.x * 100;
        player.sprite.velocity.y = -player.item.sprite.velocity.y * 100;
      }
      player.sprite.limitSpeed(10 * testKnockback);

      flying = true;
      flyingDuration = 50;
      timeFlying = flyingDuration;
      player.item.sprite.remove();
      player.item.sprite = undefined;
      ammoCheck();

    } else if (player.item.sprite.position.x > screenWidth || player.item.sprite.position.y > screenHeight || player.item.sprite.life == 0) {
      player.item.sprite.remove();
      player.item.sprite = undefined;
      ammoCheck();
    }
    sendHimFlying();
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


function ammoCheck() {
  if(player.item.ammo==0) {
    player.item = undefined;
  }
}



