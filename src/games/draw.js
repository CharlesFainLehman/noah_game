// Draws picture descriptors from the generators into a box on the pixel canvas.
import { P } from '../art/palette.js';
import { sprites, itemSprite } from '../art/sprites.js';
import { textWidth, fitScale } from '../art/font.js';

const COLORS = { red: P.red, blue: P.blue, yellow: P.yellow, green: P.green };

// Tens rods and unit cubes. Returns width used.
export function drawRods(px, n, x, y, color = P.blueberry, tall = 22) {
  const tens = Math.floor(n / 10), ones = n % 10;
  for (let i = 0; i < tens; i++) px.box(x + i * 6, y, 5, tall, color);
  const ox = x + tens * 6 + (tens ? 3 : 0);
  for (let i = 0; i < ones; i++) px.box(ox + (i % 5) * 5, y + Math.floor(i / 5) * 5, 4, 4, P.choc);
  return tens * 6 + (tens ? 3 : 0) + Math.min(ones, 5) * 5;
}

// A pile of items. Up to 20 as sprites in rows of ten, more as ten-blocks.
export function drawPile(px, n, item, x, y, w) {
  const spr = itemSprite(item);
  if (n <= 20) {
    const perRow = Math.min(n, 10), x0 = x + Math.floor((w - perRow * 14) / 2);
    for (let i = 0; i < n; i++) px.blit(spr, x0 + (i % 10) * 14, y + Math.floor(i / 10) * 14);
    return;
  }
  const tens = Math.floor(n / 10), ones = n % 10, cols = tens + (ones ? 1 : 0);
  const x0 = x + Math.floor((w - cols * 15) / 2);
  for (let g = 0; g < cols; g++) {
    const count = g < tens ? 10 : ones;
    for (let i = 0; i < count; i++) px.rect(x0 + g * 15 + (i % 2) * 6, y + Math.floor(i / 2) * 6, 5, 5, g < tens ? P.blueberry : P.choc);
  }
}

export function drawJar(px, k, x, y) {
  px.box(x, y, 20, 34, '#dff4ff'); px.rect(x - 2, y - 3, 24, 4, P.woodDark);
  const S = sprites();
  for (let i = 0; i < 10; i++) {
    const cx = x + 3 + (i % 2) * 8, cy = y + 28 - Math.floor(i / 2) * 6;
    if (i < k) px.blit(S.acorn, cx - 3, cy - 5); else px.rect(cx, cy, 3, 3, '#b9c4cc');
  }
}

export function drawClock(px, h, m, cx, cy, r) {
  px.ctx.fillStyle = P.k; px.ctx.beginPath(); px.ctx.arc(cx, cy, r, 0, Math.PI * 2); px.ctx.fill();
  px.ctx.fillStyle = '#fffdf5'; px.ctx.beginPath(); px.ctx.arc(cx, cy, r - 1, 0, Math.PI * 2); px.ctx.fill();
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2, big = i % 3 === 0;
    px.rect(Math.round(cx + Math.sin(a) * (r - 3)) - (big ? 1 : 0), Math.round(cy - Math.cos(a) * (r - 3)) - (big ? 1 : 0), big ? 2 : 1, big ? 2 : 1, P.k);
  }
  if (r >= 16) for (const [n, dx, dy] of [[12, 0, -r + 8], [3, r - 8, 0], [6, 0, r - 8], [9, -r + 8, 0]]) px.text(String(n), cx + dx, cy + dy - 3, P.k, { align: 'center' });
  const line = (angle, len, thick, color) => {
    for (let i = 0; i <= len; i++) px.rect(Math.round(cx + Math.sin(angle) * i) - Math.floor(thick / 2), Math.round(cy - Math.cos(angle) * i) - Math.floor(thick / 2), thick, thick, color);
  };
  line((m / 60) * Math.PI * 2, r - 5, 1, P.blue);
  line(((h % 12) / 12 + m / 720) * Math.PI * 2, Math.round(r * 0.55), 2, P.k);
  px.rect(cx - 1, cy - 1, 2, 2, P.red);
}

