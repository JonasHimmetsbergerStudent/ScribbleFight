//Objects
var sprite;
var sprite_pixels = [];
var environment;
var enemy;

//Variables
var bg;
var started = false;
var screenWidth = 1429;
var screenHeight = 830;
var player_height = 75;
var player_width = 75;
var JUMP_COUNT = 0;
var same_x_counter = 1;
var MAX_JUMP = 3;
var touches_side;
var bombImg;



//Forces
var GRAVITY = -1;
var JUMP = 15;
var SPEED = 5;
var player_direction = "right";

function setup() {
  createCanvas(1429, 830);
  background(51);
  sprite = createSprite(500, 200, player_width, player_height);
  enemy = createSprite(700, 200, player_width, player_height);
  //box1 = createSprite(400, 400, 50, 50);
  sprite.setCollider("rectangle", 0, 0, player_width - 15, player_height);
  environment = new Group();
  sprite.addAnimation("normal", "../assets/amogus.png");
  sprite.debug = true;
  init();
}

function draw() {
  touches_side = false;
  if (started) {
    // max speed is 20 

    if (enemy.velocity.y <= 20) {
      enemy.velocity.y -= GRAVITY;
    }
    enemy.velocity.x = 0;

    if (sprite.velocity.y <= 20 && !flying) {
      sprite.velocity.y -= GRAVITY;
    } else if (flying) {
      sprite.velocity.y -= GRAVITY / 1.25;
    }
    bombPhysics();
    defaultAttackPhysics();
    spawn();

    background(bg);

    checkForCollisions();

    if (!flying) {
      sprite.velocity.x = 0;
      controls();
    }
    mirrorSprite();
    drawSprites();
  }
}

// mirrors the sprite 
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

function init() {
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
            sprite_pixels[i][j] = createSprite((j - ((same_x_counter - 1) / 2)) * 25, i * 25, 25 * (same_x_counter - 1), 5);
            sprite_pixels[i][j].visible = false;
            environment.add(sprite_pixels[i][j]);
            sprite_pixels[i][j].immovable = true;
            sprite_pixels[i][j - 1].remove();
            sprite_pixels[i][j - 1] = undefined;
          } else {
            same_x_counter = 1;
            sprite_pixels[i][j] = createSprite(j * 25, i * 25, 5, 5);
          }
        }
      }
    }

    // X Coordinates for the item drops
    getXCoordinates();
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

    loadImage('../assets/amogus.png', img => {
      img.resize(100, 0);
      enemy.addImage(img);
      loadImage('../assets/smiley_bg.png', img => {
        bg = img;
        loadImage('../assets/bomb.png', img => {
          img.resize(50, 0);
          bombImg = img;
          started = true;
        })
      })
    })
  });
}


function checkForCollisions() {
  if (!flying) {
    for (let i = 0; i < pixel_clumps.length; i++) {
      for (let j = 0; j < pixel_clumps[0].length; j++) {
        if (sprite_pixels[i][j] !== undefined) {
          if (sprite.collide(sprite_pixels[i][j])) {
            if (sprite.touching.left || sprite.touching.right) {
              touches_side = true;
            }
            if (touches_side) {
              sprite.velocity.y = sprite.velocity.y + 5;
            } else {
              sprite.velocity.y = 0;
            }
            if (!sprite.touching.top) {
              JUMP_COUNT = 0;
            }
          }
          if (enemy.collide(sprite_pixels[i][j])) {
            enemy.velocity.y = 0;
          }
        }
      }

    }
  } else {
    sprite.bounce(environment);
  }

  for (let i = 0; i < pixel_clumps.length; i++) {
    for (let j = 0; j < pixel_clumps[0].length; j++) {
      if (sprite_pixels[i][j] !== undefined) {
        if (enemy.collide(sprite_pixels[i][j])) {
          enemy.velocity.y = 0;
        }
      }
    }

  }

}





