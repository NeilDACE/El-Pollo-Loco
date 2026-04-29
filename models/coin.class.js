class Coin extends MovableObject {
  width = 150;
  height = 150.5;
  x = 200;
  y = 425 - this.height;
  speed = 0.15 + Math.random() * 0.25;

  constructor(x, y) {
    super().loadImage("img/8_coin/coin_1.png");
    this.x = x;
    this.y = y;
    this.animate();
  }

  animate() {
    this.spinAngle = 0;
    this.originalWidth = this.width;
    this.centerX = this.x + this.originalWidth / 2;
    this.startSpinAnimation();
  }

  startSpinAnimation() {
    this.setStopableInterval(() => {
      const rotation = Math.cos(this.spinAngle);
      const flattenedRotation = this.getFlattenedRotation(rotation);
      this.width = Math.max(
        this.originalWidth * Math.abs(flattenedRotation),
        15,
      );
      this.x = this.centerX - this.width / 2;
      this.otherDirection = rotation < 0;
      this.spinAngle += 0.06;
    }, 1000 / 60);
  }

  getFlattenedRotation(rotation) {
    return Math.sign(rotation) * Math.pow(Math.abs(rotation), 0.4);
  }
}
