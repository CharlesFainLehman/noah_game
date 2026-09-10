// Shared "tap the right option" mini-game frame.
import { Pixel } from '../engine/pixel.js';
import { P } from '../art/palette.js';
import { pixelCharacter, CH, idle } from '../art/pixel-characters.js';
import { drawBackdrop } from '../art/pixel-backdrops.js';
import { makeRng } from '../engine/rng.js';
import { save, mastery, commit } from '../engine/save.js';
import { record, clampLevel } from '../engine/mastery.js';
import { sfx } from '../engine/audio.js';
import { WIN, FEET, GOOD, BAD, drawStars, drawMessage, panel } from './numgame.js';
import { drawDesc } from './draw.js';
import { fitScale } from '../art/font.js';

export function choiceGame({ game, gen, bg, who, title, onDone }) {
  const rng = makeRng();
  const m = mastery(game);
  let px, q, level, wins = 0, state = 'ask', timer = 0, msg = '', t = 0, levelMsg = '', hintOn = false, picked = -1;

  function newRound() { level = clampLevel(m, save.levelMin, save.levelMax); q = gen(level, rng); state = 'ask'; msg = ''; hintOn = false; picked = -1; }

  function answer(i) {
    if (state !== 'ask') return;
    picked = i;
    const ok = i === q.answer;
    const change = record(m, ok, save.levelMin, save.levelMax); commit();
    levelMsg = change === 'up' ? 'LEVEL UP!' : change === 'down' ? 'EASIER NOW' : '';
    if (ok) {
      wins++; sfx.ding();
      if (wins >= WIN) { state = 'done'; timer = 2.2; sfx.fanfare(); } else { state = 'good'; timer = 1.3; }
      msg = GOOD[wins % GOOD.length];
    } else { wins = 0; sfx.bad(); state = 'bad'; timer = 1.6; hintOn = true; msg = q.hint && m.total % 2 ? q.hint : BAD[m.total % BAD.length]; }
  }

  function draw() {
    px.clearHits();
    drawBackdrop(px, bg, { t });
    const expr = state === 'bad' ? 'sad' : (state === 'good' || state === 'done') ? 'happy' : 'normal';
    const id = idle(t); px.blit(pixelCharacter(who, expr, id.frame), 12, FEET[bg] - CH + id.bob, 1);
    drawStars(px, wins);
    // Card
    panel(px, 70, 4, 180, 78, '#fffdf5');
    px.text(title, 160, 8, P.k, { align: 'center' });
    if (q.show) { drawDesc(px, q.show, 74, 18, 172, 44); px.text(q.text, 160, 68, P.k, { align: 'center' }); }
    else if (q.tiles) { drawDesc(px, { type: 'tiles', tiles: q.tiles }, 74, 18, 172, 40); px.text(q.text, 160, 66, P.k, { align: 'center' }); }
    else if (q.seq) { drawDesc(px, { type: 'stones', seq: q.seq }, 74, 18, 172, 40); px.text(q.text, 160, 66, P.k, { align: 'center' }); }
    else { const sc = fitScale(q.text, 172, 3); px.text(q.text, 160, 40 - Math.floor(7 * sc / 2), P.k, { align: 'center', scale: sc }); }
    if (state === 'ask') { panel(px, 60, 84, 200, 20, '#fffdf5'); px.text(hintOn && q.hint ? q.hint : q.prompt || 'TAP THE RIGHT ONE', 160, 90, P.k, { align: 'center' }); }
    else drawMessage(px, state, msg, levelMsg);
    // Options
    const n = q.options.length, gap = 6, w = Math.floor((304 - gap * (n - 1)) / n), h = 56, y = 116;
    const boxes = [];
    q.options.forEach((o, i) => {
      const x = 8 + i * (w + gap);
      const base = o.type === 'text' ? P.yellow : '#fffdf5';
      const fill = state !== 'ask' && i === q.answer && (state !== 'bad' || hintOn) ? '#dff5d0' : state === 'bad' && i === picked ? '#ffd6d6' : base;
      panel(px, x, y, w, h, fill);
      drawDesc(px, o, x + 3, y + 3, w - 6, h - 6);
      px.hit(x, y, w, h, () => answer(i));
      boxes.push({ i, x, y, w, h });
    });
    if (state === 'done') { panel(px, 60, 30, 200, 40, P.yellow); px.text('ALL DONE!', 160, 40, P.k, { align: 'center', scale: 2 }); }
    window.__game = { game, q, level, wins, state, boxes };
  }

  return {
    exit() { window.__game = null; },
    enter(root) { px = new Pixel(root); newRound(); draw(); },
    update(dt) {
      t += dt;
      if (state !== 'ask') {
        timer -= dt;
        if (timer <= 0) {
          if (state === 'done') { onDone(); return; }
          if (state === 'good') newRound(); else { state = 'ask'; msg = ''; }
        }
      }
      draw();
    },
  };
}
