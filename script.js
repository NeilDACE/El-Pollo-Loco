let showingControls = false;

/**
 * Initialises the application by setting up the canvas.
 */
function init() {
  initCanvas();
}

/**
 * Toggles the game context panel between the story text and the controls list.
 * Updates the toggle button label to reflect the currently hidden content.
 */
function showControlsOrStory() {
  const showButton = document.getElementById("show-button");
  const showButtonSpan = document.getElementById("show-button-span");
  let gameContext = document.getElementById("game-context");
  if (showingControls) {
    gameContext.innerHTML = showStoryTemplate();
    showButtonSpan.textContent = "Show Controls";
    showingControls = false;
  } else {
    gameContext.innerHTML = showControlsTemplate();
    showButtonSpan.textContent = "Show Storyline";
    showingControls = true;
  }
}
