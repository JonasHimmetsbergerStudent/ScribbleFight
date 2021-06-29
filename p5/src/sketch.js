//Objects
var cube;
var collider;

//Forces
var GRAVITY = -1;
var JUMP = 15;
var SPEED = 5;

function setup() {
  createCanvas(1920, 1080);
  cube = createSprite(400, 200, 50, 50);
  collider = createSprite(400, 500, 200, 200);
  loadImage('../assets/amogus.png', img => {
    img.resize(50, 0);
    cube.addImage(img);
  });

}

function draw() {
  cube.velocity.y -= GRAVITY;
  cube.velocity.x = 0;
  background(255, 255, 255);

  if (cube.collide(collider)) {
    cube.velocity.y = 0;
  }

  // Controls
  //Spacebar
  if (keyWentDown(32)) {
    cube.velocity.y = -JUMP;
  }
  //A
  if (keyIsDown(65)) {
    cube.velocity.x = -SPEED;
  }
  //D
  if (keyIsDown(68)) {
    cube.velocity.x = SPEED;
  }
  //S
  if (keyIsDown(83)) {
    cube.velocity.y -= GRAVITY;
  }
  drawSprites();
}

function preload() {
  var img = loadImage('../assets/amogus.png');
}
