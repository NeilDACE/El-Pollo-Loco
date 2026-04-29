class ThrowableBottle extends ThrowableObject {
  width = 60;
  height = 60;
  groundOffset = 30;
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
    const animationIntervalID = this.setStopableInterval(() => {
      this.animationFrameCount++;
      if (this.shouldRotate()) return this.handleRotate();
      this.handleSplash(animationIntervalID);
    }, 1000 / 60);
  }

  shouldRotate() {
    return !this.isBroken && this.isAboveGround();
  }

  handleRotate() {
    this.playAnimationWithRate(this.IMAGES_ROTATE, 6);
  }

  handleSplash(animationIntervalID) {
    if (!this.isBroken) this.break();
    this.playAnimationWithRate(this.IMAGES_SPLASH, 2);
    if (this.isSplashFinished()) this.clearIntervalById(animationIntervalID);
  }

  isSplashFinished() {
    return (
      this.isBroken &&
      this.currentImage >= this.IMAGES_SPLASH.length &&
      Date.now() - this.brokenAt >= 250
    );
  }
}
