// Pixel characters, 40x56, drawn procedurally with shading, then cached.
// Every species shares one body; ears, tails, muzzles, hats and props differ.
import { sprite } from '../engine/pixel.js';

export const CW = 40, CH = 56;
const K = '#2b1b0e';

// ---- color helpers ----
function hex(c) { return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)]; }
function rgb([r, g, b]) { return '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join(''); }
export function shade(c, f) { return rgb(hex(c).map(v => v * f)); }
export function tint(c, f) { return rgb(hex(c).map(v => v + (255 - v) * f)); }

// ---- grid drawing (characters as letters, resolved through a palette) ----
function grid(w, h) { return Array.from({ length: h }, () => Array(w).fill('.')); }
const inside = (g, x, y) => y >= 0 && y < g.length && x >= 0 && x < g[0].length;
function put(g, x, y, ch) { x = Math.floor(x); y = Math.floor(y); if (inside(g, x, y)) g[y][x] = ch; }

// Filled ellipse with outline and top-left lighting. fill letters: base, light, dark.
function ellipse(g, cx, cy, rx, ry, base, { light, dark, outline = 'k', lightBias = 0.5 } = {}) {
  const x0 = Math.floor(cx - rx - 1), x1 = Math.ceil(cx + rx + 1), y0 = Math.floor(cy - ry - 1), y1 = Math.ceil(cy + ry + 1);
  const d = (x, y) => ((x + 0.5 - cx) / rx) ** 2 + ((y + 0.5 - cy) / ry) ** 2;
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    if (d(x, y) > 1) continue;
    const edge = d(x + 1, y) > 1 || d(x - 1, y) > 1 || d(x, y + 1) > 1 || d(x, y - 1) > 1;
    if (edge && outline) { put(g, x, y, outline); continue; }
    const nx = (x + 0.5 - cx) / rx, ny = (y + 0.5 - cy) / ry, dd = d(x, y);
    let ch = base;
    if (dark && (nx * 0.45 + ny * 0.75 > 0.42 && dd > 0.35)) ch = dark;
    if (light && (-nx * 0.5 - ny * 0.7 > lightBias && dd > 0.15 && dd < 0.7)) ch = light;
    put(g, x, y, ch);
  }
}
function rect(g, x, y, w, h, ch) { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) put(g, x + i, y + j, ch); }
function box(g, x, y, w, h, fill, outline = 'k') { rect(g, x, y, w, h, outline); rect(g, x + 1, y + 1, w - 2, h - 2, fill); }
// Triangle from three points, with outline.
function tri(g, pts, fill, outline = 'k', dark) {
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  const [x0, x1, y0, y1] = [Math.floor(Math.min(...xs)), Math.ceil(Math.max(...xs)), Math.floor(Math.min(...ys)), Math.ceil(Math.max(...ys))];
  const insideT = (px, py) => {
    const [[ax, ay], [bx, by], [cx, cy]] = pts;
    const s1 = (bx - ax) * (py - ay) - (by - ay) * (px - ax), s2 = (cx - bx) * (py - by) - (cy - by) * (px - bx), s3 = (ax - cx) * (py - cy) - (ay - cy) * (px - cx);
    return (s1 >= 0 && s2 >= 0 && s3 >= 0) || (s1 <= 0 && s2 <= 0 && s3 <= 0);
  };
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    if (!insideT(x + 0.5, y + 0.5)) continue;
    const edge = !insideT(x + 1.5, y + 0.5) || !insideT(x - 0.5, y + 0.5) || !insideT(x + 0.5, y + 1.5) || !insideT(x + 0.5, y - 0.5);
    put(g, x, y, edge && outline ? outline : (dark && x > (x0 + x1) / 2 + 1 ? dark : fill));
  }
}
function stamp(g, rows, x, y) { rows.forEach((r, j) => [...r].forEach((ch, i) => { if (ch !== '.') put(g, x + i, y + j, ch); })); }

