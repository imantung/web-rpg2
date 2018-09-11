const CURSOR_STATE_WALKABLE = 1;

class Cursor{
  constructor(tileSize){
    this.tileSize = tileSize;
  }
  
  create(scene){
    this.marker = scene.add.graphics();
    this.marker.lineStyle(3, 0xffffff, 1);
    this.marker.strokeRect(0, 0, this.tileSize, this.tileSize);
  }
  
  // setState(state){
  //   switch(state){
  //     case CURSOR_STATE_WALKABLE:
  // 
  //       this.marker.setVisible(true)
  //       break;
  //     default:
  //       // TODO: reset
  //       this.marker.setVisible(false)
  //   }
  // }
  
  setX(x){
    this.marker.x = x;
  }
  
  setY(y){
    this.marker.y = y;
  }
  
  setVisible(b){
    this.marker.setVisible(b)
  }
}
