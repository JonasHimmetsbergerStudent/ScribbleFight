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
var touches_side;


//Forces
var GRAVITY = -1;
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
  sprite.setCollider("rectangle", 0, 0, player_width -15, player_height);
  sprite.addAnimation("normal", "../assets/amogus.png");
  sprite.debug = true;
  loadImage('../assets/amogus.png', img => {
    img.resize(100, 0);
    sprite.addImage(img);
    //initialising the pixel sprites for the playing environment
    for (let i = 0; i < pixel_clumps.length; i++) {
      sprite_pixels[i] = [];
      for (let j = 0; j < pixel_clumps[0].length; j++) {
        if (pixel_clumps[i][j][3] > 0) {
          if (sprite_pixels[i][j - 1] !== undefined) {
            same_x_counter++;
            sprite_pixels[i][j] = createSprite((j - ((same_x_counter - 1) / 2)) * 25, i * 25, 25 * (same_x_counter-1), 5);
            //sprite_pixels[i][j].visible = false;
            sprite_pixels[i][j - 1].remove();
            sprite_pixels[i][j - 1] = undefined;
          } else {
            same_x_counter = 1;
            sprite_pixels[i][j] = createSprite(j * 25, i * 25, 5, 5);
          }
        }
      }
    }
    /*
        for (let i = 0; i < pixel_clumps.length; i++) {
          sprite_pixels[i] = [];
          for (let j = 0; j < pixel_clumps[0].length; j++) {
            if (pixel_clumps[i][j][3] > 0) {
              sprite_pixels[i][j] = createSprite(j * 25, i * 25, 5, 5);
              sprite_pixels[i][j].immovable = true;
            }
          }
        } */

    started2 = true;
  });

  loadImage('../assets/smiley_bg.png', img => {
    bg = img;
    started = true;
  })

}

function draw() {
  touches_side = false;
  if (started && started2) {
    // max speed is 25 
    if (sprite.velocity.y <= 20) {
      sprite.velocity.y -= GRAVITY;
    }


    sprite.velocity.x = 0;


    background(bg);


    for (let i = 0; i < pixel_clumps.length; i++) {
      for (let j = 0; j < pixel_clumps[0].length; j++) {
        if (sprite_pixels[i][j] !== undefined) {
          if (sprite.collide(sprite_pixels[i][j])) {
            if(sprite.touching.left || sprite.touching.right) {
              touches_side = true;
            }
            if(touches_side) {
              sprite.velocity.y = sprite.velocity.y + 5;
            } else {
              sprite.velocity.y = 0;
            }
            JUMP_COUNT = 0;
          }
        }
      }

    }


      // Controls
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

    if (keyWentDown(69)) {
      if (player_direction == "left") {
        sprite.setCollider("rectangle", -10, 0, player_width + 5, player_height);
      } else {
        sprite.setCollider("rectangle", 10, 0, player_width + 5, player_height);
      }
      hit = true;
    }

    //Hitbox change/reset on attack
    if (hit) {
      HIT_DURATION--;
      if (HIT_DURATION == 0) {
        // reset hitbox
        sprite.setCollider("rectangle", 0, 0, player_width - 15, player_height);
        HIT_DURATION = 40;
        hit = false;
      }

    }
    mirrorSprite();
    drawSprites();
  }
}

// mirrors the sprite 
function mirrorSprite() {
  if (keyWentDown(65)) {
    if (sprite.mirrorX() === 1) {
      //hitbox should also switch directions during attack
      if (hit) {
        sprite.setCollider("rectangle", -10, 0, player_width + 5, player_height);
      }
      sprite.mirrorX(sprite.mirrorX() * -1);
      player_direction = "left";
    }
  }
  if (keyWentDown(68)) {
    if (sprite.mirrorX() === -1) {
      if (hit) {
        //hitbox should also switch directions during attack
        sprite.setCollider("rectangle", 10, 0, player_width + 5, player_height);
      }
      sprite.mirrorX(sprite.mirrorX() * -1);
      player_direction = "right";
    }
  }
}

//attack
function mouseClicked() {

}