// ---- species ----
// Colors: h head, b body, y belly, f feet, e ear, i inner ear, m muzzle, x hat/prop, n nose, plus derived shades.
export const SPECIES = {
  basset:   { label: 'Bart',        h: '#b5773f', b: '#b5773f', y: '#f1dfc0', e: '#7a4a22', m: '#f1dfc0', n: K, x: '#8b5a2b', ears: 'droop', muzzle: true, hat: 'deer', vest: '#5a7a3a', sleepy: true },
  goose:    { label: 'Chef Gaston', h: '#ffffff', b: '#ffffff', y: '#f4f4f4', f: '#f0842c', n: '#f0842c', x: '#7fd1f5', beak: 'goose', hat: 'chef', apron: '#7fd1f5', neck: true, scarf: '#e0453b' },
  pigeon:   { label: 'Pip',         h: '#6f7a8f', b: '#8e97a8', y: '#b8bfcc', f: '#f0842c', n: '#f0842c', x: '#c58b4a', beak: 'small', wings: true, bag: true, sheen: '#5fae7a' },
  otter:    { label: 'Otto',        h: '#8a5a3a', b: '#8a5a3a', y: '#d9b98c', i: '#d9b98c', m: '#d9b98c', n: K, ears: 'round', muzzle: true, whiskers: true, tail: 'otter', vest: '#e0453b' },
  squirrel: { label: 'Mrs. Nutley', h: '#c0652d', b: '#c0652d', y: '#f6e2c0', i: '#f6b8c8', m: '#f6e2c0', n: K, ears: 'tuft', muzzle: true, tail: 'squirrel', glasses: true, apron: '#4e9a35' },
  fox:      { label: 'Fox',         h: '#f0842c', b: '#f0842c', y: '#fff2dc', i: '#fff2dc', m: '#fff2dc', n: K, ears: 'point', muzzle: true, tail: 'fox' },
  rabbit:   { label: 'Rabbit',      h: '#c9c6d9', b: '#c9c6d9', y: '#ffffff', i: '#f6b8c8', n: '#f08aa8', ears: 'long', teeth: true, whiskers: true },
  hedgehog: { label: 'Hedgehog',    h: '#e8caa0', b: '#c99a63', y: '#f5e6cc', i: '#f5e6cc', n: K, ears: 'round', spikes: '#6f4a2a' },
  cat:      { label: 'Cat',         h: '#f2a33a', b: '#f2a33a', y: '#fff2dc', i: '#f6b8c8', n: '#f08aa8', ears: 'point', whiskers: true, stripes: '#c67a1c', tail: 'cat' },
  raccoon:  { label: 'Nibbles',     h: '#a5a5a5', b: '#8e8e8e', y: '#d8d8d8', i: '#d8d8d8', n: K, ears: 'round', mask: '#3a3a3a', tail: 'raccoon' },
  heron:    { label: 'Ms. Heron',   h: '#9fb3c8', b: '#8fa3b8', y: '#dfe6ee', f: '#f0842c', n: '#f0842c', beak: 'long', glasses: true, crest: '#5d6470', thinLegs: true },
  penguin:  { label: 'Mayor Waddlesworth', h: '#2f3342', b: '#2f3342', y: '#ffffff', f: '#f0842c', n: '#f0842c', beak: 'small', facePatch: '#ffffff', bowtie: '#e0453b', wings: true },
  turtle:   { label: 'Captain Mabel', h: '#7fb069', b: '#7fb069', y: '#cfe3a8', n: K, shell: '#8b5a2b', glasses: true, hat: 'captain' },
  peacock:  { label: 'Priscilla',   h: '#2f9e8f', b: '#2f9e8f', y: '#9fe3d8', f: '#f0842c', n: '#f0842c', beak: 'small', fan: '#3b6fd6', crest: '#3b6fd6' },
  beaver:   { label: 'Bruno',       h: '#8a5a3a', b: '#8a5a3a', y: '#d9b98c', i: '#d9b98c', m: '#d9b98c', n: K, x: '#ffcc4d', ears: 'round', muzzle: true, teeth: true, tail: 'flat', hat: 'hard' },
};

// Geometry: head center (20, 21) radii 14x13. Body center (20, 40) radii 11x10. Feet at y 55.
const HX = 20, HY = 21, HRX = 14, HRY = 13;

