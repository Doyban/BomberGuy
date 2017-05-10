var Bomberboy = Bomberboy || {};

Bomberboy.Player = function (game_state, name, position, properties) {
  "use strict";
  Bomberboy.Prefab.call(this, game_state, name, position, properties); // Extend Bomberboy.Prefab.

  this.anchor.setTo(0.5); // Center.

  this.walking_speed = +properties.walking_speed;
  this.number_of_lives = +properties.number_of_lives;

  // Control animations.
  this.animations.add("walking_down", [1, 2, 3], 10, true);
  this.animations.add("walking_left", [4, 5, 6, 7], 10, true);
  this.animations.add("walking_right", [4, 5, 6, 7], 10, true);
  this.animations.add("walking_up", [0, 8, 9], 10, true);

  this.stopped_frames = [1, 4, 4, 0, 1]; // Frames for stopped player.

  this.game_state.game.physics.arcade.enable(this); // Init player body.
  this.body.setSize(14, 12, 0, 4); // Set player body to right size.

  this.movement = {left: false, right: false, up: false, down: false}; // Represent player movement.

  this.initial_position = new Phaser.Point(this.x, this.y); // Set up initial position of the Player.

  this.current_bomb_index = 0;
  this.MAXIMUM_NUMBER_OF_BOMBS = 3;

  this.INVINCIBILITY_DURATION = 3; // Set up invincibility for 3 seeconds.
  this.become_invincibility(); // Call becoming invivincibility.
};

Bomberboy.Player.prototype = Object.create(Bomberboy.Prefab.prototype); // Set up Bomberboy.Player prototype to Phaser.Prefab prototype.
Bomberboy.Player.prototype.constructor = Bomberboy.Player; // Set up Bomberboy.Player constructor to Bomberboy.Player.

Bomberboy.Player.prototype.reset = function (position_x, position_y) {
  "use strict";
  Phaser.Sprite.prototype.reset.call(this, position_x, position_y);
  this.become_invincibility(); // Call becoming invivincibility.
};

// Called during the core game loop.
Bomberboy.Player.prototype.update = function () {
  "use strict";
  this.game_state.game.physics.arcade.collide(this, this.game_state.layers.walls);
  this.game_state.game.physics.arcade.collide(this, this.game_state.layers.blocks);
  this.game_state.game.physics.arcade.collide(this, this.game_state.groups.bombs);
  this.game_state.game.physics.arcade.overlap(this, this.game_state.groups.explosions, this.die, null, this);
  this.game_state.game.physics.arcade.overlap(this, this.game_state.groups.enemies, this.die, null, this);


  if (this.movement.left && this.body.velocity.x <= 0) { // Moving left.
    this.body.velocity.x = -this.walking_speed; // Change player velocity to move left.
    if (this.body.velocity.y === 0) { // Player is not moving both: up and down.
      this.scale.setTo(-1, 1);
      this.animations.play("walking_left"); // Play walking left animation.
    }
  } else if (this.movement.right && this.body.velocity.x >= 0) { // Moving right.
      this.body.velocity.x = this.walking_speed; // Move right.
      if (this.body.velocity.y === 0) { // Player is not moving both: up and down.
        this.scale.setTo(1, 1);
        this.animations.play("walking_right"); // Play walking right animation.
      }
    } else {
      this.body.velocity.x = 0; // Player is not moving both: right and left.
    }

    if (this.movement.up && this.body.velocity.y <= 0) { // Moving up.
      this.body.velocity.y = -this.walking_speed; // Change player velocity to move down.
      if (this.body.velocity.x === 0) { // Player is not moving both: left and right.
        this.animations.play("walking_up"); // Play walking up animation.
      }
    } else if (this.movement.down && this.body.velocity.y >= 0) { // Moving down.
      this.body.velocity.y = this.walking_speed; // Move up.
      if (this.body.velocity.x === 0) { // Player is not moving both: right and left.
        this.animations.play("walking_down"); // Play walking down animation.
      }
    } else {
      this.body.velocity.y = 0; // Player is not moving both: up and down.
    }

     if (this.body.velocity.x === 0 && this.body.velocity.y === 0) { // Player is not moving any direction: up, down, right and left.
      this.animations.stop(); // Stop current animation.
      this.frame = this.stopped_frames[this.body.facing]; // Change frame to be one of stopped frames.
     }
};

Bomberboy.Player.prototype.change_movement = function (direction_x, direction_y, move) {
  "use strict";
  if (direction_x < 0) {
    this.movement.left = move; // Move to the left.
  } else if (direction_x > 0) {
    this.movement.right = move; // Move to right.
  }

  if (direction_y < 0) {
    this.movement.up = move; // Move up.
  } else if (direction_y > 0) {
    this.movement.down = move; // Move down.
  }
};

Bomberboy.Player.prototype.try_dropping_bomb = function () {
  "use strict";
  var colliding_bombs;

  // Check to not exceed maximum number of bombs.
  if (this.current_bomb_index < this.MAXIMUM_NUMBER_OF_BOMBS) {
    colliding_bombs = this.game_state.physics.arcade.getObjectsAtLocation(this.x, this.y, this.game_state.groups.bombs); // Receive bombs position, avoid place bomb on another bomb.
    if (colliding_bombs.length === 0) {
      // If there are no colliding bombs then drop a  bomb.
      this.drop_bomb(this.position);
    }
  }
};

Bomberboy.Player.prototype.drop_bomb = function (position) {
  "use strict";
  var bomb, bomb_name, bomb_position, bomb_properties;
  // Get the first dead bomb from the pool.
  bomb_name = this.name + "_bomb_" + this.game_state.groups.bombs.countLiving(); // Define bomb name.
  bomb_position = new Phaser.Point(this.x, this.y); // Define bomb position as position of the player.
  bomb_properties = {"texture": "bomb_spritesheet", "group": "bombs", bomb_radius: 3, owner: this};
  bomb = Bomberboy.create_prefab_from_pool(this.game_state.groups.bombs, Bomberboy.Bomb.prototype.constructor, this.game_state, bomb_name, position, bomb_properties);
  this.current_bomb_index += 1; // Increment the current bomb index.
};

// Player can die only when is no invincible.
Bomberboy.Player.prototype.die = function () {
  "use strict";
  if (!this.invincible) {
    // Player is no invincible.
    this.number_of_lives -= 1; // Decrease lives.
    if (this.number_of_lives <= 0) {
      // Player lost all lives.
      this.kill(); // Kill the player.
      this.game_state.game_over(); // Game over.
    }
    else {
      // Player didn't loose all lives.
      this.reset(this.initial_position.x, this.initial_position.y); // Reset player to the initial position.
    }
  }
};

Bomberboy.Player.prototype.become_invincibility = function () {
  "use strict";
  var blinking_tween;
  this.invincible = true; // Becaome invincible.

  // Add blinking animation while beeing invincible.
  blinking_tween = this.game_state.game.tweens.create(this);
  blinking_tween.to({alpha: 0}, Phaser.Timer.SECOND * this.INVINCIBILITY_DURATION / 20);
  blinking_tween.to({alpha: 1}, Phaser.Timer.SECOND * this.INVINCIBILITY_DURATION / 20);
  blinking_tween.repeat(10); // Above animations will happen 10 times until end of invincibility will be over.
  blinking_tween.onComplete.add(this.end_invincibility, this);
  blinking_tween.start(); // Start the animation.
};

Bomberboy.Player.prototype.end_invincibility = function () {
  "use strict";
  this.invincible = false; // Make the player available to be killed.
};
