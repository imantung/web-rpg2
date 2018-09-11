class World {
  constructor(tilesetSrc, mapSrc) {
    this.tilesetSrc = tilesetSrc
    this.mapSrc = mapSrc
  }

  preload(scene) {
    scene.load.image('tileset', this.tilesetSrc);
    scene.load.tilemapTiledJSON('map', this.mapSrc);
  }

  create(scene) {

    // Display map
    var map = scene.make.tilemap({key: 'map'});
    var tileset = map.addTilesetImage('tiles', 'tileset');
    map.createStaticLayer(0, tileset, 0, 0);
    
    // ### Pathfinding stuff ###
    // Initializing the pathfinder
    var finder = new EasyStar.js();
    
    // We create the 2D array representing all the tiles of our map
    var grid = [];
    for (var y = 0; y < map.height; y++) {
      var col = [];
      for (var x = 0; x < map.width; x++) {
        // In each cell we store the ID of the tile, which corresponds
        // to its index in the tileset of the map ("ID" field in Tiled)
        col.push(map.getTileAt(x, y).index);
      }
      grid.push(col);
    }
    finder.setGrid(grid);

    var properties = tileset.tileProperties;
    var acceptableTiles = [];
    
    // We need to list all the tile IDs that can be walked on. Let's iterate over all of them
    // and see what properties have been entered in Tiled.
    // firstgid and total are fields from Tiled that indicate the range of IDs that the tiles can take in that tileset
    for (var i = tileset.firstgid - 1; i < tileset.total; i++) { 
      
      // If there is no property indicated at all, it means it's a walkable tile
      if (!properties.hasOwnProperty(i)) {
        acceptableTiles.push(i + 1);
        continue;
      }
      if (!properties[i].collide) {
        acceptableTiles.push(i + 1);
      }
      if (properties[i].cost) {
        finder.setTileCost(i + 1, properties[i].cost); // If there is a cost attached to the tile, let's register it
      }
    }
    finder.setAcceptableTiles(acceptableTiles);
    
    this.map = map
    this.finder = finder;
  }
  
  tileX(x){
    return this.map.worldToTileX(x)
  }
  
  tileY(y){
    return this.map.worldToTileX(y)
  }
  
  getTileAt(tileX, tileY){
    return this.map.getTileAt(tileX, tileY);
  }
  
  isCollisionTile(tileX, tileY){
    var tile = this.getTileAt(tileX, tileY);
    return tile.properties.collide;
  }
}
