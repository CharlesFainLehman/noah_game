// Shark Sums: two-digit column addition with a shark who celebrates. Cartoon look, simple controls.
import { ctx, canvas, W, H, toLocal, INK, label, measure, rr, card, circle, ellipse, poly, makeRng, sfx, setMuted, loadSave, storeSave } from './engine.js';
import { genProblem, record, MAX_LEVEL } from './logic.js';
import { C, drawSea, drawFish, drawTenNet, drawShark, drawReward, GAGS, speech } from './art.js';

const rng = makeRng();
const save = loadSave();
setMuted(save.muted);
let q, step = 'start', entry = '', streak = 0, misses = 0, t = 0, msg = '', msgUntil = 0, reward = null, hits = [], levelFlash = '';
let gagIndex = Math.floor(rng.next() * GAGS.length);

function newProblem() { q = genProblem(save.level, rng); step = 'ones'; entry = ''; misses = 0; msg = ''; publish(); }

// ----- input -----
canvas.addEventListener('pointerdown', e => {
  e.preventDefault();
  const p = toLocal(e);
  for (let i = hits.length - 1; i >= 0; i--) { const h = hits[i]; if (h.r ? Math.hypot(p.x - h.x, p.y - h.y) <= h.r : (p.x >= h.x && p.x < h.x + h.w && p.y >= h.y && p.y < h.y + h.h)) { h.fn(); return; } }
});
addEventListener('keydown', e => {
  if (step === 'start') { if (e.key === 'Enter' || e.key === ' ') start(); return; }
  if (e.key >= '0' && e.key <= '9') digit(Number(e.key));
  else if (e.key === 'Backspace') back();
  else if (e.key === 'Enter') go();
});
function start() { sfx.bubble(); newProblem(); }
function digit(n) { if (!['ones', 'tens'].includes(step) || entry.length >= 2) return; entry += n; sfx.tap(); publish(); }
function back() { entry = entry.slice(0, -1); sfx.tap(); }

function go() {
  if (entry === '' || !['ones', 'tens'].includes(step)) return;
  const want = step === 'ones' ? q.onesSum : q.tensSum;
  if (Number(entry) === want) {
    misses = 0;
    if (step === 'ones') {
      if (q.carry) { step = 'carry'; msgUntil = t + 2.4; sfx.carry(); msg = `${q.onesSum} is 1 ten and ${q.onesDigit} ones. Write the ${q.onesDigit}, carry the 1!`; }
      else { step = 'tens'; sfx.good(); msg = 'Ones done! Now add the tens.'; msgUntil = t + 1.3; }
      entry = '';
    } else {
      const change = record(save, true);
      streak++; save.fish += q.sum; save.best = Math.max(save.best, streak); storeSave(save);
      levelFlash = change === 'up' ? 'Level up!' : '';
      const gag = streak > 0 && streak % 5 === 0 ? 'surf' : GAGS.filter(g => g !== 'surf')[gagIndex++ % (GAGS.length - 1)];
      reward = { gag, t0: t, dur: gag === 'surf' ? 3.6 : 3.0 };
      step = 'reward'; entry = ''; sfx.chomp();
      if (gag === 'burp') setTimeout(() => sfx.burp(), 1200); else setTimeout(() => sfx.fanfare(), 900);
    }
  } else {
    misses++; streak = 0; sfx.bad();
    if (misses >= 2) {
      msg = step === 'ones' ? `The ones make ${q.onesSum}. See: ${q.a % 10} + ${q.b % 10} = ${q.onesSum}.` : `The tens make ${q.tensSum}. See: ${Math.floor(q.a / 10)} + ${Math.floor(q.b / 10)}${q.carry ? ' + 1' : ''} = ${q.tensSum}.`;
      msgUntil = t + 2.8; entry = String(want); step = step === 'ones' ? 'onesShown' : 'tensShown';
      record(save, false); storeSave(save);
    } else {
      msg = step === 'ones' ? `Hmm, not quite. Count the little fish: ${q.a % 10} and ${q.b % 10}.` : `Hmm, not quite. Count the nets of ten${q.carry ? ', and the carry' : ''}.`;
      msgUntil = t + 2.4; entry = '';
    }
  }
  publish();
}

