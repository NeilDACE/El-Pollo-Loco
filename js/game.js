let canvas;
let ctx;
let world;
let keyboard = new Keyboard();

function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
  console.log("My Character is", world.character);
  console.log("My Enemies are", world.enemies);
}

window.addEventListener("keydown", (e) => {
  if (e.key == "ArrowLeft" || e.key == "a") {
    keyboard.LEFT = true;
  }
  if (e.key == "ArrowRight" || e.key == "d") {
    keyboard.RIGHT = true;
  }
  if (e.key == "ArrowUp" || e.key == "w") {
    keyboard.UP = true;
  }
  if (e.key == "ArrowDown" || e.key == "s") {
    keyboard.DOWN = true;
  }
  if (e.key == " ") {
    keyboard.SPACE = true;
  }
  if (e.key == "Enter") {
    keyboard.ENTER = true;
  }
});

window.addEventListener("keyup", (e) => {
  if (e.key == "ArrowLeft" || e.key == "a") {
    keyboard.LEFT = false;
  }
  if (e.key == "ArrowRight" || e.key == "d") {
    keyboard.RIGHT = false;
  }
  if (e.key == "ArrowUp" || e.key == "w") {
    keyboard.UP = false;
  }
  if (e.key == "ArrowDown" || e.key == "s") {
    keyboard.DOWN = false;
  }
  if (e.key == " ") {
    keyboard.SPACE = false;
  }
  if (e.key == "Enter") {
    keyboard.ENTER = false;
  }
});
