// Small self-contained engine: 320x180 pixel canvas scaled to fit, bitmap font, seeded rng, sound, save.
export const PW = 320, PH = 180;

export const canvas = document.getElementById('screen');
export const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

function fit() {
  const s = Math.min(innerWidth / 960, innerHeight / 540);
  const stage = document.getElementById('stage');
  stage.style.transform = `translate(${Math.floor((innerWidth - 960 * s) / 2)}px, ${Math.floor((innerHeight - 540 * s) / 2)}px) scale(${s})`;
}
addEventListener('resize', fit); fit();

export function toLocal(e) {
  const r = canvas.getBoundingClientRect();
  return { x: (e.clientX - r.left) / r.width * PW, y: (e.clientY - r.top) / r.height * PH };
}

export const rect = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
export const box = (x, y, w, h, fill, line = '#0b2a45') => { rect(x, y, w, h, line); rect(x + 1, y + 1, w - 2, h - 2, fill); };
export function panel(x, y, w, h, fill, line = '#0b2a45') {
  ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(x + 2, y + 2, w, h);
  box(x, y, w, h, fill, line);
  rect(x + 1, y + 1, w - 2, 1, 'rgba(255,255,255,0.6)'); rect(x + 1, y + 1, 1, h - 2, 'rgba(255,255,255,0.6)');
  rect(x + 1, y + h - 2, w - 2, 1, 'rgba(0,0,0,0.15)'); rect(x + w - 2, y + 1, 1, h - 2, 'rgba(0,0,0,0.15)');
}
export function ellipse(cx, cy, rx, ry, c) { ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); ctx.fill(); }
export function poly(pts, c) { ctx.fillStyle = c; ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); ctx.fill(); }

// ---- 5x7 bitmap font ----
const G = {
A:['.###.','#...#','#...#','#####','#...#','#...#','#...#'],B:['####.','#...#','#...#','####.','#...#','#...#','####.'],C:['.####','#....','#....','#....','#....','#....','.####'],D:['####.','#...#','#...#','#...#','#...#','#...#','####.'],E:['#####','#....','#....','####.','#....','#....','#####'],F:['#####','#....','#....','####.','#....','#....','#....'],G:['.####','#....','#....','#.###','#...#','#...#','.####'],H:['#...#','#...#','#...#','#####','#...#','#...#','#...#'],I:['#####','..#..','..#..','..#..','..#..','..#..','#####'],J:['....#','....#','....#','....#','#...#','#...#','.###.'],K:['#...#','#..#.','#.#..','##...','#.#..','#..#.','#...#'],L:['#....','#....','#....','#....','#....','#....','#####'],M:['#...#','##.##','#.#.#','#...#','#...#','#...#','#...#'],N:['#...#','##..#','#.#.#','#..##','#...#','#...#','#...#'],O:['.###.','#...#','#...#','#...#','#...#','#...#','.###.'],P:['####.','#...#','#...#','####.','#....','#....','#....'],Q:['.###.','#...#','#...#','#...#','#.#.#','#..#.','.##.#'],R:['####.','#...#','#...#','####.','#.#..','#..#.','#...#'],S:['.####','#....','#....','.###.','....#','....#','####.'],T:['#####','..#..','..#..','..#..','..#..','..#..','..#..'],U:['#...#','#...#','#...#','#...#','#...#','#...#','.###.'],V:['#...#','#...#','#...#','#...#','#...#','.#.#.','..#..'],W:['#...#','#...#','#...#','#.#.#','#.#.#','##.##','#...#'],X:['#...#','#...#','.#.#.','..#..','.#.#.','#...#','#...#'],Y:['#...#','#...#','.#.#.','..#..','..#..','..#..','..#..'],Z:['#####','....#','...#.','..#..','.#...','#....','#####'],
'0':['.###.','#...#','#..##','#.#.#','##..#','#...#','.###.'],'1':['..#..','.##..','..#..','..#..','..#..','..#..','.###.'],'2':['.###.','#...#','....#','...#.','..#..','.#...','#####'],'3':['####.','....#','....#','.###.','....#','....#','####.'],'4':['...#.','..##.','.#.#.','#..#.','#####','...#.','...#.'],'5':['#####','#....','#....','####.','....#','....#','####.'],'6':['.###.','#....','#....','####.','#...#','#...#','.###.'],'7':['#####','....#','...#.','..#..','.#...','.#...','.#...'],'8':['.###.','#...#','#...#','.###.','#...#','#...#','.###.'],'9':['.###.','#...#','#...#','.####','....#','....#','.###.'],
'+':['.....','..#..','..#..','#####','..#..','..#..','.....'],'-':['.....','.....','.....','#####','.....','.....','.....'],'=':['.....','.....','#####','.....','#####','.....','.....'],'?':['.###.','#...#','....#','...#.','..#..','.....','..#..'],'!':['..#..','..#..','..#..','..#..','..#..','.....','..#..'],'.':['.....','.....','.....','.....','.....','.##..','.##..'],',':['.....','.....','.....','.....','.##..','..#..','.#...'],"'":['..#..','..#..','.....','.....','.....','.....','.....'],':':['.....','.##..','.##..','.....','.##..','.##..','.....'],'/':['....#','....#','...#.','..#..','.#...','#....','#....'],'<':['....#','...#.','..#..','.#...','..#..','...#.','....#'],'>':['#....','.#...','..#..','...#.','..#..','.#...','#....'],' ':['.....','.....','.....','.....','.....','.....','.....'],'_':['.....','.....','.....','.....','.....','.....','#####'],
};
export function textWidth(str, scale = 1) { return String(str).length * 6 * scale - scale; }
export function text(str, x, y, color = '#0b2a45', { scale = 1, align = 'left' } = {}) {
  str = String(str).toUpperCase();
  const w = textWidth(str, scale);
  if (align === 'center') x -= Math.floor(w / 2); else if (align === 'right') x -= w;
  ctx.fillStyle = color;
  for (const ch of str) {
    const g = G[ch] || G['?'];
    for (let j = 0; j < 7; j++) for (let i = 0; i < 5; i++) if (g[j][i] === '#') ctx.fillRect(Math.round(x + i * scale), Math.round(y + j * scale), scale, scale);
    x += 6 * scale;
  }
}
export function outlined(str, x, y, fill, scale = 1, align = 'center', line = '#0b2a45') {
  for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) text(str, x + dx, y + dy, line, { scale, align });
  text(str, x, y, fill, { scale, align });
}

