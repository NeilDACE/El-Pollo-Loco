class EndScreen extends DrawableObject {
  constructor(imagePath) {
    super().loadImage(imagePath);
    this.width = 720;
    this.height = 480;
    this.x = 0;
    this.y = 0;
  }
}
