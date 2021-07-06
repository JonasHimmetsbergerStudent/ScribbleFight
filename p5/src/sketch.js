//Objects
var sprite;
var collider;
var box1;
var started = false;
var sprite_pixels = [];


//Variables
var bg;

//Forces
var GRAVITY = -1;
var JUMP = 15;
var SPEED = 5;
var HIT_DURATION = 40;
var hit = false;
var player_direction;

function setup() {
 
  createCanvas(windowWidth, windowHeight);
  background(51);
  sprite = createSprite(400, 200, 50, 50);
  //box1 = createSprite(400, 400, 50, 50);
  sprite.setCollider("rectangle", 0, 0, 35, 45);
  sprite.addAnimation("normal", "../assets/amogus.png");
  collider = createSprite(400, 500, 200, 200);
  sprite.debug = true;
  collider.debug = true;

  sprite.debug = true;
  loadImage('../assets/amogus.png', img => {
    img.resize(50, 0);
    sprite.addImage(img);
  });

  //bg = loadImage('../assets/smiley_bg.png');
 // bg.resize(10,10);

 //initialising the pixel sprites for the playing environment
  for (let i = 0; i < pixel_clumps.length; i++) {
    sprite_pixels[i] = [];
    for (let j = 0; j <pixel_clumps[0].length; j++) {
      if(pixel_clumps[i][j][3]>10) {
        sprite_pixels[i][j] = createSprite(j*20,i*20,8,8);
      }
    }
     
  }




  loadImage('../assets/platform.png', img => {
    img.resize(200, 0);
    collider.addImage(img);
    started = true;
  });
}

function draw() {
  background(255,255,255);
  if (started) {
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



    for (let i = 0; i < 33; i++) {
      for (let j = 0; j <57; j++) {
        if(sprite_pixels[i][j]!==undefined) {
          if(sprite.collide(sprite_pixels[i][j])) {
            sprite.velocity.y = 0;
          }
        }
      }
       
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
   // if (keyIsDown(83)) {
    //  sprite.velocity.y -= GRAVITY;
    //}
    //attack
    if (mouseIsPressed) {
      if (mouseButton === LEFT) {
        if (player_direction == "left") {
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
      player_direction = "left";
    }
  }
  if (keyWentDown(68)) {
    if (sprite.mirrorX() === -1) {
      sprite.mirrorX(sprite.mirrorX() * -1);
      player_direction = "right";
    }
  }
}
