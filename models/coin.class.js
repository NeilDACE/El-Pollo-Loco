class Coin extends MovableObject {
  width = 150;
  height = 150.5;
  x = 200 + Math.random() * 500;
  y = 425 - this.height;
  speed = 0.15 + Math.random() * 0.25;
  IMAGES_ROTATE = ["img/8_coin/coin_1.png", "img/8_coin/coin_2.png"];

  constructor() {
    super().loadImage("img/8_coin/coin_1.png");
    this.loadImages(this.IMAGES_ROTATE);
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.playAnimation(this.IMAGES_ROTATE);
    }, 1000);
  }
}
