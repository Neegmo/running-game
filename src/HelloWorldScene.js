import Phaser from "phaser";
import Runner from "./classes/Runner";
import Guard from "./classes/Guard";

export default class HelloWorldScene extends Phaser.Scene {
  runner;
  guard;
  startButton;

  balance = 999;
  balanceText;

  bet = 10;
  betText;

  multiplyer = 0;
  multiplyerText;

  maxMultiplyerForThisRound;

  state = 0;

  constructor() {
    super("hello-world");
  }

  preload() {
    this.load.image("Background", "images/bg.png");
    this.load.image("Runner", "images/Runner.png");
    this.load.image("Guard", "images/Guard.png");
    this.load.image("GuardLooking", "images/GuardLooking.png");
    this.load.image("StartButton", "images/StartButton.png");
    this.load.image("RunButton", "images/RunButton.png");
    this.load.image("Collect", "images/Collect.png");
    this.load.image("RedScreen", "images/redScreen.png");
    this.load.image("Stage", "images/Stage.png");
    this.load.image("UIHolder", "images/UIHolder.png");
    this.load.image("StartButtonHolder", "images/StartButtonHolder.png");
    this.load.image("Ninja", "images/Ninja.png");
    this.load.image("Trees", "images/Trees.png");
  }

  create() {
    this.add.image(0, 0, "Stage").setOrigin(0, 0).setScale(1.2, 1.45);
    this.add.image(0, 0, "Trees").setOrigin(0, 0).setScale(1.2, 1.45);
    this.add.image(0, 2650, "UIHolder").setOrigin(0, 0).setScale(1.2, 1.2);

    this.createStartButton();

    this.runner = new Runner(this, 640, 2400, "Ninja");
    this.add.existing(this.runner);

    this.guard = new Guard(this, 640, 500, "Guard");
    this.add.existing(this.guard);

    this.balanceText = this.add.text(80, 2700, `BALANCE: ${this.balance}`, {
      fontSize: "60px",
      strokeThickness: 5,
    });

    this.betText = this.add.text(900, 2700, `BET: ${this.bet}`, {
      fontSize: "60px",
      strokeThickness: 5,
    });

    this.multiplyerText = this.add
      .text(900, this.runner.y, `X ${this.multiplyer}`, {
        fontSize: "60px",
        strokeThickness: 5,
      })
      .setAlpha(0)
      .setDepth(2);

    this.redScreen = this.add.image(0, 0, "RedScreen").setScale(2, 2);
    this.redScreen.setAlpha(0);

    this.maxMultiplyerForThisRound = Phaser.Math.FloatBetween(0.2, 4.2);
  }

  update(time, delta) {
    if (this.state === 1) {
      this.runner.y -= (200 * delta) / 1000;
      this.multiplyer += (0.5 * delta) / 1000;
      // this.collectButton.y = this.runner.y
    } else if (this.state === 3) {
      // this.runnerCaughtAnimationSequence(delta);
      this.runnerCaughtSequence2(delta)
    }

    this.balanceText.text = `BALANCE: ${this.balance.toFixed(2)}`;
    this.betText.text = `BET: ${this.bet}`;

    this.multiplyerText.text = `X ${this.multiplyer.toFixed(2)}`;
    this.multiplyerText.y = this.runner.y;

    if (this.multiplyer >= 4) {
      this.balance += this.bet * this.multiplyer;
      this.setStateToStopped();
      this.setStateToInitial();
    }

    if (this.multiplyer >= this.maxMultiplyerForThisRound) {
      this.setStateToStopped();
      this.setStateToCaught();
    }
  } //update

  createStartButton() {
    this.add.image(1100, 2410, "StartButtonHolder").setScale(1.2, 1.2);
    this.startButton = this.add
      .image(1100, 2400, "StartButton")
      .setScale(1.2, 1.2);
    this.startButton.setInteractive();

    this.startButton.on("pointerdown", () => {
      if (this.state === 0) {
        console.log("Balance")
        this.balance -= this.bet;
      } 
      this.setStateToRunning();
      this.multiplyerText.setAlpha(1);
      this.guard.angle = 0;


      if (this.collectButton) this.collectButton.destroy();
    });

    this.startButton.on("pointerup", () => {
      if (this.state !== 1) return;

      this.setStateToStopped();

      this.createCollectButton();
    });
  }

  createCollectButton() {
    this.collectButton = this.add
      .image(1040, this.runner.y, "Collect")
      .setScale(1.2, 1.2);
    this.collectButton.setInteractive();

    this.collectButton.on("pointerdown", () => {
      this.balance += this.bet * this.multiplyer;
      this.setStateToInitial();
    });

    this.collectButton.on("pointerup", () => {});
  }

  setStateToInitial() {
    this.runner.x = 640;
    this.runner.y = 2200;

    this.multiplyer = 0;
    this.multiplyerText.setAlpha(0);

    this.maxMultiplyerForThisRound = Phaser.Math.FloatBetween(0.2, 4.2);
    if (this.collectButton) {
      this.collectButton.destroy();
    }
    this.guard.setTexture("Guard")
    this.state = 0;
  }

  setStateToRunning() {
    this.state = 1;

    this.runner.flipX = !this.runner.flipX
    this.animateRunning()
  }

  animateRunning() {
    if(this.state !== 1) return
    this.time.delayedCall(100, () =>{
      this.runner.flipX = !this.runner.flipX
      this.animateRunning()
    })
  }

  setStateToStopped() {
    this.state = 2;
  }

  setStateToCaught() {
    this.state = 3;
  }

  runnerCaughtAnimationSequence(deltaTime) {
    if (this.guard.angle < 175 && this.guard.angle > -175) {
      this.guard.angle += deltaTime / 2;
    } else if (
      this.guard.angle >= 175 ||
      (this.guard.angle <= -175 && this.redScreen.alpha < 0.5)
    ) {
      this.guard.angle = 180;
      let currentalpha = this.redScreen.alpha;
      this.redScreen.setAlpha(currentalpha + deltaTime / 750);
    } else if (
      this.guard.angle >= 175 ||
      (this.guard.angle <= -175 && this.redScreen.alpha >= 0.5)
    ) {
      this.time.delayedCall(500, () => {
        this.redScreen.setAlpha(0);
        this.setStateToInitial();
      });
    }
  }
  runnerCaughtSequence2(deltaTime) {
    this.guard.setTexture("GuardLooking")
    if (this.redScreen.alpha < 0.5) {
      let currentalpha = this.redScreen.alpha;
      this.redScreen.setAlpha(currentalpha + deltaTime / 750);
    }
    this.time.delayedCall(1000, () => {
      this.redScreen.setAlpha(0);
      this.setStateToInitial();
    });
  }

  // setStateToCought;
}
