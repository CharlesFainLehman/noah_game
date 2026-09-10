# The Pebbleton Detective Agency

A browser game for first-grade math. Animal detectives, small mysteries, a treasure map. All pixel art.

Design: [docs/DESIGN.md](docs/DESIGN.md)

## Run it

The game is plain HTML and JavaScript with no build step, but it uses ES modules,
so it must be served over HTTP. Opening `index.html` directly from disk does not work in Chrome.

```
npx http-server -p 8080 -c-1 .
```

Then open http://localhost:8080/ on the laptop, or http://<laptop-ip>:8080/ on a tablet on the same Wi-Fi.

Or publish with GitHub Pages: Settings → Pages → Deploy from branch → root. No changes needed.

## Test

```
npm test
```

Runs the node tests for question generation, adaptive difficulty, and sprite data.

## Status

All eight cases are playable, in order. Twelve mini-games with four adaptive levels each.
Daily case file with badges, office decorations, trophy shelf, and a parent screen
(hold the Parents button) with level limits, progress by game, reset, and a save code
for moving progress between devices.

`dev.html?game=clock&level=3` opens one mini-game at one level for quick testing.
