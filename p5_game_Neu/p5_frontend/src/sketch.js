
//Objects
var sprite_pixels = [];
var environment;
var players = [];
var socket;
var myPlayer;
var progressBar;
var lifePoints = [];


//Variables
var bg;
var player_height;
var player_width;
var imageFaktor;
var JUMP_COUNT = 0;
var same_x_counter = 1;
const MAX_JUMP = 3;
const MAX_KNOCKBACK = 10;
var touches_side;
var background_path = "assets/smiley_bg.png";
var visual;
var pixelWidth;
var visCopy;
var obildbreite = undefined;
var obildhoehe = undefined;
var relPosData;
var relFaktor;

// Images
var amogus;
var imposter;
var bombImg;
var itemImg;
var itemImgBlue;
var itemImgYellow;
var itemImgOrange;
var itemImgGreen;
var boogieBombImg;
var pianoImg;
var mineImg;
var amogus_green;

//Animations
var walk;

//Forces
var GRAVITY;
var JUMP;

const socketBen = io('http://localhost:3001')
socketBen.on("rafi_game", message => {
  dummy = message.img;
  dummyMap = message.map;
  pixel_clumps = JSON.parse(dummyMap);
  //pixel_clumps = dummyMap;
  //console.log("Dummy: " + dummy);
  var path_image_dummy = 'data:image/png;base64,' + dummy;
  //console.log("Jaaa: 'data:image/png;base64," + dummy + "'")
  var backgroundImage = new Image();
  //console.log(backgroundImage);
  backgroundImage.src = 'data:image/png;base64,' + dummy;


  try {
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
    relFaktor = {
      x: obildbreite / newImageWidth,
      y: obildhoehe / newImageHeight
    }
    JUMP = pixelWidth - (pixelWidth / 3);
    SPEED = pixelWidth / 4;
    CLIMBINGSPEED = -(pixelWidth / 4);
    GRAVITY = -pixelWidth / 25;
    environment = new Group();
    createUI();

    // creating pixel environment
    for (let i = 0; i < pixel_clumps.length; i++) {
      sprite_pixels[i] = [];
      for (let j = 0; j < pixel_clumps[0].length; j++) {
        if (pixel_clumps[i][j][3] > 0) {
          if (sprite_pixels[i][j - 1] !== undefined) {
            same_x_counter++;
            sprite_pixels[i][j] = createSprite((j - ((same_x_counter) / 2) + 0.5) * pixelWidth + ((windowWidth - newImageWidth) / 2) + (newImageWidth - pixel_clumps[0].length * pixelWidth) / 2, i * pixelWidth + ((windowHeight - newImageHeight) / 2) + (newImageHeight - pixel_clumps.length * pixelWidth) / 2 + pixelWidth * 3 / 4, pixelWidth * (same_x_counter), pixelWidth);
            sprite_pixels[i][j].visible = false;
            //sprite_pixels[i][j].debug = true;
            sprite_pixels[i][j].depth = 10;
            sprite_pixels[i][j].immovable = true;
            environment.add(sprite_pixels[i][j]);
            sprite_pixels[i][j - 1].remove();
            sprite_pixels[i][j - 1] = undefined;
          } else {
            same_x_counter = 1;
            sprite_pixels[i][j] = createSprite(j * pixelWidth + ((windowWidth - newImageWidth) / 2) + (newImageWidth - pixel_clumps[0].length * pixelWidth) / 2, i * pixelWidth + ((windowHeight - newImageHeight) / 2) + (newImageHeight - pixel_clumps.length * pixelWidth) / 2 + pixelWidth * 3 / 4, pixelWidth, pixelWidth);
            //sprite_pixels[i][j].debug = true;
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


    let background = createSprite(windowWidth / 2, windowHeight / 2, newImageWidth, newImageHeight);
    loadImage(path_image_dummy, img => {
      img.resize(newImageWidth, newImageHeight);
      background.addImage(img);
      background.depth = -1;
      player_width = pixelWidth * 9 / 4;
      player_height = pixelWidth * 3;
      imageFaktor = pixelWidth * 4;
      init();
    })

  }

  //socket2 = io.connect("http://localhost:3001");
} catch (e) {
  console.log(e);
}

})

function sockets() {
  socket = io.connect('http://localhost:3000/');
  socket.on("deletePlayer", deletePlayer);
  socket.on('newPlayer', createNewPlayer);
  socket.on('update', updatePosition);
  socket.on('updateDirection', updateDirection);
  socket.on('spawnItem', createItem);
  socket.on('deleteItem', syncItems);
  socket.on('attack', addAttack);
  socket.on('kill', addKill);
  socket.on('death', someoneDied);
  socket.on("win", win);
  socket.on('deleteAttack', deleteAttack);
}

function createUI() {
  progressBar = createSprite(windowWidth / 2, (windowHeight - newImageHeight) / 2, 0, pixelWidth * 2);
  progressBar.position.x += progressBar.width / 2;
  progressBar.position.y += progressBar.height / 2;
  progressBar.shapeColor = color(255, 0, 0);
}

createLifePoints();
function createLifePoints() {
  for (let i = 1; i < 4; i++) {

    lifePoints[i] = createSprite(pixelWidth * 3 + i * pixelWidth * 3, pixelWidth * 3, player_width, player_height);
    lifePoints[i].addImage(amogus_green);
    lifePoints[i].scale = 0.5;
  }
}

function updateUI() {
  let progress;
  progress = map(myPlayer.knockback, 1, MAX_KNOCKBACK, 0, newImageWidth);
  progressBar.width = progress;
}

function preload() {

}

function setup() {


  frameRate(60);
  var canvas = createCanvas(windowWidth, windowHeight);
  sockets();
  getGame();
  
/*
  try {
    frameRate(60);
    var canvas = createCanvas(windowWidth, windowHeight);
    sockets();
    background('FFFFFF');
    var backgroundImage = new Image();
    backgroundImage.src = background_path;
*/
/*
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
      relFaktor = {
        x: obildbreite / newImageWidth,
        y: obildhoehe / newImageHeight
      }
      JUMP = pixelWidth - (pixelWidth / 3);
      SPEED = pixelWidth / 4;
      CLIMBINGSPEED = -(pixelWidth / 4);
      GRAVITY = -pixelWidth / 25;
      environment = new Group();
      createUI();

      // creating pixel environment
      for (let i = 0; i < pixel_clumps.length; i++) {
        sprite_pixels[i] = [];
        for (let j = 0; j < pixel_clumps[0].length; j++) {
          if (pixel_clumps[i][j][3] > 0) {
            if (sprite_pixels[i][j - 1] !== undefined) {
              same_x_counter++;
              sprite_pixels[i][j] = createSprite((j - ((same_x_counter) / 2) + 0.5) * pixelWidth + ((windowWidth - newImageWidth) / 2) + (newImageWidth - pixel_clumps[0].length * pixelWidth) / 2, i * pixelWidth + ((windowHeight - newImageHeight) / 2) + (newImageHeight - pixel_clumps.length * pixelWidth) / 2 + pixelWidth * 3 / 4, pixelWidth * (same_x_counter), pixelWidth);
              sprite_pixels[i][j].visible = false;
              //sprite_pixels[i][j].debug = true;
              sprite_pixels[i][j].depth = 10;
              sprite_pixels[i][j].immovable = true;
              environment.add(sprite_pixels[i][j]);
              sprite_pixels[i][j - 1].remove();
              sprite_pixels[i][j - 1] = undefined;
            } else {
              same_x_counter = 1;
              sprite_pixels[i][j] = createSprite(j * pixelWidth + ((windowWidth - newImageWidth) / 2) + (newImageWidth - pixel_clumps[0].length * pixelWidth) / 2, i * pixelWidth + ((windowHeight - newImageHeight) / 2) + (newImageHeight - pixel_clumps.length * pixelWidth) / 2 + pixelWidth * 3 / 4, pixelWidth, pixelWidth);
              //sprite_pixels[i][j].debug = true;
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

/*
      let background = createSprite(windowWidth / 2, windowHeight / 2, newImageWidth, newImageHeight);
      loadImage(background_path, img => {
        img.resize(newImageWidth, newImageHeight);
        background.addImage(img);
        background.depth = -1;
        player_width = pixelWidth * 9 / 4;
        player_height = pixelWidth * 3;
        imageFaktor = pixelWidth * 4;
        init();
      })

    }

    //socket2 = io.connect("http://localhost:3001");
  } catch (e) {
    console.log(e);
  }
  */

}

function createNewPlayer(data) {
  if(!players.includes(data.id)) {
    loadImage('assets/amogus.png', img1 => {
      loadImage('assets/amogus_blue.png', img => {
        console.log(data.id);
        img.resize(imageFaktor, 0);
        img1.resize(imageFaktor, 0);
        players[data.id] = new Player(createSprite(xCoordinates[Math.floor(Math.random() * xCoordinates.length)], 0, player_width, player_height));
        players[data.id].sprite.maxSpeed = pixelWidth;
        players[data.id].sprite.setCollider("rectangle", 0, 0, player_width - player_width / 4, player_height);
       // players[data.id].sprite.debug = true;
        players[data.id].sprite.addImage(img1);
        players[data.id].id = data.id;
        imposter = img1;
        amogus = img;
        if (data.id == socket.id) {
          myPlayer = players[data.id];
          myPlayer.sprite.addImage(img);
        }
      });
    });
  }
}

function deletePlayer(id) {
  if (players[id] != undefined) {
    players[id].sprite.remove();
    players[id] = undefined;
  }
}

function updatePosition(data) {
  if (players[data.id] != undefined && obildbreite != undefined && obildhoehe != undefined) {
    players[data.id].sprite.position.x = data.x * newImageWidth / obildbreite + (windowWidth - newImageWidth) / 2;
    players[data.id].sprite.position.y = data.y * newImageHeight / obildhoehe + (windowHeight - newImageHeight) / 2;
    //addSpriteToVisual(players[data.id].sprite, 3);
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
  myPlayer.kills += 1;
}

var damagedByTimer = 4;

//// DRAW FUNCTION
function draw() {
  try {
    background('FFFFFF');
    frameRate(60);
    touches_side = false;
    if (myPlayer != undefined && !youAreDead) {
      if (!flying && !noGravity) {
        myPlayer.sprite.velocity.y -= GRAVITY;
      } else if (flying) {
        myPlayer.sprite.velocity.y -= GRAVITY / 1.25;
      }

      // deep copy of multidimensional array
      // https://morioh.com/p/d15a64da5d09
      /* visCopy = JSON.parse(JSON.stringify(visual));
       let visCopyData = {
         id: myPlayer.id,
         visCopy: visCopy
       }
       socket.emit('visCopy', visCopyData);
       addSpriteToVisual(myPlayer.sprite, 2); */

      bombPhysics();
      defaultAttackPhysics();
      blackHolePhysics();
      pianoPhysics();
      minePhysics();
      smallChecker();
      spawn();



      checkForCollisions();

      if (!flying && !noGravity) {
        myPlayer.sprite.velocity.x = 0;
        controls();
      }

      if (frameCount % 60 == 0 && damagedByTimer > 0 && myPlayer.damagedBy != null) {
        damagedByTimer--;
      }

      if (damagedByTimer == 0) {
        damagedByTimer = 4;
        myPlayer.damagedBy = null;
      }

      mirrorSprite();
      deathCheck();
      drawSprites();

      let transferX = (myPlayer.sprite.position.x - (windowWidth - newImageWidth) / 2) * relFaktor.x;
      let transferY = (myPlayer.sprite.position.y - (windowHeight - newImageHeight) / 2) * relFaktor.y;
      relPosData = {
        x: transferX,
        y: transferY
      }
      socket.emit('update', relPosData);

    }
  } catch (e) {
    console.log(e);
  }
}

/**
 * saves stats to cookies
 * not used
 */
function saveToCookies() {
  document.cookie = 'death=' + myPlayer.death;
  document.cookie = 'dmgDealt=' + myPlayer.dmgDealt;
  document.cookie = 'kills=' + myPlayer.kills;
  document.cookie = 'knockback=' + myPlayer.knockback;
}

/**
 * Converts standard map, which is 55x55 
 * into visual map which is 165x165 for better accuracy
 * 
 * @param {given arry which represents map} paramarr 
 * @returns new visual array
 */
function getVisualMap(paramarr) {
  let visual = []
  let factor = 3
  for (let i = 0; i < paramarr.length * factor; i++) {
    visual.push([])
    for (let j = 0; j < paramarr.length * factor; j++) {
      if (paramarr[int(i / factor)][int(j / factor)][3] > 0) {
        visual[i].push(1)
      } else {
        visual[i].push(0)
      }
    }
  }
  return visual
}

function getGame() {
  var pathArray = window.location.pathname.split('/');
  console.log(pathArray[1])
  var gameId = pathArray[1];
  console.log("GameID: " + gameId);
  console.log("")
  const payLoad = {
    "method": "rafi_game",
    "gameId": gameId,
  }
  //const socketBen = io('http://localhost:3001')
  socketBen.emit('rafi_game', payLoad)
  //ws.send(JSON.stringify(payLoad));
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

/**
 * Adds a given sprite to the visual array copy
 * num: 
0-> hintergrund
1->map
2->ich
3->gegner
4->meine projektile
5->f??gt mir schaden zu (oiso a des gegnerische Projektil und dann eigentlich jedes gedropte item)
6->bombe item (packerl)
7-> schwarzes loch (packerl)
8->small (packerl)
9->miene(packerl)
10->klavier(packerl)
 * 
 * @param {Sprite which should be added to the visual array copy} sprite
 * @returns 
 */
function addSpriteToVisual(sprite, num) {
  if (visual != undefined && visCopy != undefined) {
    let maxWidthHeight = pixel_clumps[0].length * pixelWidth
    let spriteX = sprite.collider.extents.x
    let spriteY = sprite.collider.extents.y
    let oriWidthInVisualUnit = spriteX * visual[0].length / (maxWidthHeight);
    let oriHeightInVisualUnit = spriteY * visual[0].length / (maxWidthHeight);
    let visualUnitCoordinates = getVisualCoordinates(sprite.position.x - spriteX / 2, sprite.position.y - spriteY / 2);
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
        if ((visCopy[j][i] != 2
          && visCopy[j][i] != 3)
          || num == 2)
          visCopy[j][i] = num;
      }
    }
  }
}




function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


function init() {
  loadImage('assets/bomb.png', img => {
    img.resize(pixelWidth * 2, 0);
    bombImg = img;
    loadImage('assets/item.png', img => {
      itemImg = img;
      loadImage('assets/boogieBomb.png', img => {
        img.resize(pixelWidth * 2, 0);
        boogieBombImg = img;
        loadImage('assets/item_blue.png', img => {
          itemImgBlue = img;
          loadImage('assets/piano.png', img => {
            img.resize(pixelWidth * 5, 0);
            pianoImg = img;
            loadImage('assets/item_yellow.png', img => {
              itemImgYellow = img;
              loadImage('assets/item_orange.png', img => {
                itemImgOrange = img;
                loadImage('assets/mine.png', img => {
                  img.resize(pixelWidth * 2, 0);
                  mineImg = img;
                  loadImage('assets/item_green.png', img => {
                    itemImgGreen = img;
                    loadImage('assets/amogus_green.png', img => {
                      img.resize(imageFaktor, 0);
                      amogus_green = img;
                      createLifePoints();
                      visual = getVisualMap(pixel_clumps);

                      socket.emit('getPlayers');
                      setTimeout(() => {
                        socket.emit('newPlayer');
                      }, 500);
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
    if (myPlayer.sprite.collide(environment)) {
      if (myPlayer.sprite.touching.left || myPlayer.sprite.touching.right) {
        touches_side = true;
      }
      if (touches_side && !noGravity) {
        myPlayer.sprite.velocity.y = CLIMBINGSPEED;
      } else if (!noGravity && !myPlayer.sprite.touching.top) {
        myPlayer.sprite.velocity.y = 0;
      }
      if (!myPlayer.sprite.touching.top) {
        JUMP_COUNT = 0;
      }
    }
  } else {
    myPlayer.sprite.bounce(environment);
  }
}





