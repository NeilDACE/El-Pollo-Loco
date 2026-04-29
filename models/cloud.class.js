class Cloud extends MovableObject {
  width = 500;
  height = 250;
  speed = 0.5;
  IMAGES_CLOUDS = [
    "img/5_background/layers/4_clouds/1.png",
    "img/5_background/layers/4_clouds/2.png",
  ];
  x = 0;
  y = 20 + Math.random() * 30;

  constructor(imageIndex, startX) {
    super().loadImage("img/5_background/layers/4_clouds/1.png");
    this.loadImages(this.IMAGES_CLOUDS);
    this.x = startX;
    this.animate();
  }

  animate() {
    let offset = Math.random() * 1000;
    let baseY = 35 + Math.random() * 30;
    let floatSpeed = 0.005 + Math.random() * 0.01;
    this.setStopableInterval(() => {
      this.moveLeft();
    }, 1000 / 60);
    this.setStopableInterval(() => {
      if (this.x < -this.width) {
        this.x = 7000;
        baseY = 35 + Math.random() * 30;
        floatSpeed = 0.005 + Math.random() * 0.01;
      }
    }, 400);

    this.setStopableInterval(() => {
      offset += floatSpeed;
      this.y = baseY + Math.sin(offset) * 8;
    }, 1000 / 60);
  }
}
