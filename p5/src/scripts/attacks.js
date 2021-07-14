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

function ballBounce() {
    console.log("e");
    if(bomb===undefined) {
        bomb = createSprite(sprite.position.x, sprite.position.y, 100, 100);
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

