import Phaser from "phaser";

export default class TutorialScene extends Phaser.Scene {
  constructor() {
    super("tutorial");
  }

  globalScale = 0.5;

  preload() {
    this.loadFont("troika", "Assets/Fonts/troika.otf");

    // this.load.baseURL = "Assets/";

    this.load.image("Stage", "images/Stage.png");
    this.load.image("Ninja", "images/Ninja.png");
    this.load.image("Trees", "images/Trees.png");
    this.load.image("Ninja", "images/Ninja.png");
    this.load.image("Bush", "images/Bush.png");
    this.load.image("Coin", "images/Coin.png");
    this.load.image("RunButton", "images/RunButton.png");
    this.load.image("Collect", "images/Collect.png");
    this.load.image("UIHolder", "images/UIHolder.png");
    this.load.image("StartButtonHolder", "images/StartButtonHolder.png");
    this.load.image("Z", "images/Z.png");
    this.load.image("shadow", "images/shadow.png");
    this.load.image("Guard", "images/Guard.png");
    this.load.image("GuardLooking", "images/GuardLooking.png");
    this.load.image("StartButton", "images/StartButton.png");

    // this.load.audio("BGMusic", ["sounds/BG1.mp3"]);
  }

  create() {
    this.add.image(0, 0, "Stage").setOrigin(0, 0).setScale(1.2, 1.45);
    this.add.image(0, 0, "Trees").setOrigin(0, 0).setScale(1.2, 1.45);

    this.createFirstSlide();
  }

  createFirstSlide() {
    this.guard = this.add.image(640, 500, "Guard");

    this.runner = this.add.image(640, 2200, "Ninja");

    this.shadow = this.add
      .image(0, 0, "shadow")
      .setOrigin(0, 0)
      .setScale(1.2, 1.45);

    this.buttonHolder = this.add
      .image(1100, 2410, "StartButtonHolder")
      .setScale(1.2, 1.2);
    this.startButton = this.add
      .image(1100, 2400, "StartButton")
      .setScale(1.2, 1.2);
    this.startButton.setInteractive();
    this.startButton.on("pointerdown", () => {
      this.createSecondSlide();
    });

    this.buttonAnimation = this.tweens.add({
      targets: this.startButton,
      scaleX: 1.3,
      scaleY: 1.3,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
      duration: 400,
    });

    this.collectButton = this.add
      .image(300, this.runner.y, "Collect")
      .setScale(1.2, 1.2);
    this.collectButton.setInteractive();
    this.multiplyerText = this.add
      .text(300, this.runner.y + 20, `X 1.3`, {
        fontSize: "60px",
        strokeThickness: 5,
      })
      .setOrigin(0.5, 0.5);

    this.firstTutorialScreenText = this.add
      .text(640, 1045, "Hold the button to\n increase the multiplier.", {
        fontSize: "80px",
        fontFamily: "troika",
        align: "center",
      })
      .setOrigin(0.5, 0.5);
  }

  createSecondSlide() {
    this.firstTutorialScreenText.destroy();

    this.guard.destroy();
    this.shadow.destroy();

    this.buttonAnimation.stop();
    this.startButton.setScale(1.2, 1.2);

    this.shadow = this.add
      .image(0, 0, "shadow")
      .setOrigin(0, 0)
      .setScale(1.2, 1.45)
      .setInteractive();

    this.shadow.once("pointerdown", () => {
      this.createThirdSlide();
    });

    this.guard = this.add.image(640, 500, "Guard");

    this.secondTutorialScreenText = this.add
      .text(
        640,
        1045,
        "Be careful,\n the Sensei can wake up\n at any moment.",
        {
          fontSize: "80px",
          fontFamily: "troika",
          align: "center",
        }
      )
      .setOrigin(0.5, 0.5);
  }

  createThirdSlide() {
    this.secondTutorialScreenText.destroy();

    this.guard.setTexture("GuardLooking");

    this.shadow.once("pointerdown", () => {
      this.createFourthSlide();
    });

    this.thirdTutorialScreenText = this.add
      .text(
        640,
        1045,
        "If you’re holding the button\n when he wakes up,\n you lose all your progress.",
        {
          fontSize: "80px",
          fontFamily: "troika",
          align: "center",
        }
      )
      .setOrigin(0.5, 0.5);
  }

  createFourthSlide() {
    this.thirdTutorialScreenText.destroy();
    this.shadow.destroy();

    this.shadow = this.add
      .image(0, 0, "shadow")
      .setOrigin(0, 0)
      .setScale(1.2, 1.45)
      .setInteractive();

    this.shadow.once("pointerdown", () => {
      this.createFifthSlide();
    });

    this.bush = this.add.image(this.runner.x, this.runner.y, "Bush");

    this.fourthTutorialScreenText = this.add
      .text(
        640,
        1045,
        "Don't worry.\n When you release the button,\n you're safe.",
        {
          fontSize: "80px",
          fontFamily: "troika",
          align: "center",
        }
      )
      .setOrigin(0.5, 0.5);
  }

  createFifthSlide() {
    this.fourthTutorialScreenText.destroy();

    this.coin = this.add.image(640, 1300, "Coin");

    this.bush.destroy();

    this.fifthTutorialScreenText = this.add
      .text(640, 1045, "Collect coins\n to boost your multiplier.", {
        fontSize: "80px",
        fontFamily: "troika",
        align: "center",
      })
      .setOrigin(0.5, 0.5);

    this.shadow.once("pointerdown", () => {
      this.createSixthSlide();
    });
  }

  createSixthSlide() {
    this.fifthTutorialScreenText.destroy();

    this.coin.destroy();

    this.sixthTutorialScreenText = this.add
      .text(640, 1045, "Goodluck.", {
        fontSize: "80px",
        fontFamily: "troika",
        align: "center",
      })
      .setOrigin(0.5, 0.5);

    this.shadow.once("pointerdown", () => {
      this.scene.start("hello-world");
    });
  }

  loadFont(name, url) {
    var newFont = new FontFace(name, `url(${url})`);
    newFont
      .load()
      .then(function (loaded) {
        document.fonts.add(loaded);
      })
      .catch(function (error) {
        return error;
      });
  }
}
