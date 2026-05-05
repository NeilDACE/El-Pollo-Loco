let canvas;
let ctx;
let world;
let keyboard = new Keyboard();
let bgMusicStarted = false;
let gameStarted = false;

const CANVAS_WIDTH = 720;
const CANVAS_HEIGHT = 480;

/**
 * Configures a canvas element for high-DPI rendering by scaling it
 * according to the device pixel ratio.
 *
 * @param {HTMLCanvasElement} canvasElement - The canvas element to configure.
 */
function setupCanvasRendering(canvasElement) {
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
  canvasElement.width = Math.floor(CANVAS_WIDTH * pixelRatio);
  canvasElement.height = Math.floor(CANVAS_HEIGHT * pixelRatio);
  const context = canvasElement.getContext("2d");
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
}

/**
 * Retrieves the canvas element from the DOM and applies high-DPI rendering setup.
 */
function initCanvas() {
  canvas = document.getElementById("canvas");
  setupCanvasRendering(canvas);
}

/**
 * Hides a UI element by setting its display style to 'none'.
 *
 * @param {string} id - The ID of the DOM element to hide.
 */
function hideUI(id) {
  document.getElementById(id).style.display = "none";
}

/**
 * Shows a UI element by setting its display style to 'flex'.
 *
 * @param {string} id - The ID of the DOM element to show.
 */
function showUI(id) {
  document.getElementById(id).style.display = "flex";
}

/**
 * Updates the audio button icon to reflect the current mute state.
 */
function updateAudioButton() {
  document.getElementById("audio-button").src = world.soundManager.muted
    ? "img/buttons/audio_off.png"
    : "img/buttons/audio_on.png";
}

/**
 * Toggles the global mute state and updates the audio button icon accordingly.
 */
function muteOrUnmute() {
  if (!world.soundManager.muted) {
    world.soundManager.muteAll();
  } else {
    world.soundManager.unmuteAll();
  }
  updateAudioButton();
}

/**
 * Triggers a CSS fade-in transition on a container element by adding
 * the 'is-visible' class after two animation frames.
 *
 * @param {HTMLElement} container - The container element to fade in.
 */
function fadeInContainer(container) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => container.classList.add("is-visible"));
  });
}

/**
 * Starts the background music if it has not already been started.
 */
function startBackgroundMusic() {
  if (bgMusicStarted) return;
  world.soundManager.playBackgroundMusic();
  bgMusicStarted = true;
}

/**
 * Stops all sounds and clears all game intervals, then destroys the current world instance.
 */
function destroyWorld() {
  if (!world) return;
  world.soundManager.stopAll();
  world.clearAllGameIntervals();
  world = null;
}

/**
 * Creates a new World instance for Level 1 and initializes the audio button state.
 */
function createWorld() {
  const restartButtonContainer = document.getElementById(
    "restart-button-container",
  );
  if (restartButtonContainer) {
    restartButtonContainer.style.display = "none";
  }
  world = new World(canvas, keyboard, createLevel1());
  updateAudioButton();
}

/**
 * Hides the landing page, shows the game container, creates the world,
 * and starts background music. Does nothing if the game is already running.
 */
function startGame() {
  if (gameStarted) return;
  hideUI("landing-page");
  showUI("game-container");
  createWorld();
  gameStarted = true;
  fadeInContainer(document.getElementById("game-container"));
  startBackgroundMusic();
}

/**
 * Destroys the current world and starts a fresh game session,
 * resetting the fade-in animation and background music.
 */
function restartGame() {
  const container = document.getElementById("game-container");
  if (container) {
    container.style.transition = "none";
    container.classList.remove("is-visible");
    void container.offsetWidth;
    container.style.transition = "";
  }
  destroyWorld();
  createWorld();
  gameStarted = true;
  bgMusicStarted = false;
  if (container) {
    fadeInContainer(container);
  }
  startBackgroundMusic();
}

/**
 * Destroys the current world, resets game state, and navigates back to the landing page.
 */
function goToLandingPage() {
  destroyWorld();
  gameStarted = false;
  bgMusicStarted = false;
  showUI("landing-page");
  const container = document.getElementById("game-container");
  container.classList.remove("is-visible");
  hideUI("game-container");
}

