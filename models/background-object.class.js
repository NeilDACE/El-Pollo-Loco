class backgroundObject extends MovableObject {
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
}
