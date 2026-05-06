/**
 * A throwable salsa bottle that spins while airborne and splashes on impact.
 * Extends {@link ThrowableObject}.
 */
class ThrowableBottle extends ThrowableObject {
  width = 50;
  height = 50;
  groundOffset = 20;
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

  /**
   * Creates a throwable bottle at the given position, loads images, and starts the throw and animation.
   *
   * @param {number} x - Starting X position.
   * @param {number} y - Starting Y position.
   */
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

  /**
   * Starts the animation loop that switches between rotation and splash frames.
   */
  animate() {
    const animationIntervalID = this.setStopableInterval(() => {
      this.animationFrameCount++;
      if (this.shouldRotate()) return this.handleRotate();
      this.handleSplash(animationIntervalID);
    }, 1000 / 60);
  }

  /**
   * Checks whether the bottle should be in the rotation (spinning) state.
   *
   * @returns {boolean} True if the bottle is not broken and is above the ground.
   */
  shouldRotate() {
    return !this.isBroken && this.isAboveGround();
  }

  /**
   * Plays the rotation animation frame.
   */
  handleRotate() {
    this.playAnimationWithRate(this.IMAGES_ROTATE, 6);
  }

  /**
   * Breaks the bottle if not already broken, plays the splash animation,
   * and clears the animation interval once the splash finishes.
   *
   * @param {number} animationIntervalID - The interval ID to clear when done.
   */
  handleSplash(animationIntervalID) {
    if (!this.isBroken) this.break();
    this.playAnimationWithRate(this.IMAGES_SPLASH, 2);
    if (this.isSplashFinished()) this.clearIntervalById(animationIntervalID);
  }

  /**
   * Checks whether the splash animation has fully completed.
   *
   * @returns {boolean} True if the bottle is broken, all splash frames have played,
   *   and at least 250ms have passed since breaking.
   */
  isSplashFinished() {
    return (
      this.isBroken &&
      this.currentImage >= this.IMAGES_SPLASH.length &&
      Date.now() - this.brokenAt >= 250
    );
  }
}
