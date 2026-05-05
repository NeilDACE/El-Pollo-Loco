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
    <li>Arrow Up(W): Buy(only available in market)</li>
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
  Fall asleep at 'El Pollo Loco' and face the revenge of the chickens!<br />
  Fight through waves of enemies, collect coins &amp; bottles, and defeat the boss.<br />
  Stomp small chickens, throw bottles at bigger ones, and buy ammo at the market.
</p>`;
}
