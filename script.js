let showingControls = false;

function init() {
  initCanvas();
}

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
