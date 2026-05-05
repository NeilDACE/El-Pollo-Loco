/**
 * Represents the full-screen end overlay (win or game-over image).
 * Extends {@link DrawableObject}.
 */
class EndScreen extends DrawableObject {
  /**
   * Creates the end screen by loading the provided image and sizing it to fill the canvas.
   *
   * @param {string} imagePath - Path to the win or game-over image.
   */
  constructor(imagePath) {
    super().loadImage(imagePath);
    this.width = 720;
    this.height = 480;
    this.x = 0;
    this.y = 0;
  }
}
