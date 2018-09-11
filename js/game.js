const TILE_SIZE = 32;

var Game = {};
var cursor = new Cursor(TILE_SIZE);
var world = new World('assets/gridtiles.png', 'assets/map.json');

Game.preload = function() {
  Game.scene = this; 
  this.load.image('phaserguy', 'assets/phaserguy.png');

  world.preload(this)
};

Game.create = function() {
  // Handles the clicks on the map to make the character move
  this.input.on('pointerup', Game.handleClick);

  Game.camera = this.cameras.main;
  Game.camera.setBounds(0, 0, 20 * TILE_SIZE, 20 * TILE_SIZE);

  var phaserGuy = this.add.image(TILE_SIZE, TILE_SIZE, 'phaserguy');
  phaserGuy.setDepth(1);
  phaserGuy.setOrigin(0, 0.5);

  Game.camera.startFollow(phaserGuy);
  Game.player = phaserGuy;

  world.create(this)
  cursor.create(this)
};

Game.update = function() {
  var worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);

  // TODO: research about mouse movement event
  var tileX = world.tileX(worldPoint.x);
  var tileY = world.tileY(worldPoint.y);

  cursor.setX(tileX * TILE_SIZE)
  cursor.setY(tileY * TILE_SIZE)
  cursor.setVisible(!world.isCollisionTile(tileX, tileY))
};

Game.handleClick = function(pointer) {
  var x = Game.camera.scrollX + pointer.x;
  var y = Game.camera.scrollY + pointer.y;
  var toX = Math.floor(x / TILE_SIZE);
  var toY = Math.floor(y / TILE_SIZE);
  var fromX = Math.floor(Game.player.x / TILE_SIZE);
  var fromY = Math.floor(Game.player.y / TILE_SIZE);

  console.log('going from (' + fromX + ',' + fromY + ') to (' + toX + ',' + toY + ')');

  world.finder.findPath(fromX, fromY, toX, toY, function(path) {
    if (path === null) {
      console.warn("Path was not found.");
    } else {
      Game.moveCharacter(path);
    }
  });
  world.finder.calculate(); // don't forget, otherwise nothing happens
};

Game.moveCharacter = function(path) {
  console.log("meh")

  var tweens = [];
  for (var i = 0; i < path.length - 1; i++) {
    var ex = path[i + 1].x;
    var ey = path[i + 1].y;
    tweens.push({
      targets: Game.player,
      x: {
        value: ex * TILE_SIZE,
        duration: 200
      },
      y: {
        value: ey * TILE_SIZE,
        duration: 200
      }
    });
  }

  Game.scene.tweens.timeline({tweens: tweens});
};
