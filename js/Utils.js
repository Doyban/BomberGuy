var Bomberboy = Bomberboy || {};

Bomberboy.create_prefab_from_pool = function (pool, prefab_construction, game_state, prefab_name, prefab_position, prefab_properties) {
  "use strict";
  var prefab;
  prefab = pool.getFirstDead(); // Get the first dead prefab from the pool.

  if (!prefab) {
    // If there is no dead prefab then create a new one.
    prefab = new prefab_construction(game_state, prefab_name, prefab_position, prefab_properties);
  } else {
    // If there is a dead prefab then reset it in the new position.
    prefab.reset(prefab_position.x, prefab_position.y);
  }
};
