/**
 * Represents the player-controlled character.
 * Handles movement, animation states, throwing, buying, and death.
 * Extends {@link MovableObject}.
 */
class Character extends MovableObject {
  height = 300;
  width = 152.5;
  y = 130;
  speed = 5;
  energy = 100;
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
  IMAGES_IDLE_LONG = [
    "img/2_character_pepe/1_idle/long_idle/I-11.png",
    "img/2_character_pepe/1_idle/long_idle/I-12.png",
    "img/2_character_pepe/1_idle/long_idle/I-13.png",
    "img/2_character_pepe/1_idle/long_idle/I-14.png",
    "img/2_character_pepe/1_idle/long_idle/I-15.png",
    "img/2_character_pepe/1_idle/long_idle/I-16.png",
    "img/2_character_pepe/1_idle/long_idle/I-17.png",
    "img/2_character_pepe/1_idle/long_idle/I-18.png",
    "img/2_character_pepe/1_idle/long_idle/I-19.png",
    "img/2_character_pepe/1_idle/long_idle/I-20.png",
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
  buyKeyLocked = false;
  idleStartedAt = null;
  deathJumpDone = false;

  /**
   * Creates the character, loads all animation images, and starts movement and animation loops.
   */
  constructor() {
    super().loadImage("img/2_character_pepe/2_walk/W-21.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_IDLE_LONG);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.animate();
    this.applyGravity();
    this.coinCounter = 0;
  }

  /**
   * Starts the movement and animation loops.
   */
  animate() {
    this.movement();
    this.animation();
  }

  /**
   * Starts the movement loop that processes keyboard input every frame.
   */
  movement() {
    this.setStopableInterval(() => {
      if (this.cantMove()) return;
      if (this.canMoveRight()) {
        this.moveRight();
      }
      if (this.canMoveLeft()) {
        this.moveLeft();
        this.otherDirection = true;
      }
      if (this.canBuy()) this.buy();
      if (!this.world.keyboard.UP) this.buyKeyLocked = false;
      if (this.canJump()) this.jump();
      if (this.canThrow()) this.throw();
      this.world.kamera_x = -this.x + 100;
    }, 1000 / 60);
  }

  /**
   * Checks whether the character can move right.
   *
   * @returns {boolean} True if the RIGHT key is pressed and the character has not reached the level end.
   */
  canMoveRight() {
    return this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x;
  }

  /**
   * Checks whether the character can move left.
   *
   * @returns {boolean} True if the LEFT key is pressed and the character is past the left boundary.
   */
  canMoveLeft() {
    return this.world.keyboard.LEFT && this.x > 102;
  }

  /**
   * Checks whether the character can purchase a bottle.
   *
   * @returns {boolean} True if UP is pressed, the buy key is not locked, the character is on the ground,
   *   and the character is in the market section.
   */
  canBuy() {
    return (
      this.world.keyboard.UP &&
      !this.buyKeyLocked &&
      !this.isAboveGround() &&
      this.world.checkMarketSection()
    );
  }

  /**
   * Checks whether the character can jump.
   *
   * @returns {boolean} True if SPACE is pressed and the character is on the ground.
   */
  canJump() {
    return this.world.keyboard.SPACE && !this.isAboveGround();
  }

  /**
   * Checks whether the character can throw a bottle.
   *
   * @returns {boolean} True if ENTER is pressed, the throw cooldown has elapsed, and a bottle is available.
   */
  canThrow() {
    return (
      this.world.keyboard.ENTER && !this.isThrown() && this.bottleAvailable()
    );
  }

  /**
   * Creates a new throwable bottle, adds it to the world, and decrements the bottle counter.
   */
  throw() {
    let bottle = new ThrowableBottle(this.x + 100, this.y + 100);
    bottle.world = this.world;
    this.world.throwableObjects.push(bottle);
    this.lastThrow = new Date().getTime();
    this.bottleCounter -= 1;
    this.world.statusBottle.setCount(this.bottleCounter);
  }

  /**
   * Triggers a bottle purchase and locks the buy key to prevent repeat purchases.
   */
  buy() {
    this.buyBottle();
    this.buyKeyLocked = true;
  }

  /**
   * Checks whether the character is unable to move (dead or in the finish section).
   *
   * @returns {boolean} True if movement should be blocked.
   */
  cantMove() {
    return this.isDead() || this.world.checkFinishSection();
  }

  /**
   * Starts the animation loop that updates the character's sprite each frame.
   */
  animation() {
    this.setStopableInterval(() => {
      this.animationFrameCount++;
      if (this.isDead()) {
        this.handleDeadAnimation();
        return;
      }
      const { nextState, nextImages, nextRate } = this.getNextAnimationState();
      this.playStateAnimation(nextState, nextImages, nextRate);
    }, 60);
  }

  /**
   * Handles the death animation: triggers the jump effect once and plays the dead sprite sequence.
   */
  handleDeadAnimation() {
    this.idleStartedAt = null;
    if (!this.deathJumpDone) {
      this.jump();
      this.ignoreGroundCollision = true;
      this.ignoreCollisions = true;
      this.deathJumpDone = true;
    }
    this.playDeadAnimation();
  }

  /**
   * Determines the animation state to use on the current frame based on game conditions.
   *
   * @returns {{ nextState: string, nextImages: string[], nextRate: number }}
   *   The next animation state descriptor.
   */
  getNextAnimationState() {
    if (this.world.checkFinishSection())
      return this.animState("idle_long", this.IMAGES_IDLE_LONG, 5);
    if (this.isHurt()) return this.animState("hurt", this.IMAGES_HURT, 1);
    if (this.isAboveGround() || this.world.keyboard.SPACE)
      return this.animState("jump", this.IMAGES_JUMPING, 2);
    if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT)
      return this.animState("walk", this.IMAGES_WALKING, 2);
    if (this.world.keyboard.ENTER)
      return this.animState("idle", this.IMAGES_IDLE, 2);
    return this.getIdleState();
  }

  /**
   * Creates an animation state descriptor and resets the idle timer.
   *
   * @param {string} nextState - The state identifier.
   * @param {string[]} nextImages - The image paths for this state.
   * @param {number} nextRate - Ticks between frame advances.
   * @returns {{ nextState: string, nextImages: string[], nextRate: number }}
   */
  animState(nextState, nextImages, nextRate) {
    this.idleStartedAt = null;
    return { nextState, nextImages, nextRate };
  }

  /**
   * Returns the appropriate idle animation state based on how long the character
   * has been idle. Switches to long-idle after 15 seconds.
   *
   * @returns {{ nextState: string, nextImages: string[], nextRate: number }}
   */
  getIdleState() {
    if (this.idleStartedAt === null) {
      this.idleStartedAt = Date.now();
    }
    const isLongIdle = Date.now() - this.idleStartedAt >= 15000;
    return {
      nextState: isLongIdle ? "idle_long" : "idle",
      nextImages: isLongIdle ? this.IMAGES_IDLE_LONG : this.IMAGES_IDLE,
      nextRate: 5,
    };
  }

  /**
   * Purchases one bottle for 2 coins if the character has enough coins.
   * Updates both status bars and plays the buy sound.
   */
  buyBottle() {
    if (this.coinCounter >= 2) {
      this.coinCounter -= 2;
      this.bottleCounter += 1;
      this.world.soundManager.play("buy");
      this.world.statusCoin.setCount(this.coinCounter);
      this.world.statusBottle.setCount(this.bottleCounter);
    }
  }
}
