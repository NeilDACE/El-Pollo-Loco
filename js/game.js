let canvas;
let ctx;
let world;
let keyboard = new Keyboard();

const CANVAS_WIDTH = 720;
const CANVAS_HEIGHT = 480;

function setupCanvasRendering(canvasElement) {
  const pixelRatio = window.devicePixelRatio || 1;
  canvasElement.width = Math.floor(CANVAS_WIDTH * pixelRatio);
  canvasElement.height = Math.floor(CANVAS_HEIGHT * pixelRatio);
  canvasElement.style.width = `${CANVAS_WIDTH}px`;
  canvasElement.style.height = `${CANVAS_HEIGHT}px`;
  const context = canvasElement.getContext("2d");
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
}

function init() {
  canvas = document.getElementById("canvas");
  setupCanvasRendering(canvas);
  world = new World(canvas, keyboard);
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
