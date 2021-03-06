//Objects
var player;
var sprite_pixels = [];
var environment;
var otherPlayers = [];

//Variables
var bg;
var started = false;
var screenWidth = 1429;
var screenHeight = 830;
var player_height = 75;
var player_width = 75;
var JUMP_COUNT = 0;
var same_x_counter = 1;
const MAX_JUMP = 3;
var touches_side;

// Images
var amogus;
var bombImg;
var itemImg;
var itemImgBlue;
var itemImgYellow;
var itemImgOrange;
var itemImgGreen;
var boogieBombImg;
var pianoImg;
var mineImg;
var amogus_supreme;

//Forces
const GAMESPEED = 1;
const GRAVITY = -1 * GAMESPEED;
var JUMP = 15;
if(GAMESPEED > 1) {
  JUMP = 15 * GAMESPEED / 1.435;
}
const SPEED = 5 * GAMESPEED;
const CLIMBINGSPEED = -5 * GAMESPEED;

function setup() {
  createCanvas(1429, 830);
  background(51);
  init();
  player = new Player(createSprite(450, 100, player_width, player_height));
  player.sprite.maxSpeed = 30;
  otherPlayers[0] = new Player(createSprite(800, 200, player_width, player_height));
  player.sprite.setCollider("rectangle", 0, 0, player_width - 15, player_height);
  environment = new Group();

  player.sprite.debug = true;
  
}

function draw() {
  console.log(player.sprite.position.y);
  touches_side = false;
  if (started && !youAreDead) {
    if (!flying && !noGravity) {
      player.sprite.velocity.y -= GRAVITY;
    } else if (flying) {
      player.sprite.velocity.y -= GRAVITY / 1.25;
    }
    bombPhysics();
    defaultAttackPhysics();
    blackHolePhysics();
    pianoPhysics();
    minePhysics();
    smallChecker();
    spawn();
    

    background(bg);

    checkForCollisions();

    if (!flying && !noGravity) {
      player.sprite.velocity.x = 0;
      controls();
    }
   
    mirrorSprite();
    deathCheck();
    drawSprites();
  }
}


function init() {
  loadImage('../assets/amogus.png', img => {
    img.resize(100, 0);
    amogus = img;
    player.sprite.addImage(amogus);

    //initialising the pixel sprites for the playing environment
    for (let i = 0; i < pixel_clumps.length; i++) {
      sprite_pixels[i] = [];
      for (let j = 0; j < pixel_clumps[0].length; j++) {
        if (pixel_clumps[i][j][3] > 0) {
          if (sprite_pixels[i][j - 1] !== undefined) {
            same_x_counter++;
            sprite_pixels[i][j] = createSprite((j - ((same_x_counter - 1) / 2)) * 25, i * 25, 25 * (same_x_counter - 1), 25);
            sprite_pixels[i][j].visible = false;
            sprite_pixels[i][j].debug = true;
            environment.add(sprite_pixels[i][j]);
            sprite_pixels[i][j].immovable = true;
            sprite_pixels[i][j - 1].remove();
            sprite_pixels[i][j - 1] = undefined;
          } else {
            same_x_counter = 1;
            sprite_pixels[i][j] = createSprite(j * 25, i * 25, 25, 25);
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

   
      loadImage('../assets/smiley_bg.png', img => {
        bg = img;
        loadImage('../assets/bomb.png', img => {
          img.resize(50, 0);
          bombImg = img;
          loadImage('../assets/item.png',img => {
            img.resize(50,0);
            itemImg = img;
            loadImage('../assets/boogieBomb.png',img => {
              img.resize(50,0);
              boogieBombImg = img;
              loadImage('../assets/item_blue.png',img => {
                img.resize(50,0);
                itemImgBlue = img;
                loadImage('../assets/piano.png',img => {
                  img.resize(120,0);
                  pianoImg = img;
                  loadImage('../assets/item_yellow.png',img => {
                    img.resize(50,0);
                    itemImgYellow = img;
                    loadImage('../assets/item_orange.png',img => {
                      img.resize(50,0);
                      itemImgOrange = img;
                      loadImage('../assets/mine.png',img => {
                        img.resize(50,0);
                        mineImg= img;
                        loadImage('../assets/item_green.png',img => {
                          img.resize(50,0);
                          itemImgGreen= img;
                          loadImage('../assets/amogus_supreme.png',img => {
                            img.resize(50,0);
                            amogus_supreme= img;
                            started = true;
                          })
                        })
                      })
                    })
                  })
                })
              })
            })
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
          if (player.sprite.collide(sprite_pixels[i][j])) {
            if (player.sprite.touching.left || player.sprite.touching.right) {
              touches_side = true;
            }
            if (touches_side && !noGravity) {
              player.sprite.velocity.y = CLIMBINGSPEED;
            } else if(!noGravity && !player.sprite.touching.top) {
              player.sprite.velocity.y = 0;
            }
            if (!player.sprite.touching.top) {
              JUMP_COUNT = 0;
            }
          }
        }
      }

    }
  } else {
    player.sprite.bounce(environment);
  }
}