function publish() { window.__shark = { step, q, entry, level: save.level, streak, hits: hits.map(h => ({ x: h.x, y: h.y, w: h.w, h: h.h, r: h.r, id: h.id })) }; }

// ----- drawing helpers -----
function wrap(str, maxW, size) { const words = str.split(' '), lines = []; let cur = ''; for (const w of words) { const test = cur ? cur + ' ' + w : w; if (measure(test, size) > maxW && cur) { lines.push(cur); cur = w; } else cur = test; } if (cur) lines.push(cur); return lines; }
function bubbleButton(x, y, r, str, fill, id, fn, size = 34) {
  ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.beginPath(); ctx.arc(x + 4, y + 6, r, 0, Math.PI * 2); ctx.fill();
  circle(x, y, r, fill, INK, 5); circle(x - r * 0.3, y - r * 0.35, r * 0.22, 'rgba(255,255,255,0.55)');
  label(str, x, y + 2, { size, fill: INK, width: 0 });
  hits.push({ x, y, r, id, fn });
}
function pillButton(x, y, w, h, str, fill, id, fn, size = 34) {
  card(x, y, w, h, fill, { r: h / 2 });
  ctx.fillStyle = 'rgba(255,255,255,0.45)'; rr(x + 10, y + 6, w - 20, h * 0.3, h * 0.15); ctx.fill();
  label(str, x + w / 2, y + h / 2 + 2, { size, fill: INK, width: 0 });
  hits.push({ x, y, w, h, id, fn });
}
function speaker(x, y, on) {
  poly([[x - 12, y - 6], [x - 4, y - 6], [x + 6, y - 15], [x + 6, y + 15], [x - 4, y + 6], [x - 12, y + 6]], INK);
  if (on) { ctx.strokeStyle = INK; ctx.lineWidth = 3; for (let i = 0; i < 2; i++) { ctx.beginPath(); ctx.arc(x + 6, y, 10 + i * 7, -0.9, 0.9); ctx.stroke(); } }
  else { ctx.strokeStyle = C.fishR; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x + 10, y - 8); ctx.lineTo(x + 24, y + 8); ctx.moveTo(x + 24, y - 8); ctx.lineTo(x + 10, y + 8); ctx.stroke(); }
}

// Column x positions for digits and answer boxes.
const COL = { h: 330, t: 386, o: 442 };
const CARD = { x: 220, y: 22, w: 540, h: 284 };

