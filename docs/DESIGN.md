# Design Document: The Pebbleton Detective Agency

Status: v0.3. Case 3 slice built. Open questions are marked `[?]`.

## 1. Goal

A browser game for a five-year-old. Teaches first-grade math. Cartoon look.
Built to be replayed over weeks, not finished in one sitting.

Decisions so far:

| Item | Decision |
|---|---|
| Art | All pixel art. Characters are 32x48 sprites built from shared parts. Scenes are 320x180 scaled 3x. |
| Device | Tablet and laptop. Touch first. Mouse works. |
| Reading | Reads well. Short sentences on screen. Optional voice. |
| Story | Detective agency in a small animal town. |
| Tech | Plain HTML, JavaScript, Canvas. No build step. Saves in localStorage. |

## 2. Story

### Setting

**Pebbleton.** A small harbor town. Cobblestones, a bakery, a clock tower,
a general store, a fish stand, a school, a lighthouse. Everyone is an animal.

### Premise

The player is the new junior detective at the Pebbleton Detective Agency.
Town legend says Founder Ferdinand Frog hid a treasure long ago. He tore the
map into 8 pieces and gave one to each old town family. Nobody knows where
the pieces are now.

Each case is a small, silly mystery. A grateful citizen gives the player a map
piece when the case closes. Eight cases, eight pieces. Then the treasure hunt.

Rules for tone:
- Nothing is scary. No thieves. No danger.
- Every mystery has an innocent, funny answer. The wind did it. A cat sat on it.
  Someone counted wrong.
- Nobody gets in trouble. Wrong guesses are met with "Hmm. Let's look again."

### Characters

| Name | Animal | Role | Trait |
|---|---|---|---|
| Detective Bartholomew Basset ("Bart") | Basset hound | Head detective, mentor | Slow, sleepy, always right in the end. Loves donuts. |
| Player | Chosen by player | Junior detective | Fox, rabbit, hedgehog, or cat. Player types a name on first start. |
| Pip | Pigeon | Messenger | Talks too fast. Delivers new cases. |
| Mrs. Nutley | Squirrel | General store | Keeps losing count of her acorns. |
| Chef Gaston | Goose | Bakery | Dramatic. Cries when orders are wrong. |
| Mayor Waddlesworth | Penguin | Mayor | Pompous. Worried about the town clock. |
| Otto | Otter | Fish stand | Cheerful. Bad at making change. |
| Priscilla | Peacock | Artist | Speaks in rhymes. Paints patterns. |
| Bruno | Beaver | Builder | Measures everything. Twice. |
| Ms. Heron | Heron | Teacher | Loves charts. |
| Nibbles | Raccoon | "Suspect" | Always suspected. Never guilty. Running joke. |
| Captain Mabel | Sea turtle | Lighthouse keeper | Very old. Tells the treasure legend. |

### Case list

Each case maps to one skill cluster. Order is also the teaching order.

| # | Case | Client | Skills | Map piece |
|---|---|---|---|---|
| 1 | The Case of the Missing Acorns | Mrs. Nutley | Count to 20, then 100. Compare more/less. | 1 |
| 2 | The Case of the Crooked Clock | Mayor Waddlesworth | Time to the hour and half hour. | 2 |
| 3 | The Case of the Backwards Bakery | Chef Gaston | Add and subtract within 10, then 20. | 3 |
| 4 | The Case of the Muddled Market | Otto | Coins: penny, nickel, dime, quarter. Make an amount. | 4 |
| 5 | The Case of the Puzzling Painter | Priscilla | Patterns (AB, ABC, growing). 2D and 3D shapes. | 5 |
| 6 | The Case of the Long Lost Ladder | Bruno | Compare and order lengths. Measure with units. | 6 |
| 7 | The Case of the Crowded Classroom | Ms. Heron | Tally marks. Picture graphs. Most/least. | 7 |
| 8 | The Case of the Founder's Treasure | Captain Mabel | Skip count by 2, 5, 10. Tens and ones. Mixed review. | 8 + treasure |

After case 8 the treasure is found. A "Season 2" unlocks with the same town
and harder numbers (within 100, two-digit addition). Not built in v1.

### Case structure

Every case follows the same five steps.

1. **Case intro.** Pixel comic, 3 to 5 panels, speech bubbles. Pip delivers
   the case. Bart explains it. Tap to advance.
2. **Investigate.** Pixel-art town map. Three locations light up. Tap one to
   travel. Each location runs one mini-game.
3. **Clue.** Winning a mini-game earns a clue card. Cards go in the notebook.
4. **Deduce.** With three clues, Bart asks "So what happened?" The player picks
   one of three explanations. All three are funny. Only one fits the clues.
   Wrong pick: Bart points at the clue that rules it out. Try again.
5. **Case closed.** Comic scene. Client hands over a map piece. Stamp on the
   case file. Back to the office.

Time budget per case: about 15 minutes. Can stop and resume at any step.

## 3. Mini-games

Each mini-game is a self-contained module. Each has three levels. The game
picks the level from the player's mastery record (see section 5).

