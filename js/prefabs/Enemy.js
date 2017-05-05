var Bomberboy = Bomberboy || {};

Bomberboy.Enemy = function (game_state, name, position, properties) {
  "use strict";
  Bomberboy.Prefab.call(this, game_state, name, position, properties);

  this.anchor.setTo(0.5);

  this.walking_speed = +properties.walking_speed;
  this.moving_radius = +properties.moving_radius;

  this.game_state.game.physics.arcade.enable(this);
  this.body.setSize(12, 12);

  // Control animations.
  this.animations.add("walking_down", [1, 2, 3], 10, true);
  this.animations.add("walking_left", [4, 5, 6, 7], 10, true);
  this.animations.add("walking_right", [4, 5, 6, 7], 10, true);
  this.animations.add("walking_up", [0, 8, 9], 10, true);

  this.stopped_frames = [1, 4, 4, 0, 1]; // Stopped frames.

  this.path = []; // Path array to show where enemy can move.
};

Bomberboy.Enemy.prototype = Object.create(Bomberboy.Prefab.prototype);
Bomberboy.Enemy.prototype.constructor = Bomberboy.Enemy;

Bomberboy.Enemy.prototype.update = function () {
  "use strict";
  var current_target, velocity;

  this.game_state.game.physics.arcade.collide(this, this.game_state.layers.walls);
  this.game_state.game.physics.arcade.collide(this, this.game_state.layers.blocks);
  this.game_state.game.physics.arcade.collide(this, this.game_state.groups.bombs);
  this.game_state.game.physics.arcade.overlap(this, this.game_state.groups.explosions, this.kill, null, this);

  // Check if path array is empty.
  if (this.path.length === 0) {
    this.stop(); // Stop animate.
    this.move(); // Find another path move.
  } else {
    // Animation should move first position in path array.
    current_target = this.path[0];
    if (current_target.distance(this.position) < 0.1) {
      // Animation reached the current target.
      this.path.shift(); // Moving from the path.
    } else {
      // Animation didn't reach the current target.

      velocity = Phaser.Point.subtract(current_target, this.position); // Difference between target and the position.

      // Walk in the same speed.
      velocity.normalize();
      this.body.velocity.x = velocity.x * this.walking_speed;
      this.body.velocity.y = velocity.y * this.walking_speed;
    }
  }
  this.play_animation(); // Manage the walking animation.
};

Bomberboy.Enemy.prototype.move = function () {
  "use strict";
  var movement, target_position;

  movement = new Phaser.Point(this.game_state.game.rnd.between(-this.moving_radius, this.moving_radius), this.game_state.game.rnd.between(-this.moving_radius, this.moving_radius)); // Get random move direction in x and y directions.
  target_position = new Phaser.Point(this.x + movement.x, this.y + movement.y); // Set up target position.
  this.move_to_target(target_position); // Move to target with the target position.
};

Bomberboy.Enemy.prototype.move_to_target = function (position) {
  "use strict";
  // Call Pathfinding plugin to find path from the current position to the target position.
  this.game_state.pathfinding.find_path(this.position, position, function (path) {
    this.path = path; // Use the path in path array.
  }, this);
};

Bomberboy.Enemy.prototype.stop = function () {
  "use strict";
  // Set velocity of both directions to 0.
  this.body.velocity.x = 0;
  this.body.velocity.y = 0;
};

Bomberboy.Enemy.prototype.play_animation = function () {
  "use strict";
  // Check if absolute value of X velocity is higher than Y velocity.
  if (Math.abs(this.body.velocity.x) > Math.abs(this.body.velocity.y)) {
    // X velocity is higher than Y.
    // Check if X velocity is negative.
    if (this.body.velocity.x < 0) {
      this.scale.setTo(-1, 1);
      this.animations.play("walking_left"); // Play walking left animation like in the Player.
    }
    // Check if X velocity if positive.
    else if (this.body.velocity.x > 0) {
      this.scale.setTo(1, 1);
      this.animations.play("walking_right"); // Play walking right animation like in the Player.
    }
  } else {
    // Y velocity is higher than X.
    // Check if Y velocity is negative.
    if (this.body.velocity.y < 0) {
      this.animations.play("walking_up"); // Play walking up animation like in the Player.
    }
    // Check if Y velocity if positive.
    else if (this.body.velocity.y > 0) {
      this.animations.play("walking_down"); // Play walking down animation like in the Player.
    }
  }

  // Check if velocity is 0 in both directions.
  if (this.body.velocity.x === 0 && this.body.velocity.y === 0) {
    this.animations.stop(); // Stop the current animation.
    this.frame = this.stopped_frames[this.body.facing]; // Set the current frame to be one of the stopped frames like in the Player.
  }
};