// Shared number mini-game: a problem card with pictures, a keypad, feedback, mastery.
// Used by Order Up (addition) and Who Ate It (subtraction).
import { Pixel, PW, PH } from '../engine/pixel.js';
import { P } from '../art/palette.js';
import { sprites, itemSprite } from '../art/sprites.js';
import { pixelCharacter, CH, idle } from '../art/pixel-characters.js';
import { drawBackdrop } from '../art/pixel-backdrops.js';
import { makeRng } from '../engine/rng.js';
import { save, mastery, commit } from '../engine/save.js';
import { record, clampLevel } from '../engine/mastery.js';
import { sfx } from '../engine/audio.js';
import { drawRods, drawPile, drawJar, drawStones } from './draw.js';
import { fitScale } from '../art/font.js';

export const WIN = 3; // correct in a row to finish a location
export const FEET = { bakery: 112, harbor: 136, store: 134, school: 126, clock: 130, office: 174, street: 130, studio: 128, workshop: 124, lighthouse: 134 };

export const GOOD = ['DING! THAT IS RIGHT!', 'PERFECT!', 'YES! WELL DONE!'];
export const BAD = ['HMM. COUNT AGAIN.', 'NOT QUITE. TRY AGAIN.'];

// Bevelled panel: fill, white highlight top-left, shadow bottom-right, drop shadow.
export function panel(px, x, y, w, h, fill, { shadow = true } = {}) {
  if (shadow) { px.ctx.fillStyle = 'rgba(0,0,0,0.25)'; px.ctx.fillRect(x + 2, y + 2, w, h); }
  px.box(x, y, w, h, fill);
  px.rect(x + 1, y + 1, w - 2, 1, 'rgba(255,255,255,0.6)'); px.rect(x + 1, y + 1, 1, h - 2, 'rgba(255,255,255,0.6)');
  px.rect(x + 1, y + h - 2, w - 2, 1, 'rgba(0,0,0,0.15)'); px.rect(x + w - 2, y + 1, 1, h - 2, 'rgba(0,0,0,0.15)');
}

// Keypad: digits 0-9 on one row, CLEAR and SERVE below. Returns hit boxes for the test driver.
export function drawKeypad(px, { onDigit, onClear, onServe, serveLabel = 'SERVE' }) {
  const pads = { digits: [] };
  for (let n = 0; n <= 9; n++) {
    const x = 4 + n * 31, y = 120;
    panel(px, x, y, 28, 24, P.yellow);
    px.text(String(n), x + 14, y + 8, P.k, { align: 'center' });
    px.hit(x, y, 28, 24, () => onDigit(n));
    pads.digits.push({ n, x, y, w: 28, h: 24 });
  }
  panel(px, 60, 150, 84, 24, '#ffd6d6'); px.text('CLEAR', 102, 158, P.k, { align: 'center' });
  px.hit(60, 150, 84, 24, onClear); pads.clear = { x: 60, y: 150, w: 84, h: 24 };
  panel(px, 176, 150, 84, 24, '#9be07d'); px.text(serveLabel, 218, 158, P.k, { align: 'center' });
  px.hit(176, 150, 84, 24, onServe); pads.serve = { x: 176, y: 150, w: 84, h: 24 };
  return pads;
}

export function drawStars(px, wins) {
  const S = sprites();
  for (let i = 0; i < WIN; i++) px.blit(i < wins ? S.star : S.starOff, 284 + i * 12, 4);
}

export function drawMessage(px, state, msg, levelMsg) {
  panel(px, 60, 84, 200, 20, state === 'bad' ? '#ffd6d6' : '#dff5d0');
  px.text(msg, 160, 90, P.k, { align: 'center' });
  if (levelMsg) px.text(levelMsg, 160, 106, P.red, { align: 'center' });
}

// Tens rods and unit cubes for two-digit numbers.
function drawBig(px, n, x, y, color) {
  const tens = Math.floor(n / 10), ones = n % 10;
  for (let i = 0; i < tens; i++) px.box(x + i * 6, y, 5, 22, color);
  for (let i = 0; i < ones; i++) px.box(x + tens * 6 + 2 + (i % 5) * 5, y + Math.floor(i / 5) * 5, 4, 4, color);
  return tens * 6 + 2 + Math.min(ones, 5) * 5;
}

