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
    let angle = 0;
    const originalWidth = this.width;
    const centerX = this.x + originalWidth / 2;

    setInterval(() => {
      let rotation = Math.cos(angle);
      let flattenedRotation =
        Math.sign(rotation) * Math.pow(Math.abs(rotation), 0.4);
      this.width = Math.max(originalWidth * Math.abs(flattenedRotation), 15);
      this.x = centerX - this.width / 2;
      this.otherDirection = rotation < 0;
      angle += 0.06;
    }, 1000 / 60);
  }
}
