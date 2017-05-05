var Bomberboy = Bomberboy || {};

Bomberboy.TextPrefab = function (game_state, name, position, properties) {
  "use strict";
  Phaser.Text.call(this, game_state.game, position.x, position.y, properties.text, properties.style);

  this.game_state = game_state;

  this.name = name;

  this.game_state.groups[properties.group].add(this);

  if (properties.anchor) {
    this.anchor.setTo(properties.anchor.x, properties.anchor.y);
  }

  this.game_state.prefabs[name] = this;
};

Bomberboy.TextPrefab.prototype = Object.create(Phaser.Text.prototype); // Set up Bomberboy.TextPrefab prototype to Phaser.Text prototype.
Bomberboy.TextPrefab.prototype.constructor = Bomberboy.TextPrefab; // Set up Bomberboy.TextPrefab constructor to Bomberboy.TextPrefab.