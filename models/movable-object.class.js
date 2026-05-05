/**
 * Extends {@link DrawableObject} with physics, movement, collision,
 * animation, and interval management for all movable game objects.
 */
class MovableObject extends DrawableObject {
  speed = 0.15;
  speedY = 0;
  speedX = 0;
  acceleration = 1.6;
  otherDirection = false;
  energy = 5;
  lastHit = 0;
  animationFrameCount = 0;
  groundOffset = 0;
  ignoreGroundCollision = false;
  ignoreCollisions = false;
  intervalIds = [];

  offset = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  /**
   * Registers a stoppable interval and stores its ID for later cleanup.
   *
   * @param {function} fn - The callback to execute on each interval tick.
   * @param {number} time - The interval duration in milliseconds.
   * @returns {number} The interval ID.
   */
  setStopableInterval(fn, time) {
    const intervalId = setInterval(fn, time);
    this.intervalIds.push(intervalId);
    return intervalId;
  }

  /**
   * Alias for {@link setStopableInterval}. Registers a stoppable interval.
   *
   * @param {function} fn - The callback to execute on each interval tick.
   * @param {number} time - The interval duration in milliseconds.
   * @returns {number} The interval ID.
   */
  setStopableIntervals(fn, time) {
    return this.setStopableInterval(fn, time);
  }

  /**
   * Clears a specific interval by its ID and removes it from the tracked list.
   *
   * @param {number} intervalId - The ID of the interval to clear.
   */
  clearIntervalById(intervalId) {
    clearInterval(intervalId);
    this.intervalIds = this.intervalIds.filter((id) => id !== intervalId);
  }

  /**
   * Clears all intervals registered by this object.
   */
  clearIntervals() {
    this.intervalIds.forEach((intervalId) => clearInterval(intervalId));
    this.intervalIds = [];
  }

  /**
   * Starts a gravity simulation loop that moves the object downward over time
   * and stops at the ground level.
   *
   * @returns {number} The interval ID of the gravity loop.
   */
  applyGravity() {
    return this.setStopableInterval(() => {
      const groundY = this.getGroundY();
      if (
        this.isAboveGround() ||
        this.speedY > 0 ||
        this.ignoreGroundCollision
      ) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
      if (!this.ignoreGroundCollision && this.y > groundY) {
        this.y = groundY;
        this.speedY = 0;
      }
    }, 1000 / 25);
  }

  /**
   * Calculates the Y position at which this object rests on the ground.
   *
   * @returns {number} The ground-level Y coordinate.
   */
  getGroundY() {
    return 430 - this.height + this.groundOffset;
  }

  /**
   * Checks whether the object is currently above the ground.
   *
   * @returns {boolean} True if the object is above the ground level.
   */
  isAboveGround() {
    return this.y < this.getGroundY();
  }

  /**
   * Checks whether this object is colliding with another movable object,
   * taking offsets and collision flags into account.
   *
   * @param {MovableObject} mo - The other object to test against.
   * @returns {boolean} True if the two objects are overlapping.
   */
  isColliding(mo) {
    if (this.ignoreCollisions || mo.ignoreCollisions) {
      return false;
    }
    return (
      this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
      this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
      this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
      this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom
    );
  }

  /**
   * Plays an animation frame from an image array at a reduced rate.
   *
   * @param {string[]} images - Array of image paths representing the animation frames.
   * @param {number} rate - Number of ticks to wait between frame advances.
   */
  playAnimationWithRate(images, rate) {
    if (this.animationFrameCount % rate === 0) {
      let i = this.currentImage % images.length;
      let path = images[i];
      this.img = this.imageCache[path];
      this.currentImage++;
    }
  }

  /**
   * Plays a named animation state. Resets the frame counter when switching states.
   *
   * @param {string} nextState - Identifier for the new state.
   * @param {string[]} nextImages - Image paths for the new animation.
   * @param {number} nextRate - Ticks between frame advances.
   */
  playStateAnimation(nextState, nextImages, nextRate) {
    if (this.currentState !== nextState) {
      this.currentState = nextState;
      this.currentImage = 0;
      this.animationFrameCount = 0;
    }
    this.playAnimationWithRate(nextImages, nextRate);
  }

  /**
   * Plays the death animation once. Freezes on the last frame when finished.
   */
  playDeadAnimation() {
    if (this.currentState !== "dead") {
      this.currentState = "dead";
      this.currentImage = 0;
      this.animationFrameCount = 0;
    }
    if (this.currentImage < this.IMAGES_DEAD.length) {
      this.playAnimationWithRate(this.IMAGES_DEAD, 3);
    } else return;
  }

  /**
   * Checks whether the object was recently hit.
   *
   * @returns {boolean} True if the object was hit within the last 250ms.
   */
  isHurt() {
    let timePassed = new Date().getTime() - this.lastHit;
    return timePassed < 250;
  }

  /**
   * Checks whether a throw action was recently performed.
   *
   * @returns {boolean} True if a throw occurred within the last 250ms.
   */
  isThrown() {
    let timePassed = new Date().getTime() - this.lastThrow;
    return timePassed < 250;
  }

  /**
   * Checks whether the object has no remaining energy.
   *
   * @returns {boolean} True if energy is 0.
   */
  isDead() {
    return this.energy == 0;
  }

  /**
   * Checks whether the object is currently falling (negative vertical speed).
   *
   * @returns {boolean} True if the object is falling.
   */
  isFalling() {
    return this.speedY < 0;
  }

  /**
   * Moves the object to the right and sets `otherDirection` to false.
   */
  moveRight() {
    this.x += this.speed;
    this.otherDirection = false;
  }

  /**
   * Checks whether the character has at least one bottle available to throw.
   *
   * @returns {boolean} True if `bottleCounter` is greater than 0.
   */
  bottleAvailable() {
    if (this.bottleCounter > 0) {
      return true;
    } else return false;
  }

  /**
   * Moves the object to the left.
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Applies an upward velocity to simulate a jump.
   */
  jump() {
    this.speedY = 20;
  }

  /**
   * Reduces the object's energy by the given damage amount and records the hit timestamp.
   * Energy cannot go below 0.
   *
   * @param {number} [damage=10] - The amount of damage to apply.
   */
  hit(damage = 10) {
    if (this.energy > 0) {
      this.energy -= damage;
      this.lastHit = new Date().getTime();
    }
  }
}
