function controls() {
    if (!youAreDead) {


        // Controls
        //Spacebar
        if (keyWentDown(32)) {
            jump()
        }
        //A
        if (keyIsDown(65)) {
            moveLeft()
        }
        //D
        if (keyIsDown(68)) {
            moveRight()
        }
        //S
        // if (keyIsDown(83)) {
        //  sprite.velocity.y -= GRAVITY;
        //}

        /*if (keyWentDown(69)) {
            if (player_direction == "left") {
                sprite.setCollider("rectangle", -10, 0, player_width + 5, player_height);
            } else {
                sprite.setCollider("rectangle", 10, 0, player_width + 5, player_height);
            }
            hit = true;
        }*/

        // mirrors the sprite 


        // E
        if (keyWentDown(69)) {
            bombAttack();
        }

        // Q
        if (keyWentDown(81)) {
            blackHoleAttack();
        }

        // R
        if (keyWentDown(82)) {
            pianoTime();
        }

        // C
        if (keyWentDown(67)) {
            placeMine();
        }
        // F
        if (keyWentDown(70)) {
            makeMeSmall();
        }
    }


}

function jump() {
    if (!(JUMP_COUNT >= MAX_JUMP)) {
        myPlayer.sprite.velocity.y = -JUMP;
        JUMP_COUNT++;
    }
}

function moveLeft() {
    myPlayer.sprite.velocity.x = -SPEED;
}


function moveRight() {
    myPlayer.sprite.velocity.x = SPEED;
}

function mouseClicked() {
    let x = camera.mouseX,
        y = camera.mouseY;
    defaultAttack(x, y);
}

function mirrorSprite() {
    if (keyWentDown(65)) {
        mirrorSpriteLeft()
    }
    if (keyWentDown(68)) {
        mirrorSpriteRight()
    }
}

function mirrorSpriteLeft() {
    if (myPlayer.sprite.mirrorX() === 1) {
        myPlayer.sprite.mirrorX(myPlayer.sprite.mirrorX() * -1);
        myPlayer.direction = "left";
        socket.emit('updateDirection', 'left');
    }
}

function mirrorSpriteRight() {
    if (myPlayer.sprite.mirrorX() === -1) {
        myPlayer.sprite.mirrorX(myPlayer.sprite.mirrorX() * -1);
        myPlayer.direction = "right";
        socket.emit('updateDirection', 'right');
    }
}