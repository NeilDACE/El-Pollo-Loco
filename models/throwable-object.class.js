class ThrowableObject extends MovableObject {
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
}
