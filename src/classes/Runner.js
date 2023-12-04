export default class Runner extends Phaser.GameObjects.Sprite {


    constructor(scene, x, y, texture) {
      super(scene, x, y, texture);
   
    }

    run(speed){
        this.y += speed; 
    }
  }
  