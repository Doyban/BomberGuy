var Bomberboy = Bomberboy || {};

Bomberboy.Bomb = function (game_state, name, position, properties) {
  "use strict";
  Bomberboy.Prefab.call(this, game_state, name, position, properties);

  this.anchor.setTo(0.5);

  this.bomb_radius = +properties.bomb_radius;

  this.game_state.game.physics.arcade.enable(this);
  this.body.immovable = true;

  // Create bomb exploding animation.
  this.exploding_animation = this.animations.add("exploding", [0, 2, 4], 1, false);
  this.exploding_animation.onComplete.add(this.explode, this);
  this.animations.play("exploding");

  this.owner = properties.owner;

  // this.EXPLOSION_PROPERTIES = {texture: "explosion_image", group: "explosions", duration: 0.5}; // Define as constant explosion properties.
};

Bomberboy.Bomb.prototype = Object.create(Bomberboy.Prefab.prototype);
Bomberboy.Bomb.prototype.constructor = Bomberboy.Bomb;

Bomberboy.Bomb.prototype.reset = function (position_x, position_y) {
  "use strict";
  Phaser.Sprite.prototype.reset.call(this, position_x, position_y);
  this.exploding_animation.restart(); // Since bombs will be reaused it is needed to restart exploding animation.
};

// Method to explode a bomb.
Bomberboy.Bomb.prototype.explode = function () {
  "use strict";
  var explosion_name, explosion_position, explosion_properties, explosion, wall_tile, block_tile;
  this.kill(); // Kill the bomb.


  explosion_name = this.name + "_explosion_" + this.game_state.groups.explosions.countLiving(); // Define explosion name.
  explosion_position = new Phaser.Point(this.position.x, this.position.y); // Define explosion position.
  explosion_properties = {texture: "explosion_image", group: "explosions", duration: 0.5}; // Define explosion properties.

  explosion = Bomberboy.create_prefab_from_pool(this.game_state.groups.explosions, Bomberboy.Explosion.prototype.constructor, this.game_state, explosion_name, explosion_position, explosion_properties); // Create a new explosion.

  this.create_explosions(-1, -this.bomb_radius, -1, "x", explosion_properties); // Create bomb explosion to the left.
  this.create_explosions(1, this.bomb_radius, 1, "x", explosion_properties); // Create bomb explosion to the right.
  this.create_explosions(-1, -this.bomb_radius, -1, "y", explosion_properties); // Create bomb explosion down.
  this.create_explosions(1, this.bomb_radius, 1, "y", explosion_properties); // Create bomb explosion up.

  this.owner.current_bomb_index -= 1; // Decrement the current bomb index.
};


// Method to create explosions arround the bomb.
Bomberboy.Bomb.prototype.create_explosions = function (initial_index, final_index, step, axis, explosion_properties) {
  "use strict";
  var index, explosion_name, explosion_position, explosion, wall_tile, block_tile;

  // For each iteration create new explosion.
  for (index = initial_index; Math.abs(index) <= Math.abs(final_index); index += step) {
    explosion_name = this.name + "_explosion_" + this.game_state.groups.explosions.countLiving();

    // The position is different according to the axis.
    if (axis === "x") {
      explosion_position = new Phaser.Point(this.position.x + (index * this.width), this.position.y); // Create row explosion.
    } else {
      explosion_position = new Phaser.Point(this.position.x, this.position.y + (index * this.height)); // Create column explosion.
    }

    wall_tile = this.game_state.map.getTileWorldXY(explosion_position.x, explosion_position.y, this.game_state.map.tileWidth, this.game_state.map.tileHeight, "walls"); // Get wall tiles positions.
    block_tile = this.game_state.map.getTileWorldXY(explosion_position.x, explosion_position.y, this.game_state.map.tileWidth, this.game_state.map.tileHeight, "blocks"); // Get block tiles positions.

    if (!wall_tile && !block_tile) {
      // If there are not wall and block tiles.
      explosion = Bomberboy.create_prefab_from_pool(this.game_state.groups.explosions, Bomberboy.Explosion.prototype.constructor, this.game_state, explosion_name, explosion_position, Object.create(explosion_properties)); // Create explosion.
    } else {
      if (block_tile) {
        // If the tile is block tile.
        this.game_state.map.removeTile(block_tile.x, block_tile.y, "blocks"); // Destroy the block.
        this.game_state.pathfinding.remove_tile({row: block_tile.y, column: block_tile.x}); // Remove tile from pathfinding.
      }
      break; // Stop creating explosions.
    }
  }
};