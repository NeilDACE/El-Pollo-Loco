/**
 * Represents a small chicken enemy that can be stomped by the player.
 * Walks left and freezes on the dead frame when defeated.
 * Extends {@link MovableObject}.
 */
class SmallChicken extends MovableObject {
  width = 59;
  height = 52.5;
  x = 350 + Math.random() * 500;
  y = 420 - this.height;
  speed = 0.15 + Math.random() * 0.25;
  energy = 10;
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

  /**
   * Creates a small chicken at the given X position (with added randomness) and starts its animation.
   *
   * @param {number} xKoordinateChicken - Base X position for the small chicken.
   */
  constructor(xKoordinateChicken) {
    super();
    this.loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.x = xKoordinateChicken + Math.random() * 500;
    this.animate();
  }

  /**
   * Starts the animation loop: moves left and cycles through walking frames,
   * or freezes on the dead frame when defeated.
   */
  animate() {
    this.setStopableInterval(() => {
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
