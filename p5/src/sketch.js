//Objects
var sprite;
var collider;
var box1;
var started = false;
var started1 = false;
var started2 = false;
var pixels = [];
var lines;
var big_lines;
var curved_line;

//Forces
var GRAVITY = -1;
var JUMP = 15;
var SPEED = 5;
var HIT_DURATION = 40;
var hit = false;

function setup() {
  createCanvas(1920, 1080);
  background(51);
  sprite = createSprite(400, 200, 50, 50);
  box1 = createSprite(300, 200, 50, 50);
  box1.setCollider("rectangle", 0, 0, 50, 50);
  box2 = createSprite(400, 100, 50, 50);
  sprite.setCollider("rectangle", 0, 0, 35, 45);
  sprite.addAnimation("normal", "../assets/amogus.png");
  lines = createSprite(1200, 200, 500, 500);
  curved_line = createSprite(500, 200, 300, 300);
  collider = createSprite(400, 500, 200, 200);
  lines.debug = true;
  sprite.debug = true;
  collider.debug = true;

  sprite.debug = true;
  loadImage('../assets/amogus.png', img => {
    img.resize(50, 0);
    sprite.addImage(img);
    started2 = true;
  });




  loadImage('../assets/platform.png', img => {
    img.resize(200, 0);
    collider.addImage(img);
    started = true;
  });

  /* loadImage('../assets/lines.png', img => {
     img.resize(1200, 0);
     lines.addImage(img);
   }); */
  loadImage('../assets/curved_line.png', img => {
    img.resize(200, 0);
    curved_line.addImage(img);
    started1 = true;
  });


  /*loadImage('../assets/big_lines.png', img => {
    img.resize(700, 0);
    big_lines.addImage(img);

  }); */

  for (let index = 0; index < 300; index++) {
    pixels[index] = index;
  }



}

function draw() {
  if (started && started1 && started2) {
    //Hitbox change on attack
    if (hit) {
      HIT_DURATION--;
      if (HIT_DURATION == 0) {
        console.log("jetzt");
        sprite.setCollider("rectangle", 0, 0, 35, 45);
        HIT_DURATION = 40;
        hit = false;
      }

    }
    sprite.velocity.y -= GRAVITY;
    sprite.velocity.x = 0;
    background(255, 255, 255);

    if (collider.overlapPixel(sprite.position.x, sprite.position.y + 20)) {
      sprite.velocity.y = 0;
    }
    while (collider.overlapPixel(sprite.position.x, sprite.position.y + 20)) {
      sprite.position.y--;
    }

    /* if (curved_line.overlapPixel(sprite.position.x, sprite.position.y + (sprite.height / 2))) {
       sprite.velocity.y -= GRAVITY;
     }
 
     while (curved_line.overlapPixel(sprite.position.x, sprite.position.y + (sprite.height / 2))
       || curved_line.overlapPixel(sprite.position.x, sprite.position.y - (sprite.height / 2))) {
       sprite.velocity.y = 0;
       if (sprite.previousPosition.y < sprite.position.y) {
         console.log("moin");
         sprite.position.y--;
       } else if (sprite.previousPosition.y > sprite.position.y) {
         console.log("hi");
         sprite.position.y++;
       } else if(sprite.previousPosition.y == sprite.position.y) {
         sprite.position.x += 50 ;
         sprite.position.y+=50;
       } 
       
 
     } */





    /* pixels.forEach(index => {
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





    if (sprite.collide(box1)) {
      if (sprite.touching.left) {
        console.log("hallo");
      }
      sprite.velocity.y = 0;
    }

    if (sprite.collide(box2)) {
      if (sprite.touching.left) {
        console.log("hallo");
      }
      sprite.velocity.y = 0;
    }

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
    //attack
    if (mouseIsPressed) {
      if (mouseButton === LEFT) {
        if (sprite.mirrorX() === -1) {
          sprite.setCollider("rectangle", -7, 0, 40, 45);
        } else {
          sprite.setCollider("rectangle", 7, 0, 40, 45);
        }
        hit = true;
      }


    }
    mirrorSprite();
    drawSprites();
  }
}

function mirrorSprite() {
  if (keyWentDown(65)) {
    if (sprite.mirrorX() === 1) {
      sprite.mirrorX(sprite.mirrorX() * -1);
    }
  }
  if (keyWentDown(68)) {
    if (sprite.mirrorX() === -1) {
      sprite.mirrorX(sprite.mirrorX() * -1);
    }
  }
}
