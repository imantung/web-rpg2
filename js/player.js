class Player{
    
  constructor(charAsset){
    this.charAsset = charAsset
    this.movementSpeed = 120;
  }
  
  preload(scene){
    scene.load.image('phaserguy', this.charAsset);
  }
  
  create(scene){
    var phaserGuy = scene.add.image(TILE_SIZE, TILE_SIZE, 'phaserguy');
    phaserGuy.setDepth(1);
    phaserGuy.setOrigin(0, 0.5);
    
    // TODO: rename to a better name
    this.phaserGuy = phaserGuy
  }
  
  // return y position of player based on its tile
  // TODO: consider to store tilex in this class itself
  getTx(){
    return Math.floor(this.phaserGuy.x / TILE_SIZE);
  }
  
  // return x position of player based on its tile
  getTy(){
    return Math.floor(this.phaserGuy.y / TILE_SIZE);
  }
  
  createTween(x,y){
    return {
      targets: this.phaserGuy,
      x: {
        value: x * TILE_SIZE,
        duration: this.movementSpeed
      },
      y: {
        value: y * TILE_SIZE,
        duration: this.movementSpeed
      }
    }
  }


}
