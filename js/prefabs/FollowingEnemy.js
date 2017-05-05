var Bomberboy = Bomberboy || {};

Bomberboy.FollowingEnemy = function (game_state, name, position, properties) {
  "use strict";
  Bomberboy.Enemy.call(this, game_state, name, position, properties); // Extend regular Enemy.

  this.detection_radius = +properties.detection_radius;

  this.following_player = false;
};

Bomberboy.FollowingEnemy.prototype = Object.create(Bomberboy.Enemy.prototype);
Bomberboy.FollowingEnemy.prototype.constructor = Bomberboy.FollowingEnemy;

Bomberboy.FollowingEnemy.prototype.update = function () {
  "use strict";
  var player_position, distance_to_player;

  Bomberboy.Enemy.prototype.update.call(this); // Add regular Enemy behavior.

  // Measure distance between player and enemy.
  player_position = this.game_state.prefabs.player.position;
  distance_to_player = this.position.distance(player_position);

  if (distance_to_player <= this.detection_radius && !this.following_player) {
    // Distance is less or equal than detection radius and enemy is not following player.
    this.stop(); // Stop animation.
    this.following_player = true; // Set it to follow the player.
    this.move_to_target(player_position); // Move enemy to the player.
  }
};

Bomberboy.FollowingEnemy.prototype.stop = function () {
  "use strict";
  Bomberboy.Enemy.prototype.stop.call(this);
  this.following_player = false; // Stop following the player.
};