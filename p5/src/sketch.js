//Objects
var sprite;
var collider;
var testSprite;

//Forces
var GRAVITY = -1;
var JUMP = 15;
var SPEED = 5;

function setup() {
  createCanvas(1920, 1080);
  sprite = createSprite(400, 200, 50, 50);
  collider = createSprite(400, 500, 200, 200);
  testSprite = createSprite(350, 200, 50, 50);
  collider.setCollider("rectangle", 0, 0, 200, 200, -45);
  collider.debug = true;
  testSprite.debug = true;
  sprite.debug = true;
  loadImage('../assets/amogus.png', img => {
    img.resize(50, 0);
    sprite.addImage(img);
  });

}

function draw() {
  sprite.velocity.y -= GRAVITY;
  sprite.velocity.x = 0;
  background(255, 255, 255);

  if (sprite.collide(collider)) {
    sprite.velocity.y = 0;
  }
  if (sprite.collide(testSprite)) {
    sprite.velocity.y = 0;
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
  if (keyIsDown(83)) {
    sprite.velocity.y -= GRAVITY;
  }
  mirrorSprite();
  drawSprites();
}

function mirrorSprite() {
  if(keyWentDown(65)) {
    sprite.mirrorX(sprite.mirrorX() * -1);
  }
  if(keyWentDown(68)) {
   if(sprite.mirrorX()===-1) {
    sprite.mirrorX(sprite.mirrorX() * -1);
   }
  }
}