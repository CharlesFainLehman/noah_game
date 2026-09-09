// Composes a 32x48 pixel character from shared parts.
import { sprite } from '../engine/pixel.js';
import { BASE, PARTS, SPECIES } from './char-rows.js';

export { SPECIES };
export const CW = 32, CH = 48;
const K = '#2b1b0e';
const cache = new Map();

function pal(S) {
  return { k: K, w: '#ffffff', W: '#fff2dc', r: '#c0392b', h: S.h, b: S.b, y: S.y, f: S.f, e: S.e, i: S.i, m: S.m, s: S.s, d: S.d, o: S.o, p: S.p, a: S.a, g: S.g, x: S.x };
}

export function pixelCharacter(species, expr = 'normal') {
  const key = species + ':' + expr;
  if (cache.has(key)) return cache.get(key);
  const S = SPECIES[species];
  if (!S) throw new Error('unknown species ' + species);
  const P = pal(S);
  const c = document.createElement('canvas');
  c.width = CW; c.height = CH;
  const ctx = c.getContext('2d');
  const put = name => { const p = PARTS[name]; ctx.drawImage(sprite(p.rows, P), p.x, p.y); };

  for (const n of S.behind) put(n);
  ctx.drawImage(sprite(BASE, P), 0, 0);
  // Face
  const frontMouthless = S.front.filter(n => n !== 'muzzle');
  if (S.front.includes('muzzle')) put('muzzle');
  put('eyeL'); put('eyeR');
  if (S.sleepy && expr !== 'surprised' && expr !== 'happy') { put('lidL'); put('lidR'); }
  if (expr === 'sad') { put('browSadL'); put('browSadR'); }
  for (const n of frontMouthless) put(n);
  if (!S.beak) {
    put(expr === 'happy' ? 'mouthHappy' : expr === 'sad' ? 'mouthSad' : expr === 'surprised' ? 'mouthO' : 'mouthNormal');
    if (S.front.includes('teeth') && expr !== 'surprised') put('teeth');
  }
  if (S.hat) put(S.hat);
  cache.set(key, c);
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
