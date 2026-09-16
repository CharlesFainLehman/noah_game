# Noah's math games

Two separate browser games in one repo. Both are plain HTML and JavaScript with no build step.

## 1. The Pebbleton Detective Agency

A first-grade math game. Animal detectives, small mysteries, a treasure map. All pixel art.

Design: [docs/DESIGN.md](docs/DESIGN.md)

## 2. Shark Sums

A small game that teaches two-digit column addition. Add the ones, carry the ten, add the tens.
Smooth cartoon look (think Freddi Fish), not pixel art. The shark says the prompts in a speech bubble.
A shark eats the fish and does something silly when the answer is right (backflip, party hat,
sunglasses, a giant burp, a crab dance, jellyfish disco, and a surfboard ride at five in a row).
Five levels, from two-digit plus one-digit with no carrying up to sums past 100. The level moves
up after four right in a row and down after two misses. Pick a starting level on the start screen.
Keyboard works too: digits, Backspace, Enter.
A short tutorial with a Skip button plays on the first boot; "How to play" on the start screen replays it.

Open `shark/index.html` through the same server: http://localhost:8080/shark/

## Run it

The game is plain HTML and JavaScript with no build step, but it uses ES modules,
so it must be served over HTTP. Opening `index.html` directly from disk does not work in Chrome.

```
npx http-server -p 8080 -c-1 .
```

Then open http://localhost:8080/ (detective game) or http://localhost:8080/shark/ (Shark Sums) on the laptop,
or use http://<laptop-ip>:8080/ on a tablet on the same Wi-Fi.

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
