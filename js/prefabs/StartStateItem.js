var Bomberboy = Bomberboy || {};

Bomberboy.StartStateItem = function (game_state, name, position, properties) {
  "use strict";
  Bomberboy.MenuItem.call(this, game_state, name, position, properties);

  this.level_file = properties.level_file; // set up level file
  this.state_name = properties.state_name; // set up state name
};

Bomberboy.StartStateItem.prototype = Object.create(Bomberboy.MenuItem.prototype);
Bomberboy.StartStateItem.prototype.constructor = Bomberboy.StartStateItem;

Bomberboy.StartStateItem.prototype.select = function () {
  "use strict";
  // Starts game state.
  this.game_state.state.start("BootState", true, false, this.level_file, this.state_name); // start next Phaser state
};