function palette(S) {
  const p = { k: K, w: '#ffffff', r: '#c0392b', c: 'rgba(240,110,110,0.45)', g: '#f0842c', s: '#5d6470' };
  const add = (key, col, up = 0.22, down = 0.8) => { if (!col) return; p[key] = col; p[key.toUpperCase()] = shade(col, down); p[key + '2'] = tint(col, up); };
  add('h', S.h); add('b', S.b); add('y', S.y, 0.15, 0.88); add('e', S.e || S.h); add('m', S.m); add('x', S.x || '#8b5a2b'); add('t', S.tail === 'fox' ? S.b : S.b);
  p.f = S.f || S.y || S.b; p.F = shade(p.f, 0.8); p.i = S.i || '#f6b8c8'; p.n = S.n || K;
  p.v = S.vest; p.V = S.vest && shade(S.vest, 0.75); p.a = S.apron; p.A = S.apron && shade(S.apron, 0.8);
  p.q = S.spikes; p.Q = S.spikes && shade(S.spikes, 0.75); p.d = S.mask || S.stripes || S.crest || S.fan || S.shell; p.D = p.d && shade(p.d, 0.75); p.d2 = p.d && tint(p.d, 0.25);
  p.z = S.sheen; p.o = S.bowtie || S.scarf; p.O = p.o && shade(p.o, 0.75); p.fp = S.facePatch;
  return p;
}

