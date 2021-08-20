function controls() {
    // Controls
    //Spacebar
    if (keyWentDown(32)) {
        if (!(JUMP_COUNT >= MAX_JUMP)) {
            player.sprite.velocity.y =  -JUMP;
            JUMP_COUNT++;
        }
    }
    //A
    if (keyIsDown(65)) {
        player.sprite.velocity.x = -SPEED;

    }
    //D
    if (keyIsDown(68)) {
        player.sprite.velocity.x = SPEED;
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

function mouseClicked() {
    defaultAttack();
}

function mirrorSprite() {
    if (keyWentDown(65)) {
        if (player.sprite.mirrorX() === 1) {
            player.sprite.mirrorX(player.sprite.mirrorX() * -1);
            player.direction = "left";
        }
    }
    if (keyWentDown(68)) {
        if (player.sprite.mirrorX() === -1) {
            player.sprite.mirrorX(player.sprite.mirrorX() * -1);
            player.direction = "right";
        }
    }
}