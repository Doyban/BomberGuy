var Bomberboy = Bomberboy || {};

var game = new Phaser.Game(240, 240, Phaser.CANVAS);
game.state.add("BootState", new Bomberboy.BootState());
game.state.add("LoadingState", new Bomberboy.LoadingState());
game.state.add("TiledState", new Bomberboy.TiledState());
game.state.start("BootState", true, false, "assets/levels/level1.json", "TiledState");