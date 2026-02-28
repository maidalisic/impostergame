# Imposter Game

A browser-based party game for 3–11+ players, built with React. Every player receives the same word — except the imposter, who only gets a hint and has to guess the real word.

**Live:** [maidalisic.github.io/impostergame](https://maidalisic.github.io/impostergame)

## Game Modes

| Mode | Content |
| --- | --- |
| Normal | Everyday words and topics |
| Countries | Countries of the world |
| Celebrities | Celebrities, athletes, cartoon characters |
| Jobs | Professions and occupations |
| Youth Words | Current German slang |
| Adults | 18+ only |
| Random | Picks one of the above at random |

## Features

- **Imposter Hint** – Optional: the imposter receives a random hint word instead of the real word
- **Word Reveal** – After the game, the word can be revealed in a protected step (prevents quick peeking)
- **4 Themes** – Dark, Light, Pink, Blue
- **Swipe to Dismiss** – Swipe cards away on mobile devices
- **Persistence** – Settings (player count, mode, theme) are saved across sessions

## Development

```bash
npm start        # Dev server at localhost:3000
npm run build    # Production build
npm run deploy   # Build + deploy to GitHub Pages
```

## Deployment

Automatically deployed to GitHub Pages via GitHub Actions on every push to `main`.

---

Developed with love in Maid's Keller