// Draw the pictures for a problem inside the card. Returns nothing.
export function drawPictures(px, q, item, item2, t) {
  const S = sprites(), a = itemSprite(item), b = itemSprite(item2);
  const size = 14, perRow = 10;
  if (q.kind === 'count') { drawPile(px, q.n, item, 74, 20, 172); return; }
  if (q.kind === 'fill') { drawJar(px, q.k, 76, 23); return; }
  if (['rods', 'tens', 'ones'].includes(q.kind)) { drawRods(px, q.n, 90, 20); return; }
  if (q.kind === 'build') { drawRods(px, q.t * 10 + q.o, 90, 20); return; }
  if (q.kind === 'skip') { drawStones(px, q.seq, 74, 22, 172); return; }
  if (q.big) {
    // Two-digit: tens rods and ones.
    const x0 = 84;
    const w1 = drawBig(px, q.kind === 'sub' ? q.n : q.a, x0, 20, P.blueberry);
    px.text(q.kind === 'sub' ? '-' : '+', x0 + w1 + 6, 27, P.k);
    drawBig(px, q.kind === 'sub' ? q.m : q.b, x0 + w1 + 16, 20, P.choc);
    return;
  }
  if (q.kind === 'sub' || q.kind === 'missingSub') {
    // One group, first m crossed out (eaten).
    const n = q.groups[0], m = q.crossed;
    const x0 = 160 - Math.floor(Math.min(n, perRow) * size / 2);
    for (let i = 0; i < n; i++) {
      const x = x0 + (i % perRow) * size, y = 20 + Math.floor(i / perRow) * size;
      px.blit(a, x, y);
      if (i < m) { px.ctx.fillStyle = 'rgba(255,255,255,0.55)'; px.ctx.fillRect(x, y, 12, 12); px.rect(x + 2, y + 2, 8, 1, P.red); px.rect(x + 2, y + 9, 8, 1, P.red); px.rect(x + 5, y + 2, 2, 8, P.red); }
    }
    return;
  }
  // Addition: groups in sequence, alternating sprites. Missing addend shows the unknown group faded.
  const total = q.groups.reduce((s, g) => s + g, 0);
  const x0 = 160 - Math.floor(Math.min(total, perRow) * size / 2);
  let i = 0;
  q.groups.forEach((g, gi) => {
    for (let j = 0; j < g; j++, i++) {
      const x = x0 + (i % perRow) * size, y = 20 + Math.floor(i / perRow) * size;
      const bounce = t !== undefined ? Math.round(Math.abs(Math.sin(t * 10 + i)) * 3) : 0;
      px.blit(gi % 2 ? b : a, x, y - bounce);
      if (q.missingIndex === gi) { px.ctx.fillStyle = 'rgba(255,255,255,0.45)'; px.ctx.fillRect(x, y - bounce, 12, 12); }
    }
  });
}

// Prompt for each problem kind.
export function promptFor(q, fallback) {
  return { missing: 'HOW MANY MORE ARE NEEDED?', add3: 'HOW MANY ALL TOGETHER?', add: 'HOW MANY ALL TOGETHER?', sub: 'HOW MANY ARE LEFT?', missingSub: 'HOW MANY WERE EATEN?' }[q.kind] || fallback;
}

export function numberGame({ game, gen, bg, who, item, item2 = item, title, prompt, onDone, alwaysShow = false, maxDigits = 2 }) {
  const rng = makeRng();
  const m = mastery(game);
  let px, q, level, wins = 0, state = 'ask', timer = 0, entry = '', reveal = false, msg = '', t = 0, levelMsg = '';

  function newRound() {
    level = clampLevel(m, save.levelMin, save.levelMax);
    q = gen(level, rng);
    entry = ''; reveal = alwaysShow || level <= 2; state = 'ask'; msg = '';
  }

  function answer() {
    if (state !== 'ask' || entry === '') return;
    const ok = Number(entry) === q.answer;
    const change = record(m, ok, save.levelMin, save.levelMax);
    commit();
    levelMsg = change === 'up' ? 'LEVEL UP!' : change === 'down' ? 'EASIER NOW' : '';
    if (ok) {
      wins++; sfx.ding();
      if (wins >= WIN) { state = 'done'; timer = 2.2; sfx.fanfare(); }
      else { state = 'good'; timer = 1.3; }
      msg = GOOD[wins % GOOD.length];
    } else {
      wins = 0; sfx.bad(); state = 'bad'; timer = 1.4; reveal = true; entry = '';
      msg = BAD[m.total % BAD.length];
    }
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
    if (reveal) drawPictures(px, q, item, item2, state === 'good' || state === 'done' ? t : undefined);
    else { px.text('TAP HERE TO SEE THEM', 160, 30, P.greyDark, { align: 'center' }); px.hit(70, 4, 180, 78, () => { reveal = true; sfx.tap(); }); }
    const shown = q.text.replace('?', entry === '' ? '?' : entry);
    const hasEq = q.text.includes('?');
    if (hasEq) px.text(shown, 160, 56, P.k, { align: 'center', scale: fitScale(shown, 172, 2) });
    else px.text(entry === '' ? '?' : entry, 160, 56, P.k, { align: 'center', scale: 2 });
    // Prompt or message
    if (state === 'ask') { panel(px, 60, 84, 200, 20, '#fffdf5'); px.text(q.prompt || promptFor(q, prompt), 160, 90, P.k, { align: 'center' }); }
    else drawMessage(px, state, msg, levelMsg);
    // Keypad
    const pads = drawKeypad(px, {
      onDigit: n => { if (state === 'ask' && entry.length < maxDigits) { entry += n; sfx.tap(); } },
      onClear: () => { entry = ''; sfx.tap(); },
      onServe: answer,
    });
    if (state === 'done') { panel(px, 60, 30, 200, 40, P.yellow); px.text('ALL DONE!', 160, 40, P.k, { align: 'center', scale: 2 }); }
    window.__game = { game, q, level, wins, state, pads };
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
