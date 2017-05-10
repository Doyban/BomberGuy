var Bomberboy = Bomberboy || {};

Bomberboy.Menu = function (game_state, name, position, properties) {
  "use strict";
  var live_index, life;
  Bomberboy.Prefab.call(this, game_state, name, position, properties);

  this.visible = false; // make this prefab invisible

  this.menu_items = properties.menu_items; // list of items
  this.current_item_index = 0;
  this.menu_items[0].selection_over();

  this.cursor_keys = this.game_state.game.input.keyboard.createCursorKeys();
};

Bomberboy.Menu.prototype = Object.create(Bomberboy.Prefab.prototype);
Bomberboy.Menu.prototype.constructor = Bomberboy.Menu;

Bomberboy.Menu.prototype.update = function () {
  "use strict";
  if (this.cursor_keys.up.isDown && this.current_item_index > 0) {
    // Navigate to previous item.
    this.menu_items[this.current_item_index].selection_out();
    this.current_item_index -= 1;
    this.menu_items[this.current_item_index].selection_over();
  } else if (this.cursor_keys.down.isDown && this.current_item_index < this.menu_items.length - 1) {
    // Navigate to next item.
    this.menu_items[this.current_item_index].selection_out();
    this.current_item_index += 1;
    this.menu_items[this.current_item_index].selection_over();
  }

  if (this.game_state.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
    this.menu_items[this.current_item_index].select();
  }
};