/**
 * Checks whether a key event corresponds to a left-movement key.
 *
 * @param {string} key - The key value from the keyboard event.
 * @returns {boolean} True if the key is ArrowLeft or 'a'.
 */
function isLeftKey(key) {
  return key == "ArrowLeft" || key == "a";
}

/**
 * Checks whether a key event corresponds to a right-movement key.
 *
 * @param {string} key - The key value from the keyboard event.
 * @returns {boolean} True if the key is ArrowRight or 'd'.
 */
function isRightKey(key) {
  return key == "ArrowRight" || key == "d";
}

/**
 * Starts looping the footstep sound if it is currently paused.
 */
function startFootstep() {
  const foot = world.soundManager.sounds.footstep;
  foot.loop = true;
  if (foot.paused) foot.play();
}

/**
 * Stops the footstep sound if neither the LEFT nor RIGHT key is currently pressed.
 */
function stopFootstepIfIdle() {
  if (!keyboard.LEFT && !keyboard.RIGHT && world) {
    world.soundManager.stop("footstep");
  }
}

/**
 * Handles keydown events and updates the keyboard state accordingly.
 * Ignores repeated events and events that occur before the game has started.
 *
 * @param {KeyboardEvent} e - The keyboard event.
 */
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

/**
 * Handles keyup events and resets the corresponding keyboard state.
 * Also stops the footstep sound if no movement key is held.
 *
 * @param {KeyboardEvent} e - The keyboard event.
 */
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

/**
 * Registers press-and-hold interactions (touchstart/touchend and mousedown/mouseup)
 * on a DOM element, calling the provided callbacks on press and release.
 *
 * @param {string} id - The ID of the DOM element.
 * @param {function} onDown - Callback invoked when the element is pressed.
 * @param {function} onUp - Callback invoked when the element is released.
 */
function addHoldEvents(id, onDown, onUp) {
  const el = document.getElementById(id);
  el.addEventListener("touchstart", (e) => {
    e.preventDefault();
    onDown();
  });
  el.addEventListener("touchend", (e) => {
    e.preventDefault();
    onUp();
    el.blur();
  });
  el.addEventListener("mousedown", onDown);
  el.addEventListener("mouseup", () => {
    onUp();
    el.blur();
  });
}

/**
 * Registers click interactions (touchstart and click) on a DOM element.
 *
 * @param {string} id - The ID of the DOM element.
 * @param {function} onClick - Callback invoked when the element is clicked or tapped.
 */
function addClickEvents(id, onClick) {
  const el = document.getElementById(id);
  el.addEventListener("touchstart", (e) => {
    e.preventDefault();
    onClick();
    el.blur();
  });
  el.addEventListener("click", () => {
    onClick();
    el.blur();
  });
}

/**
 * Registers all on-screen button interactions for mobile and desktop controls,
 * including movement, jump, throw, buy, audio, restart, and menu buttons.
 */
function handleBtsPress() {
  addHoldEvents(
    "btn-left",
    () => {
      keyboard.LEFT = true;
      startFootstep();
    },
    () => {
      keyboard.LEFT = false;
      stopFootstepIfIdle();
    },
  );
  addHoldEvents(
    "btn-right",
    () => {
      keyboard.RIGHT = true;
      startFootstep();
    },
    () => {
      keyboard.RIGHT = false;
      stopFootstepIfIdle();
    },
  );
  addHoldEvents(
    "btn-jump",
    () => {
      keyboard.SPACE = true;
    },
    () => {
      keyboard.SPACE = false;
    },
  );
  addHoldEvents(
    "btn-throw",
    () => {
      keyboard.ENTER = true;
    },
    () => {
      keyboard.ENTER = false;
    },
  );
  addHoldEvents(
    "btn-buy",
    () => {
      keyboard.UP = true;
    },
    () => {
      keyboard.UP = false;
    },
  );
  addClickEvents("btn-audio", muteOrUnmute);
  addClickEvents("btn-restart", restartGame);
  addClickEvents("btn-menu", goToLandingPage);
}

window.addEventListener("load", handleBtsPress);
window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);
