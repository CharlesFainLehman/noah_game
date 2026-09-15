// Shark Sums: two-digit column addition with a shark who celebrates.
import { ctx, canvas, PW, PH, toLocal, rect, box, panel, text, outlined, textWidth, makeRng, sfx, setMuted, loadSave, storeSave } from './engine.js';
import { genProblem, record, MAX_LEVEL } from './logic.js';
import { C, drawSea, drawFish, drawTenBar, drawShark, drawReward, GAGS, drawBubbleText } from './art.js';

const rng = makeRng();
const save = loadSave();
setMuted(save.muted);
let q, step = 'start', entry = '', streak = 0, misses = 0, t = 0, msg = '', msgUntil = 0, reward = null, hits = [], levelFlash = '';
let gagIndex = Math.floor(rng.next() * GAGS.length);

function newProblem() {
  q = genProblem(save.level, rng);
  step = 'ones'; entry = ''; misses = 0; msg = '';
  publish();
}

// ----- input -----
canvas.addEventListener('pointerdown', e => {
  e.preventDefault();
  const p = toLocal(e);
  for (let i = hits.length - 1; i >= 0; i--) { const h = hits[i]; if (p.x >= h.x && p.x < h.x + h.w && p.y >= h.y && p.y < h.y + h.h) { h.fn(); return; } }
  if (step === 'start') start();
});
addEventListener('keydown', e => {
  if (step === 'start') { if (e.key === 'Enter' || e.key === ' ') start(); return; }
  if (e.key >= '0' && e.key <= '9') digit(Number(e.key));
  else if (e.key === 'Backspace') { entry = entry.slice(0, -1); }
  else if (e.key === 'Enter') go();
});
function start() { sfx.bubble(); newProblem(); }
function digit(n) { if (!['ones', 'tens'].includes(step) || entry.length >= 2) return; entry += n; sfx.tap(); publish(); }
function clear() { entry = ''; sfx.tap(); }

function go() {
  if (entry === '' || !['ones', 'tens'].includes(step)) return;
  const want = step === 'ones' ? q.onesSum : q.tensSum;
  if (Number(entry) === want) {
    misses = 0;
    if (step === 'ones') {
      if (q.carry) { step = 'carry'; msgUntil = t + 2.2; sfx.carry(); msg = `${q.onesSum} IS 1 TEN AND ${q.onesDigit} ONES. WRITE ${q.onesDigit}, CARRY THE 1.`; }
      else { step = 'tens'; sfx.good(); msg = `ONES DONE. NOW THE TENS.`; msgUntil = t + 1.2; }
      entry = '';
    } else {
      // Whole problem right.
      const change = record(save, true);
      streak++; save.fish += q.sum; save.best = Math.max(save.best, streak); storeSave(save);
      levelFlash = change === 'up' ? 'LEVEL UP!' : '';
      const gag = streak > 0 && streak % 5 === 0 ? 'surf' : GAGS.filter(g => g !== 'surf')[gagIndex++ % (GAGS.length - 1)];
      reward = { gag, t0: t, dur: gag === 'surf' ? 3.6 : 3.0 };
      step = 'reward'; entry = ''; sfx.chomp();
      if (gag === 'burp') setTimeout(() => sfx.burp(), 1200); else setTimeout(() => sfx.fanfare(), 900);
    }
  } else {
    misses++; streak = 0; sfx.bad();
    if (misses >= 2) {
      // Show the answer for this step and move on, so nobody gets stuck.
      msg = step === 'ones' ? `THE ONES MAKE ${q.onesSum}. ${q.a % 10} + ${q.b % 10} = ${q.onesSum}.` : `THE TENS MAKE ${q.tensSum}. LOOK: ${Math.floor(q.a / 10)} + ${Math.floor(q.b / 10)}${q.carry ? ' + 1' : ''}.`;
      msgUntil = t + 2.6; entry = String(want); step = step === 'ones' ? 'onesShown' : 'tensShown';
      record(save, false); storeSave(save);
    } else {
      msg = step === 'ones' ? `HMM. COUNT THE LITTLE FISH: ${q.a % 10} AND ${q.b % 10}.` : `HMM. COUNT THE NETS OF TEN${q.carry ? ', PLUS THE CARRY' : ''}.`;
      msgUntil = t + 2.2; entry = '';
    }
  }
  publish();
}

function publish() { window.__shark = { step, q, entry, level: save.level, streak, hits: hits.map(h => ({ x: h.x, y: h.y, w: h.w, h: h.h, id: h.id })) }; }

// ----- drawing -----
const COLX = { h: 44, t: 62, o: 80 }; // digit column x (scale 2 digits, 11 px wide)

