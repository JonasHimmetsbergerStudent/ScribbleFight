

//Objects
var sprite;
var collider;
var box1;
var started = false;
var started1 = false;
var started2 = false;
var pixels_clumps = [];

//Forces
var GRAVITY = -1;
var JUMP = 15;
var SPEED = 5;
var HIT_DURATION = 40;
var hit = false;

function setup() {
  createCanvas(1920, 1080);
  background(51);
  sprite = createSprite(400, 200, 50, 50);
  box1 = createSprite(300, 200, 50, 50);
  box1.setCollider("rectangle", 0, 0, 50, 50);
  box2 = createSprite(400, 100, 50, 50);
  sprite.setCollider("rectangle", 0, 0, 35, 45);
  sprite.addAnimation("normal", "../assets/amogus.png");
  collider = createSprite(400, 500, 200, 200);
  sprite.debug = true;
  collider.debug = true;

  sprite.debug = true;
  loadImage('../assets/amogus.png', img => {
    img.resize(50, 0);
    sprite.addImage(img);
    started2 = true;
  });

for (let i = 0; i < 500; i++) {
  pixels_clumps[i] = createSprite(i,i,5,5);
}


  loadImage('../assets/platform.png', img => {
    img.resize(200, 0);
    collider.addImage(img);
    started = true;
  });
}

function draw() {
  if (started) {
    //Hitbox change on attack
    if (hit) {
      HIT_DURATION--;
      if (HIT_DURATION == 0) {
        console.log("jetzt");
        sprite.setCollider("rectangle", 0, 0, 35, 45);
        HIT_DURATION = 40;
        hit = false;
      }

    }
    sprite.velocity.y -= GRAVITY;
    sprite.velocity.x = 0;
    background(255, 255, 255);

    if (collider.overlapPixel(sprite.position.x, sprite.position.y + 20)) {
      sprite.velocity.y = 0;
    }
    while (collider.overlapPixel(sprite.position.x, sprite.position.y + 20)) {
      sprite.position.y--;
    }

    if (sprite.collide(box1)) {
      if (sprite.touching.left) {
        console.log("hallo");
      }
      sprite.velocity.y = 0;
    }

    if (sprite.collide(box2)) {
      if (sprite.touching.left) {
        console.log("hallo");
      }
      sprite.velocity.y = 0;
    }

    for (let i = 0; i < pixels_clumps.length; i++) {
      if(sprite.collide(pixels_clumps[i])) {
        sprite.velocity.y = 0;
      }
      
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
    //attack
    if (mouseIsPressed) {
      if (mouseButton === LEFT) {
        if (sprite.mirrorX() === -1) {
          sprite.setCollider("rectangle", -7, 0, 40, 45);
        } else {
          sprite.setCollider("rectangle", 7, 0, 40, 45);
        }
        hit = true;
      }


    }
    mirrorSprite();
    drawSprites();
  }
}

function mirrorSprite() {
  if (keyWentDown(65)) {
    if (sprite.mirrorX() === 1) {
      sprite.mirrorX(sprite.mirrorX() * -1);
    }
  }
  if (keyWentDown(68)) {
    if (sprite.mirrorX() === -1) {
      sprite.mirrorX(sprite.mirrorX() * -1);
    }
  }
}