export function drawTile(px, t, cx, cy, boxSize = 16) {
  const s = Math.max(6, Math.min(boxSize, 6 + t.size * 3)), col = COLORS[t.color] || P.grey, x = cx - Math.floor(s / 2), y = cy - Math.floor(s / 2);
  if (t.shape === 'square') px.box(x, y, s, s, col);
  else if (t.shape === 'circle') { px.ctx.fillStyle = P.k; px.ctx.beginPath(); px.ctx.arc(cx, cy, s / 2, 0, Math.PI * 2); px.ctx.fill(); px.ctx.fillStyle = col; px.ctx.beginPath(); px.ctx.arc(cx, cy, s / 2 - 1, 0, Math.PI * 2); px.ctx.fill(); }
  else { for (let i = 0; i < s; i++) { const half = Math.floor((i * (s / 2)) / s); px.rect(cx - half, y + i, half * 2 + 1, 1, i === s - 1 ? P.k : col); } px.rect(cx, y, 1, 1, P.k); }
}

export function drawShape(px, shape, cx, cy, size) {
  const s = size, x = cx - Math.floor(s / 2), y = cy - Math.floor(s / 2), col = P.blue;
  const c = px.ctx;
  const poly = pts => { c.fillStyle = P.k; c.beginPath(); pts.forEach(([a, b], i) => i ? c.lineTo(a, b) : c.moveTo(a, b)); c.closePath(); c.fill(); c.fillStyle = col; c.beginPath(); pts.forEach(([a, b], i) => { const dx = (cx - a) * 0.12, dy = (cy - b) * 0.12; i ? c.lineTo(a + dx, b + dy) : c.moveTo(a + dx, b + dy); }); c.closePath(); c.fill(); };
  switch (shape) {
    case 'circle': c.fillStyle = P.k; c.beginPath(); c.arc(cx, cy, s / 2, 0, Math.PI * 2); c.fill(); c.fillStyle = col; c.beginPath(); c.arc(cx, cy, s / 2 - 2, 0, Math.PI * 2); c.fill(); break;
    case 'square': px.box(x, y, s, s, col); px.rect(x + 1, y + 1, s - 2, 1, P.k); break;
    case 'rectangle': px.box(cx - s * 0.7, cy - s * 0.35, s * 1.4, s * 0.7, col); break;
    case 'triangle': poly([[cx, y], [x + s, y + s], [x, y + s]]); break;
    case 'hexagon': poly([0, 1, 2, 3, 4, 5].map(i => { const a = i * Math.PI / 3; return [cx + Math.cos(a) * s / 2, cy + Math.sin(a) * s / 2]; })); break;
    case 'sphere': c.fillStyle = P.k; c.beginPath(); c.arc(cx, cy, s / 2, 0, Math.PI * 2); c.fill(); c.fillStyle = col; c.beginPath(); c.arc(cx, cy, s / 2 - 2, 0, Math.PI * 2); c.fill(); c.fillStyle = '#9db8ff'; c.beginPath(); c.arc(cx - s / 6, cy - s / 6, s / 6, 0, Math.PI * 2); c.fill(); break;
    case 'cube': { const d = Math.floor(s / 3); px.box(x, y + d, s - d, s - d, col); poly([[x, y + d], [x + d, y], [x + s, y], [x + s - d, y + d]]); poly([[x + s - d, y + d], [x + s, y], [x + s, y + s - d], [x + s - d, y + s]]); c.fillStyle = '#2f4fa8'; c.beginPath(); c.moveTo(x + s - d + 1, y + d + 2); c.lineTo(x + s - 2, y + 2); c.lineTo(x + s - 2, y + s - d - 2); c.lineTo(x + s - d + 1, y + s - 2); c.closePath(); c.fill(); break; }
    case 'cone': poly([[cx, y], [x + s, y + s - 4], [x, y + s - 4]]); c.fillStyle = P.k; c.beginPath(); c.ellipse(cx, y + s - 4, s / 2, 4, 0, 0, Math.PI * 2); c.fill(); c.fillStyle = '#2f4fa8'; c.beginPath(); c.ellipse(cx, y + s - 4, s / 2 - 2, 2.5, 0, 0, Math.PI * 2); c.fill(); break;
    case 'cylinder': px.box(x + 2, y + 4, s - 4, s - 8, col); c.fillStyle = P.k; c.beginPath(); c.ellipse(cx, y + s - 4, s / 2 - 2, 4, 0, 0, Math.PI * 2); c.fill(); c.fillStyle = '#2f4fa8'; c.beginPath(); c.ellipse(cx, y + s - 4, s / 2 - 4, 2.5, 0, 0, Math.PI * 2); c.fill(); c.fillStyle = P.k; c.beginPath(); c.ellipse(cx, y + 4, s / 2 - 2, 4, 0, 0, Math.PI * 2); c.fill(); c.fillStyle = '#9db8ff'; c.beginPath(); c.ellipse(cx, y + 4, s / 2 - 4, 2.5, 0, 0, Math.PI * 2); c.fill(); break;
  }
}

