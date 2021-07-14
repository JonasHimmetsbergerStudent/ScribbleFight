var projectile;

function defaultAttack() {

    projectile = createSprite(sprite.position.x, sprite.position.y, 20, 20);
    projectile.life = 200;
    projectile.velocity.x = (camera.mouseX - projectile.position.x) / 15;
    projectile.velocity.y = (camera.mouseY- projectile.position.y) / 15;

    console.log("y: " + mouseY);
    console.log("x: " + mouseX);
}

function explosion() {
    console.log("hit");
}