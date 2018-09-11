const TILE_SIZE = 32;

var Game = {};
var cursor = new Cursor(TILE_SIZE);
var world = new World('assets/gridtiles.png', 'assets/map.json');
var player = new Player('assets/phaserguy.png', TILE_SIZE)

Game.preload = function() {
  Game.scene = this; 
  // this.load.image('phaserguy', 'assets/phaserguy.png');
  
  player.preload(this)
  world.preload(this)
};

Game.create = function() {
  // Handles the clicks on the map to make the character move
  this.input.on('pointerup', Game.handleClick);

  player.create(this);
  world.create(this);
  cursor.create(this);
  
  Game.camera = this.cameras.main;
  Game.camera.setBounds(0, 0, 20 * TILE_SIZE, 20 * TILE_SIZE);
  
  player.followMe(Game.camera)
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
  
  var fromX = Math.floor(player.getX() / TILE_SIZE);
  var fromY = Math.floor(player.getY() / TILE_SIZE);
  

  console.log('going from (' + fromX + ',' + fromY + ') to (' + toX + ',' + toY + ')');

  world.finder.findPath(fromX, fromY, toX, toY, function(path) {
    if (path === null) {
      console.warn("Path was not found.");
    } else {
      player.move(Game.scene, path)
    }
  });
  world.finder.calculate(); // don't forget, otherwise nothing happens
};
