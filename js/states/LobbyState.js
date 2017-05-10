var Bomberboy = Bomberboy || {};

Bomberboy.LobbyState = function () {
  "use strict";
  Bomberboy.JSONLevelState.call(this);

  this.prefab_classes= {
    "text": Bomberboy.TextPrefab.prototype.constructor
  };

  this.INITIAL_PLAYER_DATA = {movement: {left: false, right: false, up: false, down: false}, position: {x: 0, y: 0}}; // initial player data defines movement and initial player position
};

Bomberboy.LobbyState.prototype = Object.create(Bomberboy.JSONLevelState.prototype);
Bomberboy.LobbyState.prototype.constructor = Bomberboy.LobbyState;

Bomberboy.LobbyState.prototype.create = function () {
  "use strict";
  Bomberboy.JSONLevelState.prototype.create.call(this);

  firebase.database().ref("battles").once("value", this.find_battle.bind(this)); // Add callback to battle reference to find battle.
};

// Search to existing battle to join, if there is no existing one then create a new one.
Bomberboy.LobbyState.prototype.find_battle = function (snapshot) {
  "use strict";
  var battles, battle, chosen_battle, new_battle;
  battles = snapshot.val(); // Get battles.

  // Try to find a bttle to join.
  for (battle in battles) {
    if (battles.hasOwnProperty(battle) && !battles[battle].full) {
      // Battle exists and is not full.
      chosen_battle = battle; // Join battle.
      // firebase.database().ref("battles").on("value", this.join_battle.bind(this, chosen_battle)).on("full", this.join_battle.bind(this, chosen_battle)).set(true, this.join_battle.bind(this, chosen_battle)); // Change battle to be full and join the battle.
      firebase.database().ref("battles").child(chosen_battle).child("full").set(true, this.join_battle.bind(this, chosen_battle));
      // firebase.database().ref("battles").on("value", this.join_battle.bind(this, chosen_battle));
      break;
    }
  }

  if (!chosen_battle) {
    // There is no chosen battles, then create new battle.
    this.new_battle = firebase.database().ref("battles").push({
      player1: this.INITIAL_PLAYER_DATA,
      player2: this.INITIAL_PLAYER_DATA,
      full: false // full: false means the battle is not full of players yet
    });
    this.new_battle.on("value", this.host_battle.bind(this)); // when player join the same battle then call host battle
  }
};

Bomberboy.LobbyState.prototype.host_battle = function (snapshot) {
  "use strict";
  var battle_data;

  battle_data = snapshot.val(); // get battle data

  if (battle_data.full) {
    // battle data is full
    this.new_battle.off(); // remove callbacks from new battle

    // start new battle
    this.game.state.start("BootState", true, false, "assets/levels/battle_level.json", "BattleState", {battle_id: snapshot.key, local_player: "player1", remote_player: "player2"});
    console.log("starting battle");
  }
};

Bomberboy.LobbyState.prototype.join_battle = function (battle_id) {
  "use strict";
  // joining battle
  this.game.state.start("BootState", true, false, "assets/levels/battle_level.json", "BattleState", {battle_id: battle_id, local_player: "player2", remote_player: "player1"});
  console.log("joining battle");
};