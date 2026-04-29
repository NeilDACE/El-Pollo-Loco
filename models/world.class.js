class World {
  character = new Character();
  statusBarHealth = new StatusBarHealth();
  statusCoin = new StatusCoin();
  statusBottle = new StatusBottle();
  statusBarEndboss = new StatusBarEndboss();
  throwableObjects = [];
  intervalIdsWorld = [];
  gameEnded = false;
  endScreen = null;
  level = level1;
  ctx;
  canvas;
  keyboard;
  kamera_x = 0;
  soundManager = new SoundManager();

  constructor(canvas, keyboard) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.runCollisionChecks();
  }

  setStopableIntervals(fn, time) {
    const intervalId = setInterval(fn, time);
    this.intervalIdsWorld.push(intervalId);
  }

  clearAllGameIntervals() {
    this.intervalIdsWorld.forEach((id) => clearInterval(id));
    this.intervalIdsWorld = [];
    this.character.clearIntervals();
    this.level.enemies.forEach((enemy) => enemy.clearIntervals());
    this.level.coins.forEach((coin) => coin.clearIntervals());
    this.level.bottles.forEach((bottle) => bottle.clearIntervals());
    this.level.backgroundObjects.forEach((bg) => {
      if (bg.clearIntervals) {
        bg.clearIntervals();
      }
    });
    this.level.clouds.forEach((cloud) => cloud.clearIntervals());
    this.throwableObjects.forEach((bottle) => bottle.clearIntervals());
  }

  endGame(didWin) {
    this.gameEnded = true;
    const imagePath = didWin
      ? "img/9_intro_outro_screens/you win!.png"
      : "img/9_intro_outro_screens/game_over/game over!.png";
    this.endScreen = new EndScreen(imagePath);
  }

  setWorld() {
    this.character.world = this;
    this.level.enemies.forEach((enemy) => {
      enemy.world = this;
    });
    this.statusCoin.setCount(this.character.coinCounter);
    this.statusBottle.setCount(this.character.bottleCounter);
  }

  runCollisionChecks() {
    this.setStopableIntervals(() => {
      if (this.gameEnded) return;
      this.updateBossBackgroundMusic();
      this.checkGameEnd();
      this.checkCharacterFallingCollisions();
      this.checkEnemyCollisions();
      this.checkEnemyCollisionsWithBottle();
      this.removeBrokenBottles();
      this.level.coins = this.checkAndRemoveCollisions(this.level.coins, () =>
        this.onCollisionWithCoin(),
      );
      this.level.bottles = this.checkAndRemoveCollisions(
        this.level.bottles,
        () => this.onCollisionWithBottle(),
      );
    }, 1000 / 60);
  }

  checkGameEnd() {
    if (this.character.isDead()) {
      this.endGame(false);
      this.soundManager.stopAll();
      this.soundManager.play("gameOver");
      return;
    }
    const endboss = this.getEndboss();
    if (endboss && endboss.isDead() && this.checkFinishSection()) {
      this.endGame(true);
      this.soundManager.stopAll();
      this.soundManager.play("win");
    }
  }

  updateBossBackgroundMusic() {
    const endboss = this.getEndboss();
    if (!endboss) return;
    if (endboss.isDead()) {
      this.soundManager.playAfterEndbossMusic();
      return;
    }
    if (endboss.alert) {
      this.soundManager.playEndbossBackgroundMusic();
    }
  }

  getEndboss() {
    return this.level.enemies.find((enemy) => enemy instanceof Endboss);
  }

  checkEnemyCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (
        this.character.isColliding(enemy) &&
        !enemy.isDead() &&
        !this.isStompFromAbove(enemy)
      ) {
        if (!this.character.isHurt()) {
          this.character.hit(20);
          this.statusBarHealth.setPercentage(this.character.energy);
          this.soundManager.play("hit");
        }
      }
    });
  }

  checkCharacterFallingCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (
        this.character.isColliding(enemy) &&
        !enemy.isDead() &&
        this.isStompFromAbove(enemy)
      ) {
        enemy.hit(10);
        this.soundManager.play("hitChicken");
        this.character.speedY = 10;
      }
    });
  }

  isStompFromAbove(enemy) {
    if (!(enemy instanceof SmallChicken)) {
      return false;
    }
    const tolerance = 20;
    const characterBottom =
      this.character.y + this.character.height - this.character.offset.bottom;
    const enemyTop = enemy.y + enemy.offset.top;
    return this.character.speedY < 0 && characterBottom <= enemyTop + tolerance;
  }

  checkEnemyCollisionsWithBottle() {
    this.throwableObjects.forEach((bottle) => {
      this.level.enemies.forEach((enemy) => {
        if (bottle.isColliding(enemy) && !enemy.isDead() && !bottle.isBroken) {
          enemy.hit(10);
          bottle.break();
          this.reduceEndbossHealth(enemy);
        }
      });
    });
  }

  reduceEndbossHealth(enemy) {
    if (enemy instanceof Endboss) {
      this.statusBarEndboss.setPercentage(enemy.energy);
      this.soundManager.play("hitEndboss");
    } else {
      this.soundManager.play("hitChicken");
    }
  }

  removeBrokenBottles() {
    this.throwableObjects = this.throwableObjects.filter((bottle) => {
      if (!bottle.isBroken) {
        return true;
      }
      return Date.now() - bottle.brokenAt < 250;
    });
  }

  checkMarketSection() {
    const marketStart = 719 * 5;
    const marketEnd = marketStart + 395;
    return (
      this.character.x + this.character.width > marketStart &&
      this.character.x < marketEnd
    );
  }

  checkFinishSection() {
    const finishStart = 5100;
    const finishEnd = finishStart + 400;
    return (
      this.character.x + this.character.width > finishStart &&
      this.character.x < finishEnd
    );
  }

  checkAndRemoveCollisions(array, onCollision) {
    const remainingItems = array.filter((item) => {
      if (this.character.isColliding(item)) {
        onCollision();
        return false;
      }
      return true;
    });
    return remainingItems;
  }

  onCollisionWithCoin() {
    this.character.coinCounter += 1;
    this.statusCoin.setCount(this.character.coinCounter);
    this.soundManager.play("coin");
  }

  onCollisionWithBottle() {
    this.character.bottleCounter += 1;
    this.statusBottle.setCount(this.character.bottleCounter);
    this.soundManager.play("bottle");
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawScrollableObjects();
    this.drawFixedObjects();
    this.drawEndScreen();
    requestAnimationFrame(() => this.draw());
  }

  drawScrollableObjects() {
    this.ctx.translate(this.kamera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.throwableObjects);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.level.enemies);
    this.ctx.translate(-this.kamera_x, 0);
  }

  drawFixedObjects() {
    this.addToMap(this.statusCoin);
    this.addToMap(this.statusBarHealth);
    if (this.shouldDrawEndbossBar()) {
      this.addToMap(this.statusBarEndboss);
    }
    this.addToMap(this.statusBottle);
    this.ctx.translate(this.kamera_x, 0);
    this.ctx.translate(-this.kamera_x, 0);
  }

  shouldDrawEndbossBar() {
    const endboss = this.getEndboss();
    return endboss?.alert && !endboss.isDead();
  }

  drawEndScreen() {
    if (!this.gameEnded) return;
    this.addToMap(this.endScreen);
  }

  addObjectsToMap(objects) {
    objects.forEach((object) => {
      this.addToMap(object);
    });
  }

  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }
    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);
    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    this.ctx.restore();
    mo.x = mo.x * -1;
  }
}
