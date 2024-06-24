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

  minMultiplyer = 0.1;
  maxMultiplyer = 6;
  coinPresent = false;

  bonus = 0;

  canResetGame = false;

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
    this.load.image("Coin", "images/Coin.png");
    this.load.image("IncreaseBetButton", "images/IncreaseBetButton.png");
    this.load.image("DecreaseBetButton", "images/DecreaseBetButton.png");
    this.load.image("Z", "images/Z.png");

    this.load.audio("BGMusic", ["sounds/BGMusic.mp3"]);
    this.load.audio("CoinCollectedSound", ["sounds/CoinCollectedSound.mp3"]);
    this.load.audio("CollectSound", ["sounds/CollectSound.mp3"]);
    this.load.audio("CoughtSound", ["sounds/CoughtSound.mp3"]);
    this.load.audio("BushSound", ["sounds/BushSound.mp3"]);
    this.load.audio("DecrementSound", ["sounds/DecrementSound.mp3"]);
    this.load.audio("IncrementSound", ["sounds/IncrementSound.mp3"]);
    this.load.audio("RunningSound", ["sounds/RunningSound.mp3"]);
    this.load.audio("SleepingSound", ["sounds/SleepingSound.mp3"]);
  }

  create() {
    this.add.image(0, 0, "Stage").setOrigin(0, 0).setScale(1.2, 1.45);
    this.add.image(0, 0, "Trees").setOrigin(0, 0).setScale(1.2, 1.45);
    this.add.image(0, 2650, "UIHolder").setOrigin(0, 0).setScale(1.2, 1.2);

    this.createStartButton();

    this.runner = new Runner(this, 640, 2500, "Ninja");
    this.add.existing(this.runner);

    this.createGuard();

    this.balanceText = this.add
      .text(350, 2730, `BALANCE: ${this.balance}`, {
        fontSize: "60px",
        strokeThickness: 5,
      })
      .setOrigin(0.5, 0.5);

    this.betText = this.add
      .text(990, 2720, `BET: ${this.bet}`, {
        fontSize: "60px",
        strokeThickness: 5,
        align: "center",
      })
      .setOrigin(0.5, 0.5);

    this.multiplyerText = this.add
      .text(300, this.runner.y + 20, `X ${this.multiplyer}`, {
        fontSize: "60px",
        strokeThickness: 5,
      })
      .setAlpha(0)
      .setOrigin(0.5, 0.5)
      .setDepth(2);

    this.redScreen = this.add
      .image(0, 0, "RedScreen")
      .setScale(2, 2)
      .setDepth(5);
    this.redScreen.setAlpha(0);

    this.generateCatchingPoint();

    this.addSounds();

    this.addIncreaseBetButton();
    this.addDecreaseBetButton();
  }

  update(time, delta) {
    if (this.state === 1) {
      this.progress += delta / 7000;

      this.runner.y = this.lerp(
        this.startRunnerY,
        this.endRunnerY,
        this.progress
      );
      this.multiplyer =
        this.lerp(this.minMultiplyer, this.maxMultiplyer, this.progress) +
        this.bonus;

      // this.collectButton.y = this.runner.y
    } else if (this.state === 3) {
      this.runnerCaughtSequence2(delta);
    }
    this.checkProgress();

    this.updateUI();

    this.collectCoin();
  } //update

  addSounds() {
    if (!this.BGMusic || !this.BGMusic.isPlaying) {
      this.BGMusic = this.sound.add("BGMusic", { loop: true, volume: 0.4 });
      this.BGMusic.play();
    }
    if (!this.BushSound || !this.BushSound.isPlaying) {
      this.BushSound = this.sound.add("BushSound", { loop: false, volume: 1 });
    }
    if (!this.CoinCollectedSound || !this.CoinCollectedSound.isPlaying) {
      this.CoinCollectedSound = this.sound.add("CoinCollectedSound", {
        loop: false,
        volume: 1,
      });
    }
    if (!this.CollectSound || !this.CollectSound.isPlaying) {
      this.CollectSound = this.sound.add("CollectSound", {
        loop: false,
        volume: 1,
      });
    }
    if (!this.CoughtSound || !this.CoughtSound.isPlaying) {
      this.CoughtSound = this.sound.add("CoughtSound", {
        loop: false,
        volume: 1,
      });
    }
    if (!this.DecrementSound || !this.DecrementSound.isPlaying) {
      this.DecrementSound = this.sound.add("DecrementSound", {
        loop: false,
        volume: 1,
      });
    }
    if (!this.IncrementSound || !this.IncrementSound.isPlaying) {
      this.IncrementSound = this.sound.add("IncrementSound", {
        loop: false,
        volume: 1,
      });
    }
    if (!this.RunningSound || !this.RunningSound.isPlaying) {
      this.RunningSound = this.sound.add("RunningSound", {
        loop: true,
        volume: 1,
      });
    }
    if (!this.SleepingSound || !this.SleepingSound.isPlaying) {
      this.SleepingSound = this.sound.add("SleepingSound", {
        loop: true,
        volume: 0.8,
      });
      this.SleepingSound.play();
    }
  }

  createGuard() {
    this.guard = new Guard(this, 640, 500, "Guard");
    this.add.existing(this.guard);

    this.sleepingSign = this.add.image(740, 350, "Z");
    this.tweens.add({
      targets: this.sleepingSign,
      X: 850,
      Y: 240,
      scaleX: 1.4,
      scaleY: 1.4,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeIn",
      duration: 1300,
    });
  }

  addIncreaseBetButton() {
    this.increaseBetButton = this.add
      .image(1200, 2720, "IncreaseBetButton")
      .setScale(3, 3)
      .setInteractive();

    this.increaseBetButton.on("pointerup", () => {
      console.log("TestIncrease");
      this.bet += 10;
      this.betText.text = `BET: ${this.bet}`;
      this.IncrementSound.play();
    });
  }

  addDecreaseBetButton() {
    this.decreaseBetButton = this.add
      .image(780, 2720, "DecreaseBetButton")
      .setScale(3, 3)
      .setInteractive();

    this.decreaseBetButton.on("pointerup", () => {
      if (this.bet <= 10) return;
      this.bet -= 10;
      this.betText.text = `BET: ${this.bet}`;
      this.DecrementSound.play();
    });
  }

  checkProgress() {
    if (
      this.multiplyer >= this.maxMultiplyerForThisRound + 0.1 &&
      this.state === 1
    ) {
      this.setStateToCaught();
      console.log("TestChecker");
    }
  }

  updateUI() {
    this.balanceText.text = `BALANCE: ${this.balance.toFixed(2)}`;
    this.betText.text = `BET: ${this.bet}`;

    this.multiplyerText.text = `X${this.multiplyer.toFixed(2)}`;
    this.multiplyerText.y = this.runner.y + 25;
  }

  generateCatchingPoint() {
    this.firstRandomNumber = Phaser.Math.Between(1, 100);
    this.secondRandomNumber = Phaser.Math.Between(1, 100);

    if (this.firstRandomNumber < 61) {
      this.firstCatchingPointCase();
    } else if (this.firstRandomNumber < 96) {
      this.secondCatchingPointCase();
    } else {
      this.thirdCatchingPointCase();
    }
  }

  firstCatchingPointCase() {
    if (this.secondRandomNumber < 81)
      this.maxMultiplyerForThisRound = Phaser.Math.FloatBetween(0.1, 4);
    else this.maxMultiplyerForThisRound = Phaser.Math.FloatBetween(4.1, 6);
  }

  secondCatchingPointCase() {
    this.createCoin(2120, 1.3);
    if (this.secondRandomNumber < 41)
      this.maxMultiplyerForThisRound = Phaser.Math.FloatBetween(0.1, 1.3);
    else if (this.secondRandomNumber < 96)
      this.maxMultiplyerForThisRound = Phaser.Math.FloatBetween(2.6, 4);
    else this.maxMultiplyerForThisRound = Phaser.Math.FloatBetween(4.1, 7.3);
  }

  thirdCatchingPointCase() {
    this.createCoin(1300, 4);
    if (this.secondRandomNumber < 61)
      this.maxMultiplyerForThisRound = Phaser.Math.FloatBetween(0.1, 4);
    else this.maxMultiplyerForThisRound = Phaser.Math.FloatBetween(8, 10);
  }

  createCoin(height, addition) {
    this.coin = this.add.image(642, height, "Coin");
    this.coinHeight = height;
    this.multiplyerAddition = addition;
    this.coin.setAlpha(0);
    this.coinPresent = true;
  }

  collectCoin() {
    if (!this.coinPresent) return;

    if (this.runner.y <= this.coinHeight + 10) {
      this.CoinCollectedSound.play();
      this.coin.destroy();
      this.bonus = this.multiplyerAddition;
      this.animateMultiPlyer();
      this.coinPresent = false;
    }
  }

  createStartButton() {
    this.add.image(1100, 2410, "StartButtonHolder").setScale(1.2, 1.2);
    this.startButton = this.add
      .image(1100, 2400, "StartButton")
      .setScale(1.2, 1.2);
    this.startButton.setInteractive();

    this.startButton.on("pointerdown", () => {
      if (this.state === 0) {
        this.balance -= this.bet;
        this.increaseBetButton.setAlpha(0);
        this.decreaseBetButton.setAlpha(0);
      }
      this.setStateToRunning();
      this.multiplyerText.setAlpha(1);

      if (this.coin) this.coin.setAlpha(1);

      if (this.collectButton) this.collectButton.destroy();
    });

    this.startButton.on("pointerup", () => {
      console.log("ButtonUp");
      if (this.state !== 1) return;

      this.setStateToStopped();

      this.createCollectButton();

      this.animateBush();
    });
  }

  createCollectButton() {
    this.collectButton = this.add
      .image(300, this.runner.y, "Collect")
      .setScale(1.2, 1.2);
    this.collectButton.setInteractive();

    this.collectButton.once("pointerdown", () => {
      this.balance += this.bet * this.multiplyer;
      this.betCollectedSequence();
      if (this.bush) this.bush.destroy();
      this.CollectSound.play();
    });

    this.collectButton.on("pointerup", () => {});
  }

  animateMultiPlyer() {
    this.multiplyerText.setColor("#00ff00");
    this.tweens.add({
      targets: this.multiplyerText,
      scaleX: 1.4,
      scaleY: 1.4,
      yoyo: true,
      ease: "Expo.easeOut",
      duration: 200,
      onComplete: () => {
        this.multiplyerText.setColor("#ffffff");
      },
    });
  }

  betCollectedSequence() {
    this.setStateToCollection();
    this.balanceText.setColor("#00ff00");
    this.tweens.add({
      targets: this.balanceText,
      scaleX: 1.4,
      scaleY: 1.4,
      yoyo: true,
      ease: "Expo.easeOut",
      duration: 200,
      onComplete: () => {
        this.balanceText.setColor("#ffffff");
        this.setStateToInitial();
      },
    });
  }

  setStateToInitial() {
    console.log("TestInitial");

    if (this.state === 0) return;
    this.progress = 0;

    this.runner.y = this.startRunnerY;

    this.multiplyer = 0;
    this.multiplyerText.setAlpha(0);

    if (this.coin) {
      this.coin.destroy();
      this.coin = undefined;
      this.coinPresent = false;
    }

    this.generateCatchingPoint();

    if (this.collectButton) {
      this.collectButton.destroy();
    }
    this.guard.setTexture("Guard");

    if (this.bush) {
      this.bush.destroy();
      this.bush = undefined;
    }

    this.RunningSound.stop();

    if (!this.SleepingSound.isPlaying) this.SleepingSound.play();

    this.increaseBetButton.setAlpha(1);
    this.decreaseBetButton.setAlpha(1);
    this.sleepingSign.setAlpha(1);

    this.bonus = 0;
    this.state = 0;

    this.time.delayedCall(100, () => {
      this.startButton.setAlpha(1);
    });
  }

  setStateToRunning() {
    // console.log("TestRunning");
    if (this.state === 1) return;
    this.RunningSound.play();
    this.state = 1;
    this.runner.flipX = !this.runner.flipX;
    this.animateRunning();

    if (this.bush) {
      this.bush.destroy();
    }
  }

  setStateToStopped() {
    // console.log("TestStopped");
    if (this.state === 2) return;
    this.state = 2;
    this.RunningSound.stop();
  }

  setStateToCaught() {
    // console.log("TestCaught");
    if (this.state === 3) return;
    this.state = 3;
    this.CoughtSound.play();
    this.RunningSound.stop();
    this.SleepingSound.stop();
    this.sleepingSign.setAlpha(0);
    this.canResetGame = true;
    this.startButton.setAlpha(0);
  }

  setStateToCollection() {
    // console.log("TestCollected");
    if (this.state === 4) return;
    this.state = 4;
  }

  animateRunning() {
    if (this.state !== 1) return;

    this.time.delayedCall(170, () => {
      this.runner.flipX = !this.runner.flipX;
      this.animateRunning();
    });
  }

  animateBush() {
    this.BushSound.play();
    this.bush = this.add
      .image(this.runner.x, this.runner.y, "Bush")
      .setScale(1.2, 1.2)
      .setDepth(3);
  }

  runnerCaughtSequence2(deltaTime) {
    if (this.state !== 3) return;

    this.guard.setTexture("GuardLooking");
    if (this.redScreen.alpha < 0.8) {
      let currentalpha = this.redScreen.alpha;
      this.redScreen.setAlpha(currentalpha + deltaTime / 750);
    } else if (this.canResetGame) {
      this.time.delayedCall(700, () => {
        console.log("Test");
        this.redScreen.setAlpha(0);
        this.setStateToInitial();
      });
      this.canResetGame = false;
    }
  }

  lerp(a, b, alpha) {
    if (alpha > 1) alpha = 1;
    return a + alpha * (b - a);
  }
}
