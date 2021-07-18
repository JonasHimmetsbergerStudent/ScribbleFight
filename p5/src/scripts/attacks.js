var projectile;
var projectiles = [];
var bomb;
// is he flying?
var flying = false;
// how long is he flying away
var flyingDuration = 50;
// how long has he been flying
var timeFlying = flyingDuration;
var diffDirection = false;
var testKnockback = 3;
var projectileIndex;

function defaultAttack() {

    projectile = createSprite(sprite.position.x, sprite.position.y, 20, 20);
    projectile.mass = 10;
    projectile.life = 100;
    projectile.velocity.x = (camera.mouseX - sprite.position.x) / 15 * 100;
    projectile.velocity.y = (camera.mouseY- sprite.position.y) / 15 * 100;
    projectile.limitSpeed(20);   
    projectiles.push(projectile);

}

function defaultAttackPhysics() {
     
      console.log(enemy.velocity.x);
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
          if(projectile.life == 0 ) {
            if (projectileIndex > -1) {
              projectiles.splice(projectileIndex, 1);
            }
          }
          if(projectile.bounce(enemy)) {
            enemy.limitSpeed(5);
            projectile.remove();
            projectiles.splice(projectileIndex,1);
          }
        });
      
      
      }
}


function bombAttack() {
    if(bomb===undefined) {
        if(player_direction=="right") {
            bomb = createSprite(sprite.position.x + player_width, sprite.position.y, 100, 100);
        } else if(player_direction=="left") {
            bomb = createSprite(sprite.position.x - player_width, sprite.position.y, 100, 100);
        }
        bomb.addImage(bombImg);
        bomb.life = 1000;
        if(player_direction == "left") {
            bomb.velocity.x -= 5;
        } else if(player_direction == "right") {
            bomb.velocity.x += 5;
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
          if(sprite.velocity.x > 0 && bomb.velocity.x > 0 ) {
            diffDirection = true;
          }  if(sprite.velocity.y > 2 && bomb.velocity.y >= 0) {
            diffDirection = true;
          }
          if(!diffDirection) {
            sprite.velocity.x = bomb.velocity.x * 100;
            sprite.velocity.y = bomb.velocity.y * testKnockback * 100;
          } else {
            sprite.velocity.x = -bomb.velocity.x * 100;
            sprite.velocity.y = -bomb.velocity.y  * 100;
          }
          sprite.limitSpeed(10 * testKnockback);
          
          flying = true;
          bomb.remove();
          bomb = undefined;
        } else if (bomb.position.x > screenWidth || bomb.position.y > screenHeight || bomb.life == 0) {
          bomb.remove();
          bomb = undefined;
        }
  
      }
  
      if(flying) {
        timeFlying--;
        //slowdown 
        if(timeFlying<=flyingDuration/2 && timeFlying > 0) {
          console.log(timeFlying);
          if(sprite.velocity.x>0) {sprite.velocity.x -= 0.3;}
          if(sprite.velocity.x<0) {sprite.velocity.x += 0.3;}
          if(sprite.velocity.y>0) {sprite.velocity.y -= 0.3;}
          if(sprite.velocity.y<0) {sprite.velocity.y += 0.3;}
        }
        if(timeFlying==0) {
          timeFlying = 50;
          flying = false;
        }
      }
  
}

