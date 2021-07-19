var projectile;
var projectiles = [];
var bomb;
// is he flying?
var flying = false;
// how long is he flying away
var flyingDuration;
// how long has he been flying
var timeFlying;
var diffDirection = false;
var testKnockback = 3;
var projectileIndex;

function defaultAttack() {

  if (player_direction == "right") {
    projectile = createSprite(sprite.position.x, sprite.position.y, 20, 20);
  } else {
    projectile = createSprite(sprite.position.x, sprite.position.y, 20, 20);
  }


  projectile.mass = 10;
  projectile.life = 100;
  projectile.velocity.x = (camera.mouseX - sprite.position.x) * 100;
  projectile.velocity.y = (camera.mouseY - sprite.position.y) * 100;
  projectile.limitSpeed(10);
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
      console.log(projectile.life);
      // if you shoot the projectile, it needs about 10 frames to be outside of your own hitbox
      if(projectile.life <= 90) {
        if (projectile.collide(sprite)) {
          if (sprite.velocity.x > 0 && projectile.velocity.x > 0 || sprite.velocity.x < 0 && projectile.velocity.x < 0) {
            diffDirection = true;
          } if (sprite.velocity.y > 2 && projectile.velocity.y >= 0) {
            diffDirection = true;
          }
          if (!diffDirection) {
            sprite.velocity.x = projectile.velocity.x * 100;
            sprite.velocity.y = projectile.velocity.y * testKnockback * 100;
          } else {
            sprite.velocity.x = -projectile.velocity.x * 100;
            sprite.velocity.y = -projectile.velocity.y * 100;
          }
          sprite.limitSpeed(2 * testKnockback);
  
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
  if (bomb === undefined) {
    if (player_direction == "right") {
      bomb = createSprite(sprite.position.x + player_width, sprite.position.y, 100, 100);
    } else if (player_direction == "left") {
      bomb = createSprite(sprite.position.x - player_width, sprite.position.y, 100, 100);
    }
    bomb.addImage(bombImg);
    bomb.life = 1000;
    if (player_direction == "left") {
      bomb.velocity.x -= 2;
    } else if (player_direction == "right") {
      bomb.velocity.x += 2;
    }
    bomb.debug = true;
  }
  sprite.mass = 0.01;
}

function bombPhysics() {
  diffDirection = false;
  if (bomb !== undefined) {
    if (bomb.velocity.y <= 20) {
      bomb.velocity.y -= GRAVITY;
    }
    bomb.bounce(environment);

    if (bomb.collide(sprite)) {
      if (sprite.velocity.x > 0 && bomb.velocity.x > 0 || sprite.velocity.x < 0 && bomb.velocity.x < 0) {
        diffDirection = true;
      } if (sprite.velocity.y > 2 && bomb.velocity.y >= 0) {
        diffDirection = true;
      }
      if (!diffDirection) {
        sprite.velocity.x = bomb.velocity.x * 100;
        sprite.velocity.y = bomb.velocity.y * testKnockback * 100;
      } else {
        sprite.velocity.x = -bomb.velocity.x * 100;
        sprite.velocity.y = -bomb.velocity.y * 100;
      }
      sprite.limitSpeed(10 * testKnockback);

      flying = true;
      flyingDuration = 50;
      timeFlying = flyingDuration;
      bomb.remove();
      bomb = undefined;
    } else if (bomb.position.x > screenWidth || bomb.position.y > screenHeight || bomb.life == 0) {
      bomb.remove();
      bomb = undefined;
    }
      sendHimFlying();    
  }



}

function sendHimFlying() {
  if (flying) {
    timeFlying--;
    console.log(timeFlying);
    //slowdown 
    if (timeFlying <= flyingDuration / 2 && timeFlying > 0) {
      if (sprite.velocity.x > 0) { sprite.velocity.x -= 0.3; }
      if (sprite.velocity.x < 0) { sprite.velocity.x += 0.3; }
      if (sprite.velocity.y > 0) { sprite.velocity.y -= 0.3; }
      if (sprite.velocity.y < 0) { sprite.velocity.y += 0.3; }
    }
    if (timeFlying == 0) {
      timeFlying = flyingDuration;
      flying = false;
    }
  }
}


