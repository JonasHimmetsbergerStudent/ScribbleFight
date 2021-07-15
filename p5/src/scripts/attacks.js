var projectile;
var bomb;

function defaultAttack() {

    projectile = createSprite(sprite.position.x, sprite.position.y, 20, 20);
    projectile.life = 200;
    projectile.velocity.x = (camera.mouseX - sprite.position.x) / 15;
    projectile.velocity.y = (camera.mouseY- sprite.position.y) / 15;

    console.log("y: " + camera.mouseY);
    console.log("x: " + camera.mouseX);
}

function bombAttack() {
    if(bomb===undefined) {
        if(player_direction=="right") {
            bomb = createSprite(sprite.position.x + player_width, sprite.position.y, 100, 100);
        } else if(player_direction=="left") {
            bomb = createSprite(sprite.position.x - player_width, sprite.position.y, 100, 100);
        }
        bomb.addImage(bombImg);
        bomb.setCollider("circle",0,0,25);
        bomb.life = 1000;
        if(player_direction == "left") {
            bomb.velocity.x -= 5;
        } else if(player_direction == "right") {
            bomb.velocity.x += 5;
        }
        bomb.debug = true;
    
    
        bomb.mass = 5;
        sprite.mass=1;  
  }
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
        flyingDuration--;
        if(flyingDuration==0) {
          flyingDuration = 100;
          flying = false;
        }
      }
  
      if(!flying) {
        sprite.velocity.x = 0;
        console.log("yes");
      }
}

