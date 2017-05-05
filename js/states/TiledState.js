var Bomberboy = Bomberboy || {};

Bomberboy.TiledState = function () {
  "use strict";
  Phaser.State.call(this); // Extend Phaser.State.

  this.prefab_classes = {
    "player": Bomberboy.Player.prototype.constructor,
    "enemy": Bomberboy.Enemy.prototype.constructor,
    "following_enemy": Bomberboy.FollowingEnemy.prototype.constructor,
    "lives": Bomberboy.Lives.prototype.constructor,
    "target": Bomberboy.Target.prototype.constructor
  };
};

Bomberboy.TiledState.prototype = Object.create(Phaser.State.prototype); // Set up Bomberboy.TiledState prototype to Phaser.State prototype.
Bomberboy.TiledState.prototype.constructor = Bomberboy.TiledState; // Set up Bomberboy.TiledState constructor to Bomberboy.TiledState.

// Prepare set of objects before preloading starts.
Bomberboy.TiledState.prototype.init = function (level_data) {
  "use strict";
  var tileset_index;
  this.level_data = level_data;

  // Align game horiztontally and vertically.
  this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  this.scale.pageAlignHorizontally = true;
  this.scale.pageAlignVertically = true;

  // Start physics system.
  this.game.physics.startSystem(Phaser.Physics.ARCADE);
  this.game.physics.arcade.gravity.y = 0;

  // Create map and set tileset.
  this.map = this.game.add.tilemap(level_data.map.key);
  tileset_index = 0;
  this.map.tilesets.forEach(function (tileset) {
    this.map.addTilesetImage(tileset.name, level_data.map.tilesets[tileset_index]);
    tileset_index += 1;
  }, this);
};

// Create game once preload is complete.
Bomberboy.TiledState.prototype.create = function () {
  "use strict";
  var group_name, object_layer, collision_tiles, tile_dimensions, world_grid;

  // Create map layers.
  this.layers = {};
  this.map.layers.forEach(function (layer) {
    this.layers[layer.name] = this.map.createLayer(layer.name);
    if (layer.properties.collision) { // Collision layer.
      this.map.setCollisionByExclusion([-1], true, layer.name); // Set this layer as collision able.
    }
  }, this);
  this.layers[this.map.layer.name].resizeWorld(); // Resize the world to be the size of the current layer.

  // Create groups.
  this.groups = {};
  this.level_data.groups.forEach(function (group_name) {
    this.groups[group_name] = this.game.add.group();
  }, this);

  // Create prefabs.
  this.prefabs = {};
  // Iterate through all object layers.
  for (object_layer in this.map.objects) {
    // Check if objects property is object_layer.
    if (this.map.objects.hasOwnProperty(object_layer)) {
      this.map.objects[object_layer].forEach(this.create_object, this); // Create layer objects.
    }
  }

  this.game.user_input = this.game.plugins.add(Bomberboy.UserInput, this, JSON.parse(this.game.cache.getText("user_input"))); // Start game user input.

  world_grid = this.create_world_grid(); // Create world grid.
  tile_dimensions = new Phaser.Point(this.map.tileWidth, this.map.tileHeight); // Get tile dimensions.
  this.pathfinding = this.game.plugins.add(Bomberboy.Pathfinding, world_grid, [-1], tile_dimensions); // Start pathfinding plugin, "-1" is acceptable tile to find path.

  // this.game.input.onDown.add(this.test_pathfinding, this); // test_pathfinding will be used when user will click on the screen.
};

Bomberboy.TiledState.prototype.create_object = function (object) {
  "use strict";
  var object_y, position, prefab;

  // Tiled coordinates start in the bottom left corner.
  object_y = (object.gid) ? object.y - (this.map.tileHeight / 2) : object.y + (object.height / 2);
  position = {"x": object.x + (this.map.tileHeight / 2), "y": object_y};

  // Check if the prefab_classes has the object type.
  if (this.prefab_classes.hasOwnProperty(object.type)) {
    prefab = new this.prefab_classes[object.type](this, object.name, position, object.properties); // Create prefabs.
  }
  this.prefabs[object.name] = prefab; // Add to prefabs.
};

// Create world grid.
Bomberboy.TiledState.prototype.create_world_grid = function () {
  "use strict";

  var walls_layer, blocks_layer, row_index, column_index, world_grid;

  // Save layers to simplify code.
  walls_layer = this.map.layers[1];
  blocks_layer = this.map.layers[2];

  world_grid = []; // Start empty world grid.

  // Add block, wall tiles and "-1" value to find path for Pathfinding plugin.
  // Iterate through rows.
  for (row_index = 0; row_index < this.map.height; row_index += 1) {
    world_grid.push([]); // Add empty row of world grid.
    // Iterate through columns.
    for (column_index = 0; column_index < this.map.width; column_index += 1) {
      // Check if walls and blocks layers are empty, "-1" means there is no tile in this position.
      if (walls_layer.data[row_index][column_index].index === -1 && blocks_layer.data[row_index][column_index].index === -1) {
        // Walls and blocks layers are empty.
        world_grid[row_index].push(-1); // Add "-1" in the world grid in this row, "-1" is the value to find path for Pathfinding plugin.
      } else {
        // Walls and blocks layers are not empty.
        // Check if walls layer is empty.
        if (walls_layer.data[row_index][column_index].index === -1) {
          // Walls layer is empty.
          world_grid[row_index].push(blocks_layer.data[row_index][column_index].index); // Add block layer index to the world grid.
        } else {
          // Walls layer has tile in this position
          world_grid[row_index].push(walls_layer.data[row_index][column_index].index); // Add wall layer index to the world grid.
        }
      }
    }
  }
  return world_grid; // Return world grid.
};

// Method to find path.
// Bomberboy.TiledState.prototype.test_pathfinding = function (pointer) {
//   "use strict";
//   // Find path from player position to the clicked position.
//   this.pathfinding.find_path(this.prefabs.player.position, {x: pointer.x, y:pointer.y}, function (path) {
//     console.log(path);
//   }, this);
// };

Bomberboy.TiledState.prototype.game_over = function () {
  "use strict";
  this.game.state.restart(true, false, this.level_data); // Restart the game.
};

Bomberboy.TiledState.prototype.next_level = function () {
  "use strict";
  this.game.state.start("BootState", true, false, this.level_data.next_level, "TiledState"); // Go to next level.
};