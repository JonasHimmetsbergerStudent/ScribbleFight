//Objects
var sprite_pixels = [];
var environment;
var players = [];
var socket;

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
if (GAMESPEED > 1) {
  JUMP = 15 * GAMESPEED / 1.435;
}
const SPEED = 5 * GAMESPEED;
const CLIMBINGSPEED = -5 * GAMESPEED;



function setup() {
  var canvas = createCanvas(windowWidth, windowHeight);
  background('FFFFFF');
  var backgroundImage = new Image();
  backgroundImage.src = 'assets/smiley_bg.png';


  var obildbreite = 1;
  var obildhoehe = 1;
  backgroundImage.onload = function () {
    obildbreite = this.width;
    obildhoehe = this.height;



    if ((windowWidth / windowHeight) > (obildbreite / obildhoehe)) {
      let screenHeight = windowHeight;
      var faktor = screenHeight / obildhoehe;
      newImageHeight = faktor * obildhoehe;
      newImageWidth = faktor * obildbreite;
    } else {
      let screenWidth = windowWidth;
      var faktor = screenWidth / obildbreite;
      newImageHeight = faktor * obildhoehe;
      newImageWidth = faktor * obildbreite;
    }

    const pixelWidth = obildbreite / pixel_clumps[0].length * faktor;
    environment = new Group();
    for (let i = 0; i < pixel_clumps.length; i++) {
      sprite_pixels[i] = [];
      for (let j = 0; j < pixel_clumps[0].length; j++) {
        if (pixel_clumps[i][j][3] > 0) {
          if (sprite_pixels[i][j - 1] !== undefined) {
            same_x_counter++;
            sprite_pixels[i][j] = createSprite((j - ((same_x_counter) / 2) + 0.5) * pixelWidth + ((windowWidth - newImageWidth) / 2), i * pixelWidth + ((windowHeight - newImageHeight) / 2) + 20, pixelWidth * (same_x_counter), pixelWidth);
            sprite_pixels[i][j].visible = false;
            sprite_pixels[i][j].debug = true;
            sprite_pixels[i][j].depth = 10;
            sprite_pixels[i][j].immovable = true;
            environment.add(sprite_pixels[i][j]);
            sprite_pixels[i][j - 1].remove();
            sprite_pixels[i][j - 1] = undefined;
          } else {
            same_x_counter = 1;
            sprite_pixels[i][j] = createSprite(j * pixelWidth + ((windowWidth - newImageWidth) / 2), i * pixelWidth + ((windowHeight - newImageHeight) / 2) + 20, pixelWidth, pixelWidth);
            sprite_pixels[i][j].debug = true;
            environment.add(sprite_pixels[i][j]);
            sprite_pixels[i][j].visible = false;
          }
        }
      }
    }
    // X Coordinates for the item drops
    getXCoordinates();


    /*  for (let i = 0; i < pixel_clumps.length; i++) {
         sprite_pixels[i] = [];
         for (let j = 0; j < pixel_clumps[0].length; j++) {
           if (pixel_clumps[i][j][3] > 0) {
             sprite_pixels[i][j] = createSprite(j * pixelWidth + ((windowWidth-newImageWidth)/2), i * pixelWidth, pixelWidth, pixelWidth);
             sprite_pixels[i][j].immovable = true;
             environment.add(sprite_pixels[i][j]);
             //sprite_pixels[i][j].visible = false;
           }
         }
       } */

    //for background
    /*let div = createDiv('').size(newImageWidth, newImageHeight);
    div.style('background-color', 'orange');
    div.style('background', 'url("assets/komischer_smiley.png")');
    div.style('background-repeat', 'no-repeat');
    div.style('background-size','contain');
    div.center(); */

    let background = createSprite(windowWidth / 2, windowHeight / 2, newImageWidth, newImageHeight);
    loadImage('assets/smiley_bg.png', img => {
      img.resize(newImageWidth, newImageHeight);
      background.addImage(img);
      background.depth = -1;
    })

  }

  socket = io.connect('http://localhost:3000');
  socket.on("deletePlayer", deletePlayer);
  socket.on('newPlayer', createNewPlayer);
  socket.on('update', updatePosition);
  socket.on('updateDirection', updateDirection);
  socket.on('spawnItem', createItem);
  socket.on('deleteItem', syncItems);
  socket.on('attack', addAttack);
  socket.on('deleteAttack', deleteAttack);
  init();
}

