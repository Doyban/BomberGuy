var Bomberboy = Bomberboy || {};

Bomberboy.FirebaseState = function () {
  "use strict";
  Phaser.State.call(this); // Extend Phaser.State.
};

Bomberboy.FirebaseState.prototype = Object.create(Phaser.State.prototype);
Bomberboy.FirebaseState.prototype.constructor = Bomberboy.FirebaseState;

Bomberboy.FirebaseState.prototype.create = function () {
  "use strict";
  var that = this;

  firebase.auth().signInAnonymously().catch(function(error) {
    // Handle Errors here.
    console.log(error);
  });
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      console.log(user);
      that.game.state.start("BootState", true, false, "assets/levels/title_screen.json", "TitleState"); // Start new game.
    } else {
      console.log("User is signed out.");
    }
  });
};