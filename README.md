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

Playable: Case 3, The Backwards Bakery, end to end. Title, office, comic scenes,
town map, the Order Up addition game with three adaptive levels, deduction, case closed, save and resume.
