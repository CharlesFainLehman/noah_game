// Small self-contained engine: 960x540 vector canvas scaled to fit, text helpers, rng, sound, save.
export const W = 960, H = 540;
export const canvas = document.getElementById('screen');
export const ctx = canvas.getContext('2d');
const dpr = Math.min(2, window.devicePixelRatio || 1);
canvas.width = W * dpr; canvas.height = H * dpr;
ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

function fit() {
  const s = Math.min(innerWidth / W, innerHeight / H);
  document.getElementById('stage').style.transform = `translate(${Math.floor((innerWidth - W * s) / 2)}px, ${Math.floor((innerHeight - H * s) / 2)}px) scale(${s})`;
}
addEventListener('resize', fit); fit();

export function toLocal(e) {
  const r = canvas.getBoundingClientRect();
  return { x: (e.clientX - r.left) / r.width * W, y: (e.clientY - r.top) / r.height * H };
}

export const FONT = '"Chalkboard SE", "Comic Sans MS", "Marker Felt", "Trebuchet MS", "Segoe UI", sans-serif';
export const INK = '#1d2b4a';

export function font(size, weight = 'bold') { ctx.font = `${weight} ${size}px ${FONT}`; }
// Text with an outline. align: left|center|right. Baseline middle.
export function label(str, x, y, { size = 28, fill = '#ffffff', stroke = INK, width = 0, align = 'center', weight = 'bold' } = {}) {
  font(size, weight); ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  if (width) { ctx.lineWidth = width; ctx.strokeStyle = stroke; ctx.strokeText(str, x, y); }
  ctx.fillStyle = fill; ctx.fillText(str, x, y);
}
export function measure(str, size, weight = 'bold') { font(size, weight); return ctx.measureText(str).width; }

// Rounded rectangle path.
export function rr(x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
export function card(x, y, w, h, fill = '#ffffff', { r = 22, stroke = INK, width = 5, shadow = true } = {}) {
  if (shadow) { ctx.fillStyle = 'rgba(0,0,0,0.25)'; rr(x + 6, y + 8, w, h, r); ctx.fill(); }
  rr(x, y, w, h, r); ctx.fillStyle = fill; ctx.fill();
  if (width) { ctx.lineWidth = width; ctx.strokeStyle = stroke; ctx.stroke(); }
}
export function circle(x, y, r, fill, stroke = null, width = 5) {
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill();
  if (stroke) { ctx.lineWidth = width; ctx.strokeStyle = stroke; ctx.stroke(); }
}
export function ellipse(x, y, rx, ry, fill, stroke = null, width = 5, rot = 0) {
  ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill();
  if (stroke) { ctx.lineWidth = width; ctx.strokeStyle = stroke; ctx.stroke(); }
}
export function poly(pts, fill, stroke = null, width = 5) {
  ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath();
  ctx.fillStyle = fill; ctx.fill(); if (stroke) { ctx.lineJoin = 'round'; ctx.lineWidth = width; ctx.strokeStyle = stroke; ctx.stroke(); }
}

export { makeRng } from './engine-rng.js';

// ---- sound ----
let ac = null, muted = false;
export function setMuted(m) { muted = m; }
export function unlockAudio() {
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    if (ac.state === 'suspended') ac.resume();
    const b = ac.createBuffer(1, 1, 22050), src = ac.createBufferSource(); src.buffer = b; src.connect(ac.destination); src.start(0);
  } catch (e) { /* no audio */ }
}
for (const ev of ['pointerup', 'touchend', 'keydown', 'click']) addEventListener(ev, unlockAudio, { passive: true });
export const audioState = () => (ac ? ac.state : 'none');
function tone(freq, dur, type = 'triangle', vol = 0.08, delay = 0) {
  if (muted) return;
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    if (ac.state === 'suspended') ac.resume();
    const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + delay;
    o.type = type; o.frequency.value = freq; g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + dur);
  } catch (e) { /* no audio */ }
}
export const sfx = {
  tap() { tone(660, 0.06, 'sine', 0.06); },
  good() { [523, 659, 784].forEach((f, i) => tone(f, 0.16, 'triangle', 0.08, i * 0.09)); },
  bad() { tone(220, 0.22, 'sawtooth', 0.04); tone(170, 0.28, 'sawtooth', 0.04, 0.14); },
  chomp() { tone(110, 0.14, 'square', 0.1); tone(70, 0.2, 'sawtooth', 0.09, 0.09); },
  fanfare() { [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone(f, 0.18, 'triangle', 0.08, i * 0.11)); },
  burp() { for (let i = 0; i < 9; i++) tone(85 + i * 5, 0.09, 'sawtooth', 0.08, i * 0.05); },
  bubble() { tone(900, 0.07, 'sine', 0.06); tone(1300, 0.09, 'sine', 0.05, 0.07); },
  carry() { tone(880, 0.1, 'triangle', 0.07); tone(1175, 0.12, 'triangle', 0.07, 0.1); },
};

// ---- save ----
const KEY = 'sharksums.v1';
export function loadSave() {
  try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.v === 1) return s; } catch (e) { /* ignore */ }
  return { v: 1, level: 1, fish: 0, best: 0, correct: 0, wrong: 0, muted: false };
}
export function storeSave(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* ignore */ } }
