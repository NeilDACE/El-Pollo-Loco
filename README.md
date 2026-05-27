# El Pollo Loco

A 2D side-scrolling browser game built with HTML5 Canvas and vanilla JavaScript.

## Overview
In this game you control Pepe, fight waves of chickens, collect coins and bottles, buy ammo, and defeat the end boss.
📸 Screenshots

<img width="1518" height="837" alt="Screenshot 2026-05-27 112344" src="https://github.com/user-attachments/assets/9ab69b5f-9fe2-4cfc-8fd6-bd0cafb5af0e" />
<img width="1223" height="746" alt="el-pollo-loco screenshot" src="https://github.com/user-attachments/assets/c43298a6-b3c8-4eb1-8a3f-a848fed692e7" />

## Features
- Canvas-based side-scroller gameplay
- Character movement, jump, bottle throw, and buy action
- Multiple enemy types (small chicken, chicken, end boss)
- **Swarm mechanic (by design):** Only one stomp registers per jump — chicken swarms are intentionally dangerous and require bottles to clear safely
- **Normal chickens (by design):** Cannot be stomped — must be killed with thrown bottles only
- Collectibles (coins and bottles)
- Health and collectible status bars
- Sound effects and background music toggle
- Desktop and mobile controls

## Tech Stack
- HTML5
- CSS3
- Vanilla JavaScript (ES6 classes)
- HTML5 Canvas

## Controls
### Desktop
- `Arrow Left` / `A`: Move left
- `Arrow Right` / `D`: Move right
- `Space`: Jump
- `Enter`: Throw bottle
- `Arrow Up` / `W`: Buy

### Mobile
Use the on-screen buttons:
- Left / Right
- Jump
- Throw
- Buy

## Getting Started
### 1. Clone the repository
```bash
git clone <your-repo-url>
cd "Pollo Loco"
```

### 2. Run the game
This project does not require a build step.

Option A: Open `index.html` directly in your browser.

Option B (recommended): Use a local server (for example VS Code Live Server) and open the served URL.

## Project Structure
- `index.html` - Main entry point
- `style.css` - Main game styles
- `script.js` - UI and startup logic
- `js/game.js` - Game initialization and canvas setup
- `js/levels/level1.js` - Level configuration
- `models/` - Core game classes and game logic
- `templates/templates.js` - UI template strings
- `img/` - Sprites, backgrounds, and UI assets
- `audio/` - Game audio files

## Developer Notes
JSDoc is available as a dev dependency.

Install dependencies:
```bash
npm install
```

## Author
Developed by Neil DACE.
