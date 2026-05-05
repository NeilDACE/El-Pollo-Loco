/**
 * HUD element that displays the player's current coin count.
 * Extends {@link StatusCollectible}.
 */
class StatusCoin extends StatusCollectible {
  width = 40.5;
  height = 39.5;
  x = 25;
  y = 50;
  imgPath = "img/7_statusbars/3_icons/icon_coin.png";
  count = 0;

  /**
   * Loads the coin icon image.
   */
  constructor() {
    super();
    this.loadImage(this.imgPath);
  }
}
