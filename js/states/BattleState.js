var Bomberboy = Bomberboy || {};

Bomberboy.BattleState = function () {
  "use strict";
  Bomberboy.TiledState.call(this);
};

Bomberboy.BattleState.prototype = Object.create(Bomberboy.TiledState.prototype);
Bomberboy.BattleState.prototype.constructor = Bomberboy.BattleState;

Bomberboy.BattleState.prototype.init = function (level_data, extra_parameters) {
  "use strict";
  Bomberboy.TiledState.prototype.init.call(this, level_data);

  this.battle_ref = firebase.database().ref("battles").child(extra_parameters.battle_id); // Save battle reference in Firebase.
  this.local_player = extra_parameters.local_player; // Save who is local player. If the player is the host of the battle, then local player is player 1 and player 2 will be the remove player. If the player will join battle then local player will be player 2 and remote player will be player 1.
  this.remote_player = extra_parameters.remote_player; // Save who is remote player.
};

Bomberboy.BattleState.prototype.create = function () {
  "use strict";
  Bomberboy.TiledState.prototype.create.call(this);

  this.battle_ref.child(this.local_player).child("position").set(this.prefabs[this.local_player].position); // Set position for the position of the local player.

  // Callbacks to remote player.
  this.battle_ref.child(this.remote_player).child("movement").on("value", this.update_player_movement.bind(this)); // Callback to movement of remote player, "on" means will be called every time the movement changes.
  this.battle_ref.child(this.remote_player).child("position").on("value", this.update_player_position.bind(this)); // Callback to position of remote player, "on" means will be called every time the position.// changes.

  this.battle_ref.child(this.remote_player).child("bombs").on("child_added", this.add_bomb.bind(this)); // Callback to bombs of remote player, "on" means will be called every time the bombs added (child_added).

  this.battle_ref.onDisconnect().remove(); // Remove callbacks if the player is disconnected.

  this.game.state.disableVisibilityChange = true; // To test game, in Phaser while set disableVisibilityChange to true we can open 2 windows on the same computer and both of the windows will be updated.
};

Bomberboy.BattleState.prototype.update_player_movement = function (snapshot) {
  "use strict";
  this.prefabs[this.remote_player].movement = snapshot.val(); // Update player movement according to movement in database.
};

Bomberboy.BattleState.prototype.update_player_position = function (snapshot) {
  "use strict";
  var position;
  position = snapshot.val();

  // Update player position according to position in database.
  this.prefabs[this.remote_player].position.x = position.x;
  this.prefabs[this.remote_player].position.y = position.y;
};

Bomberboy.BattleState.prototype.add_bomb = function (snapshot) {
  "use strict";
  this.prefabs[this.remote_player].drop_bomb(snapshot.val()); // Make remote player to drop a bomb, in snapshot there is position of a bomb.
};

Bomberboy.BattleState.prototype.change_movement = function (direction_x, direction_y, move) {
  "use strict";
  this.prefabs[this.local_player].change_movement(direction_x, direction_y, move); // Call change_movement method for the local player.

  this.battle_ref.child(this.local_player).child("movement").set(this.prefabs[this.local_player].movement); // Set movement property in the database.
  if (!move) {
    // Player has stopped.
    this.battle_ref.child(this.local_player).child("position").set({x: this.prefabs[this.local_player].x, y: this.prefabs[this.local_player].y}); // Set position property in the database.
  }
};

Bomberboy.BattleState.prototype.try_dropping_bomb = function () {
  "use strict";
  this.prefabs[this.local_player].try_dropping_bomb(); // Call try_dropping_bomb method for the local player.
  this.battle_ref.child(this.local_player).child("bombs").push({x: this.prefabs[this.local_player].x, y: this.prefabs[this.local_player].y}); // Add new bomb of local player to the database.
};

Bomberboy.BattleState.prototype.game_over = function () {
  "use strict";
  // Remove remote player callbacks.
  this.battle_ref.child(this.remote_player).child("movement").off();
  this.battle_ref.child(this.remote_player).child("position").off();
  this.battle_ref.child(this.remote_player).child("bombs").off();
  
  this.battle_ref.remove(); // Disable all callbacks from battle reference.
  this.game.state.start("BootState", true, false, "assets/levels/title_screen.json", "TitleState"); // Start TitleState again.
};