// Coin Purse: count coins, or make an amount.
import { Pixel } from '../engine/pixel.js';
import { P } from '../art/palette.js';
import { sprites } from '../art/sprites.js';
import { pixelCharacter, CH, idle } from '../art/pixel-characters.js';
import { drawBackdrop } from '../art/pixel-backdrops.js';
import { makeRng } from '../engine/rng.js';
import { save, mastery, commit } from '../engine/save.js';
import { record, clampLevel } from '../engine/mastery.js';
import { sfx } from '../engine/audio.js';
import { genCoins, COIN_VALUE, coinTotal } from './logic.js';
import { WIN, FEET, GOOD, BAD, drawKeypad, drawStars, drawMessage, panel } from './numgame.js';

const TYPES = ['penny', 'nickel', 'dime', 'quarter'];

export function coinPurse(loc, onDone) {
  const rng = makeRng();
  const m = mastery('coins');
  let px, q, level, wins = 0, state = 'ask', timer = 0, entry = '', reveal = false, msg = '', t = 0, levelMsg = '', picked = [];
  const S = sprites();
  const coin = type => S[type];

  function newRound() { level = clampLevel(m, save.levelMin, save.levelMax); q = genCoins(level, rng); entry = ''; picked = []; reveal = level <= 2; state = 'ask'; msg = ''; }

  function check(value) {
    if (state !== 'ask') return;
    const ok = value === q.answer;
    const change = record(m, ok, save.levelMin, save.levelMax); commit();
    levelMsg = change === 'up' ? 'LEVEL UP!' : change === 'down' ? 'EASIER NOW' : '';
    if (ok) {
      wins++; sfx.ding();
      if (wins >= WIN) { state = 'done'; timer = 2.2; sfx.fanfare(); } else { state = 'good'; timer = 1.3; }
      msg = GOOD[wins % GOOD.length];
    } else { wins = 0; sfx.bad(); state = 'bad'; timer = 1.4; reveal = true; entry = ''; msg = BAD[m.total % BAD.length]; }
  }

  function drawCoinRow(coins, x0, y0, showValues) {
    let x = x0;
    const boxes = [];
    coins.forEach((c, i) => {
      const s = coin(c);
      if (x + s.width > 244) { x = x0; y0 += 22; }
      px.blit(s, x, y0 + Math.floor((14 - s.height) / 2));
      if (showValues) px.text(String(COIN_VALUE[c]), x + Math.floor(s.width / 2), y0 + 15, P.greyDark, { align: 'center' });
      boxes.push({ i, x, y: y0, w: s.width, h: 20 });
      x += s.width + 6;
    });
    return boxes;
  }

  function draw() {
    px.clearHits();
    drawBackdrop(px, loc.bg, { t });
    const expr = state === 'bad' ? 'sad' : (state === 'good' || state === 'done') ? 'happy' : 'normal';
    const id = idle(t); px.blit(pixelCharacter(loc.who, expr, id.frame), 12, FEET[loc.bg] - CH + id.bob, 1);
    drawStars(px, wins);
    panel(px, 70, 4, 180, 78, '#fffdf5');
    const info = { game: 'coins', q, level, wins, state };
    if (q.kind === 'count') {
      px.text(`${loc.customer}'S COINS`, 160, 8, P.k, { align: 'center' });
      drawCoinRow(q.coins, 78, 20, reveal);
      if (!reveal) px.hit(70, 4, 180, 78, () => { reveal = true; sfx.tap(); });
      px.text(entry === '' ? '? CENTS' : `${entry} CENTS`, 160, 60, P.k, { align: 'center', scale: 2 });
      if (state === 'ask') { panel(px, 60, 84, 200, 20, '#fffdf5'); px.text(reveal ? 'HOW MANY CENTS?' : 'TAP THE CARD FOR HELP', 160, 90, P.k, { align: 'center' }); }
      else drawMessage(px, state, msg, levelMsg);
      info.pads = drawKeypad(px, {
        onDigit: n => { if (state === 'ask' && entry.length < 2) { entry += n; sfx.tap(); } },
        onClear: () => { entry = ''; sfx.tap(); },
        onServe: () => { if (entry !== '') check(Number(entry)); },
        serveLabel: 'PAY',
      });
    } else {
      // Make the amount.
      px.text(`PRICE: ${q.target} CENTS`, 160, 8, P.k, { align: 'center', scale: 1 });
      const total = coinTotal(picked);
      const boxes = drawCoinRow(picked, 78, 20, true);
      for (const b of boxes) px.hit(b.x, b.y, b.w, b.h, () => { if (state === 'ask') { picked.splice(b.i, 1); sfx.tap(); } });
      px.text(`YOU HAVE ${total} CENTS`, 160, 66, total === q.target ? P.green : P.k, { align: 'center' });
      if (state === 'ask') { panel(px, 60, 84, 200, 20, '#fffdf5'); px.text('TAP COINS TO PAY THE PRICE', 160, 90, P.k, { align: 'center' }); }
      else drawMessage(px, state, msg, levelMsg);
      // Coin tray
      info.tray = [];
      TYPES.forEach((type, i) => {
        const x = 60 + i * 60, y = 118;
        panel(px, x, y, 52, 30, P.tan);
        px.blit(coin(type), x + 4, y + 8 - Math.floor(coin(type).height / 2) + 6);
        px.text(String(COIN_VALUE[type]), x + 38, y + 11, P.k, { align: 'center' });
        px.hit(x, y, 52, 30, () => { if (state === 'ask' && picked.length < 12) { picked.push(type); sfx.pop(); } });
        info.tray.push({ type, x, y, w: 52, h: 30 });
      });
      panel(px, 60, 152, 84, 22, '#ffd6d6'); px.text('CLEAR', 102, 159, P.k, { align: 'center' });
      px.hit(60, 152, 84, 22, () => { picked = []; sfx.tap(); });
      panel(px, 176, 152, 84, 22, '#9be07d'); px.text('PAY', 218, 159, P.k, { align: 'center' });
      px.hit(176, 152, 84, 22, () => { if (picked.length) check(total); });
      info.pads = { clear: { x: 60, y: 152, w: 84, h: 22 }, serve: { x: 176, y: 152, w: 84, h: 22 } };
    }
    if (state === 'done') { panel(px, 60, 30, 200, 40, P.yellow); px.text('ALL DONE!', 160, 40, P.k, { align: 'center', scale: 2 }); }
    window.__game = info;
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
