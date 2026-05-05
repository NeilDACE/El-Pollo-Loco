/**
 * Base class for collectible-count HUD elements (coins, bottles).
 * Renders an icon and a numeric count on the canvas.
 * Extends {@link DrawableObject}.
 */
class StatusCollectible extends DrawableObject {
  width = 40.5;
  height = 39.5;
  x = 25;
  y = 50;
  imgPath;
  count = 0;

  /**
   * Updates the displayed count value.
   *
   * @param {number} value - The new count to display.
   */
  setCount(value) {
    this.count = value;
  }

  /**
   * Draws the icon image and the current count as text next to it.
   *
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  draw(ctx) {
    super.draw(ctx);
    ctx.font = "28px Arial";
    ctx.fillStyle = "rgb(255, 149, 0)";
    ctx.strokeStyle = "rgb(255, 149, 0)";
    ctx.lineWidth = 1;
    ctx.strokeText(String(this.count), this.x + 40, this.y + 32.5);
    ctx.fillText(String(this.count), this.x + 40, this.y + 32.5);
  }
}