| Game | Skill | Level 1 | Level 2 | Level 3 | Input |
|---|---|---|---|---|---|
| Count the Pile | Counting | 1 to 10 | 1 to 20 | 20 to 100 in groups of 10 | Tap number |
| More or Less | Compare | Two piles, pick bigger | Two numbers | Use >, <, = | Tap |
| Jars of Ten | Place value | Fill a jar of 10 | Read tens and ones | Build a number | Tap acorn into jar |
| Clock Fixer | Time | Set hour hand | Set both to o'clock | Half hours | Tap hour marks |
| Order Up | Addition | Sums to 5 | Sums to 10 | Sums to 20 | Tap muffins onto tray |
| Who Ate It | Subtraction | Within 5 | Within 10 | Within 20 | Tap answer |
| Coin Purse | Money | Name coins | Count pennies and nickels | Make an amount with mixed coins | Tap coins |
| Paint the Pattern | Patterns | AB | ABC, AAB | Growing patterns | Tap next tile |
| Shape Sorter | Shapes | Circle, square, triangle | Rectangle, hexagon | Cube, sphere, cone, cylinder | Tap bin |
| Plank Picker | Measurement | Longer or shorter | Order three lengths | Measure with paperclips | Tap plank |
| Tally Time | Data | Count tallies | Read picture graph | Build a graph | Tap |
| Skip Hop | Skip counting | By 10s | By 5s | By 2s | Tap stepping stones |

Rules for all games:
- Touch targets at least 64 by 64 CSS pixels.
- No drag required. Tap to pick up, tap to place. Drag is a bonus, not needed.
- Wrong answer: gentle sound, the character gives a hint, try again. No lives.
- Three correct answers in a row wins the round.
- Every round is generated from a seeded random source. No fixed question lists.

## 4. Return play

The story alone is about 8 sessions. These features make it last longer.

- **Daily Case File.** Three random rounds from any unlocked mini-game.
  Completing it earns one badge stamp. Shows a streak count.
- **Office upgrades.** Badges buy office decor: desk lamp, goldfish, plant,
  hat rack, a picture of Nibbles. Purely cosmetic. The office is the hub screen,
  so upgrades are always visible.
- **Trophy shelf.** One trophy per case. One gold trophy per mini-game mastered
  at level 3.
- **Replay any closed case.** Same story, fresh random rounds.
- **Adaptive level.** Games get harder as he gets better. Stays fresh.

## 5. Adaptive difficulty

Per mini-game, store: current level (1 to 3), correct streak, wrong streak.

- Five correct in a row at a level: streak resets, level goes up (max 3). Three in a row wins a location, so a level-up takes about two locations.
- Two wrong in a row: level goes down (min 1). Streak resets.
- Case story rounds use the stored level.
- Parent screen can lock a minimum or maximum level.

## 6. Screens

| Screen | Art | Purpose |
|---|---|---|
| Title | Pixel | Start. New detective: type a name, pick an avatar. Or resume. |
| Office (hub) | Pixel | Case board, daily file, trophy shelf, notebook, settings door. |
| Comic | Pixel | Story panels with speech bubbles. |
| Town map | Pixel | Travel between locations. |
| Mini-game | Pixel | One game at a time. |
| Deduction | Pixel | Three clue cards, three explanations. |
| Notebook | HTML panel, pixel icons | Clues, map pieces, badges. |
| Parent screen | Plain | Progress by skill. Reset. Level limits. Sound. Change name. Export and import save. |

Parent screen is gated by a hold-to-open button (hold for 3 seconds).

## 7. Accessibility and input

- Works at any screen size. Game area scales to fit. Pixel scenes scale by
  whole-number factors so pixels stay crisp.
- Touch, mouse, and keyboard (arrows, enter) all work.
- Sound effects made with Web Audio. No audio files. Mute toggle.
- No timers on any puzzle in v1. `[?]`

## 8. Technical plan

- Single page. `index.html` loads ES modules from `src/`. No bundler, no npm
  dependencies at runtime.
- Pixel art: sprites defined as text grids in JavaScript. Each character is a
  palette index. Rendered once to an offscreen canvas. Drawn with image
  smoothing off.
- Characters: one shared 32x48 body template plus per-animal parts (ears, muzzle,
  tail, hat, accessories) and swappable eyes and mouths for expressions. Composed once and cached.
- Speech bubbles, buttons, and cards are HTML with square corners and hard shadows so they sit with the pixel art.
- Scenes: a small scene stack. Each scene has `enter`, `update`, `draw`, `exit`.
- Save: one JSON object in localStorage, with a version number. Export and
  import as a text code so the save can move between devices.
- Tests: `node --test` for question generators and the adaptive logic. Rendering
  is checked by eye.
- Hosting: GitHub Pages, or any static server. ES modules need HTTP, so `index.html` cannot be opened straight from disk in Chrome.

### File layout

```
index.html
src/
  main.js          boot, scene router
  engine/          canvas, input, scenes, sprite, svg, audio, speech, save, rng
  data/            characters, cases, story text, palette
  art/             pixel sprite sheets, svg character builders
  scenes/          title, office, comic, map, deduction, notebook, parent
  games/           one file per mini-game
test/              node tests
docs/              this document
```

## 9. Build order

1. ~~Engine: canvas scaling, input, scene stack, save.~~ Done.
2. ~~One mini-game end to end (Order Up). Adaptive logic. Tests.~~ Done.
3. ~~Office hub and town map. Save and resume.~~ Done.
4. ~~Comic scene and deduction scene. Case 3 complete.~~ Done.
5. Remaining mini-games, one at a time. Cases 1, 2, 4 through 8.
6. Daily Case File, badges, office upgrades.
7. Art pass. Sound.
8. Parent screen. Export and import save.

## 10. Decided

- Player types a name on first start. Editable on the parent screen.
- Avatar choices: fox, rabbit, hedgehog, cat.
- No text-to-speech.
- First mini-game built: Order Up (addition).

## 11. Open questions

- `[?]` Session length target. 15 minutes per case proposed.
- `[?]` Any animals he dislikes or fears? Any he loves that should be in the cast?
- `[?]` Timed challenges. Proposed: none in v1.
- `[?]` Skill priorities. Anything to add, remove, or move earlier?
