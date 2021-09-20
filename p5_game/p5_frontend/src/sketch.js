//Objects
var sprite_pixels = [];
var environment;
var players = [];
var socket;

//Variables
var bg;
var player_height;
var player_width;
var imageFaktor;
var JUMP_COUNT = 0;
var same_x_counter = 1;
const MAX_JUMP = 3;
var touches_side;
var background_path = "assets/komischer_smiley.png";
var cookieArr = [];
cookieArr["dmgDealt"] = 0;
cookieArr["knockback"] = 1;
cookieArr["death"] = 0;
cookieArr["kills"] = 0;
var visual;
var pixelWidth;
var visCopy;

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
  backgroundImage.src = background_path;


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

    pixelWidth = Math.max(obildbreite, obildhoehe) / pixel_clumps[0].length * faktor;
    environment = new Group();
    console.log(pixelWidth);
    for (let i = 0; i < pixel_clumps.length; i++) {
      sprite_pixels[i] = [];
      for (let j = 0; j < pixel_clumps[0].length; j++) {
        if (pixel_clumps[i][j][3] > 0) {
          if (sprite_pixels[i][j - 1] !== undefined) {
            same_x_counter++;
            sprite_pixels[i][j] = createSprite((j - ((same_x_counter) / 2) + 0.5) * pixelWidth + ((windowWidth - newImageWidth) / 2) + (newImageWidth - pixel_clumps[0].length * pixelWidth) / 2, i * pixelWidth + ((windowHeight - newImageHeight) / 2) + (newImageHeight - pixel_clumps.length * pixelWidth) / 2 + pixelWidth * 3 / 4, pixelWidth * (same_x_counter), pixelWidth);
            sprite_pixels[i][j].visible = false;
            sprite_pixels[i][j].debug = true;
            sprite_pixels[i][j].depth = 10;
            sprite_pixels[i][j].immovable = true;
            environment.add(sprite_pixels[i][j]);
            sprite_pixels[i][j - 1].remove();
            sprite_pixels[i][j - 1] = undefined;
          } else {
            same_x_counter = 1;
            sprite_pixels[i][j] = createSprite(j * pixelWidth + ((windowWidth - newImageWidth) / 2) + (newImageWidth - pixel_clumps[0].length * pixelWidth) / 2, i * pixelWidth + ((windowHeight - newImageHeight) / 2) + (newImageHeight - pixel_clumps.length * pixelWidth) / 2 + pixelWidth * 3 / 4, pixelWidth, pixelWidth);
            sprite_pixels[i][j].debug = true;
            sprite_pixels[i][j].immovable = true;
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
    loadImage(background_path, img => {
      img.resize(newImageWidth, newImageHeight);
      background.addImage(img);
      background.depth = -1;
      console.log(faktor);
      player_width = pixelWidth * 9 / 4;
      player_height = pixelWidth * 3;
      imageFaktor = pixelWidth * 4;
      init();
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
  socket.on('kill', addKill);
  socket.on('deleteAttack', deleteAttack);
}

function createNewPlayer(data) {
  loadImage('assets/amogus.png', img => {
    img.resize(imageFaktor, 0);
    players[data.id] = new Player(createSprite(windowWidth / 2, windowHeight / 2, player_width, player_height));
    players[data.id].sprite.maxSpeed = 25;
    players[data.id].sprite.setCollider("rectangle", 0, 0, player_width - player_width / 4, player_height);
    players[data.id].sprite.debug = true;
    players[data.id].sprite.addImage(img);
    amogus = img;

  });
}

function deletePlayer(id) {
  if (players[id] != undefined) {
    players[id].sprite.remove();
    players[id] = undefined;
  }
}

function updatePosition(data) {
  if (players[data.id] != undefined) {
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

function addKill(data) {
  cookieArr["kills"] += 1;
}

let damagedByTimer = 5;
function draw() {
  touches_side = false;
  if (players[socket.id] != undefined && !youAreDead) {
    if (!flying && !noGravity) {
      players[socket.id].sprite.velocity.y -= GRAVITY;
    } else if (flying) {
      players[socket.id].sprite.velocity.y -= GRAVITY / 1.25;
    }
    visCopy = JSON.parse(JSON.stringify(visual));
    addSpriteToVisual(players[socket.id].sprite);
    // console.log(visCopy);
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

    if (frameCount == 60 && damagedByTimer > 0) {
      damagedByTimer--;
    }

    if (damagedByTimer == 0) {
      damagedByTimer = 5;
      players[socket.id].damagedBy = null;
    }

    mirrorSprite();
    deathCheck();
    drawSprites();
    var data = {
      x: players[socket.id].sprite.position.x,
      y: players[socket.id].sprite.position.y
    }
    socket.emit('update', data);

    setCookies();


  }
}

/**
 * it is what it is
 * @param {*} param0 
 * @returns 
 */
function createAndFillTwoDArray({ rows, columns, defaultValue }) {
  return Array.from({ length: rows }, () => (
    Array.from({ length: columns }, () => defaultValue)
  ))
}

/**
 * Converts standard map, which is 55x55 
 * into visual map which is 165x165 for better accuracy
 * 
 * @param {given arry which represents map} paramarr 
 * @returns new visual array
 */
function getVisualMap(paramarr) {
  let visual = createAndFillTwoDArray({ rows: paramarr.length * 3, columns: paramarr.length * 3, defaultValue: [0] })
  for (let i = 0; i < visual.length; i++) {
    for (let j = 0; j < visual[0].length; j++) {
      if (paramarr[int(i / 3)][int(j / 3)][3] > 0) {
        visual[i][j] = [1]
      }
    }
  }
  return visual
}

function getVisualCoordinates(x, y) {
  // x wird geparsed auf den 165 * 165 array
  let newx = Math.floor(((x - ((windowWidth - newImageWidth) / 2) + ((pixel_clumps[0].length * pixelWidth) - newImageWidth) / 2) / (pixel_clumps[0].length * pixelWidth)) * visual[0].length)
  // y wird geparsed auf den 165 * 165 array
  let newy = Math.floor(((y - ((windowHeight - newImageHeight) / 2) + ((pixel_clumps[0].length * pixelWidth) - newImageHeight) / 2) / (pixel_clumps[0].length * pixelWidth)) * visual.length)
  let data = {
    x: newx,
    y: newy
  }
  return data;
}

function addSpriteToVisual(sprite) {
  let maxWidthHeight = pixel_clumps[0].length * pixelWidth
  let spriteWidth = sprite.collider.extents.x
  let spriteHeight = sprite.collider.extents.y
  let oriWidthInVisualUnit = spriteWidth * visual[0].length / (maxWidthHeight);
  let oriHeightInVisualUnit = spriteHeight * visual[0].length / (maxWidthHeight);
  let visualUnitCoordinates = getVisualCoordinates(sprite.position.x - spriteWidth / 2, sprite.position.y - spriteHeight / 2);
  let visualUnitX = visualUnitCoordinates.x;
  let visualUnitY = visualUnitCoordinates.y;
  let maxXIterations = visualUnitX + oriWidthInVisualUnit;
  let maxYIterations = visualUnitY + oriHeightInVisualUnit;

  // set x and y cooridnates if out of bounds
  if ((visualUnitX + oriWidthInVisualUnit < 0)
    || (visualUnitX >= visual[0].length)
    || (visualUnitY + oriHeightInVisualUnit < 0)
    || (visualUnitY >= visual[0].length))
    return;
  if (visualUnitX < 0)
    visualUnitX = 0
  if (visualUnitY < 0)
    visualUnitY = 0
  if ((visualUnitX + oriWidthInVisualUnit) >= visual[0].length) {
    maxXIterations = visual[0].length - 1;
  }
  if ((visualUnitY + oriHeightInVisualUnit) >= visual[0].length) {
    maxYIterations = visual[0].length - 1;
  }

  for (let i = visualUnitX; i < maxXIterations; i++) {
    for (let j = visualUnitY; j < maxYIterations; j++) {
      visCopy[j][i] = [2];
    }
  }
}


function setCookie(name, value) {
  document.cookie = name + '=' + value;
}

function setCookies() {
  setCookie("dmgDealt", cookieArr["dmgDealt"]);
  setCookie("knockback", cookieArr["knockback"]);
  setCookie("death", cookieArr["death"]);
  setCookie("kills", cookieArr["kills"]);
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
                      img.resize(imageFaktor, 0);
                      amogus_supreme = img;
                      socket.emit('newPlayer');
                      visual = getVisualMap(pixel_clumps);
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
    if (players[socket.id].sprite.collide(environment)) {
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
  } else {
    players[socket.id].sprite.bounce(environment);
  }
}





