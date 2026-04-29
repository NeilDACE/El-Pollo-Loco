let canvas;
let ctx;
let world;
let keyboard = new Keyboard();
let bgMusicStarted = false;

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

function isLeftKey(key) {
  return key == "ArrowLeft" || key == "a";
}

function isRightKey(key) {
  return key == "ArrowRight" || key == "d";
}

function startFootstep() {
  const foot = world.soundManager.sounds.footstep;
  foot.loop = true;
  if (foot.paused) foot.play();
}

function stopFootstepIfIdle() {
  if (!keyboard.LEFT && !keyboard.RIGHT && world) {
    world.soundManager.stop("footstep");
  }
}

function handleKeyDown(e) {
  if (!bgMusicStarted && world) {
    world.soundManager.playBackgroundMusic();
    bgMusicStarted = true;
  }
  if (e.repeat) return;
  if (isLeftKey(e.key)) {
    keyboard.LEFT = true;
    startFootstep();
  }
  if (isRightKey(e.key)) {
    keyboard.RIGHT = true;
    startFootstep();
  }
  if (e.key == "ArrowUp" || e.key == "w") keyboard.UP = true;
  if (e.key == "ArrowDown" || e.key == "s") keyboard.DOWN = true;
  if (e.key == " ") keyboard.SPACE = true;
  if (e.key == "Enter") keyboard.ENTER = true;
}

function handleKeyUp(e) {
  if (isLeftKey(e.key)) keyboard.LEFT = false;
  if (isRightKey(e.key)) keyboard.RIGHT = false;
  if (e.key == "ArrowUp" || e.key == "w") keyboard.UP = false;
  if (e.key == "ArrowDown" || e.key == "s") keyboard.DOWN = false;
  if (e.key == " ") keyboard.SPACE = false;
  if (e.key == "Enter") keyboard.ENTER = false;
  stopFootstepIfIdle();
}

window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);
