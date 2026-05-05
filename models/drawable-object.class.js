/**
 * Base class for all objects that can be rendered on the canvas.
 * Provides image loading, caching, drawing, and debug frame utilities.
 */
class DrawableObject {
  x = 120;
  y = 125;
  img;
  height = 150;
  width = 100;
  imageCache = {};
  currentImage = 0;

  /**
   * Loads a single image and assigns it to `this.img`.
   *
   * @param {string} path - The path to the image file.
   */
  loadImage(path) {
    try {
      this.img = new Image();
      this.img.src = path;
    } catch (error) {
      console.error("Error loading image:", error, "Path:", path);
    }
  }

  /**
   * Preloads an array of image paths into the `imageCache`.
   *
   * @param {string[]} arr - An array of image file paths to preload.
   */
  loadImages(arr) {
    arr.forEach((path) => {
      try {
        let img = new Image();
        img.src = path;
        this.imageCache[path] = img;
      } catch (error) {
        console.error("Error loading image:", error, "Path:", path);
      }
    });
  }

  /**
   * Draws the object's current image onto the canvas context.
   * Uses pixel-ratio-aware rounding for crisp rendering.
   *
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  draw(ctx) {
    try {
      const pr = window.devicePixelRatio || 1;
      const sx = Math.round(this.x * pr) / pr;
      const sy = Math.round(this.y * pr) / pr;
      const sw = Math.round(this.width * pr) / pr;
      const sh = Math.round(this.height * pr) / pr;
      ctx.drawImage(this.img, sx, sy, sw, sh);
    } catch (error) {
      console.error(
        "Error drawing image:",
        error,
        "Image source:",
        this.img?.src,
      );
    }
  }

  /**
   * Draws a debug collision frame around the object if it is a debug target.
   *
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  drawFrame(ctx) {
    if (!this.isDebugFrameTarget()) return;
    this.drawCollisionBox(ctx);
  }

  /**
   * Determines whether this object should have a debug frame drawn around it.
   * Override in subclasses to enable debug rendering.
   *
   * @returns {boolean} Always returns false by default.
   */
  isDebugFrameTarget() {
    return false;
    // this instanceof Character ||
    // this instanceof ThrowableBottle ||
    // this instanceof Chicken ||
    // this instanceof SmallChicken ||
    // this instanceof Endboss
  }

  /**
   * Draws a red rectangle representing the collision box of this object,
   * adjusted by the object's offset values.
   *
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  drawCollisionBox(ctx) {
    ctx.beginPath();
    ctx.lineWidth = "1";
    ctx.strokeStyle = "red";
    ctx.rect(
      this.x + this.offset.left,
      this.y + this.offset.top,
      this.width - this.offset.left - this.offset.right,
      this.height - this.offset.top - this.offset.bottom,
    );
    ctx.stroke();
  }
}
