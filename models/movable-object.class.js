class MovableObject extends DrawableObject {
  speed = 0.15;
  speedY = 0;
  acceleration = 1.6;
  otherDirection = false;
  energy = 100;
  lastHit = 0;
  animationFrameCount = 0;

  offset = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  isAboveGround() {
    return this.y < 130;
  }

  isColliding(mo) {
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
    return timePassed < 500;
  }

  isDead() {
    return this.energy == 0;
  }

  moveRight() {
    this.x += this.speed;
    this.otherDirection = false;
  }

  moveLeft() {
    this.x -= this.speed;
  }

  jump() {
    this.speedY = 20;
  }

  hit() {
    if (this.energy > 0) {
      this.energy -= 5;
      this.lastHit = new Date().getTime();
    }
  }
}