function createNewPlayer(data) {
  loadImage('assets/amogus.png', img => {
    img.resize(100, 0);
    players[data.id] = new Player(createSprite(windowWidth / 2, 200, player_width, player_height));
    players[data.id].sprite.maxSpeed = 30;
    players[data.id].sprite.setCollider("rectangle", 0, 0, player_width - 15, player_height);
    players[data.id].sprite.debug = true;
    players[data.id].sprite.addImage(img);
    console.log(socket.id);
    console.log(data.id);
    started = true;
  });
}

function deletePlayer(id) {
  if (players[id] != undefined) {
    players[id].sprite.remove();
    players[id] = undefined;
  }
}

function updatePosition(data) {
  if(players[data.id]!=undefined) {
    players[data.id].sprite.position.x = data.x;
    players[data.id].sprite.position.y = data.y;
  }
}

function updateDirection(data) {
  if (data.direction == "left") {
    if (players[data.id].sprite.mirrorX() === 1) {
      players[data.id].sprite.mirrorX(players[data.id].sprite.mirrorX() * -1);
    }
  } else if (data.direction == "right") {
    if (players[data.id].sprite.mirrorX() === -1) {
      players[data.id].sprite.mirrorX(players[data.id].sprite.mirrorX() * -1);
    }
  }

}

function draw() {
  touches_side = false;
  if (players[socket.id] != undefined && !youAreDead) {
    if (!flying && !noGravity) {
      players[socket.id].sprite.velocity.y -= GRAVITY;
    } else if (flying) {
      players[socket.id].sprite.velocity.y -= GRAVITY / 1.25;
    }
    bombPhysics();
    defaultAttackPhysics();
    blackHolePhysics();
    pianoPhysics();
    minePhysics();
    smallChecker();
    spawn();


    background('FFFFFF');

    checkForCollisions();

    if (!flying && !noGravity) {
      players[socket.id].sprite.velocity.x = 0;
      controls();
    }

    mirrorSprite();
    //deathCheck();
    drawSprites();
    var data = {
      x: players[socket.id].sprite.position.x,
      y: players[socket.id].sprite.position.y
    }
    socket.emit('update', data);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


function init() {
  loadImage('assets/bomb.png', img => {
    img.resize(50, 0);
    bombImg = img;
    loadImage('assets/item.png', img => {
      img.resize(50, 0);
      itemImg = img;
      loadImage('assets/boogieBomb.png', img => {
        img.resize(50, 0);
        boogieBombImg = img;
        loadImage('assets/item_blue.png', img => {
          img.resize(50, 0);
          itemImgBlue = img;
          loadImage('assets/piano.png', img => {
            img.resize(120, 0);
            pianoImg = img;
            loadImage('assets/item_yellow.png', img => {
              img.resize(50, 0);
              itemImgYellow = img;
              loadImage('assets/item_orange.png', img => {
                img.resize(50, 0);
                itemImgOrange = img;
                loadImage('assets/mine.png', img => {
                  img.resize(50, 0);
                  mineImg = img;
                  loadImage('assets/item_green.png', img => {
                    img.resize(50, 0);
                    itemImgGreen = img;
                    loadImage('assets/amogus_supreme.png', img => {
                      img.resize(50, 0);
                      amogus_supreme = img;
                      socket.emit('newPlayer');
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
          if (players[socket.id].sprite.collide(sprite_pixels[i][j])) {
            if (players[socket.id].sprite.touching.left || players[socket.id].sprite.touching.right) {
              touches_side = true;
            }
            if (touches_side && !noGravity) {
              players[socket.id].sprite.velocity.y = CLIMBINGSPEED;
            } else if (!noGravity && !players[socket.id].sprite.touching.top) {
              players[socket.id].sprite.velocity.y = 0;
            }
            if (!players[socket.id].sprite.touching.top) {
              JUMP_COUNT = 0;
            }
          }
        }
      }

    }
  } else {
    players[socket.id].sprite.bounce(environment);
  }
}





