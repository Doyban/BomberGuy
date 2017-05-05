var Phaser = Phaser || {};
var Bomberboy = Bomberboy || {};

Bomberboy.UserInput = function (game, parent, game_state, user_input_data) {
  "use strict";
  Phaser.Plugin.call(this, game, parent); // Extend Phaser.Plugin.
};

Bomberboy.UserInput.prototype = Object.create(Phaser.Plugin.prototype); // Set up Bomberboy.UserInput prototype to Phaser.Plugin prototype.
Bomberboy.UserInput.prototype.constructor = Bomberboy.UserInput; // Set up Bomberboy.UserInput constructor to Bomberboy.UserInput.

// Prepare set of data before preloading starts.
Bomberboy.UserInput.prototype.init = function (game_state, user_input_data) {
  "use strict";
  var input_type, key, key_code;
  this.game_state = game_state;
  this.user_inputs = {"keydown": {}, "keyup": {}, "keypress": {}}; // Keyboard events.

  // Instantiate object with user input data provided.
  // Each event can be keydown, keyup or keypress.
  // Separate events by key code.
  for (input_type in user_input_data) {
    if (user_input_data.hasOwnProperty(input_type)) {
      for (key in user_input_data[input_type]) {
        if (user_input_data[input_type].hasOwnProperty(key)) {
          key_code = Phaser.Keyboard[key];
          this.user_inputs[input_type][key_code] = user_input_data[input_type][key];
        }
      }
    }
  }

  this.game.input.keyboard.addCallbacks(this, this.process_input, this.process_input); // Add callback for all three events.
};

Bomberboy.UserInput.prototype.process_input = function (event) {
  "use strict";
  var user_input, callback_data, prefab;

  // Check if there is a user input and appropriate key.
  if (this.user_inputs[event.type] && this.user_inputs[event.type][event.keyCode]) {
    user_input = this.user_inputs[event.type][event.keyCode]; // Callback function.
    if (user_input) {
      callback_data = user_input.callback.split(".");
      if (callback_data[0] === "game_state") { // Method from game state.
        this.game_state[callback_data[1]].apply(this.game_state, user_input.args); // Extend from game state.
      } else { // Method from prefab.
        prefab = this.game_state.prefabs[callback_data[0]]; // Get prefab.
        prefab[callback_data[1]].apply(prefab, user_input.args); // Extend from prefab.
      }
    }
  }
};