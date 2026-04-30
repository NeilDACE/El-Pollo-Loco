let canvas;
let ctx;
let world;
let keyboard = new Keyboard();
let bgMusicStarted = false;
let gameStarted = false;

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

function initCanvas() {
  canvas = document.getElementById("canvas");
  setupCanvasRendering(canvas);
}

function hideUI(id) {
  document.getElementById(id).style.display = "none";
}

function showUI(id) {
  document.getElementById(id).style.display = "block";
}

function fadeInContainer(container) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => container.classList.add("is-visible"));
  });
}

function startBackgroundMusic() {
  if (bgMusicStarted) return;
  world.soundManager.playBackgroundMusic();
  bgMusicStarted = true;
}

function destroyWorld() {
  if (!world) return;
  world.soundManager.stopAll();
  world.clearAllGameIntervals();
  world = null;
}

function createWorld() {
  world = new World(canvas, keyboard, createLevel1());
}

function startGame() {
  if (gameStarted) return;
  hideUI("landing-page");
  showUI("game-container");
  createWorld();
  gameStarted = true;
  fadeInContainer(document.getElementById("game-container"));
  startBackgroundMusic();
}

function restartGame() {
  destroyWorld();
  createWorld();
  gameStarted = true;
  startBackgroundMusic();
}

function goToLandingPage() {
  destroyWorld();
  gameStarted = false;
  bgMusicStarted = false;
  showUI("landing-page");
  const container = document.getElementById("game-container");
  container.classList.remove("is-visible");
  hideUI("game-container");
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
  if (e.repeat || !gameStarted) return;
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
  if (!gameStarted) return;
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
