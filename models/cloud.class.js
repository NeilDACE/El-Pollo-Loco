/**
 * Represents a decorative cloud that drifts left across the sky.
 * Extends {@link MovableObject}.
 */
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

  /**
   * Creates a cloud starting at the given X position and begins all movement and floating loops.
   *
   * @param {number} imageIndex - Index of the cloud image to use (unused; kept for API compatibility).
   * @param {number} startX - Initial X position.
   */
  constructor(imageIndex, startX) {
    super().loadImage("img/5_background/layers/4_clouds/1.png");
    this.loadImages(this.IMAGES_CLOUDS);
    this.x = startX;
    this.animate();
  }

  /**
   * Initialises floating and movement parameters and starts all cloud animation intervals.
   */
  animate() {
    this.floatOffset = Math.random() * 1000;
    this.baseY = 35 + Math.random() * 30;
    this.floatSpeed = 0.005 + Math.random() * 0.01;
    this.startMovement();
    this.startResetCheck();
    this.startFloating();
  }

  /**
   * Starts the interval that moves the cloud to the left each frame.
   */
  startMovement() {
    this.setStopableInterval(() => {
      this.moveLeft();
    }, 1000 / 60);
  }

  /**
   * Starts the interval that wraps the cloud back to the right edge of the level
   * once it scrolls off the left side.
   */
  startResetCheck() {
    this.setStopableInterval(() => {
      if (this.x < -this.width) {
        this.x = 7000;
        this.baseY = 35 + Math.random() * 30;
        this.floatSpeed = 0.005 + Math.random() * 0.01;
      }
    }, 400);
  }

  /**
   * Starts the interval that applies a sine-wave vertical float to the cloud's Y position.
   */
  startFloating() {
    this.setStopableInterval(() => {
      this.floatOffset += this.floatSpeed;
      this.y = this.baseY + Math.sin(this.floatOffset) * 8;
    }, 1000 / 60);
  }
}
