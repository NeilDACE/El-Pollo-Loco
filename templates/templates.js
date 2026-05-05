/**
 * Returns the HTML string for the controls overlay.
 *
 * @returns {string} HTML markup listing all keyboard and button controls.
 */
function showControlsTemplate() {
  return `<div class="controls-container">
  <h2>Controls</h2>
  <div class="divider"></div>
  <ul>
    <li>Arrow Up(W): Buy</li>
    <li>Arrow Left(A): Move Left</li>
    <li>Arrow Right(D): Move Right</li>
    <li>Space: Jump</li>
    <li>Enter: Throw Bottle</li>
  </ul>
</div>`;
}

/**
 * Returns the HTML string for the game story description.
 *
 * @returns {string} HTML paragraph with the game's backstory text.
 */
function showStoryTemplate() {
  return `<p>
          What happens when you fall asleep after one too many burritos at
          'El Pollo Loco'? <br />
          That's right: the revenge of the chickens!<br />
          Join our drowsy Mexican through a bizarre dream where the poultry
          isn't ending up on the plate — it's fighting back.
        </p>`;
}
