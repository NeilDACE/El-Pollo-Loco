class World {
  character = new Character();
  statusBarHealth = new StatusBarHealth();
  statusCoin = new StatusCoin();
  statusBottle = new StatusBottle();
  statusBarEndboss = new StatusBarEndboss();
  throwableObjects = [];
  level = level1;
  ctx;
  canvas;
  keyboard;
  kamera_x = 0;

  constructor(canvas, keyboard) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.runCollisionChecks();
  }

  setWorld() {
    this.character.world = this;
    this.statusCoin.setCount(this.character.coinCounter);
    this.statusBottle.setCount(this.character.bottleCounter);
  }

  runCollisionChecks() {
    setInterval(() => {
      this.checkCharacterFallingCollisions();
      this.checkEnemyCollisions();
      this.checkEnemyCollisionsWithBottle();

      this.level.coins = this.checkAndRemoveCollisions(this.level.coins, () =>
        this.onCollisionWithCoin(),
      );

      this.level.bottles = this.checkAndRemoveCollisions(
        this.level.bottles,
        () => this.onCollisionWithBottle(),
      );
    }, 1000 / 60);
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
        enemy.hit(5);
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
          bottle.isBroken = true;
        }
      });
    });
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
  }

  onCollisionWithBottle() {
    this.character.bottleCounter += 1;
    this.statusBottle.setCount(this.character.bottleCounter);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.kamera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.throwableObjects);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.level.enemies);
    this.ctx.translate(-this.kamera_x, 0);
    //Space for fixed objects like status bar
    this.addToMap(this.statusCoin);
    this.addToMap(this.statusBarHealth);
    this.addToMap(this.statusBottle);
    this.ctx.translate(this.kamera_x, 0);
    this.ctx.translate(-this.kamera_x, 0);

    requestAnimationFrame(() => this.draw());
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
