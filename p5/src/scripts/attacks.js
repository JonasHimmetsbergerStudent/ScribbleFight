var projectile;
var projectiles = [];
var bomb;
// is he flying?
var flying = false;
// how long is he flying away
var flyingDuration = 50;
// how long has he been flying
var timeFlying = flyingDuration;

function defaultAttack() {

    projectile = createSprite(sprite.position.x, sprite.position.y, 20, 20);
    projectile.mass = 0.1;
    projectile.life = 200;
    projectile.velocity.x = (camera.mouseX - sprite.position.x) / 15;
    projectile.velocity.y = (camera.mouseY- sprite.position.y) / 15;
    projectiles.push(projectile);
    
  console.log(projectile.velocity.x);
    console.log("y: " + camera.mouseY);
    console.log("x: " + camera.mouseX);
}

function defaultAttackPhysics() {
  if(projectile!==undefined) {
    
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
    if (bomb !== undefined) {
        if (bomb.velocity.y <= 20) {
          bomb.velocity.y -= GRAVITY;
        }
        bomb.bounce(environment);
  
        if (bomb.bounce(sprite)) {
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
        if(timeFlying<=flyingDuration/2 && timeFlying > 0) {
          if(sprite.velocity.x>0) {sprite.velocity.x -= 0.3;}
          if(sprite.velocity.x<0) {sprite.velocity.x += 0.3;}
          if(sprite.velocity.y>0) {sprite.velocity.y -= 0.3;}
          if(sprite.velocity.y<0) {sprite.velocity.y += 0.3;}
          console.log("test");
        }
        if(timeFlying==0) {
          timeFlying = 100;
          flying = false;
        }
      }
  
}

