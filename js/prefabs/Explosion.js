var Bomberboy = Bomberboy || {};

Bomberboy.Explosion = function (game_state, name, position, properties) {
  "use strict";
  Bomberboy.Prefab.call(this, game_state, name, position, properties);

  this.anchor.setTo(0.5);

  this.duration = +properties.duration;

  this.game_state.game.physics.arcade.enable(this);
  this.body.immovable = true;

  // Create timer to kill tile after few seconds.
  this.kill_timer = this.game_state.time.create(false);
  this.kill_timer.add(Phaser.Timer.SECOND * this.duration, this.kill, this);
  this.kill_timer.start();
};

Bomberboy.Explosion.prototype = Object.create(Bomberboy.Prefab.prototype);
Bomberboy.Explosion.prototype.constructor = Bomberboy.Explosion;

// Method to reset the timer.
Bomberboy.Explosion.prototype.reset = function (position_x, position_y) {
  "use strict";
  Phaser.Sprite.prototype.reset.call(this, position_x, position_y);
  this.kill_timer.add(Phaser.Timer.SECOND * this.duration, this.kill, this); // Add another kill event.
};