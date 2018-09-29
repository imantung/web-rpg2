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
    // prepare title
    var tilemap = scene.make.tilemap({key: 'map'});
    var tileset = tilemap.addTilesetImage('tiles', 'tileset');
    tilemap.createStaticLayer(0, tileset, 0, 0);
    
    // set camera
    var camera = scene.cameras.main;
    camera.setBounds(0, 0, 20 * TILE_SIZE, 20 * TILE_SIZE);
    
    // add cursor
    var cursor = scene.add.graphics();
    cursor.lineStyle(3, 0xffffff, 1);
    cursor.strokeRect(0, 0, TILE_SIZE, TILE_SIZE);
    
    this.tilemap = tilemap;
    this.tileset = tileset;
    this.camera = camera;  
    this.cursor = cursor;
  }
  
  tileX(x){
    return this.tilemap.worldToTileX(this.camera.scrollX + x)
  }
  
  tileY(y){
    return this.tilemap.worldToTileY(this.camera.scrollY +y)
  }
  
  getTileAt(tileX, tileY){
    return this.tilemap.getTileAt(tileX, tileY);
  }
  
  isCollisionTile(tileX, tileY){
    var tile = this.getTileAt(tileX, tileY);
    return tile.properties.collide;
  }
  
  startFollow(obj){
    this.camera.startFollow(this.phaserGuy)
  }
  
  setCursor(x,y){
    var tileX = this.tileX(x);
    var tileY = this.tileY(y);
    
    this.cursor.setX(tileX * TILE_SIZE)
    this.cursor.setY(tileY * TILE_SIZE)
    this.cursor.setVisible(!this.isCollisionTile(tileX, tileY))
  }
  
  // 2D array representing all the tiles of our map
  getGrid(){
    var grid = [];
    for (var y = 0; y < this.tilemap.height; y++) {
      var col = [];
      for (var x = 0; x < this.tilemap.width; x++) {
        // In each cell we store the ID of the tile, which corresponds
        // to its index in the tileset of the map ("ID" field in Tiled)
        col.push(this.tilemap.getTileAt(x, y).index);
      }
      grid.push(col);
    }
    
    return grid
  }
  
  getAcceptableProperty(){
    var properties = this.tileset.tileProperties;
    var acceptableTiles = [];
    
    // We need to list all the tile IDs that can be walked on. Let's iterate over all of them
    // and see what properties have been entered in Tiled.
    // firstgid and total are fields from Tiled that indicate the range of IDs that the tiles can take in that tileset
    for (var i = this.tileset.firstgid - 1; i < this.tileset.total; i++) { 
      
      // If there is no property indicated at all, it means it's a walkable tile
      if (!properties.hasOwnProperty(i)) {
        acceptableTiles.push(i + 1);
        continue;
      }
      if (!properties[i].collide) {
        acceptableTiles.push(i + 1);
      }
      // if (properties[i].cost) {
      //   finder.setTileCost(i + 1, properties[i].cost); // If there is a cost attached to the tile, let's register it
      // }
    }
    
    return acceptableTiles;
  }
}