function drawProblem() {
  panel(8, 15, 100, 64, '#eaf6ff');
  const colHi = step === 'ones' || step === 'onesShown' ? COLX.o : step === 'tens' || step === 'tensShown' || step === 'carry' ? COLX.t : null;
  if (colHi !== null) rect(colHi - 2, 18, 15, 58, '#fff3b0');
  text('T', COLX.t + 3, 18, C.mid); text('O', COLX.o + 3, 18, C.mid);
  if (q.sum >= 100) text('H', COLX.h - 7, 18, C.mid);
  // Carry box flies from the ones answer up beside the tens column
  if ((step === 'carry' || step === 'tens' || step === 'tensShown' || step === 'reward') && q.carry) { const fly = step === 'carry' ? Math.min(1, Math.max(0, 1 - (msgUntil - t) / 2.2) * 1.6) : 1; const cx = COLX.o + (COLX.t - 12 - COLX.o) * fly, cy = 60 - fly * 44; box(cx, cy, 9, 9, C.fishY); text('1', cx + 2, cy + 1, C.line); }
  const digits = (n, y, color = C.line) => { const s = String(n); for (let i = 0; i < s.length; i++) { const col = s.length - 1 - i === 0 ? COLX.o : s.length - 1 - i === 1 ? COLX.t : COLX.h; text(s[i], col, y, color, { scale: 2 }); } };
  digits(q.a, 26); digits(q.b, 42); text('+', 24, 42, C.line, { scale: 2 });
  rect(22, 57, 74, 2, C.line);
  // Answer row
  const onesKnown = ['carry', 'tens', 'tensShown', 'reward'].includes(step);
  const tensKnown = step === 'reward';
  const ay = 61;
  const oneStr = onesKnown ? String(q.onesDigit) : (step === 'ones' && entry ? entry.slice(-1) : '?');
  text(oneStr, COLX.o, ay, onesKnown ? '#1a7f3c' : C.mid, { scale: 2 });
  if (tensKnown) { const ts = String(q.tensSum); text(ts[ts.length - 1], COLX.t, ay, '#1a7f3c', { scale: 2 }); if (ts.length > 1) text(ts[0], COLX.h, ay, '#1a7f3c', { scale: 2 }); }
  else if (step === 'tens' && entry) { text(entry[entry.length - 1], COLX.t, ay, C.mid, { scale: 2 }); if (entry.length > 1) text(entry[0], COLX.h, ay, C.mid, { scale: 2 }); }
  else text('?', COLX.t, ay, C.mid, { scale: 2 });
}

function drawFishPanel() {
  panel(116, 15, 196, 64, '#eaf6ff');
  const onesStep = step === 'ones' || step === 'onesShown';
  const tensStep = ['carry', 'tens', 'tensShown'].includes(step);
  const row = (n, y, label, carryNet) => {
    text(label, 122, y + 4, C.line, { scale: 1 });
    const tens = Math.floor(n / 10), ones = n % 10;
    let x = 140;
    for (let i = 0; i < tens; i++) { ctx.globalAlpha = onesStep ? 0.3 : 1; drawTenBar(x, y, tensStep, t); x += 17; ctx.globalAlpha = 1; }
    if (carryNet) { text('+', x + 1, y + 1, C.fishR); drawTenBar(x + 8, y, tensStep, t); }
    x = 140;
    for (let i = 0; i < ones; i++) { ctx.globalAlpha = onesStep || step === 'reward' ? 1 : 0.3; if (onesStep) { ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(x - 1, y + 9, 10, 9); } drawFish(x, y + 11, i % 2 ? C.fishY : C.fishO, t); x += 10; ctx.globalAlpha = 1; }
  };
  const showCarry = q.carry && ['carry', 'tens', 'tensShown', 'reward'].includes(step);
  row(q.a, 19, String(q.a), false); text('+', 122, 44, C.line); row(q.b, 49, String(q.b), showCarry);
  if (showCarry) text('CARRY', 300, 41, C.fishR, { align: 'center' });
}

function drawPrompt() {
  panel(8, 83, 304, 16, step === 'reward' ? '#dff5d0' : msg && t < msgUntil ? '#fff3b0' : '#ffffff');
  let s;
  if (msg && t < msgUntil) s = msg;
  else if (step === 'ones') s = `ADD THE ONES: ${q.a % 10} + ${q.b % 10} = ${entry || '?'}`;
  else if (step === 'tens') s = `ADD THE TENS: ${Math.floor(q.a / 10)} + ${Math.floor(q.b / 10)}${q.carry ? ' + 1' : ''} = ${entry || '?'}`;
  else s = '';
  const sc = textWidth(s) > 296 ? 1 : 1;
  text(s, 160, 87, C.line, { align: 'center', scale: sc });
}

