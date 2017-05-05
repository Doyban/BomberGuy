var Bomberboy = Bomberboy || {};

Bomberboy.Goal = function (game_state, name, position, properties) {
  "use strict";
  Bomberboy.Prefab.call(this, game_state, name, position, properties);

  this.anchor.setTo(0.5);
  this.scale.setTo(0.5);

  this.game_state.game.physics.arcade.enable(this);
  this.body.immovable = true; // Set up it immovable.
};

Bomberboy.Goal.prototype = Object.create(Bomberboy.Prefab.prototype);
Bomberboy.Goal.prototype.constructor = Bomberboy.Goal;

Bomberboy.Goal.prototype.update = function () {
  "use strict";
  this.game_state.game.physics.arcade.overlap(this, this.game_state.groups.players, this.reach_goal, null, this); // Check for overlaps for player.
};

Bomberboy.Goal.prototype.reach_goal = function () {
  "use strict";
  this.game_state.next_level(); // Call next level method.
};