export { makeRng } from './engine-rng.js';

// ---- sound ----
let ac = null, muted = false;
export function setMuted(m) { muted = m; }
// Browsers only start audio after a real user gesture. Touch-down may not count, so unlock on
// pointerup, touchend and keydown too, and play a silent blip to prime iOS.
export function unlockAudio() {
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    if (ac.state === 'suspended') ac.resume();
    const b = ac.createBuffer(1, 1, 22050), src = ac.createBufferSource(); src.buffer = b; src.connect(ac.destination); src.start(0);
  } catch (e) { /* no audio */ }
}
for (const ev of ['pointerup', 'touchend', 'keydown', 'click']) addEventListener(ev, unlockAudio, { passive: true });
export const audioState = () => (ac ? ac.state : 'none');
function tone(freq, dur, type = 'square', vol = 0.07, delay = 0) {
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
  tap() { tone(700, 0.05, 'square', 0.04); },
  good() { [523, 659, 784].forEach((f, i) => tone(f, 0.14, 'square', 0.06, i * 0.09)); },
  bad() { tone(200, 0.2, 'sawtooth', 0.05); tone(150, 0.25, 'sawtooth', 0.05, 0.12); },
  chomp() { tone(120, 0.12, 'square', 0.12); tone(80, 0.18, 'sawtooth', 0.1, 0.08); },
  fanfare() { [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone(f, 0.16, 'square', 0.06, i * 0.11)); },
  burp() { for (let i = 0; i < 8; i++) tone(90 + i * 6, 0.08, 'sawtooth', 0.08, i * 0.05); },
  bubble() { tone(900, 0.06, 'sine', 0.06); tone(1300, 0.08, 'sine', 0.05, 0.06); },
  carry() { tone(880, 0.08, 'triangle', 0.06); tone(1175, 0.1, 'triangle', 0.06, 0.08); },
};

// ---- save ----
const KEY = 'sharksums.v1';
export function loadSave() {
  try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.v === 1) return s; } catch (e) { /* ignore */ }
  return { v: 1, level: 1, fish: 0, best: 0, correct: 0, wrong: 0, muted: false };
}
export function storeSave(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* ignore */ } }
