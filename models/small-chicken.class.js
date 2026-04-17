class SmallChicken extends MovableObject {
  width = 59;
  height = 52.5;
  x = 350 + Math.random() * 500;
  y = 425 - this.height;
  speed = 0.15 + Math.random() * 0.25;
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.moveLeft();
    }, 1000 / 60);

    setInterval(() => {
      this.animationFrameCount++;
      this.playAnimationWithRate(this.IMAGES_WALKING, 2);
    }, 100);
  }
}
