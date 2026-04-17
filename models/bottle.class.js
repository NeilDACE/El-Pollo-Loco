class Bottle extends MovableObject {
  width = 60;
  height = 60;
  x = 200;
  y = 350;
  IMAGES_ON_GROUND = [
    "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
  ];

  constructor(x) {
    super();
    let randomIndex = Math.floor(Math.random() * this.IMAGES_ON_GROUND.length);
    let path = this.IMAGES_ON_GROUND[randomIndex];
    this.loadImage(path);
    this.x = x;
  }
}