function drawWorksheet() {
  card(CARD.x, CARD.y, CARD.w, CARD.h, '#fffdf3');
  const onesStep = step === 'ones' || step === 'onesShown', tensStep = ['carry', 'tens', 'tensShown'].includes(step);
  const hiCol = onesStep ? COL.o : tensStep ? COL.t : null;
  if (hiCol !== null) { ctx.fillStyle = '#fff1a8'; rr(hiCol - 28, 40, 56, 244, 14); ctx.fill(); }
  label('tens', COL.t, 52, { size: 17, fill: '#7a8598', width: 0, weight: 'normal' });
  label('ones', COL.o, 52, { size: 17, fill: '#7a8598', width: 0, weight: 'normal' });
  if (q.sum >= 100) label('hundreds', COL.h - 10, 52, { size: 15, fill: '#7a8598', width: 0, weight: 'normal' });
  const digits = (n, y) => { const s = String(n); for (let i = 0; i < s.length; i++) { const col = s.length - 1 - i === 0 ? COL.o : s.length - 1 - i === 1 ? COL.t : COL.h; label(s[i], col, y, { size: 58, fill: INK, width: 0 }); } };
  digits(q.a, 96); digits(q.b, 158); label('+', 300, 158, { size: 50, fill: INK, width: 0 });
  ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(288, 196); ctx.lineTo(470, 196); ctx.stroke();
  // Answer boxes
  const onesKnown = ['carry', 'tens', 'tensShown', 'reward'].includes(step), tensKnown = step === 'reward';
  const boxAt = (col, str, known, active) => { rr(col - 27, 214, 54, 54, 12); ctx.fillStyle = known ? '#d6f5c9' : active ? '#ffffff' : '#f1f1f1'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = known ? '#3f9a4f' : INK; ctx.stroke(); if (str) label(str, col, 243, { size: 44, fill: known ? '#2f7f3f' : INK, width: 0 }); };
  boxAt(COL.o, onesKnown ? String(q.onesDigit) : (onesStep && entry ? entry.slice(-1) : ''), onesKnown, onesStep);
  const tensStr = tensKnown ? String(q.tensSum) : (step === 'tens' && entry ? entry : '');
  boxAt(COL.t, tensStr ? tensStr[tensStr.length - 1] : '', tensKnown, tensStep);
  if (q.sum >= 100 || tensStr.length > 1) boxAt(COL.h, tensStr.length > 1 ? tensStr[0] : '', tensKnown, tensStep);
  // Carry bubble flies from the ones box up beside the tens column
  if (q.carry && ['carry', 'tens', 'tensShown', 'reward'].includes(step)) {
    const fly = step === 'carry' ? Math.min(1, Math.max(0, 1 - (msgUntil - t) / 2.4) * 1.5) : 1;
    const ease = 1 - Math.pow(1 - fly, 3);
    const cx = COL.o + (COL.t - 34 - COL.o) * ease, cy = 240 - (240 - 62) * ease;
    circle(cx, cy, 16, C.fishY, INK, 4); label('1', cx, cy + 1, { size: 24, fill: INK, width: 0 });
  }
  // Fish visuals on the right: nets of ten in rows of five, single fish below.
  const block = (n, top, faded, carryNet) => {
    const tens = Math.floor(n / 10), ones = n % 10;
    ctx.save(); ctx.globalAlpha = faded.nets ? 0.3 : 1;
    for (let i = 0; i < tens; i++) drawTenNet(486 + (i % 5) * 50, top + Math.floor(i / 5) * 30, tensStep && !faded.nets, t);
    if (carryNet) { const i = tens; label('+', 486 + (i % 5) * 50 - 6, top + Math.floor(i / 5) * 30 + 15, { size: 22, fill: C.fishR, width: 0 }); ctx.save(); ctx.translate(6, 0); drawTenNet(486 + (i % 5) * 50, top + Math.floor(i / 5) * 30, step === 'tens', t); ctx.restore(); }
    ctx.restore();
    ctx.save(); ctx.globalAlpha = faded.fish ? 0.3 : 1;
    if (onesStep) { ctx.fillStyle = 'rgba(255,241,168,0.9)'; rr(478, top + 66, 12 + ones * 24, 30, 10); ctx.fill(); }
    for (let i = 0; i < ones; i++) drawFish(492 + i * 24, top + 81, i % 2 ? C.fishY : C.fishO, t, 0.62);
    ctx.restore();
  };
  const faded = { nets: onesStep, fish: tensStep };
  const showCarry = q.carry && ['carry', 'tens', 'tensShown', 'reward'].includes(step);
  block(q.a, 44, faded, false); block(q.b, 168, faded, showCarry);
}

function drawSharkTalk(text, mood) {
  const bob = Math.sin(t * 2) * 5;
  drawShark(150, 430 + bob, { t, expr: mood, mouth: 0.08, flip: true, scale: 0.95 });
  if (!text) return;
  const lines = wrap(text, 420, 26);
  const h = 30 + lines.length * 30;
  speech(280, 386 - h, 470, h, 250, 405 + bob, msg && t < msgUntil ? '#fff6c8' : '#ffffff');
  lines.forEach((ln, i) => label(ln, 515, 386 - h + 24 + i * 30, { size: 26, fill: INK, width: 0 }));
}

function drawControls() {
  for (let n = 0; n <= 9; n++) bubbleButton(352 + n * 62, 482, 28, String(n), C.fishY, 'd' + n, () => digit(n), 32);
  pillButton(790, 322, 150, 70, 'GO!', '#8fe08f', 'go', go, 40);
  bubbleButton(742, 357, 26, '⌫', '#ffd6d6', 'back', back, 24);
  circle(924, 36, 24, '#ffffff', INK, 4); speaker(924, 36, !save.muted);
  hits.push({ x: 924, y: 36, r: 26, id: 'mute', fn: () => { save.muted = !save.muted; setMuted(save.muted); storeSave(save); } });
}