function drawBody(g, S) {
  // Tail behind
  switch (S.tail) {
    case 'fox': ellipse(g, 31, 46, 8, 5, 't', { light: 't2', dark: 'T' }); ellipse(g, 36, 44, 3, 2.5, 'w', { outline: 'k' }); break;
    case 'squirrel': ellipse(g, 32, 30, 6, 16, 't', { light: 't2', dark: 'T' }); ellipse(g, 32, 30, 2, 11, 't2', { outline: null }); break;
    case 'cat': ellipse(g, 32, 44, 7, 3, 't', { dark: 'T' }); ellipse(g, 37, 38, 2.5, 6, 't', { dark: 'T' }); put(g, 37, 35, 'd'); put(g, 37, 40, 'd'); put(g, 36, 40, 'd'); break;
    case 'otter': ellipse(g, 32, 48, 7, 3.5, 't', { dark: 'T' }); break;
    case 'raccoon': ellipse(g, 32, 46, 8, 4.5, 't', { dark: 'T' }); rect(g, 30, 43, 2, 6, 'd'); rect(g, 35, 43, 2, 5, 'd'); break;
    case 'flat': ellipse(g, 32, 49, 8, 4, 'x', { dark: 'X', outline: 'k' }); for (let i = 0; i < 4; i++) { put(g, 27 + i * 3, 48, 'X'); put(g, 28 + i * 3, 50, 'X'); } break;
  }
  if (S.shell) { ellipse(g, 20, 40, 15, 12, 'd', { light: 'd2', dark: 'D' }); for (const [x, y] of [[12, 36], [20, 33], [28, 36], [16, 43], [24, 43]]) box(g, x - 2, y - 1, 5, 4, 'd2', 'D'); }
  if (S.fan) {
    ellipse(g, 20, 22, 19, 20, 'd', { light: 'd2', dark: 'D' });
    for (const [x, y] of [[6, 14], [12, 6], [20, 3], [28, 6], [34, 14], [4, 26], [36, 26]]) { ellipse(g, x, y, 2.5, 2.5, 'g', { outline: 'D' }); put(g, x, y, 'k'); }
  }
  if (S.spikes) { for (let a = 200; a <= 340; a += 17) { const r = a * Math.PI / 180; tri(g, [[HX + Math.cos(r - 0.14) * 13, HY + Math.sin(r - 0.14) * 12], [HX + Math.cos(r) * 20, HY + Math.sin(r) * 19], [HX + Math.cos(r + 0.14) * 13, HY + Math.sin(r + 0.14) * 12]], 'q', 'k', 'Q'); } }
  // Ears behind the head
  if (S.ears === 'droop') { ellipse(g, 6, 27, 3.5, 10, 'e', { light: 'e2', dark: 'E' }); ellipse(g, 34, 27, 3.5, 10, 'e', { light: 'e2', dark: 'E' }); }
  if (S.ears === 'long') { ellipse(g, 13, 6, 3.5, 10, 'h', { light: 'h2', dark: 'H' }); ellipse(g, 13, 6, 1.5, 7, 'i', { outline: null }); ellipse(g, 27, 6, 3.5, 10, 'h', { light: 'h2', dark: 'H' }); ellipse(g, 27, 6, 1.5, 7, 'i', { outline: null }); }
  if (S.ears === 'point' || S.ears === 'tuft') { tri(g, [[7, 14], [5, 2], [16, 9]], 'h', 'k', 'H'); tri(g, [[9, 12], [7, 5], [14, 10]], 'i', null); tri(g, [[33, 14], [35, 2], [24, 9]], 'h', 'k', 'H'); tri(g, [[31, 12], [33, 5], [26, 10]], 'i', null); if (S.ears === 'tuft') { put(g, 5, 1, 'k'); put(g, 35, 1, 'k'); } }
  // Legs and feet
  const legW = S.thinLegs ? 2 : 5;
  for (const x of [12, 24]) { if (S.thinLegs) rect(g, x + 1, 46, 2, 8, 'g'); else box(g, x, 46, legW + 1, 8, 'b'); ellipse(g, x + 3, 53, 4.5, 2.2, 'f', { dark: 'F' }); }
  // Body
  ellipse(g, 20, 40, 11.5, 10.5, 'b', { light: 'b2', dark: 'B' });
  ellipse(g, 20, 41, 7, 7.5, 'y', { outline: null, dark: 'Y' });
  if (S.apron) { rect(g, 13, 37, 14, 11, 'a'); rect(g, 13, 37, 14, 1, 'k'); rect(g, 13, 47, 14, 1, 'k'); rect(g, 12, 38, 1, 9, 'k'); rect(g, 27, 38, 1, 9, 'k'); rect(g, 16, 33, 1, 4, 'k'); rect(g, 23, 33, 1, 4, 'k'); rect(g, 14, 42, 12, 1, 'A'); }
  if (S.vest) { rect(g, 10, 33, 4, 12, 'v'); rect(g, 26, 33, 4, 12, 'v'); rect(g, 9, 33, 1, 12, 'k'); rect(g, 30, 33, 1, 12, 'k'); rect(g, 10, 45, 4, 1, 'k'); rect(g, 26, 45, 4, 1, 'k'); put(g, 12, 44, 'V'); put(g, 28, 44, 'V'); }
  // Arms or wings
  if (S.wings) { ellipse(g, 7, 40, 3.5, 7, 'b', { dark: 'B' }); ellipse(g, 33, 40, 3.5, 7, 'b', { dark: 'B' }); }
  else { for (const [x, dir] of [[7, -1], [33, 1]]) { rect(g, x - 1, 34, 3, 9, 'k'); rect(g, x, 34, 1, 9, 'b'); ellipse(g, x, 44, 2.5, 2.5, 'b', { dark: 'B' }); } }
  if (S.bag) { for (let i = 0; i < 9; i++) { put(g, 10 + i, 33 + i, 'x'); put(g, 11 + i, 33 + i, 'X'); } box(g, 19, 42, 8, 6, 'x'); rect(g, 20, 43, 6, 2, 'X'); }
  if (S.bowtie) { tri(g, [[14, 34], [14, 39], [19, 36.5]], 'o', 'k', 'O'); tri(g, [[26, 34], [26, 39], [21, 36.5]], 'o', 'k', 'O'); box(g, 19, 35, 3, 3, 'o'); }
  if (S.scarf) { rect(g, 14, 32, 12, 3, 'o'); rect(g, 14, 32, 12, 1, 'k'); rect(g, 14, 35, 12, 1, 'k'); rect(g, 24, 35, 3, 5, 'o'); put(g, 24, 40, 'k'); put(g, 26, 40, 'k'); }
  // Neck
  if (S.neck) { rect(g, 16, 29, 8, 6, 'h'); rect(g, 15, 29, 1, 6, 'k'); rect(g, 24, 29, 1, 6, 'k'); rect(g, 22, 30, 2, 5, 'H'); }
  // Head
  ellipse(g, HX, HY, HRX, HRY, 'h', { light: 'h2', dark: 'H', lightBias: 0.62 });
  if (S.facePatch) { ellipse(g, 20, 23, 10, 9, 'fp', { outline: null }); }
  if (S.mask) { ellipse(g, 20, 19, 12, 5, 'd', { outline: null, dark: 'D' }); }
  if (S.stripes) { for (const x of [14, 19, 24]) rect(g, x, 9, 2, 4, 'd'); }
  if (S.ears === 'round') { for (const x of [8, 32]) { ellipse(g, x, 10, 4, 4, 'h', { light: 'h2', dark: 'H' }); ellipse(g, x, 10, 2, 2, 'i', { outline: null }); } }
  if (S.crest && !S.fan) { rect(g, 19, 4, 2, 6, 'd'); put(g, 19, 3, 'k'); put(g, 22, 5, 'd'); put(g, 23, 4, 'k'); }
  if (S.fan) { for (const [x, y] of [[16, 5], [20, 3], [24, 5]]) { put(g, x, y + 1, 'd'); put(g, x, y + 2, 'd'); put(g, x, y + 3, 'd'); ellipse(g, x, y - 1, 1.5, 1.5, 'g', { outline: 'k' }); } }
  if (S.muzzle) ellipse(g, 20, 26, 8, 5.5, 'm', { outline: null, dark: 'M' });
}

