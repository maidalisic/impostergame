# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start        # Start development server (localhost:3000)
npm run build    # Production build
npm test         # Run tests in watch mode
npm test -- --watchAll=false  # Run tests once (CI mode)
npm run deploy   # Build and deploy to GitHub Pages (maidalisic.github.io/impostergame)
```

## Architecture

This is a **single-component React app** — virtually all game logic lives in [src/App.js](src/App.js). There is no routing, no external state management, and no component hierarchy beyond the root `App` function.

**Game flow (controlled by `step` state):**
1. `step=1` — Mode selection (7 modes)
2. `step=2` — Player count (3–11+)
3. `step=3` — Imposter count (1–3+)
4. `gameStarted=true` — Card-reveal phase

**Game modes and their data sources:**

| Mode | Data file |
|------|-----------|
| `normal` | [src/words.json](src/words.json) |
| `countries` | [src/countries.json](src/countries.json) |
| `adults` | [src/adults.json](src/adults.json) |
| `celebrities` | [src/celebrities.json](src/celebrities.json) |
| `jobs` | [src/jobs.json](src/jobs.json) |
| `memes` | [src/memes.json](src/memes.json) + images in [public/memes/](public/memes/) |
| `random` | Picks one of the above randomly via `initializeGame()` |

**Theming:** [src/theme.js](src/theme.js) defines 4 themes (`dark`, `light`, `pink`, `blue`) as CSS custom property maps. `applyTheme(theme)` writes them to `:root`. Theme state is stored in `App` and persisted only for the session.

**Key state in App:**
- `step` / `gameStarted` — controls which UI screen is shown
- `wordList` — array of assigned words/objects per player (set by `initializeGame`)
- `revealedWords` — parallel boolean array tracking which cards have been seen
- `mode` — currently selected game mode
- `showCard` / `activeCardIndex` — overlay card display
- `showInfo` / `showThemeOverlay` — modal visibility

**To add a new game mode:** add a JSON data file to `src/`, import it in `App.js`, add a `case` in `getItemsByMode()`, and add the mode string to the modes list/UI.

## Deployment

The app deploys to GitHub Pages via `gh-pages`. The `homepage` field in `package.json` is set to `https://maidalisic.github.io/impostergame`.

## Language

UI text and word data are in **German**.
