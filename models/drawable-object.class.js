class DrawableObject {
  x = 120;
  y = 125;
  img;
  height = 150;
  width = 100;
  imageCache = {};
  currentImage = 0;

  loadImage(path) {
    try {
      this.img = new Image();
      this.img.src = path;
    } catch (error) {
      console.error("Error loading image:", error, "Path:", path);
    }
  }

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

  draw(ctx) {
    try {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    } catch (error) {
      console.error(
        "Error drawing image:",
        error,
        "Image source:",
        this.img?.src,
      );
    }
  }

  drawFrame(ctx) {
    if (
      this instanceof Character ||
      this instanceof ThrowableBottle ||
      this instanceof Chicken ||
      this instanceof SmallChicken ||
      this instanceof Endboss
    ) {
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
}