function drawFace(g, S, expr, blink) {
  const ey = 19, ex = 6;
  const big = expr === 'surprised';
  for (const sx of [-1, 1]) {
    const cx = HX + sx * ex;
    if (blink || (S.sleepy && expr !== 'surprised' && expr !== 'happy')) {
      // closed or half lid
      if (blink) { rect(g, cx - 3, ey, 6, 1, 'k'); }
      else { ellipse(g, cx, ey, 3.5, big ? 4.5 : 4, 'w', { outline: 'k' }); rect(g, cx - 3, ey - 4, 7, 4, 'h'); rect(g, cx - 3, ey, 7, 1, 'k'); put(g, cx + sx, ey + 1, 'k'); put(g, cx + sx, ey + 2, 'k'); }
      continue;
    }
    ellipse(g, cx, ey, 3.5, big ? 4.5 : 4, 'w', { outline: 'k' });
    rect(g, cx + (sx > 0 ? 0 : -1), ey - 1 + (big ? 0 : 0), 2, 3, 'k');
    put(g, cx + (sx > 0 ? 0 : -1), ey - 1, 'w');
    if (expr === 'sad') { for (let i = 0; i < 4; i++) put(g, cx - 3 + i, ey - 6 + (sx > 0 ? 3 - i : i) * 0.5 | 0, 'k'); }
  }
  // Cheeks
  put(g, 9, 24, 'c'); put(g, 10, 24, 'c'); put(g, 9, 25, 'c'); put(g, 30, 24, 'c'); put(g, 31, 24, 'c'); put(g, 31, 25, 'c');
  if (S.glasses) { for (const sx of [-1, 1]) { const cx = HX + sx * ex; for (let a = 0; a < 16; a++) { const t = a / 16 * Math.PI * 2; put(g, Math.round(cx + Math.cos(t) * 4.5), Math.round(ey + Math.sin(t) * 4.5), 'k'); } } rect(g, 18, 19, 4, 1, 'k'); put(g, 9, 18, 'k'); put(g, 30, 18, 'k'); }
  // Nose or beak
  if (S.beak === 'goose') { ellipse(g, 20, 26, 6, 2.5, 'g', { outline: 'k' }); ellipse(g, 20, 29, 5, 2, 'g', { outline: 'k' }); rect(g, 15, 27, 10, 1, 'k'); if (expr === 'happy') rect(g, 17, 28, 6, 1, 'r'); }
  else if (S.beak === 'small') { tri(g, [[17, 24], [23, 24], [20, 29]], 'g', 'k'); }
  else if (S.beak === 'long') { tri(g, [[16, 24], [24, 24], [20, 36]], 'g', 'k'); rect(g, 17, 26, 6, 1, 'k'); }
  else { ellipse(g, 20, 24, 2.5, 1.8, 'n', { outline: S.n === K ? null : 'k' }); put(g, 19, 23, 'w'); }
  // Mouth
  if (!S.beak) {
    const my = 29;
    if (expr === 'happy') { rect(g, 15, my - 1, 10, 1, 'k'); rect(g, 15, my, 10, 3, 'r'); rect(g, 16, my + 3, 8, 1, 'k'); put(g, 15, my + 1, 'k'); put(g, 24, my + 1, 'k'); put(g, 15, my + 2, 'k'); put(g, 24, my + 2, 'k'); rect(g, 17, my + 2, 6, 1, '#e8748a'.length ? 'p' : 'r'); }
    else if (expr === 'sad') { rect(g, 17, my + 1, 6, 1, 'k'); put(g, 16, my + 2, 'k'); put(g, 23, my + 2, 'k'); }
    else if (expr === 'surprised') { ellipse(g, 20, my + 1, 2.5, 3, 'r', { outline: 'k' }); }
    else { rect(g, 17, my, 6, 1, 'k'); put(g, 16, my - 1, 'k'); put(g, 23, my - 1, 'k'); }
    if (S.teeth && expr !== 'surprised') { box(g, 17, my + 1, 4, 4, 'w'); box(g, 20, my + 1, 4, 4, 'w'); }
  }
  if (S.whiskers) { for (const sx of [-1, 1]) for (const dy of [0, 3]) for (let i = 0; i < 5; i++) put(g, 20 + sx * (9 + i), 24 + dy + (dy ? Math.floor(i / 3) : -Math.floor(i / 3)), 'k'); }
}

