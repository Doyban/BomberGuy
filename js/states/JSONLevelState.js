var Bomberboy = Bomberboy || {};

Bomberboy.JSONLevelState = function () {
  "use strict";
  Phaser.State.call(this);

  // setting constructors of prefabs
  this.prefab_classes = {

  };
};

Bomberboy.JSONLevelState.prototype = Object.create(Phaser.State.prototype);
Bomberboy.JSONLevelState.prototype.constructor = Bomberboy.JSONLevelState;

Bomberboy.JSONLevelState.prototype.init = function (level_data) {
  "use strict";
  this.level_data = level_data; // save level data

  this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  this.scale.pageAlignHorizontally = true;
  this.scale.pageAlignVertically = true;
};

Bomberboy.JSONLevelState.prototype.create = function () {
  "use strict";
  var group_name, prefab_name;

  // Create groups.
  this.groups = {};
  this.level_data.groups.forEach(function (group_name) {
    this.groups[group_name] = this.game.add.group();
  }, this);

  // Create prefabs.
  this.prefabs = {};
  for (prefab_name in this.level_data.prefabs) {
    if (this.level_data.prefabs.hasOwnProperty(prefab_name)) {
      // Create prefab.
      this.create_prefab(prefab_name, this.level_data.prefabs[prefab_name]);
    }
  }
};

Bomberboy.JSONLevelState.prototype.create_prefab = function (prefab_name, prefab_data) {
  "use strict";
  var prefab_position, prefab;

  // Create object according to its type.
  if (this.prefab_classes.hasOwnProperty(prefab_data.type)) {
    if (prefab_data.position.x > 0 && prefab_data.position.x <= 1) {
      // Position as percentage.
      prefab_position = new Phaser.Point(prefab_data.position.x * this.game.world.width, prefab_data.position.y * this.game.world.height);
    } else {
      // Position as absolute number.
      prefab_position = prefab_data.position;
    }
    prefab = new this.prefab_classes[prefab_data.type](this, prefab_name, prefab_position, prefab_data.properties);
  }
}