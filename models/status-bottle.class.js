/**
 * HUD element that displays the player's current bottle count.
 * Extends {@link StatusCollectible}.
 */
class StatusBottle extends StatusCollectible {
  y = 90;
  x = 25;
  width = 40.5;
  height = 39.5;

  imgPath = "img/7_statusbars/3_icons/icon_salsa_bottle.png";

  /**
   * Loads the bottle icon image.
   */
  constructor() {
    super();
    this.loadImage(this.imgPath);
  }
}
