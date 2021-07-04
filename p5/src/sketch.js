

//Objects
var sprite;
var collider;
var testSprite;
var started;
var pixels = [];
var lines;
var big_lines;

//Forces
var GRAVITY = -1;
var JUMP = 15;
var SPEED = 5;

function setup() {
  createCanvas(1920, 1080);
  background(51);
  sprite = createSprite(400, 200, 50, 50);
  sprite.setCollider("rectangle", 0, 0, 40, 45);
  sprite.addAnimation("normal", "../assets/amogus.png");
  lines = createSprite(1200,500,500,500);
  big_lines = createSprite(800,500,300,300);
  collider = createSprite(400, 500, 200, 200);
  lines.debug = true;
 
  collider.debug = true;

  sprite.debug = true;
  loadImage('../assets/amogus.png', img => {
    img.resize(50, 0);
    sprite.addImage(img);
  });


  loadImage('../assets/platform.png', img => {
    img.resize(200, 0);
    collider.addImage(img);
    started = true;
  });

  loadImage('../assets/lines.png', img => {
    img.resize(1200, 0);
    lines.addImage(img);
  
  });

  loadImage('../assets/big_lines.png', img => {
    img.resize(700, 0);
    big_lines.addImage(img);
  
  });

  for (let index = 0; index < 300; index++) {
    pixels[index] = index;
  }



}

function draw() {
  if (started) {
    sprite.velocity.y -= GRAVITY;
    sprite.velocity.x = 0;
    background(255, 255, 255);

    if (collider.overlapPixel(sprite.position.x, sprite.position.y + 20)) {
      sprite.velocity.y = 0;
      while (collider.overlapPixel(sprite.position.x, sprite.position.y + 20)) {
        sprite.position.y--;
      }
    }

    if (big_lines.overlapPixel(sprite.position.x, sprite.position.y + 25)) {
      sprite.velocity.y = 0;
      
      while (big_lines.overlapPixel(sprite.position.x, sprite.position.y + 25)) {
        if(sprite.previousPosition.y < sprite.position.y) {
          sprite.position.y--;
        } else {
          sprite.position.y++;
        }
        
      }
    }

   /* if (lines.overlapPixel(sprite.position.x, sprite.position.y +20 )) {
      console.log("jfd");
      sprite.velocity.y = 0;
  
    }*/

   

    /*pixels.forEach(index => {
      if(sprite.overlapPoint(index,200)) {
        sprite.velocity.y = 0;
        while(sprite.overlapPoint(index,200)) {
          if(sprite.position.y < 200) {
            sprite.position.y--;
          }
          if(sprite.position.y > 200) {
            sprite.position.y++;
          }
          
        }
      }
    }); */

   
   
    

    /*if (sprite.collide(testSprite)) {
      if (sprite.touching.left) {
        console.log("hallo");
      }
      sprite.velocity.y = 0;
    } */

    // Controls
    //Spacebar
    if (keyWentDown(32)) {
      sprite.velocity.y = -JUMP;
    }
    //A
    if (keyIsDown(65)) {
      sprite.velocity.x = -SPEED;

    }
    //D
    if (keyIsDown(68)) {
      sprite.velocity.x = SPEED;
    }
    //S
    if (keyIsDown(83)) {
      sprite.velocity.y -= GRAVITY;
    }
    mirrorSprite();
    drawSprites();
  }
}

function mirrorSprite() {
  if (keyWentDown(65)) {
    if(sprite.mirrorX() === 1) {
    sprite.mirrorX(sprite.mirrorX() * -1);
    }
  }
  if (keyWentDown(68)) {
    if (sprite.mirrorX() === -1) {
      sprite.mirrorX(sprite.mirrorX() * -1);
    }
  }
}