const TILE_SIZE = 32;

var Game = {};
var cursor = new Cursor(TILE_SIZE);
var world = new World('assets/gridtiles.png', 'assets/map.json');
var player = new Player('assets/phaserguy.png', TILE_SIZE)
var worldPoint;

Game.preload = function() {
  Game.scene = this; 
  
  player.preload(this)
  world.preload(this)
};

Game.create = function() {
  // Handles the clicks on the map to make the character move
  this.input.on('pointerup', Game.onPointerUp);
  this.input.on('pointermove', Game.onPointerMove);

  player.create(this);
  world.create(this);
  cursor.create(this);
  
  Game.camera = this.cameras.main;
  Game.camera.setBounds(0, 0, 20 * TILE_SIZE, 20 * TILE_SIZE);
  
  player.followMe(Game.camera)
  
  worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);
};


Game.update = function() {
};

Game.onPointerMove = function(pointer){
  var x = Game.camera.scrollX + pointer.x;
  var y = Game.camera.scrollY + pointer.y;
  
  var tileX = world.tileX(x);
  var tileY = world.tileY(y);
  
  cursor.setX(tileX * TILE_SIZE)
  cursor.setY(tileY * TILE_SIZE)
  cursor.setVisible(!world.isCollisionTile(tileX, tileY))
};

Game.onPointerUp = function(pointer) {
  var x = Game.camera.scrollX + pointer.x;
  var y = Game.camera.scrollY + pointer.y;
  
  var toX = world.tileX(x);
  var toY = world.tileY(y);
  
  var fromX = player.getX()
  var fromY = player.getY()
  

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
