var Bomberboy = Bomberboy || {};

Bomberboy.Prefab = function (game_state, name, position, properties) {
  "use strict";
  Phaser.Sprite.call(this, game_state.game, position.x, position.y, properties.texture); // Extend Phaser.Sprite.

  this.game_state = game_state;

  this.name = name;

  this.game_state.groups[properties.group].add(this);
  this.frame = +properties.frame;
  // this.frame += properties.frame;

  this.game_state.prefabs[name] = this;
};

Bomberboy.Prefab.prototype = Object.create(Phaser.Sprite.prototype); // Set up Bomberboy.Prefab prototype to Phaser.Sprite prototype.
Bomberboy.Prefab.prototype.constructor = Bomberboy.Prefab; // Set up Bomberboy.Prefab constructor to Bomberboy.Prefab.