var Bomberboy = Bomberboy || {};

Bomberboy.Pathfinding = function (game, parent) {
  "use strict";
  Phaser.Plugin.call(this, game, parent);
  this.easy_star = new EasyStar.js();
};

Bomberboy.Pathfinding.prototype = Object.create(Phaser.Plugin.prototype);
Bomberboy.Pathfinding.prototype.constructor = Bomberboy.Pathfinding;

Bomberboy.Pathfinding.prototype.init = function (world_grid, acceptable_tiles, tile_dimensions) {
  "use strict";
  var grid_row, grid_column, grid_indices;

  this.grid_dimensions = {row: world_grid.length, column: world_grid[0].length};
  this.world_grid = world_grid;

  this.easy_star.setGrid(world_grid); // Set world grid in Easystar.
  this.easy_star.setAcceptableTiles(acceptable_tiles); // Set acceptable tiles to make them walkable in Easystar.

  this.tile_dimensions = tile_dimensions
};

// Find path.
Bomberboy.Pathfinding.prototype.find_path = function (origin, target, callback, context) {
  "use strict";
  var origin_coord, target_coord;

  origin_coord = this.get_coord_from_point(origin); // Get original coordinates.
  target_coord = this.get_coord_from_point(target); // Get target coordinates.

  if (!this.outside_grid(origin_coord) && !this.outside_grid(target_coord)) {
    // Both coordinates are in the world, so do pathfinding.
    this.easy_star.findPath(origin_coord.column, origin_coord.row, target_coord.column, target_coord.row, this.call_callback_function.bind(this, callback, context));
    this.easy_star.calculate();

    return true;
  } else {
    // At least one of coordinates is out of the world, so stop pathfinding.
    return false;
  }
};

// Receive the path and put path positions to an array, but with conversion to coordinates.
Bomberboy.Pathfinding.prototype.call_callback_function = function (callback, context, path) {
  "use strict";
  var path_positions;
  path_positions = [];

  if (path) {
    path.forEach(function (path_coord) { // Iterate through all positions.
      path_positions.push(this.get_point_from_coord({row: path_coord.y, column: path_coord.x}));
    }, this);
  }
  callback.call(context, path_positions);
};

// Check if coordinates are in world grid.
Bomberboy.Pathfinding.prototype.outside_grid = function (coord) {
  "use strict";
  return coord.row < 0 || coord.row > this.grid_dimensions.row - 1 || coord.column < 0 || coord.column > this.grid_dimensions.column - 1;
};

// Remove tile.
Bomberboy.Pathfinding.prototype.remove_tile = function (coord) {
  "use strict";
  this.world_grid[coord.row][coord.column] = -1; // Change the world grid in this positions, -1 means there is no tile in this position.
  this.easy_star.setGrid(this.world_grid); // Set world grid again in Easystar.
};

// Return coordinates from point.
Bomberboy.Pathfinding.prototype.get_coord_from_point = function (point) {
  "use strict";
  var row, column;

  row = Math.floor(point.y / this.tile_dimensions.y);
  column = Math.floor(point.x / this.tile_dimensions.x);

  return {row: row, column: column};
};

// Return point from coordinates.
Bomberboy.Pathfinding.prototype.get_point_from_coord = function (coord) {
  "use strict";
  var x, y;

  x = (coord.column * this.tile_dimensions.x) + (this.tile_dimensions.x / 2);
  y = (coord.row * this.tile_dimensions.y) + (this.tile_dimensions.y / 2);

  return new Phaser.Point(x, y);
};

