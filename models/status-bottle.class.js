class StatusBottle extends StatusCollectible {
  y = 90;
  x = 25;
  width = 40.5;
  height = 39.5;

  imgPath = "img/7_statusbars/3_icons/icon_salsa_bottle.png";

  constructor() {
    super();
    this.loadImage(this.imgPath);
  }
}
