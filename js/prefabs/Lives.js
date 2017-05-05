var Bomberboy = Bomberboy || {};

Bomberboy.Lives = function (game_state, name, position, properties) {
  "use strict";
  var lives_text_position, lives_text_style, lives_text_properties;
  Bomberboy.Prefab.call(this, game_state, name, position, properties);

  this.player = properties.player;

  this.fixedToCamera = true;

  this.anchor.setTo(0.5);
  this.scale.setTo(0.6);

  // Create a text prefab to show the number of lives.
  lives_text_position = new Phaser.Point(this.position.x, this.position.y + 5);
  lives_text_style = {font: "10px Arial", fill: "#fff"};
  lives_text_properties = {group: "hud", text: "", style: lives_text_style};
  this.lives_text = new Bomberboy.TextPrefab(this.game_state, "lives_text", lives_text_position, lives_text_properties);
  this.lives_text.anchor.setTo(0.5);
};

Bomberboy.Lives.prototype = Object.create(Bomberboy.Prefab.prototype);
Bomberboy.Lives.prototype.constructor = Bomberboy.Lives;

Bomberboy.Lives.prototype.update = function () {
  "use strict";
  this.lives_text.text = this.game_state.prefabs[this.player].number_of_lives; // Update the current number of Player's lives.
};