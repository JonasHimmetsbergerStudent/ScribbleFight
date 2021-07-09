//Objects
var sprite;
var started = false;
var started2 = false;
var sprite_pixels = [];

//Variables
var bg;
var player_height = 75;
var player_width = 75;
var JUMP_COUNT = 0;
var same_x_counter = 1;
var MAX_JUMP = 3;


//Forces
var GRAVITY = -0.8;
var JUMP = 15;
var SPEED = 5;
var HIT_DURATION = 40;
var hit = false;
var player_direction;

function setup() {

  createCanvas(1429, 830);
  background(51);
  sprite = createSprite(500, 200, player_width, player_height);
  //box1 = createSprite(400, 400, 50, 50);
  sprite.setCollider("rectangle", 0, 0, 60, 75);
  sprite.addAnimation("normal", "../assets/amogus.png");
  sprite.debug = true;
  loadImage('../assets/amogus.png', img => {
    img.resize(100, 0);
    sprite.addImage(img);
    //initialising the pixel sprites for the playing environment
    /*  for (let i = 0; i < pixel_clumps.length; i++) {
        sprite_pixels[i] = [];
        for (let j = 0; j < pixel_clumps[0].length; j++) {
          if (pixel_clumps[i][j][3] > 0) {
            if(sprite_pixels[i][j-1]!==undefined) {
              same_x_counter++;
              sprite_pixels[i][j] = createSprite(j -  , i * 20, 7 * same_x_counter, 7);
              console.log(same_x_counter);
            } else {
              same_x_counter = 1;
              sprite_pixels[i][j] = createSprite(j * 20, i * 20, 7, 7);
            }
            sprite_pixels[i][j].immovable = true;
          }
        }
      } */

    console.log(sprite_pixels);



    for (let i = 0; i < pixel_clumps.length; i++) {
      sprite_pixels[i] = [];
      for (let j = 0; j < pixel_clumps[0].length; j++) {
        if (pixel_clumps[i][j][3] > 0) {
          sprite_pixels[i][j] = createSprite(j * 25, i * 25, 1, 1);
          sprite_pixels[i][j].immovable = true;
          sprite_pixels[i][j].visible = false;
        }
      }
    }

    started2 = true;
  });

  loadImage('../assets/smiley_bg.png', img => {
    bg = img;
    started = true;
  })

}

function draw() {
  if (started && started2) {
    sprite.velocity.y -= GRAVITY;
    sprite.velocity.x = 0;
    background(bg);


    for (let i = 0; i < pixel_clumps.length; i++) {
      for (let j = 0; j < pixel_clumps[0].length; j++) {
        if (sprite_pixels[i][j] !== undefined) {
          if (sprite.collide(sprite_pixels[i][j])) {
            console.log("collision");
            JUMP_COUNT = 0;
            sprite.velocity.y = 0;
          }

        }
      }

    }

  
  
    //Spacebar
    if (keyWentDown(32)) {
      if (!(JUMP_COUNT >= MAX_JUMP)) {
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

    //Hitbox change on attack
    if (hit) {
      HIT_DURATION--;
      if (HIT_DURATION == 0) {
        // reset hitbox
        sprite.setCollider("rectangle", 0, 0, 60, 75);
        HIT_DURATION = 40;
        hit = false;
      }

    }





    // Controls


    mirrorSprite();
    drawSprites();
  }
}

function mirrorSprite() {
  if (keyWentDown(65)) {
    if (sprite.mirrorX() === 1) {
      //hitbox should also switch directions during attack
      if (hit) {
        sprite.setCollider("rectangle", -10, 0, 55, 45);
      }
      sprite.mirrorX(sprite.mirrorX() * -1);
      player_direction = "left";
    }
  }
  if (keyWentDown(68)) {
    if (sprite.mirrorX() === -1) {
      if (hit) {
        //hitbox should also switch directions during attack
        sprite.setCollider("rectangle", 10, 0, 55, 45);
      }
      sprite.mirrorX(sprite.mirrorX() * -1);
      player_direction = "right";
    }
  }
  if (keyWentDown(69)) {
    if (player_direction == "left") {
      sprite.setCollider("rectangle", -10, 0, 80, 75);
    } else {
      sprite.setCollider("rectangle", 10, 0, 80, 75);
    }
    hit = true;
  }
}

//attack
function mouseClicked() {

}
