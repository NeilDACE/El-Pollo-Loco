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
          Was passiert, wenn man nach drei Burritos zu viel im 'El Pollo Loco'
          einschläft? <br />
          Richtig: Die Rache der Hühner!<br />
          Begleite unseren müden Mexikaner durch einen bizarren Traum, in dem
          das Geflügel nicht auf dem Teller landet, sondern zurückschlägt.
        </p>`;
}