export function drawPlank(px, len, x, y, unit, units) {
  px.box(x, y, len * unit, 8, P.wood);
  for (let i = 1; i < len; i++) px.rect(x + i * unit, y + 2, 1, 4, P.woodDark);
  if (units) for (let i = 0; i < len; i++) px.box(x + i * unit, y + 10, unit, 6, P.yellow);
}

export function drawTally(px, n, x, y) {
  let cx = x;
  for (let g = 0; g < n; g += 5) {
    const count = Math.min(5, n - g);
    for (let i = 0; i < Math.min(4, count); i++) px.rect(cx + i * 4, y, 2, 14, P.k);
    if (count === 5) for (let i = 0; i < 14; i++) px.rect(cx + 12 - Math.floor(i * 12 / 14), y + i, 2, 1, P.red);
    cx += 20;
  }
}

export function drawGraph(px, rows, x, y) {
  rows.forEach((r, i) => {
    const spr = itemSprite(r.item), ry = y + i * 13;
    px.text(r.item.slice(0, 6), x, ry + 3, P.k);
    px.rect(x + 38, ry - 1, 1, 14, P.k);
    for (let j = 0; j < r.n; j++) px.blit(spr, x + 42 + j * 13, ry);
  });
}

export function drawStones(px, seq, x, y, w) {
  const all = [...seq.map(String), '?'];
  const x0 = x + Math.floor((w - all.length * 30) / 2);
  all.forEach((s, i) => { px.box(x0 + i * 30, y, 26, 18, i === all.length - 1 ? P.yellow : '#b9c4cc'); px.text(s, x0 + i * 30 + 13, y + 6, P.k, { align: 'center' }); });
}

// Draw a descriptor centered in the box (x, y, w, h).
export function drawDesc(px, d, x, y, w, h) {
  const cx = x + Math.floor(w / 2), cy = y + Math.floor(h / 2);
  switch (d.type) {
    case 'text': {
      const s = fitScale(d.text, w - 4, 3);
      px.text(d.text, cx, cy - Math.floor(7 * s / 2), P.k, { align: 'center', scale: s }); break;
    }
    case 'pile': drawPile(px, d.n, d.item || 'acorn', x, y + Math.max(2, Math.floor((h - (d.n > 10 ? 28 : 14)) / 2)), w); break;
    case 'rods': drawRods(px, d.n, x + 6, y + 4); break;
    case 'jar': drawJar(px, d.k, cx - 10, y + 4); break;
    case 'clock': drawClock(px, d.h, d.m, cx, cy, Math.floor(Math.min(w, h) / 2) - 3); break;
    case 'tile': drawTile(px, d, cx, cy, Math.min(w, h) - 6); break;
    case 'tiles': { const n = d.tiles.length + 1, step = Math.min(20, Math.floor(w / n)), x0 = cx - Math.floor(step * n / 2) + Math.floor(step / 2); d.tiles.forEach((t, i) => drawTile(px, t, x0 + i * step, cy, 22)); px.box(x0 + d.tiles.length * step - 8, cy - 8, 16, 16, '#fffdf5'); px.text('?', x0 + d.tiles.length * step, cy - 3, P.k, { align: 'center' }); break; }
    case 'shape': drawShape(px, d.shape, cx, cy, Math.min(w, h) - 8); break;
    case 'plank': { const unit = Math.min(12, Math.floor((w - 8) / 12)); drawPlank(px, d.len, cx - Math.floor(d.len * unit / 2), d.units ? cy - 8 : cy - 4, unit, d.units); break; }
    case 'planks': { const unit = Math.min(12, Math.floor((w - 8) / 12)); const x0 = x + 6; drawPlank(px, d.lens[0], x0, y + 4, unit, d.units); drawPlank(px, d.lens[1], x0, y + 24, unit, d.units); break; }
    case 'tally': drawTally(px, d.n, cx - Math.floor(Math.ceil(d.n / 5) * 20 / 2), cy - 7); break;
    case 'graph': drawGraph(px, d.rows, x + 4, y + 2); break;
    case 'stones': drawStones(px, d.seq, x, cy - 9, w); break;
  }
}
