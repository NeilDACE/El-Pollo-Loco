class ThrowableObject extends MovableObject {
  lastThrow = 0;
  isBroken = false;
  brokenAt = 0;

  throw(x, y) {
    this.x = x;
    this.y = y;
    this.speedX = 10;
    this.speedY = 20;
    this.gravityIntervalId = this.applyGravity();
    this.moveIntervalId = this.setStopableInterval(() => {
      this.x += this.speedX;
    }, 1000 / 25);
  }

  break() {
    if (this.isBroken) {
      return;
    }
    this.isBroken = true;
    if (this.world?.soundManager) {
      this.world.soundManager.play("bottleSplash");
    }
    this.brokenAt = Date.now();
    this.currentImage = 0;
    this.animationFrameCount = 0;
    this.clearIntervalById(this.gravityIntervalId);
    this.clearIntervalById(this.moveIntervalId);
  }
}
