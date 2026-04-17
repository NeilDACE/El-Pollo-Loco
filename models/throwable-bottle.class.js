class ThrowableBottle extends ThrowableObject {
  width = 60;
  height = 60;
  IMAGES_ROTATE = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];
  IMAGES_SPLASH = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  constructor(x, y) {
    super().loadImage(
      "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    );
    this.loadImages(this.IMAGES_ROTATE);
    this.loadImages(this.IMAGES_SPLASH);
    this.x = x;
    this.y = y;
    this.throw(this.x, this.y);
    this.animate();
  }

  animate() {
    let animationIntervalID = setInterval(() => {
      this.animationFrameCount++;
      if (this.isAboveGround()) {
        this.playAnimationWithRate(this.IMAGES_ROTATE, 6);
      } else {
        this.playAnimationWithRate(this.IMAGES_SPLASH, 1);
        if (this.currentImage >= this.IMAGES_SPLASH.length) {
          clearInterval(animationIntervalID);
          clearInterval(this.gravityInterval);
          clearInterval(this.moveInterval);
        }
      }
    }, 1000 / 60);
  }
}
