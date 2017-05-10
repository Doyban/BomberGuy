var Bomberboy = Bomberboy || {};

Bomberboy.MenuItem = function (game_state, name, position, properties) {
  "use strict";
  Bomberboy.TextPrefab.call(this, game_state, name, position, properties);

  this.anchor.setTo(0.5); // set center of texture

  this.on_selection_animation = this.game_state.game.add.tween(this.scale);
  this.on_selection_animation.to({x: 1.5 * this.scale.x, y: 1.5 * this.scale.y}, 500);
  this.on_selection_animation.to({x: this.scale.x, y: this.scale.y}, 500);
  this.on_selection_animation.repeatAll(-1);
};

Bomberboy.MenuItem.prototype = Object.create(Bomberboy.TextPrefab.prototype);
Bomberboy.MenuItem.prototype.constructor = Bomberboy.MenuItem;

Bomberboy.MenuItem.prototype.selection_over = function () {
  "use strict";
  if (this.on_selection_animation.isPaused) {
    this.on_selection_animation.resume();
  } else {
    this.on_selection_animation.start();
  }
};

Bomberboy.MenuItem.prototype.selection_out = function () {
  "use strict";
  this.on_selection_animation.pause();
};

Bomberboy.MenuItem.prototype.select = function () {
  "use strict";
  // The default item does nothing.
};