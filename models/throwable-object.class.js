/**
 * Base class for objects that can be thrown.
 * Provides throw physics and a break mechanic.
 * Extends {@link MovableObject}.
 */
class ThrowableObject extends MovableObject {
  lastThrow = 0;
  isBroken = false;
  brokenAt = 0;

  /**
   * Launches the object from the given position with horizontal and vertical velocity,
   * and starts both gravity and horizontal movement intervals.
   *
   * @param {number} x - Starting X position.
   * @param {number} y - Starting Y position.
   */
  throw(x, y) {
    this.x = x;
    this.y = y;
    this.speedX = 10;
    this.speedY = 20;
    this.gravityIntervalId = this.applyGravity();
    this.moveIntervalId = this.setStopableInterval(() => {
      this.x += this.speedX;
    }, 1000 / 25);
  }

  /**
   * Marks the object as broken, plays the splash sound, and stops all movement.
   * Does nothing if already broken.
   */
  break() {
    if (this.isBroken) {
      return;
    }
    this.isBroken = true;
    if (this.world?.soundManager) {
      this.world.soundManager.play("bottleSplash");
    }
    this.brokenAt = Date.now();
    this.currentImage = 0;
    this.animationFrameCount = 0;
    this.clearIntervalById(this.gravityIntervalId);
    this.clearIntervalById(this.moveIntervalId);
  }
}
