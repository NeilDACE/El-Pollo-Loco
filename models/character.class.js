class Character extends MovableObject {
  height = 300;
  width = 152.5;
  constructor() {
    super().loadImage("img/2_character_pepe/2_walk/W-21.png");
    this.x = 50;
    this.y = 430 - this.height;
  }

  jump() {
    console.log("jump");
  }
}