function drawHat(g, S) {
  if (S.hat === 'deer') {
    ellipse(g, 20, 12, 15, 7, 'x', { light: 'x2', dark: 'X' });
    rect(g, 4, 12, 32, 2, 'k'); rect(g, 5, 13, 30, 1, 'x');
    for (let y = 7; y < 12; y += 2) for (let x = 8 + (y % 4 ? 0 : 2); x < 32; x += 4) if (g[y][x] === 'x' || g[y][x] === 'x2') put(g, x, y, 'X');
    box(g, 3, 13, 5, 9, 'x'); box(g, 32, 13, 5, 9, 'x');
  } else if (S.hat === 'chef') {
    ellipse(g, 13, 5, 5, 4.5, 'w', { dark: '#dddddd'.length ? 'Y' : 'w' }); ellipse(g, 27, 5, 5, 4.5, 'w', { dark: 'Y' }); ellipse(g, 20, 3, 6, 4.5, 'w', { dark: 'Y' });
    box(g, 12, 5, 16, 6, 'w'); rect(g, 13, 6, 14, 4, 'w'); rect(g, 12, 10, 16, 1, 'k');
  } else if (S.hat === 'hard') {
    ellipse(g, 20, 11, 14, 6, 'x', { light: 'x2', dark: 'X' }); rect(g, 4, 11, 32, 2, 'k'); rect(g, 5, 12, 30, 1, 'x'); rect(g, 19, 6, 2, 5, 'X');
  } else if (S.hat === 'captain') {
    ellipse(g, 20, 7, 11, 4.5, 'w', { dark: 'Y' }); rect(g, 8, 10, 24, 4, 'k'); rect(g, 9, 11, 22, 2, '#1f2a5a'.length ? 's' : 's'); rect(g, 17, 11, 6, 2, 'g'); rect(g, 6, 14, 28, 1, 'k'); rect(g, 7, 13, 26, 1, 's');
  }
}

const cache = new Map();

// expr: normal | happy | sad | surprised. frame: 0 normal, 1 blink.
export function pixelCharacter(species, expr = 'normal', frame = 0) {
  const key = `${species}:${expr}:${frame}`;
  if (cache.has(key)) return cache.get(key);
  const S = SPECIES[species];
  if (!S) throw new Error('unknown species ' + species);
  const g = grid(CW, CH);
  drawBody(g, S);
  drawFace(g, S, expr, frame === 1);
  drawHat(g, S);
  const p = palette(S);
  p.p = '#e8748a';
  // Resolve letters: map each unique letter (may be multi-char like 'h2') via a two-pass approach.
  const c = document.createElement('canvas'); c.width = CW; c.height = CH;
  const ctx = c.getContext('2d');
  for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) {
    const ch = g[y][x]; if (ch === '.') continue;
    const col = p[ch] || (ch.length > 1 && p[ch]) || ch;
    ctx.fillStyle = col; ctx.fillRect(x, y, 1, 1);
  }
  cache.set(key, c);
  return c;
}

// Head only (top 34 rows) for suspect cards and the notebook.
export function portrait(species, expr = 'normal') {
  const full = pixelCharacter(species, expr);
  const c = document.createElement('canvas');
  c.width = CW; c.height = 34;
  c.getContext('2d').drawImage(full, 0, 0, CW, 34, 0, 0, CW, 34);
  return c;
}

// A DOM <canvas> showing a sprite scaled up with crisp pixels. For HTML panels.
export function iconCanvas(img, scale) {
  const c = document.createElement('canvas');
  c.width = img.width * scale; c.height = img.height * scale;
  c.style.imageRendering = 'pixelated';
  c.style.display = 'block';
  const x = c.getContext('2d');
  x.imageSmoothingEnabled = false;
  x.drawImage(img, 0, 0, c.width, c.height);
  return c;
}

// Idle animation helper: which frame and bob offset to use at time t (seconds).
export function idle(t, seed = 0) {
  const phase = (t + seed) % 3.7;
  return { frame: phase > 3.5 ? 1 : 0, bob: Math.round(Math.sin((t + seed) * 2.2) * 0.6 + 0.5) };
}
