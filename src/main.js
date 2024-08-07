import Phaser from "phaser";

import HelloWorldScene from "./HelloWorldScene";

import TutorialScene from "./TutorialScene";

const config = {
  type: Phaser.AUTO,
  parent: "app",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
    width: 1284,
    height: 2778,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
    },
  },
  scene: [TutorialScene, HelloWorldScene],
};

export default new Phaser.Game(config);
