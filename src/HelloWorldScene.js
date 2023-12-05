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
    this.load.image("StartButton", "images/StartButton.png");
    this.load.image("RunButton", "images/RunButton.png");
    this.load.image("CollectButton", "images/CollectButton.png");
    this.load.image("RedScreen", "images/RedScreen.png");
  }

  create() {
    this.add.image(0, 0, "Background").setScale(2, 2);

    this.createStartButton();

    this.runner = new Runner(this, 640, 2200, "Runner");
    this.add.existing(this.runner);

    this.guard = new Guard(this, 640, 200, "Guard");
    this.add.existing(this.guard);

    this.balanceText = this.add.text(80, 2620, `BALANCE: \n${this.balance}`, {
      fontSize: "60px",
      strokeThickness: 5,
    });

    this.betText = this.add.text(900, 2620, `BET: \n${this.bet}`, {
      fontSize: "60px",
      strokeThickness: 5,
    });

    this.multiplyerText = this.add
      .text(900, this.runner.y, `X ${this.multiplyer}`, {
        fontSize: "60px",
        strokeThickness: 5,
      })
      .setAlpha(0);

    this.redScreen = this.add.image(0, 0, "RedScreen").setScale(2, 2);
    this.redScreen.setAlpha(0);

    this.maxMultiplyerForThisRound = Phaser.Math.FloatBetween(0.2, 4.2);
  }

  update(time, delta) {
    console.log(this.guard.angle);

    if (this.state === 1) {
      this.runner.y -= (200 * delta) / 1000;
      this.multiplyer += (0.5 * delta) / 1000;
    } else if (this.state === 3) {
      this.runnerCaughtAnimationSequence(delta);
    }

    this.balanceText.text = `BALANCE: \n${this.balance.toFixed(2)}`;
    this.betText.text = `BET: \n${this.bet}`;

    this.multiplyerText.text = `X ${this.multiplyer.toFixed(2)}`;
    this.multiplyerText.y = this.runner.y;

    if (this.multiplyer >= 4) {
      this.balance += this.bet * this.multiplyer;
      this.setStateToStopped();
      this.setStateToInitial();
    }

    if (this.multiplyer >= this.maxMultiplyerForThisRound) {
      // console.log("Cought!");
      this.setStateToStopped();
      this.setStateToCaught();
    }
  } //update

  createStartButton() {
    this.startButton = this.add
      .image(640, 2500, "StartButton")
      .setScale(0.5, 0.5);
    this.startButton.setInteractive();

    this.startButton.on("pointerdown", () => {
      this.setStateToRunning();
      this.balance -= this.bet;
      this.multiplyerText.setAlpha(1);
      this.guard.angle = 0;
    });

    this.startButton.on("pointerup", () => {
      if (this.state === 0) return;

      this.setStateToStopped();

      this.createCollectButton();
      this.createRunButton();
    });
  }

  createCollectButton() {
    this.collectButton = this.add
      .image(1040, 2500, "CollectButton")
      .setScale(0.5, 0.5);
    this.collectButton.setInteractive();

    this.collectButton.on("pointerdown", () => {
      this.balance += this.bet * this.multiplyer;
      this.setStateToInitial();
    });

    this.collectButton.on("pointerup", () => {});
  }

  createRunButton() {
    this.runButton = this.add.image(640, 2500, "RunButton").setScale(0.5, 0.5);
    this.runButton.setInteractive();

    this.runButton.on("pointerdown", () => {
      this.setStateToRunning();
    });

    this.runButton.on("pointerup", () => {
      this.setStateToStopped();
    });
  }

  setStateToInitial() {
    this.runner.x = 640;
    this.runner.y = 2200;

    this.multiplyer = 0;
    this.multiplyerText.setAlpha(0);

    this.maxMultiplyerForThisRound = Phaser.Math.FloatBetween(0.2, 4.2);
    if (this.runButton !== undefined) {
      this.runButton.destroy();
      this.collectButton.destroy();
    }

    this.state = 0;
  }

  setStateToRunning() {
    this.state = 1;
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
      this.guard.angle <= -175 &&
      this.redScreen.alpha < 0.5
    ) {
      this.guard.angle = 180;
      let currentalpha = this.redScreen.alpha;
      this.redScreen.setAlpha(currentalpha + deltaTime / 750);
    } else if (
      this.guard.angle >= 175 ||
      this.guard.angle <= -175 &&
      this.redScreen.alpha >= 0.5
    ) {
      this.redScreen.setAlpha(0);
      this.setStateToInitial();
    }
  }

  setStateToCought;
}
