function controls() {
    // Controls
    //Spacebar
    if (keyWentDown(32)) {
        if (!(JUMP_COUNT >= MAX_JUMP)) {
            sprite.velocity.y = -JUMP;
            JUMP_COUNT++;
        }
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

    if(keyWentDown(69)) {
        defaultAttack();
    } 

}