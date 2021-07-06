//Objects
var sprite;
var started = false;
var started2 = false;
var sprite_pixels = [];

//Variables
var bg;
var JUMP_COUNT = 0;

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
  sprite = createSprite(500, 200, 50, 50);
  //box1 = createSprite(400, 400, 50, 50);
  sprite.setCollider("rectangle", 0, 0, 35, 45);
  sprite.addAnimation("normal", "../assets/amogus.png");
  sprite.debug = true;
  loadImage('../assets/amogus.png', img => {
    img.resize(50, 0);
    sprite.addImage(img);
    //initialising the pixel sprites for the playing environment
    for (let i = 0; i < pixel_clumps.length; i++) {
      sprite_pixels[i] = [];
      for (let j = 0; j < pixel_clumps[0].length; j++) {
        if (pixel_clumps[i][j][3] > 0) {
          sprite_pixels[i][j] = createSprite(j * 20, i * 20, 7, 7);
          sprite_pixels[i][j].immovable = true;
        }
      }
    }
    started2 = true;
  });

  loadImage('../assets/smiley_bg.png',img=> {
    img.resize(windowWidth,windowHeight);
    bg = img;
    started = true;
  })

}

function draw() {
  if (started && started2) {
    background(bg);
    //Hitbox change on attack
    if (hit) {
      HIT_DURATION--;
      if (HIT_DURATION == 0) {
        // reset hitbox
        sprite.setCollider("rectangle", 0, 0, 35, 45);
        HIT_DURATION = 40;
        hit = false;
      }

    }
    sprite.velocity.y -= GRAVITY;
    sprite.velocity.x = 0;


    for (let i = 0; i < pixel_clumps.length; i++) {
      for (let j = 0; j < pixel_clumps[0].length; j++) {
        if (sprite_pixels[i][j] !== undefined) {
          if (sprite.collide(sprite_pixels[i][j])) {
            if (sprite.touching.bottom) {
              JUMP_COUNT = 0;
            }
            sprite.velocity.y = 0;
          }
          
        }
      }

    }

    // Controls
    //Spacebar
    if (keyWentDown(32)) {
      if (!(JUMP_COUNT > 1)) {
        sprite.velocity.y = -JUMP;
        JUMP_COUNT++;
      }
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
   
    mirrorSprite();
    drawSprites();
  }
}

function mirrorSprite() {
  if (keyWentDown(65)) {
    if (sprite.mirrorX() === 1) {
      //hitbox should also switch directions during attack
      if(hit) {
        sprite.setCollider("rectangle", -10, 0, 55, 45);
      }
      sprite.mirrorX(sprite.mirrorX() * -1);
      player_direction = "left";
    }
  }
  if (keyWentDown(68)) {
    if (sprite.mirrorX() === -1) {
      if(hit) {
         //hitbox should also switch directions during attack
        sprite.setCollider("rectangle", 10, 0, 55, 45);
      }
      sprite.mirrorX(sprite.mirrorX() * -1);
      player_direction = "right";
    }
  }
}


function mouseClicked() {
  if (player_direction == "left") {
    sprite.setCollider("rectangle", -10, 0, 55, 45);
  } else {
    sprite.setCollider("rectangle", 10, 0, 55, 45);
  }
  hit = true;
}
