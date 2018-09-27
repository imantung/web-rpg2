class Player{
  constructor(charAsset, tileSize){
    this.charAsset = charAsset
    this.tileSize = tileSize;
    this.movementSpeed = 120;
  }
  
  preload(scene){
    scene.load.image('phaserguy', this.charAsset);
  }
  
  create(scene){
    var phaserGuy = scene.add.image(this.tileSize, this.tileSize, 'phaserguy');
    phaserGuy.setDepth(1);
    phaserGuy.setOrigin(0, 0.5);
    
    // TODO: rename to a better name
    this.phaserGuy = phaserGuy
  }
  
  followMe(camera){
    camera.startFollow(this.phaserGuy)
  }
  
  // return y position of player based on its tile
  getTileX(){
    return Math.floor(this.phaserGuy.x / this.tileSize);
  }
  
  // return x position of player based on its tile
  getTileY(){
    return Math.floor(this.phaserGuy.y / this.tileSize);
  }
  
  move(scene, path){
    var tweens = [];
    for (var i = 0; i < path.length - 1; i++) {
      var ex = path[i + 1].x;
      var ey = path[i + 1].y;
      tweens.push({
        targets: this.phaserGuy,
        x: {
          value: ex * this.tileSize,
          duration: this.movementSpeed
        },
        y: {
          value: ey * this.tileSize,
          duration: this.movementSpeed
        }
      });
    }
    
    scene.tweens.timeline({tweens: tweens});
  }

}
