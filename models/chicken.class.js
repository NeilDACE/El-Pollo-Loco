/**
 * Represents a standard chicken enemy.
 * Walks left and plays a dead frame when defeated.
 * Extends {@link MovableObject}.
 */
class Chicken extends MovableObject {
  width = 62;
  height = 60.75;
  y = 420 - this.height;
  speed = 0.15 + Math.random() * 0.25;
  energy = 10;
  offset = {
    top: 5,
    left: 2,
    right: 2,
    bottom: 5,
  };
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];
  IMAGES_DEAD = ["img/3_enemies_chicken/chicken_normal/2_dead/dead.png"];

  /**
   * Creates a chicken at the given X position (with added randomness) and starts its animation.
   *
   * @param {number} xKoordinateChicken - Base X position for the chicken.
   */
  constructor(xKoordinateChicken) {
    super();
    this.loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_WALKING);
    this.x = xKoordinateChicken + Math.random() * 500;
    this.animate();
  }

  /**
   * Starts the animation loop: moves left and cycles through walking frames,
   * or shows the dead frame when defeated.
   */
  animate() {
    this.setStopableInterval(() => {
      this.animationFrameCount++;
      if (this.isDead()) {
        this.dead();
        return;
      } else {
        this.moveLeft();
        this.playAnimationWithRate(this.IMAGES_WALKING, 10);
      }
    }, 1000 / 60);
  }

  /**
   * Sets energy to 0 and switches the sprite to the dead image.
   */
  dead() {
    this.energy = 0;
    this.img = this.imageCache[this.IMAGES_DEAD[0]];
  }
}
