var Bomberboy = Bomberboy || {};

// Initialize Firebase
var config = {
  apiKey: "AIzaSyD8U11J8u5vqA-fKEwUD_PZHoqIJToe_VE",
  authDomain: "bomberguy-82239.firebaseapp.com",
  databaseURL: "https://bomberguy-82239.firebaseio.com",
  projectId: "bomberguy-82239",
  storageBucket: "bomberguy-82239.appspot.com",
  messagingSenderId: "354995244018"
};
firebase.initializeApp(config);

var game = new Phaser.Game(240, 240, Phaser.CANVAS);
game.state.add("BootState", new Bomberboy.BootState());
game.state.add("LoadingState", new Bomberboy.LoadingState());
game.state.add("TitleState", new Bomberboy.TitleState());
game.state.add("TiledState", new Bomberboy.TiledState());
game.state.add("LobbyState", new Bomberboy.LobbyState());
game.state.add("BattleState", new Bomberboy.BattleState());
game.state.add("FirebaseState", new Bomberboy.FirebaseState());
// game.state.start("BootState", true, false, "assets/levels/title_screen.json", "TitleState");
game.state.start("FirebaseState");