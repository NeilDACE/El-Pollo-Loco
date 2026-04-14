class MovableObject {
  x = 120;
  y = 300;
  img;
  height = 150;
  width = 100;

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  moveRight() {
    this.x += 5;
    console.log("move right");
  }

  moveLeft() {
    this.x -= 5;
    console.log("move left");
  }
}
