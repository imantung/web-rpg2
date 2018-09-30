const TILE_SIZE = 32;

var world = new World('assets/gridtiles.png', 'assets/map.json');
var player = new Player('assets/phaserguy.png', TILE_SIZE)
var finder = new EasyStar.js();
var playerTween;

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
  var px = world.toTx(pointer.x);
  var py = world.toTy(pointer.y);
  
  world.setCursor(px, py)
};

Game.onPointerUp = function(pointer) {
  var fromTx = player.getTx()
  var fromTy = player.getTy()
  
  var toTx = world.toTx(pointer.x);
  var toTy = world.toTy(pointer.y);
  
  finder.findPath(fromTx, fromTy, toTx, toTy, function(path) {
    if (path === null) {
      console.warn("Path was not found.");
    } else {
      if(playerTween){
        playerTween.stop();  
      }
      world.setMarker(toTx, toTy)
      
      var tweens = [];
      for (var i = 1; i < path.length; i++) {
        tweens.push(player.createTween(path[i].x,path[i].y));
      }

      playerTween = Game.scene.tweens.timeline({
        tweens: tweens, 
        onComplete: function () { 
          world.hideMarker()
        }
      });
    }
  });
  finder.calculate();
};
