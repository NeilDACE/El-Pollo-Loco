class ThrowableObject extends MovableObject {
  lastThrow = 0;
  isBroken = false;
  brokenAt = 0;

  throw(x, y) {
    this.x = x;
    this.y = y;
    this.speedX = 10;
    this.speedY = 20;
    this.gravityInterval = this.applyGravity();
    this.moveInterval = setInterval(() => {
      this.x += this.speedX;
    }, 1000 / 25);
  }

  break() {
    if (this.isBroken) {
      return;
    }
    this.isBroken = true;
    this.brokenAt = Date.now();
    this.currentImage = 0;
    this.animationFrameCount = 0;
    clearInterval(this.gravityInterval);
    clearInterval(this.moveInterval);
  }
}
