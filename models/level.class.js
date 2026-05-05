/**
 * Represents a game level, holding all objects needed to run it.
 */
class Level {
  enemies;
  clouds;
  coins;
  bottles;
  backgroundObjects;
  level_end_x = 5125;

  /**
   * Creates a new level with the provided collections of game objects.
   *
   * @param {MovableObject[]} enemies - Array of enemy instances.
   * @param {Cloud[]} clouds - Array of cloud instances.
   * @param {Coin[]} coins - Array of collectible coin instances.
   * @param {Bottle[]} bottles - Array of collectible bottle instances.
   * @param {backgroundObject[]} backgroundObjects - Array of background layer objects.
   */
  constructor(enemies, clouds, coins, bottles, backgroundObjects) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.coins = coins;
    this.bottles = bottles;
    this.backgroundObjects = backgroundObjects;
  }
}