function drawKeypad() {
  hits = [];
  for (let n = 0; n <= 9; n++) {
    const x = 4 + n * 31, y = 104;
    panel(x, y, 28, 22, C.fishY); text(String(n), x + 14, y + 7, C.line, { align: 'center' });
    hits.push({ x, y, w: 28, h: 22, id: 'd' + n, fn: () => digit(n) });
  }
  panel(60, 130, 84, 20, '#ffd6d6'); text('CLEAR', 102, 136, C.line, { align: 'center' }); hits.push({ x: 60, y: 130, w: 84, h: 20, id: 'clear', fn: clear });
  panel(176, 130, 84, 20, '#9be07d'); text('GO!', 218, 136, C.line, { align: 'center' }); hits.push({ x: 176, y: 130, w: 84, h: 20, id: 'go', fn: go });
  panel(268, 130, 44, 20, '#dfe9f0'); text(save.muted ? 'MUTE' : 'SOUND', 290, 136, C.line, { align: 'center' }); hits.push({ x: 268, y: 130, w: 44, h: 20, id: 'mute', fn: () => { save.muted = !save.muted; setMuted(save.muted); storeSave(save); } });
}

function drawTopBar() {
  ctx.fillStyle = 'rgba(11,42,69,0.6)'; ctx.fillRect(0, 0, PW, 13);
  outlined('SHARK SUMS', 40, 3, C.fishY, 1, 'center');
  text(`LEVEL ${save.level}/${MAX_LEVEL}`, 160, 3, '#ffffff', { align: 'center' });
  text(`FISH ${save.fish}  STREAK ${streak}`, 314, 3, '#ffffff', { align: 'right' });
}

function drawStart() {
  drawSea(t);
  drawShark(160 + Math.sin(t) * 20, 96, { t, expr: 'happy', mouth: 0.2 + Math.abs(Math.sin(t * 2)) * 0.3 });
  for (let i = 0; i < 6; i++) drawFish(40 + i * 45 + Math.sin(t + i) * 8, 40 + (i % 2) * 14, [C.fishY, C.fishO, C.fishR][i % 3], t);
  outlined('SHARK SUMS', 160, 20, C.fishY, 3);
  outlined('TWO-DIGIT ADDING', 160, 46, '#ffffff', 1);
  if (Math.floor(t * 2) % 2) outlined('TAP TO START', 160, 128, '#ffffff', 2);
  outlined('LEVEL:', 92, 152, '#ffffff', 1, 'right');
  for (let L = 1; L <= MAX_LEVEL; L++) { const x = 100 + (L - 1) * 26; panel(x, 148, 22, 14, L === save.level ? C.fishY : '#dfe9f0'); text(String(L), x + 11, 152, C.line, { align: 'center' }); hits.push({ x, y: 148, w: 22, h: 14, id: 'L' + L, fn: () => { save.level = L; save.correct = 0; save.wrong = 0; storeSave(save); sfx.tap(); } }); }
  if (save.fish) text(`FISH EATEN: ${save.fish}   BEST STREAK: ${save.best}`, 160, 168, '#ffffff', { align: 'center' });
}

function frame(now) {
  t = now / 1000;
  hits = [];
  if (step === 'start') { hits.push({ x: 0, y: 0, w: PW, h: PH, id: 'start', fn: start }); drawStart(); publish(); requestAnimationFrame(frame); return; }
  if (step === 'reward') {
    const p = (t - reward.t0) / reward.dur;
    if (p >= 1) { newProblem(); requestAnimationFrame(frame); return; }
    drawReward(reward.gag, p, q, t, streak);
    drawTopBar();
    if (levelFlash && p > 0.4) outlined(levelFlash, 160, 100, '#ffffff', 2);
    hits.push({ x: 0, y: 0, w: PW, h: PH, id: 'skip', fn: () => { if (p > 0.6) newProblem(); } });
    requestAnimationFrame(frame); return;
  }
  // Step timers
  if (step === 'carry' && t >= msgUntil) { step = 'tens'; msg = ''; publish(); }
  if (step === 'onesShown' && t >= msgUntil) { entry = ''; misses = 0; step = q.carry ? 'carry' : 'tens'; if (q.carry) { msgUntil = t + 2.2; msg = `${q.onesSum} IS 1 TEN AND ${q.onesDigit} ONES. WRITE ${q.onesDigit}, CARRY THE 1.`; } else msg = ''; publish(); }
  if (step === 'tensShown' && t >= msgUntil) { misses = 0; step = 'reward'; reward = { gag: 'shades', t0: t, dur: 2.4 }; entry = ''; publish(); }

  drawSea(t);
  // Shark swims along the bottom, watching
  const sx = 160 + Math.sin(t * 0.5) * 120, dir = Math.cos(t * 0.5) < 0;
  drawShark(sx, 160, { t, flip: dir, expr: msg && t < msgUntil && misses ? 'puzzled' : 'normal', mouth: 0.1, scale: 0.7 });
  drawTopBar(); drawProblem(); drawFishPanel(); drawPrompt(); drawKeypad();
  publish();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
