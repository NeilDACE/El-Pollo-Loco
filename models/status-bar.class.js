/**
 * Base class for percentage-based status bars.
 * Selects the correct sprite from a six-frame image set based on the current percentage.
 * Extends {@link DrawableObject}.
 */
class StatusBar extends DrawableObject {
  x = 30;
  y = 10;
  height = 39.5;
  width = 148.75;
  percentage = 100;

  /**
   * Updates the percentage value and switches to the matching sprite.
   *
   * @param {number} percentage - The new percentage value (0–100).
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Maps the current percentage to a frame index in the IMAGES array.
   *
   * @returns {number} An index from 0 (empty) to 5 (full).
   */
  resolveImageIndex() {
    switch (true) {
      case this.percentage === 100:
        return 5;
      case this.percentage >= 80:
        return 4;
      case this.percentage >= 60:
        return 3;
      case this.percentage >= 40:
        return 2;
      case this.percentage >= 20:
        return 1;
      default:
        return 0;
    }
  }
}
