/**
 * Represents the final boss enemy.
 * Cycles through alert, attack, hurt, walk, and dead states.
 * Extends {@link MovableObject}.
 */
class Endboss extends MovableObject {
  width = 256;
  height = 304.25;
  x = 4900;
  y = 435 - this.height;
  offset = {
    top: 55,
    left: 20,
    right: 15,
    bottom: 15,
  };
  speed = 0;
  energy = 100;
  alertRange = 600;
  alert = false;
  walkSpeed = 10;
  IMAGES_WALKING = [
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png",
  ];
  IMAGES_ALERT = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];
  IMAGES_ATTACK = [
    "img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/4_enemie_boss_chicken/3_attack/G15.png",
    "img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/4_enemie_boss_chicken/3_attack/G19.png",
    "img/4_enemie_boss_chicken/3_attack/G20.png",
  ];
  IMAGES_HURT = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];
  IMAGES_DEAD = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  /**
   * Creates the endboss, loads all animation images, and starts gravity and the animation loop.
   */
  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.applyGravity();
    this.animate();
  }

  /**
   * Starts the main animation loop that evaluates the boss state each frame.
   */
  animate() {
    this.setStopableInterval(() => {
      this.animationFrameCount++;
      const character = this.world?.character;
      if (this.isDead()) return this.handleDeadState();
      if (this.isHurt()) return this.handleHurtState();
      if (this.isCollidingWithCharacter(character))
        return this.handleAttackState();
      if (this.shouldAlert(character)) return this.handleAlertState();
      this.handleWalkState();
    }, 1000 / 60);
  }

  /**
   * Checks whether the endboss is currently touching the character.
   *
   * @param {Character} character - The player character.
   * @returns {boolean} True if the boss is colliding with the character.
   */
  isCollidingWithCharacter(character) {
    return !!character && this.isColliding(character);
  }

  /**
   * Checks whether the endboss should transition into the alert state.
   *
   * @param {Character} character - The player character.
   * @returns {boolean} True if the character is within alert range and the boss is not yet alerted.
   */
  shouldAlert(character) {
    if (!character || this.alert) return false;
    const bossCenter = this.x + this.width / 2;
    const charCenter = character.x + character.width / 2;
    return Math.abs(bossCenter - charCenter) <= this.alertRange;
  }

  /**
   * Handles the dead state: stops movement, disables collisions, and plays the death animation.
   */
  handleDeadState() {
    this.speed = 0;
    this.ignoreGroundCollision = true;
    this.ignoreCollisions = true;
    this.playDeadAnimation("dead", this.IMAGES_DEAD, 10);
  }

  /**
   * Plays the hurt animation.
   */
  handleHurtState() {
    if (this.currentState !== "hurt") {
      this.jump();
    }
    this.playStateAnimation("hurt", this.IMAGES_HURT, 10);
  }

  /**
   * Plays the attack animation.
   */
  handleAttackState() {
    this.playStateAnimation("attack", this.IMAGES_ATTACK, 10);
  }

  /**
   * Plays the alert animation. Once complete, activates the boss and increases its speed.
   */
  handleAlertState() {
    this.playStateAnimation("alert", this.IMAGES_ALERT, 12);
    if (this.currentImage < this.IMAGES_ALERT.length) return;
    this.alert = true;
    this.speed = 2.5;
    this.walkSpeed = 6;
  }

  /**
   * Moves the boss left and plays the walking animation.
   */
  handleWalkState() {
    if (this.alert) {
      if (this.energy <= 25) {
        this.speed = 4.5;
      } else if (this.energy <= 50) {
        this.speed = 3.5;
      }
    }
    this.moveLeft();
    this.playStateAnimation("walk", this.IMAGES_WALKING, this.walkSpeed);
  }
}
