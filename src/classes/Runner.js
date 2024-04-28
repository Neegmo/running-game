export default class Runner extends Phaser.GameObjects.Sprite {


    constructor(scene, x, y, texture) {
      super(scene, x, y, texture);
      this.setScale(1.2, 1.2)
    }

    run(speed){
        this.y += speed; 
    }
  }
  