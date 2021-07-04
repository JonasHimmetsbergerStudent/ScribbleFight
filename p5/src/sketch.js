//Objects
var sprite;
var collider;
var testSprite;
var started;

//Forces
var GRAVITY = -1;
var JUMP = 15;
var SPEED = 5;

function setup() {
  createCanvas(1920, 1080);
  background(51);
  sprite = createSprite(400, 200, 50, 50);
  sprite.setCollider("rectangle", 0, 0, 40, 40);
  sprite.addAnimation("normal", "../assets/amogus.png");
  collider = createSprite(400, 500, 200, 200);
  testSprite = createSprite(350, 200, 50, 50);
  collider.debug = true;
  testSprite.debug = true;
  sprite.debug = true;
  loadImage('../assets/amogus.png', img => {
    img.resize(50, 0);
    sprite.addImage(img);
  });


  loadImage('../assets/platform.png', img => {
    img.resize(200, 0);
    collider.addImage(img);
    started = true;
  });



}

function draw() {
  if (started) {
    sprite.velocity.y -= GRAVITY;
    sprite.velocity.x = 0;
    background(255, 255, 255);

    if (collider.overlapPixel(sprite.position.x, sprite.position.y + 20)) {
      sprite.velocity.y = 0;
      while (collider.overlapPixel(sprite.position.x, sprite.position.y + 20)) {
        sprite.position.y--;
      }
    }

    if (sprite.collide(testSprite)) {
      if (sprite.touching.left) {
        console.log("hallo");
      }
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
}

function mirrorSprite() {
  if (keyWentDown(65)) {
    if(sprite.mirrorX() === 1) {
    sprite.mirrorX(sprite.mirrorX() * -1);
    }
  }
  if (keyWentDown(68)) {
    if (sprite.mirrorX() === -1) {
      sprite.mirrorX(sprite.mirrorX() * -1);
    }
  }
}