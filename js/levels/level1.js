const level1 = new Level(
  [
    new Chicken(),
    new Chicken(),
    new Chicken(),
    new SmallChicken(),
    new SmallChicken(),
    new Endboss(),
  ],
  [
    new Cloud(0, 0),
    new Cloud(1, 500),
    new Cloud(0, 1000),
    new Cloud(1, 1500),
    new Cloud(0, 2000),
    new Cloud(1, 2500),
    new Cloud(0, 3000),
  ],
  [
    new backgroundObject("img/5_background/layers/air.png", 0),
    new backgroundObject("img/5_background/layers/3_third_layer/1.png", 0),
    new backgroundObject("img/5_background/layers/2_second_layer/1.png", 0),
    new backgroundObject("img/5_background/layers/1_first_layer/1.png", 0),
    new backgroundObject("img/5_background/layers/air.png", 719),
    new backgroundObject("img/5_background/layers/3_third_layer/2.png", 719),
    new backgroundObject("img/5_background/layers/2_second_layer/2.png", 719),
    new backgroundObject("img/5_background/layers/1_first_layer/2.png", 719),
    new backgroundObject("img/5_background/layers/air.png", 719 * 2),
    new backgroundObject(
      "img/5_background/layers/3_third_layer/1.png",
      719 * 2,
    ),
    new backgroundObject(
      "img/5_background/layers/2_second_layer/1.png",
      719 * 2,
    ),
    new backgroundObject(
      "img/5_background/layers/1_first_layer/1.png",
      719 * 2,
    ),
    new backgroundObject("img/5_background/layers/air.png", 719 * 3),
    new backgroundObject(
      "img/5_background/layers/3_third_layer/2.png",
      719 * 3,
    ),
    new backgroundObject(
      "img/5_background/layers/2_second_layer/2.png",
      719 * 3,
    ),
    new backgroundObject(
      "img/5_background/layers/1_first_layer/2.png",
      719 * 3,
    ),
  ],
);
