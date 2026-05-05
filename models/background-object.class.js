/**
 * Represents a static background element in the game world.
 * Extends {@link MovableObject} to inherit image loading and positioning.
 */
class backgroundObject extends MovableObject {
  /**
   * Creates a new background object and positions it in the game world.
   *
   * @param {string} imagePath - Path to the image asset.
   * @param {number} x - Horizontal position in pixels.
   * @param {number} [y=125] - Vertical position in pixels. If the default value
   *   is used, the object is automatically aligned to the bottom of the canvas.
   * @param {number} [width=720] - Width of the object in pixels.
   * @param {number} [height=480] - Height of the object in pixels.
   */
  constructor(imagePath, x, y = 125, width = 720, height = 480) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    if (y === 125) {
      this.y = 480 - this.height;
    }
  }

  /**
   * Draws the background with physical-pixel-aligned coordinates to avoid sub-pixel seams.
   *
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  draw(ctx) {
    try {
      const pr = Math.min(window.devicePixelRatio || 1, 1.5);
      const sx = Math.round(this.x * pr) / pr;
      const sy = Math.round(this.y * pr) / pr;
      const sw = Math.round(this.width * pr) / pr;
      const sh = Math.round(this.height * pr) / pr;
      const previousSmoothing = ctx.imageSmoothingEnabled;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(this.img, sx, sy, sw, sh);
      ctx.imageSmoothingEnabled = previousSmoothing;
    } catch (error) {
      console.error(
        "Error drawing background image:",
        error,
        "Image source:",
        this.img?.src,
      );
    }
  }
}
