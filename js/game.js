const TILE_SIZE = 32;

var world = new World('assets/gridtiles.png', 'assets/map.json');
var player = new Player('assets/phaserguy.png', TILE_SIZE)
var finder = new EasyStar.js();

var Game = {};
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
  
  finder.setGrid(world.getGrid());
  finder.setAcceptableTiles(world.getAcceptableProperty());
};

Game.update = function() {
  
};

Game.onPointerMove = function(pointer){
  world.setCursor(pointer.x, pointer.y)
};

Game.onPointerUp = function(pointer) {
  var toX = world.tileX(pointer.x);
  var toY = world.tileY(pointer.y);
  
  var fromX = player.getTileX()
  var fromY = player.getTileY()

  console.log('going from (' + fromX + ',' + fromY + ') to (' + toX + ',' + toY + ')');

  finder.findPath(fromX, fromY, toX, toY, function(path) {
    if (path === null) {
      console.warn("Path was not found.");
    } else {
      player.move(Game.scene, path)
    }
  });
  finder.calculate();
};
