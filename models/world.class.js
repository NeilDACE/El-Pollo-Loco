class World {
  character = new Character();
  statusBarHealth = new StatusBarHealth();
  statusBarCoin = new StatusBarCoin();
  statusBarBottle = new StatusBarBottle();
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
  }

  runCollisionChecks() {
    setInterval(() => {
      this.checkEnemyCollisions();
      this.checkEnemyCollisionsWithBottle();

      this.level.coins = this.checkAndRemoveCollisions(this.level.coins, () =>
        this.onCollisionWithCoin(),
      );

      this.level.bottles = this.checkAndRemoveCollisions(
        this.level.bottles,
        () => this.onCollisionWithBottle(),
      );
    }, 200);
  }

  checkEnemyCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy) && !enemy.isDead()) {
        this.character.hit();
        this.statusBarHealth.setPercentage(this.character.energy);
      }
    });
  }

  checkEnemyCollisionsWithBottle() {
    this.throwableObjects.forEach((bottle) => {
      this.level.enemies.forEach((enemy) => {
        if (bottle.isColliding(enemy) && !enemy.isDead() && !bottle.isBroken) {
          enemy.hit();
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
    console.log(this.character.coinCounter);
    return remainingItems;
  }

  onCollisionWithCoin() {
    this.character.coinCounter += 20;
    this.statusBarCoin.setPercentage(this.character.coinCounter);
  }

  onCollisionWithBottle() {
    this.character.bottleCounter += 20;
    this.statusBarBottle.setPercentage(this.character.bottleCounter);
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
    this.addToMap(this.statusBarCoin);
    this.addToMap(this.statusBarHealth);
    this.addToMap(this.statusBarBottle);
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