function drawStatus() {
  card(16, 14, 150, 40, '#ffffff', { r: 20, width: 4, shadow: false });
  label(`Level ${save.level}`, 91, 36, { size: 22, fill: INK, width: 0 });
  card(16, 62, 150, 40, '#ffffff', { r: 20, width: 4, shadow: false });
  drawFish(46, 82, C.fishY, t, 0.6);
  label(String(save.fish), 120, 84, { size: 22, fill: INK, width: 0 });
  if (streak > 1) { card(16, 110, 150, 40, '#ffffff', { r: 20, width: 4, shadow: false }); label(`${streak} in a row!`, 91, 132, { size: 20, fill: '#2f7f3f', width: 0 }); }
}

function drawStart() {
  drawSea(t);
  drawShark(480, 300 + Math.sin(t * 1.5) * 10, { t, expr: 'happy', mouth: 0.15 + Math.abs(Math.sin(t * 2)) * 0.25, scale: 1.5 });
  for (let i = 0; i < 6; i++) drawFish(120 + i * 150 + Math.sin(t + i) * 20, 150 + (i % 2) * 40, [C.fishY, C.fishO, C.fishR][i % 3], t, 1.1);
  label('Shark Sums', 480, 80, { size: 92, fill: C.fishY, width: 14 });
  label('Two-digit adding', 480, 140, { size: 30, fill: '#ffffff', width: 7 });
  pillButton(360, 420, 240, 76, 'Play!', '#8fe08f', 'start', start, 44);
  label('Start at level', 200, 458, { size: 24, fill: '#ffffff', width: 6 });
  for (let L = 1; L <= MAX_LEVEL; L++) bubbleButton(640 + (L - 1) * 62, 458, 26, String(L), L === save.level ? C.fishY : '#ffffff', 'L' + L, () => { save.level = L; save.correct = 0; save.wrong = 0; storeSave(save); sfx.tap(); }, 26);
  if (save.fish) label(`Fish eaten: ${save.fish}   Best streak: ${save.best}`, 480, 520, { size: 20, fill: '#ffffff', width: 5 });
}

function frame(now) {
  t = now / 1000;
  hits = [];
  if (step === 'start') { drawStart(); publish(); requestAnimationFrame(frame); return; }
  if (step === 'reward') {
    const p = (t - reward.t0) / reward.dur;
    if (p >= 1) { newProblem(); requestAnimationFrame(frame); return; }
    drawReward(reward.gag, p, q, t, streak);
    if (levelFlash && p > 0.4) label(levelFlash, 480, 270, { size: 60, fill: '#ffffff', width: 10 });
    hits.push({ x: 0, y: 0, w: W, h: H, id: 'skip', fn: () => { if (p > 0.6) newProblem(); } });
    publish(); requestAnimationFrame(frame); return;
  }
  if (step === 'carry' && t >= msgUntil) { step = 'tens'; msg = ''; publish(); }
  if (step === 'onesShown' && t >= msgUntil) { entry = ''; misses = 0; step = q.carry ? 'carry' : 'tens'; if (q.carry) { msgUntil = t + 2.4; msg = `${q.onesSum} is 1 ten and ${q.onesDigit} ones. Write the ${q.onesDigit}, carry the 1!`; } else msg = ''; publish(); }
  if (step === 'tensShown' && t >= msgUntil) { misses = 0; step = 'reward'; reward = { gag: 'shades', t0: t, dur: 2.4 }; entry = ''; publish(); }

  drawSea(t);
  drawStatus();
  drawWorksheet();
  let say;
  if (msg && t < msgUntil) say = msg;
  else if (step === 'ones') say = `Add the ones! ${q.a % 10} + ${q.b % 10} = ${entry || '?'}`;
  else if (step === 'tens') say = `Add the tens! ${Math.floor(q.a / 10)} + ${Math.floor(q.b / 10)}${q.carry ? ' + 1' : ''} = ${entry || '?'}`;
  drawSharkTalk(say, msg && t < msgUntil && misses ? 'puzzled' : 'normal');
  drawControls();
  publish();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
