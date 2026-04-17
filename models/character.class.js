class Character extends MovableObject {
  height = 300;
  width = 152.5;
  y = 130;
  speed = 5;
  coinCounter = 0;
  bottleCounter = 0;
  currentState = "";
  offset = {
    top: 130,
    left: 25,
    right: 45,
    bottom: 15,
  };

  IMAGES_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];
  IMAGES_IDLE = [
    "img/2_character_pepe/1_idle/idle/I-1.png",
    "img/2_character_pepe/1_idle/idle/I-2.png",
    "img/2_character_pepe/1_idle/idle/I-3.png",
    "img/2_character_pepe/1_idle/idle/I-4.png",
    "img/2_character_pepe/1_idle/idle/I-5.png",
    "img/2_character_pepe/1_idle/idle/I-6.png",
    "img/2_character_pepe/1_idle/idle/I-7.png",
    "img/2_character_pepe/1_idle/idle/I-8.png",
    "img/2_character_pepe/1_idle/idle/I-9.png",
    "img/2_character_pepe/1_idle/idle/I-10.png",
  ];
  IMAGES_JUMPING = [
    "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png",
    "img/2_character_pepe/3_jump/J-35.png",
    "img/2_character_pepe/3_jump/J-36.png",
    "img/2_character_pepe/3_jump/J-37.png",
    "img/2_character_pepe/3_jump/J-38.png",
    "img/2_character_pepe/3_jump/J-39.png",
  ];
  IMAGES_HURT = [
    "img/2_character_pepe/4_hurt/H-41.png",
    "img/2_character_pepe/4_hurt/H-42.png",
    "img/2_character_pepe/4_hurt/H-43.png",
  ];
  IMAGES_DEAD = [
    "img/2_character_pepe/5_dead/D-51.png",
    "img/2_character_pepe/5_dead/D-52.png",
    "img/2_character_pepe/5_dead/D-53.png",
    "img/2_character_pepe/5_dead/D-54.png",
    "img/2_character_pepe/5_dead/D-55.png",
    "img/2_character_pepe/5_dead/D-56.png",
    "img/2_character_pepe/5_dead/D-57.png",
  ];
  world;

  constructor() {
    super().loadImage("img/2_character_pepe/2_walk/W-21.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.animate();
    this.applyGravity();
    this.coinCounter = 0;
  }

  animate() {
    setInterval(() => {
      if (this.isDead()) return;
      if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
        this.moveRight();
      }
      if (this.world.keyboard.LEFT && this.x > 102) {
        this.moveLeft();
        this.otherDirection = true;
      }
      if (this.world.keyboard.SPACE && !this.isAboveGround()) {
        this.jump();
      } else if (this.world.keyboard.ENTER && !this.isThrown()) {
        let bottle = new ThrowableBottle(this.x + 100, this.y + 100);
        this.world.throwableObjects.push(bottle);
        this.lastThrow = new Date().getTime();
      }
      this.world.kamera_x = -this.x + 100;
    }, 1000 / 60);

    setInterval(() => {
      this.animationFrameCount++;
      let nextImages;
      let nextRate;
      let nextState;
      if (this.isDead()) {
        this.playDeadAnimation();
        return;
      } else if (this.isHurt()) {
        nextImages = this.IMAGES_HURT;
        nextRate = 1;
        nextState = "hurt";
      } else if (this.isAboveGround()) {
        nextImages = this.IMAGES_JUMPING;
        nextRate = 2;
        nextState = "jump";
      } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
        nextImages = this.IMAGES_WALKING;
        nextRate = 2;
        nextState = "walk";
      } else {
        nextImages = this.IMAGES_IDLE;
        nextRate = 5;
        nextState = "idle";
      }
      this.playStateAnimation(nextState, nextImages, nextRate);
    }, 60);
  }
}
