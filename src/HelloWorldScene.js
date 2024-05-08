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

  progress = 0;

  startRunnerY = 2500;
  endRunnerY = 700;

  minMultiplyer = 0.2;
  maxMultiplyer = 10;

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
    this.load.image("Bush", "images/Bush.png");
  }

  create() {
    this.add.image(0, 0, "Stage").setOrigin(0, 0).setScale(1.2, 1.45);
    this.add.image(0, 0, "Trees").setOrigin(0, 0).setScale(1.2, 1.45);
    this.add.image(0, 2650, "UIHolder").setOrigin(0, 0).setScale(1.2, 1.2);

    this.createStartButton();

    this.runner = new Runner(this, 640, 2500, "Ninja");
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
      .text(300, this.runner.y + 20, `X ${this.multiplyer}`, {
        fontSize: "60px",
        strokeThickness: 5,
      })
      .setAlpha(0)
      .setOrigin(0.5, 0.5)
      .setDepth(2);

    this.redScreen = this.add.image(0, 0, "RedScreen").setScale(2, 2);
    this.redScreen.setAlpha(0);

    this.maxMultiplyerForThisRound = Phaser.Math.FloatBetween(this.minMultiplyer, this.maxMultiplyer);
  }

  update(time, delta) {
    if (this.state === 1) {

      // if(this.progress + delta / 5000 <= 1) this.progress += delta / 5000;
      // else this.progress = 1

      this.progress += delta / 5000;

      this.runner.y = this.lerp(this.startRunnerY, this.endRunnerY, this.progress);
      this.multiplyer = this.lerp(this.minMultiplyer, this.maxMultiplyer, this.progress)
      // this.collectButton.y = this.runner.y
    } else if (this.state === 3) {
      // this.runnerCaughtAnimationSequence(delta);
      this.runnerCaughtSequence2(delta)
    }

    this.balanceText.text = `BALANCE: ${this.balance.toFixed(2)}`;
    this.betText.text = `BET: ${this.bet}`;

    this.multiplyerText.text = `X${this.multiplyer.toFixed(2)}`;
    this.multiplyerText.y = this.runner.y + 25;

    if (this.multiplyer >= this.maxMultiplyer) {
      this.balance += this.bet * this.multiplyer;
      this.setStateToStopped();
      this.setStateToInitial();
    }

    if (this.multiplyer >= this.maxMultiplyerForThisRound + 0.1) {
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

      this.animateBush()
    });
  }

  createCollectButton() {
    this.collectButton = this.add
      .image(300, this.runner.y, "Collect")
      .setScale(1.2, 1.2);
    this.collectButton.setInteractive();

    this.collectButton.on("pointerdown", () => {
      this.balance += this.bet * this.multiplyer;
      this.setStateToInitial();
      if(this.bush) this.bush.destroy()
    });

    this.collectButton.on("pointerup", () => {});
  }

  setStateToInitial() {
    this.progress = 0;
    this.runner.y = this.startRunnerY

    this.multiplyer = 0;
    this.multiplyerText.setAlpha(0);

    this.maxMultiplyerForThisRound = Phaser.Math.FloatBetween(this.minMultiplyer, this.maxMultiplyer);
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

    if(this.bush) {
      this.bush.destroy()
    }
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

  animateBush(){
   this.bush = this.add.image(this.runner.x, this.runner.y, "Bush").setScale(1.2, 1.2)
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

  lerp( a, b, alpha ) {
    if (alpha > 1) alpha = 1
    return a + alpha * ( b - a )
   }

  // setStateToCought;
}
