/**
 * Represents a collectible coin that spins in place.
 * Extends {@link MovableObject}.
 */
class Coin extends MovableObject {
  width = 150;
  height = 150.5;
  x = 200;
  y = 425 - this.height;
  speed = 0.15 + Math.random() * 0.25;

  /**
   * Creates a coin at the given position and starts its spin animation.
   *
   * @param {number} x - X position in the level.
   * @param {number} y - Y position in the level.
   */
  constructor(x, y) {
    super().loadImage("img/8_coin/coin_1.png");
    this.x = x;
    this.y = y;
    this.animate();
  }

  /**
   * Initialises spin animation properties and starts the spin and movement loops.
   */
  animate() {
    this.spinAngle = 0;
    this.originalWidth = this.width;
    this.centerX = this.x + this.originalWidth / 2;
    this.startSpinAnimation();
  }

  /**
   * Starts the interval that updates the coin's width and position to simulate spinning.
   */
  startSpinAnimation() {
    this.setStopableInterval(() => {
      const rotation = Math.cos(this.spinAngle);
      const flattenedRotation = this.getFlattenedRotation(rotation);
      this.width = Math.max(
        this.originalWidth * Math.abs(flattenedRotation),
        15,
      );
      this.x = this.centerX - this.width / 2;
      this.otherDirection = rotation < 0;
      this.spinAngle += 0.06;
    }, 1000 / 60);
  }

  /**
   * Applies a flattening curve to a cosine rotation value to exaggerate the spin effect.
   *
   * @param {number} rotation - A cosine value in the range [-1, 1].
   * @returns {number} The adjusted rotation value.
   */
  getFlattenedRotation(rotation) {
    return Math.sign(rotation) * Math.pow(Math.abs(rotation), 0.4);
  }
}
