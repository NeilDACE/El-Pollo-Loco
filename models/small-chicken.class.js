class SmallChicken extends MovableObject {
  width = 59;
  height = 52.5;
  x = 350 + Math.random() * 500;
  y = 420 - this.height;
  speed = 0.15 + Math.random() * 0.25;
  energy = 5;
  offset = {
    top: 5,
    left: 8,
    right: 5,
    bottom: 5,
  };
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];
  IMAGES_DEAD = ["img/3_enemies_chicken/chicken_small/2_dead/dead.png"];

  constructor() {
    super();
    this.loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.animationFrameCount++;
      if (this.isDead()) {
        this.speed = 0;
        this.img = this.imageCache[this.IMAGES_DEAD[0]];
        return;
      } else {
        this.moveLeft();
        this.playAnimationWithRate(this.IMAGES_WALKING, 10);
      }
    }, 1000 / 60);
  }
}
