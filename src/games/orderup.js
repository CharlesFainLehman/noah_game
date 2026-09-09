// Order Up: fill muffin orders. Pixel-art mini-game scene.
import { Pixel, PW, PH } from '../engine/pixel.js';
import { P } from '../art/palette.js';
import { sprites } from '../art/sprites.js';
import { makeRng } from '../engine/rng.js';
import { mastery, commit } from '../engine/save.js';
import { record } from '../engine/mastery.js';
import { generate, padMax } from './orderup-logic.js';
import { sfx } from '../engine/audio.js';

const WIN = 3; // correct in a row to finish the location

export function orderUp({ customer = 'Gaston', onDone }) {
  const rng = makeRng();
  const m = mastery('orderUp');
  const S = sprites();
  let px, q, level, wins = 0, state = 'ask', timer = 0, tray = 0, reveal = false, msg = '', t = 0, levelMsg = '';

  function newRound() {
    level = m.level;
    q = generate(level, rng);
    tray = 0; reveal = level < 3; state = 'ask'; msg = '';
    window.__orderUp = { q, level, wins };
  }

  function answer(n) {
    if (state !== 'ask') return;
    const ok = n === q.sum;
    const change = record(m, ok);
    commit();
    levelMsg = change === 'up' ? 'LEVEL UP!' : change === 'down' ? 'EASIER NOW' : '';
    if (ok) {
      wins++; sfx.ding();
      if (wins >= WIN) { state = 'done'; timer = 2.2; sfx.fanfare(); }
      else { state = 'good'; timer = 1.3; }
      msg = ['DING! MERCI!', 'PERFECT!', 'OUI! THAT IS RIGHT!'][wins % 3];
    } else {
      wins = 0; sfx.bad(); state = 'bad'; timer = 1.4; reveal = true;
      msg = 'SACRE BLEU! COUNT AGAIN.';
    }
  }

  function draw() {
    const c = px.ctx;
    px.clearHits();
    // Room
    px.clear(P.cream);
    for (let i = 0; i < PW; i += 24) px.rect(i, 0, 12, 108, '#ffe4e8');
    px.rect(0, 108, PW, 6, P.woodDark); px.rect(0, 114, PW, PH - 114, P.wood);
    for (let i = 0; i < PW; i += 40) px.rect(i, 114, 1, PH - 114, P.woodDark);
    // Shelf with breads
    px.rect(6, 30, 56, 3, P.woodDark);
    for (let i = 0; i < 3; i++) { px.rect(10 + i * 18, 22, 14, 8, P.brown); px.rect(11 + i * 18, 21, 12, 1, P.tan); }
    // Gaston
    px.blit(S.gaston, 8, 44, 2);
    // Stars
    for (let i = 0; i < WIN; i++) px.blit(i < wins ? S.star : S.starOff, 284 + i * 12, 4);
    // Order card
    px.box(70, 4, 180, 78, '#fffdf5');
    px.text(`ORDER FOR ${customer}`, 160, 8, P.k, { align: 'center' });
    const showPics = reveal;
    if (showPics) {
      const perRow = 10, size = 12, gap = 2;
      const drawGroup = (n, spr, x0, y0) => {
        for (let i = 0; i < n; i++) px.blit(spr, x0 + (i % perRow) * (size + gap), y0 + Math.floor(i / perRow) * (size + gap));
      };
      if (level === 3) {
        // Two rows of ten: first addend then second addend in sequence (a tens frame).
        for (let i = 0; i < q.sum; i++) {
          px.blit(i < q.a ? S.muffinBlue : S.muffinChoc, 90 + (i % perRow) * 14, 20 + Math.floor(i / perRow) * 14);
        }
        px.text(`${q.a} + ${q.b} = ?`, 160, 56, P.k, { align: 'center', scale: 2 });
      } else {
        const wA = q.a * 14, wB = q.b * 14, total = wA + 14 + wB, x0 = 160 - Math.floor(total / 2);
        drawGroup(q.a, S.muffinBlue, x0, 22);
        px.text('+', x0 + wA + 2, 25, P.k, { scale: 1 });
        drawGroup(q.b, S.muffinChoc, x0 + wA + 14, 22);
        px.text(String(q.a), x0 + Math.floor(wA / 2) - 1, 38, P.blueberry, { align: 'center', scale: 1 });
        px.text(String(q.b), x0 + wA + 14 + Math.floor(wB / 2) - 1, 38, P.choc, { align: 'center', scale: 1 });
        px.text(`${q.a} + ${q.b} = ?`, 160, 56, P.k, { align: 'center', scale: 2 });
      }
    } else {
      px.text(`${q.a} + ${q.b} = ?`, 160, 26, P.k, { align: 'center', scale: 3 });
      px.text('TAP HERE TO SEE THE MUFFINS', 160, 60, P.greyDark, { align: 'center' });
      px.hit(70, 4, 180, 78, () => { reveal = true; sfx.tap(); });
    }
    // Prompt / message
    if (state === 'ask') {
      px.text(level === 1 ? 'PUT THE MUFFINS ON THE TRAY' : 'HOW MANY MUFFINS ALL TOGETHER?', 160, 88, P.k, { align: 'center' });
    } else {
      px.box(60, 84, 200, 20, state === 'bad' ? '#ffd6d6' : '#dff5d0');
      px.text(msg, 160, 90, P.k, { align: 'center' });
    }
    if (levelMsg && state !== 'ask') px.text(levelMsg, 160, 106, P.red, { align: 'center' });

    // Input area
    if (level === 1) {
      // Tray
      px.box(90, 122, 120, 40, '#c9c0aa');
      px.text('TRAY', 150, 152, P.greyDark, { align: 'center' });
      for (let i = 0; i < tray; i++) {
        const bounce = state === 'good' || state === 'done' ? Math.round(Math.abs(Math.sin(t * 10 + i)) * 4) : 0;
        px.blit(S.muffinBlue, 96 + i * 18, 132 - bounce);
        px.hit(96 + i * 18, 128, 16, 16, () => { if (state === 'ask') { tray--; sfx.tap(); } });
      }
      px.text(String(tray), 204, 126, P.k, { align: 'right' });
      // Basket
      px.box(224, 120, 60, 30, P.brown);
      for (let i = 0; i < 4; i++) px.blit(S.muffinChoc, 228 + i * 13, 118);
      px.rect(226, 132, 56, 4, P.woodDark);
      px.text('TAP', 254, 140, P.cream, { align: 'center' });
      px.hit(220, 112, 68, 42, () => { if (state === 'ask' && tray < 10) { tray++; sfx.pop(); } });
      // Bell
      px.blit(S.bell, 230, 156, 1); px.text('DING!', 262, 160, P.k);
      px.hit(224, 152, 70, 26, () => answer(tray));
    } else {
      const max = padMax(level);
      for (let n = 0; n <= max; n++) {
        const row = n > 10 ? 1 : 0, col = row ? n - 11 : n;
        const x = 2 + col * 29, y = row ? 148 : 122;
        px.box(x, y, 26, 24, P.yellow);
        px.text(String(n), x + 13, y + 8, P.k, { align: 'center' });
        px.hit(x, y, 26, 24, () => answer(n));
      }
    }
    if (state === 'done') {
      px.box(60, 30, 200, 40, P.yellow);
      px.text('ORDER COMPLETE!', 160, 40, P.k, { align: 'center', scale: 2 });
    }
  }

  return {
    enter(root) {
      px = new Pixel(root);
      newRound();
      draw();
    },
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
