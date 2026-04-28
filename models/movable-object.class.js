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

  offset = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  applyGravity() {
    let id = setInterval(() => {
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
    return id;
  }

  getGroundY() {
    return 430 - this.height + this.groundOffset;
  }

  isAboveGround() {
    return this.y < this.getGroundY();
  }

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

  playAnimationWithRate(images, rate) {
    if (this.animationFrameCount % rate === 0) {
      let i = this.currentImage % images.length;
      let path = images[i];
      this.img = this.imageCache[path];
      this.currentImage++;
    }
  }

  playStateAnimation(nextState, nextImages, nextRate) {
    if (this.currentState !== nextState) {
      this.currentState = nextState;
      this.currentImage = 0;
      this.animationFrameCount = 0;
    }
    this.playAnimationWithRate(nextImages, nextRate);
  }

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

  isHurt() {
    let timePassed = new Date().getTime() - this.lastHit;
    return timePassed < 250;
  }

  isThrown() {
    let timePassed = new Date().getTime() - this.lastThrow;
    return timePassed < 250;
  }

  isDead() {
    return this.energy == 0;
  }

  isFalling() {
    return this.speedY < 0;
  }

  moveRight() {
    this.x += this.speed;
    this.otherDirection = false;
  }

  bottleAvailable() {
    if (this.bottleCounter > 0) {
      return true;
    } else return false;
  }

  moveLeft() {
    this.x -= this.speed;
  }

  jump() {
    this.speedY = 20;
  }

  hit(damage = 10) {
    if (this.energy > 0) {
      this.energy -= damage;
      this.lastHit = new Date().getTime();
    }
  }
}
