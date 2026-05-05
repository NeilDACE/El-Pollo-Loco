/**
 * Central game world class that owns all game objects, runs the game loop,
 * handles collisions, drawing, and game-end logic.
 */
class World {
  character = new Character();
  statusBarHealth = new StatusBarHealth();
  statusCoin = new StatusCoin();
  statusBottle = new StatusBottle();
  statusBarEndboss = new StatusBarEndboss();
  throwableObjects = [];
  intervalIdsWorld = [];
  gameEnded = false;
  stopped = false;
  endScreen = null;
  level = null;
  ctx;
  canvas;
  keyboard;
  kamera_x = 0;
  soundManager = new SoundManager();

  /**
   * Creates the world, binds the canvas, starts drawing, sets object references,
   * and begins the collision check loop.
   *
   * @param {HTMLCanvasElement} canvas - The game canvas element.
   * @param {Keyboard} keyboard - The keyboard state object.
   * @param {Level} level - The level instance to play.
   */
  constructor(canvas, keyboard, level) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.keyboard = keyboard;
    this.level = level;
    this.draw();
    this.setWorld();
    this.runCollisionChecks();
  }

  /**
   * Registers a stoppable interval for world-level logic and stores its ID.
   *
   * @param {function} fn - Callback to execute on each tick.
   * @param {number} time - Interval duration in milliseconds.
   */
  setStopableIntervals(fn, time) {
    const intervalId = setInterval(fn, time);
    this.intervalIdsWorld.push(intervalId);
  }

  /**
   * Clears all world, character, enemy, collectible, and throwable intervals.
   */
  clearAllGameIntervals() {
    this.intervalIdsWorld.forEach((id) => clearInterval(id));
    this.intervalIdsWorld = [];
    this.stopped = true;
    this.character.clearIntervals();
    this.level.enemies.forEach((enemy) => enemy.clearIntervals());
    this.level.coins.forEach((coin) => coin.clearIntervals());
    this.level.bottles.forEach((bottle) => bottle.clearIntervals());
    this.level.backgroundObjects.forEach((bg) => {
      if (bg.clearIntervals) {
        bg.clearIntervals();
      }
    });
    this.level.clouds.forEach((cloud) => cloud.clearIntervals());
    this.throwableObjects.forEach((bottle) => bottle.clearIntervals());
  }

  /**
   * Ends the game, shows the correct end screen, and reveals the restart button.
   *
   * @param {boolean} didWin - True to show the win screen, false to show the game-over screen.
   */
  endGame(didWin) {
    this.gameEnded = true;
    const imagePath = didWin
      ? "img/9_intro_outro_screens/you win!.png"
      : "img/9_intro_outro_screens/game_over/game over!.png";
    this.endScreen = new EndScreen(imagePath);
    const restartButtonContainer = document.getElementById(
      "restart-button-container",
    );
    if (restartButtonContainer) {
      restartButtonContainer.style.display = "flex";
    }
  }

  /**
   * Assigns the world reference to the character and all enemies,
   * and initialises the HUD counters.
   */
  setWorld() {
    this.character.world = this;
    this.level.enemies.forEach((enemy) => {
      enemy.world = this;
    });
    this.statusCoin.setCount(this.character.coinCounter);
    this.statusBottle.setCount(this.character.bottleCounter);
  }

  /**
   * Starts the main game-logic loop at 60 fps.
   */
  runCollisionChecks() {
    this.setStopableIntervals(() => this.gameTick(), 1000 / 60);
  }

  /**
   * Executes one game-logic tick: updates music, checks end conditions,
   * resolves all collision types, and cleans up broken bottles.
   */
  gameTick() {
    if (this.gameEnded) return;
    this.updateBossBackgroundMusic();
    this.checkGameEnd();
    this.checkCharacterFallingCollisions();
    this.checkEnemyCollisions();
    this.checkEnemyCollisionsWithBottle();
    this.removeBrokenBottles();
    this.checkCollectibleCollisions();
  }

  /**
   * Checks for character–coin and character–bottle collisions and removes collected items.
   */
  checkCollectibleCollisions() {
    this.level.coins = this.checkAndRemoveCollisions(this.level.coins, () =>
      this.onCollisionWithCoin(),
    );
    this.level.bottles = this.checkAndRemoveCollisions(this.level.bottles, () =>
      this.onCollisionWithBottle(),
    );
  }

  /**
   * Checks whether the character or the endboss has fulfilled a win/loss condition
   * and triggers the appropriate end-game state.
   */
  checkGameEnd() {
    if (this.character.isDead()) {
      this.endGame(false);
      this.soundManager.stopAll();
      this.soundManager.play("gameOver");
      return;
    }
    const endboss = this.getEndboss();
    if (endboss && endboss.isDead() && this.checkFinishSection()) {
      this.endGame(true);
      this.soundManager.stopAll();
      this.soundManager.play("win");
    }
  }

  /**
   * Switches the background music track based on the endboss's current state.
   */
  updateBossBackgroundMusic() {
    const endboss = this.getEndboss();
    if (!endboss) return;
    if (endboss.isDead()) {
      this.soundManager.playAfterEndbossMusic();
      return;
    }
    if (endboss.alert) {
      this.soundManager.playEndbossBackgroundMusic();
    }
  }

  /**
   * Finds and returns the Endboss instance from the level's enemy list.
   *
   * @returns {Endboss|undefined} The endboss, or undefined if not present.
   */
  getEndboss() {
    return this.level.enemies.find((enemy) => enemy instanceof Endboss);
  }

  /**
   * Checks all enemies for a side/top collision with the character and applies damage.
   */
  checkEnemyCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (
        this.character.isColliding(enemy) &&
        !enemy.isDead() &&
        !this.isStompFromAbove(enemy)
      ) {
        if (!this.character.isHurt()) {
          this.character.hit(20);
          this.statusBarHealth.setPercentage(this.character.energy);
          this.soundManager.play("hit");
        }
      }
    });
  }

  /**
   * Checks whether the character is stomping a small chicken from above and kills it.
   * Intentional design: only one stomp per jump is registered. Chicken swarms cannot
   * be cleared by jumping — the player must use bottles to deal with groups safely.
   */
  checkCharacterFallingCollisions() {
    let stompedThisJump = false;
    this.level.enemies.forEach((enemy) => {
      if (
        !stompedThisJump &&
        this.character.isColliding(enemy) &&
        !enemy.isDead() &&
        this.isStompFromAbove(enemy)
      ) {
        stompedThisJump = true;
        enemy.hit(10);
        this.soundManager.play("hitChicken");
        this.character.speedY = 10;
      }
    });
  }

  /**
   * Determines whether the character is landing on top of a small chicken.
   *
   * @param {MovableObject} enemy - The enemy to test.
   * @returns {boolean} True if the character is descending onto the enemy's top edge.
   */
  isStompFromAbove(enemy) {
    if (!(enemy instanceof SmallChicken)) {
      return false;
    }
    const tolerance = 20;
    const characterBottom =
      this.character.y + this.character.height - this.character.offset.bottom;
    const enemyTop = enemy.y + enemy.offset.top;
    return this.character.speedY < 0 && characterBottom <= enemyTop + tolerance;
  }

  /**
   * Checks all throwable bottles against all enemies and applies hit logic on collision.
   */
  checkEnemyCollisionsWithBottle() {
    this.throwableObjects.forEach((bottle) => {
      this.level.enemies.forEach((enemy) => {
        if (bottle.isColliding(enemy) && !enemy.isDead() && !bottle.isBroken) {
          enemy.hit(10);
          bottle.break();
          this.reduceEndbossHealth(enemy);
        }
      });
    });
  }

  /**
   * Updates the endboss health bar and plays the correct hit sound when a bottle hits an enemy.
   *
   * @param {MovableObject} enemy - The enemy that was hit.
   */
  reduceEndbossHealth(enemy) {
    if (enemy instanceof Endboss) {
      this.statusBarEndboss.setPercentage(enemy.energy);
      this.soundManager.play("hitEndboss");
    } else {
      this.soundManager.play("hitChicken");
    }
  }

  /**
   * Removes throwable bottles that have broken and whose splash animation has completed.
   */
  removeBrokenBottles() {
    this.throwableObjects = this.throwableObjects.filter((bottle) => {
      if (!bottle.isBroken) {
        return true;
      }
      return Date.now() - bottle.brokenAt < 250;
    });
  }

  /**
   * Checks whether the character is currently within the market section of the level.
   *
   * @returns {boolean} True if the character overlaps the market area.
   */
  checkMarketSection() {
    const marketStart = 719 * 5;
    const marketEnd = marketStart + 395;
    return (
      this.character.x + this.character.width > marketStart &&
      this.character.x < marketEnd
    );
  }

  /**
   * Checks whether the character is currently within the finish section of the level.
   *
   * @returns {boolean} True if the character overlaps the finish area.
   */
  checkFinishSection() {
    const finishStart = 5100;
    const finishEnd = finishStart + 400;
    return (
      this.character.x + this.character.width > finishStart &&
      this.character.x < finishEnd
    );
  }

  /**
   * Filters an array of collectibles, calling the collision callback and removing
   * any item that the character is touching.
   *
   * @param {MovableObject[]} array - The collectible array to filter.
   * @param {function} onCollision - Callback invoked when an item is collected.
   * @returns {MovableObject[]} The remaining items after collision removal.
   */
  checkAndRemoveCollisions(array, onCollision) {
    const remainingItems = array.filter((item) => {
      if (this.character.isColliding(item)) {
        onCollision();
        return false;
      }
      return true;
    });
    return remainingItems;
  }

  /**
   * Handles coin collection: increments the counter, updates the HUD, and plays the coin sound.
   */
  onCollisionWithCoin() {
    this.character.coinCounter += 1;
    this.statusCoin.setCount(this.character.coinCounter);
    this.soundManager.play("coin");
  }

  /**
   * Handles bottle collection: increments the counter, updates the HUD, and plays the bottle sound.
   */
  onCollisionWithBottle() {
    this.character.bottleCounter += 1;
    this.statusBottle.setCount(this.character.bottleCounter);
    this.soundManager.play("bottle");
  }

  /**
   * Clears the canvas and redraws all game objects each frame via requestAnimationFrame.
   */
  draw() {
    if (this.stopped) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawScrollableObjects();
    this.drawFixedObjects();
    this.drawEndScreen();
    requestAnimationFrame(() => this.draw());
  }

  /**
   * Draws all world-scrolling objects (background, clouds, enemies, character, collectibles)
   * translated by the camera offset.
   */
  drawScrollableObjects() {
    const pr = Math.min(window.devicePixelRatio || 1, 1.5);
    const kameraX = Math.round(this.kamera_x * pr) / pr;
    this.ctx.translate(kameraX, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.throwableObjects);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.level.enemies);
    this.ctx.translate(-kameraX, 0);
  }

  /**
   * Draws all fixed HUD elements (status bars) that are not affected by the camera.
   */
  drawFixedObjects() {
    this.addToMap(this.statusCoin);
    this.addToMap(this.statusBarHealth);
    if (this.shouldDrawEndbossBar()) {
      this.addToMap(this.statusBarEndboss);
    }
    this.addToMap(this.statusBottle);
    this.ctx.translate(this.kamera_x, 0);
    this.ctx.translate(-this.kamera_x, 0);
  }

  /**
   * Checks whether the endboss health bar should currently be rendered.
   *
   * @returns {boolean} True if the endboss is alerted and still alive.
   */
  shouldDrawEndbossBar() {
    const endboss = this.getEndboss();
    return endboss?.alert && !endboss.isDead();
  }

  /**
   * Draws the end screen overlay when the game has ended.
   */
  drawEndScreen() {
    if (!this.gameEnded) return;
    this.addToMap(this.endScreen);
  }

  /**
   * Iterates over an array of objects and draws each one onto the canvas.
   *
   * @param {DrawableObject[]} objects - The objects to draw.
   */
  addObjectsToMap(objects) {
    objects.forEach((object) => {
      this.addToMap(object);
    });
  }

  /**
   * Draws a single object onto the canvas, flipping it horizontally if needed.
   *
   * @param {DrawableObject} mo - The object to draw.
   */
  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }
    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);
    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  /**
   * Flips the canvas context horizontally around the object's position
   * to mirror its image when moving in the opposite direction.
   *
   * @param {DrawableObject} mo - The object to flip.
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Restores the canvas context after a horizontal flip and corrects the object's X coordinate.
   *
   * @param {DrawableObject} mo - The object whose flip is being reversed.
   */
  flipImageBack(mo) {
    this.ctx.restore();
    mo.x = mo.x * -1;
  }
}
