// Pixel scene backgrounds drawn onto a 320x180 canvas. opts.t animates small details.
import { PW, PH } from '../engine/pixel.js';
import { P } from './palette.js';
import { sprites } from './sprites.js';
import { shade, tint } from './pixel-characters.js';

const K = P.k;

// ---------- drawing helpers ----------
function dither(px, x, y, w, h, c1, c2) {
  px.rect(x, y, w, h, c1);
  px.ctx.fillStyle = c2;
  for (let j = 0; j < h; j++) for (let i = (j % 2); i < w; i += 2) px.ctx.fillRect(x + i, y + j, 1, 1);
}
// Vertical gradient in bands with dithered joins.
function skyGradient(px, y0, y1, top, bottom, steps = 4) {
  const [tr, tg, tb] = hex(top), [br, bg, bb] = hex(bottom);
  const h = Math.ceil((y1 - y0) / steps);
  for (let i = 0; i < steps; i++) {
    const f = i / (steps - 1), c = rgb([tr + (br - tr) * f, tg + (bg - tg) * f, tb + (bb - tb) * f]);
    px.rect(0, y0 + i * h, PW, h, c);
    if (i > 0) { const prev = rgb([tr + (br - tr) * (i - 1) / (steps - 1), tg + (bg - tg) * (i - 1) / (steps - 1), tb + (bb - tb) * (i - 1) / (steps - 1)]); dither(px, 0, y0 + i * h, PW, 2, c, prev); }
  }
}
function hex(c) { return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)]; }
function rgb([r, g, b]) { return '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join(''); }

function wallpaper(px, base, y0, y1, style = 'stripes') {
  const dark = shade(base, 0.94), light = tint(base, 0.12);
  px.rect(0, y0, PW, y1 - y0, base);
  if (style === 'stripes') for (let x = 0; x < PW; x += 24) { px.rect(x, y0, 10, y1 - y0, dark); px.rect(x + 10, y0, 1, y1 - y0, light); }
  if (style === 'diamonds') for (let y = y0 + 4; y < y1; y += 16) for (let x = ((y - y0) / 16 % 2) * 8; x < PW; x += 16) { px.rect(x, y, 1, 1, dark); px.rect(x - 1, y + 1, 3, 1, dark); px.rect(x, y + 2, 1, 1, dark); px.rect(x, y + 1, 1, 1, light); }
  if (style === 'dots') for (let y = y0 + 6; y < y1; y += 12) for (let x = ((y - y0) / 12 % 2) * 6 + 4; x < PW; x += 12) px.rect(x, y, 2, 2, dark);
  if (style === 'stone') { for (let y = y0; y < y1; y += 10) for (let x = ((y - y0) / 10 % 2) * 14; x < PW; x += 28) { px.rect(x + 1, y + 1, 26, 8, light); px.rect(x + 1, y + 1, 26, 1, tint(base, 0.25)); px.rect(x + 1, y + 8, 26, 1, dark); px.rect(x, y, 1, 10, dark); } }
  // Ceiling trim and a soft vignette at both sides.
  px.rect(0, y0, PW, 3, shade(base, 0.7)); px.rect(0, y0 + 3, PW, 1, light);
  dither(px, 0, y0 + 4, 8, y1 - y0 - 4, base, dark); dither(px, PW - 8, y0 + 4, 8, y1 - y0 - 4, base, dark);
}
function wainscot(px, y, h, wood) {
  px.rect(0, y, PW, h, wood); px.rect(0, y, PW, 2, shade(wood, 0.6)); px.rect(0, y + 2, PW, 1, tint(wood, 0.3));
  for (let x = 4; x < PW; x += 40) { px.rect(x, y + 5, 32, h - 8, shade(wood, 0.85)); px.rect(x + 1, y + 6, 30, h - 10, wood); px.rect(x + 1, y + 6, 30, 1, tint(wood, 0.2)); }
}
function floorPlanks(px, y, wood) {
  const dark = shade(wood, 0.72), light = tint(wood, 0.18);
  px.rect(0, y, PW, PH - y, wood);
  for (let j = 0, row = y; row < PH; row += 9, j++) {
    px.rect(0, row, PW, 1, dark);
    px.rect(0, row + 1, PW, 1, light);
    for (let x = (j % 2) * 30 + 10; x < PW; x += 60) px.rect(x, row + 1, 1, 8, dark);
    for (let x = (j % 3) * 20 + 4; x < PW; x += 45) px.rect(x, row + 4, 6, 1, dark);
  }
  px.rect(0, y, PW, 1, shade(wood, 0.5));
}
function tileFloor(px, y, c1, c2) {
  for (let row = y, j = 0; row < PH; row += 10, j++) for (let x = 0, i = 0; x < PW; x += 10, i++) { const c = (i + j) % 2 ? c1 : c2; px.rect(x, row, 10, 10, c); px.rect(x, row, 10, 1, tint(c, 0.15)); px.rect(x, row, 1, 10, tint(c, 0.15)); }
}
function cloud(px, x, y, w, c = '#ffffff') {
  const h = Math.max(6, Math.floor(w / 4));
  px.rect(x, y + 2, w, h - 2, c); px.rect(x + 3, y, w - 6, 2, c); px.rect(x + Math.floor(w / 3), y - 3, Math.floor(w / 3), 3, c);
  px.rect(x, y + h, w, 1, shade(c, 0.9)); px.rect(x - 2, y + 4, 2, h - 4, c); px.rect(x + w, y + 4, 2, h - 4, c);
}
function sun(px, cx, cy, r, t = 0) {
  px.rect(cx - r, cy - Math.floor(r / 2), r * 2, r, '#ffe98a'); px.rect(cx - Math.floor(r / 2), cy - r, r, r * 2, '#ffe98a'); px.rect(cx - r + 2, cy - r + 2, r * 2 - 4, r * 2 - 4, '#ffe98a');
  px.rect(cx - Math.floor(r / 2), cy - Math.floor(r / 2), r, r, '#fff5c0');
  const spin = Math.floor(t * 2) % 2;
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 + spin * 0.2; px.rect(Math.round(cx + Math.cos(a) * (r + 5)), Math.round(cy + Math.sin(a) * (r + 5)), 2, 2, '#ffe98a'); }
}
function windowFrame(px, x, y, w, h, { curtain, view = 'sky', t = 0, wood = P.woodDark } = {}) {
  px.ctx.save(); px.ctx.beginPath(); px.ctx.rect(x, y, w, h); px.ctx.clip();
  if (view === 'sky' || view === 'town') {
    skyGradient(px, y, y + h, '#7fc8ff', '#c9ecff', 3);
    cloud(px, x + ((t * 4) % (w + 30)) - 20, y + 8, 18); cloud(px, x + ((t * 3 + 40) % (w + 30)) - 20, y + 22, 12);
    if (view === 'town') for (let i = 0; i < 6; i++) { const bx = x - 4 + i * 16, bh = 14 + (i % 3) * 6; px.rect(bx, y + h - bh, 14, bh, ['#e8a35b', '#c58b4a', '#9aa0ad'][i % 3]); px.rect(bx - 1, y + h - bh - 3, 16, 3, P.woodDark); px.rect(bx + 4, y + h - bh + 4, 3, 3, '#fff5c0'); }
  } else if (view === 'sea') {
    skyGradient(px, y, y + Math.floor(h * 0.55), '#7fc8ff', '#c9ecff', 2); px.rect(x, y + Math.floor(h * 0.55), w, h - Math.floor(h * 0.55), P.water);
    for (let i = 0; i < 3; i++) px.rect(x + ((i * 17 + Math.floor(t * 6)) % (w - 8)) + 2, y + Math.floor(h * 0.62) + i * 6, 6, 1, '#7fd1f5');
  }
  px.ctx.restore();
  px.rect(x, y, w, 1, '#ffffff');
  // Frame
  px.rect(x - 3, y - 3, w + 6, 3, wood); px.rect(x - 3, y + h, w + 6, 4, wood); px.rect(x - 3, y, 3, h, wood); px.rect(x + w, y, 3, h, wood);
  px.rect(x + Math.floor(w / 2) - 1, y, 2, h, wood); px.rect(x, y + Math.floor(h / 2) - 1, w, 2, wood);
  px.rect(x - 5, y + h + 1, w + 10, 3, shade(wood, 0.7)); px.rect(x - 5, y + h, w + 10, 1, tint(wood, 0.3));
  if (curtain) { for (const cx of [x - 8, x + w - 4]) { px.rect(cx, y - 6, 12, h + 8, curtain); px.rect(cx + 2, y - 6, 2, h + 8, shade(curtain, 0.8)); px.rect(cx + 7, y - 6, 2, h + 8, shade(curtain, 0.8)); px.rect(cx, y + Math.floor(h / 2), 12, 3, shade(curtain, 0.6)); } px.rect(x - 10, y - 8, w + 20, 3, shade(curtain, 0.6)); }
}
function shelfBoard(px, x, y, w, wood = P.woodDark) { px.rect(x, y, w, 3, wood); px.rect(x, y, w, 1, tint(wood, 0.3)); px.rect(x, y + 3, w, 2, shade(wood, 0.6)); }
function book(px, x, y, h, c) { px.rect(x, y, 5, h, c); px.rect(x, y, 5, 1, tint(c, 0.3)); px.rect(x + 4, y, 1, h, shade(c, 0.7)); px.rect(x + 1, y + 3, 3, 1, shade(c, 0.6)); }
function jar(px, x, y, c) { px.rect(x, y, 10, 14, K); px.rect(x + 1, y + 1, 8, 12, c); px.rect(x + 2, y + 2, 1, 9, tint(c, 0.5)); px.rect(x + 2, y - 3, 6, 4, P.woodDark); px.rect(x + 2, y - 3, 6, 1, tint(P.woodDark, 0.3)); px.rect(x + 3, y + 6, 4, 3, '#fffdf5'); }
function gear(px, cx, cy, r, teeth, angle, c) {
  const dark = shade(c, 0.7);
  for (let i = 0; i < teeth; i++) { const a = angle + i * Math.PI * 2 / teeth; px.rect(Math.round(cx + Math.cos(a) * r) - 2, Math.round(cy + Math.sin(a) * r) - 2, 4, 4, dark); }
  px.ctx.fillStyle = dark; px.ctx.beginPath(); px.ctx.arc(cx, cy, r - 1, 0, Math.PI * 2); px.ctx.fill();
  px.ctx.fillStyle = c; px.ctx.beginPath(); px.ctx.arc(cx, cy, r - 3, 0, Math.PI * 2); px.ctx.fill();
  px.ctx.fillStyle = dark; px.ctx.beginPath(); px.ctx.arc(cx, cy, Math.max(2, r - 8), 0, Math.PI * 2); px.ctx.fill();
  px.rect(cx - 1, cy - 1, 3, 3, K);
}
function steam(px, x, y, t) { for (let i = 0; i < 3; i++) { const ph = (t * 0.8 + i * 0.33) % 1; px.rect(x + i * 4 + Math.round(Math.sin(ph * 6 + i) * 2), y - Math.round(ph * 14), 2, 2, `rgba(255,255,255,${0.7 - ph * 0.6})`); } }
function dropShadow(px, x, y, w) { px.ctx.fillStyle = 'rgba(0,0,0,0.18)'; px.ctx.fillRect(x, y, w, 3); }

// ---------- office extras ----------
export const DECOR = [
  { id: 'fishbowl', name: 'Goldfish bowl', cost: 1 },
  { id: 'plant', name: 'Potted plant', cost: 2 },
  { id: 'hatrack', name: 'Hat rack', cost: 2 },
  { id: 'rug', name: 'Fancy rug', cost: 3 },
  { id: 'portrait', name: 'Portrait of Nibbles', cost: 3 },
  { id: 'globe', name: 'Globe', cost: 4 },
];
function drawDecor(px, decor, t) {
  if (decor.includes('fishbowl')) { px.rect(196, 96, 18, 14, K); px.rect(197, 97, 16, 12, '#cfe9ff'); px.rect(200, 92, 10, 5, '#cfe9ff'); px.rect(198, 98, 2, 8, '#ffffff'); const fx = 200 + Math.round(Math.sin(t * 2) * 3); px.rect(fx, 102, 5, 3, P.orange); px.rect(fx + 5, 101, 2, 5, P.orange); px.rect(fx + 1, 103, 1, 1, K); }
  if (decor.includes('plant')) { px.rect(300, 96, 16, 14, K); px.rect(301, 97, 14, 12, '#c8763a'); px.rect(301, 97, 14, 2, '#d98a4a'); for (const [dx, dy, w, h] of [[4, -18, 8, 18], [-2, -12, 8, 10], [10, -14, 8, 10], [5, -24, 5, 8]]) { px.rect(302 + dx, 96 + dy, w, h, P.green); px.rect(302 + dx, 96 + dy, 2, h, tint(P.green, 0.3)); } }
  if (decor.includes('hatrack')) { px.rect(170, 58, 3, 68, P.woodDark); px.rect(171, 58, 1, 68, tint(P.woodDark, 0.3)); px.rect(160, 70, 23, 3, P.woodDark); px.rect(159, 60, 13, 4, '#8b5a2b'); px.rect(162, 56, 7, 5, '#8b5a2b'); px.rect(176, 60, 10, 7, P.red); px.rect(176, 60, 10, 2, tint(P.red, 0.3)); }
  if (decor.includes('rug')) { px.rect(24, 154, 120, 18, P.blue); px.rect(28, 157, 112, 12, '#7fd1f5'); for (let i = 0; i < 7; i++) { px.rect(34 + i * 16, 160, 6, 6, P.yellow); px.rect(36 + i * 16, 162, 2, 2, P.blue); } }
  if (decor.includes('portrait')) { px.rect(164, 18, 30, 38, K); px.rect(165, 19, 28, 36, '#c58b4a'); px.rect(168, 22, 22, 30, '#e8d6b0'); px.rect(172, 30, 14, 10, '#a5a5a5'); px.rect(174, 33, 10, 4, '#3a3a3a'); px.rect(175, 34, 2, 2, '#ffffff'); px.rect(181, 34, 2, 2, '#ffffff'); px.rect(172, 40, 14, 10, '#8e8e8e'); px.rect(178, 44, 3, 2, K); }
  if (decor.includes('globe')) { px.rect(250, 96, 2, 12, P.woodDark); px.rect(246, 108, 10, 2, P.woodDark); px.ctx.fillStyle = K; px.ctx.beginPath(); px.ctx.arc(251, 92, 8, 0, Math.PI * 2); px.ctx.fill(); px.ctx.fillStyle = P.sky; px.ctx.beginPath(); px.ctx.arc(251, 92, 7, 0, Math.PI * 2); px.ctx.fill(); px.rect(247, 89, 5, 4, P.green); px.rect(252, 94, 4, 3, P.green); px.rect(248, 87, 2, 1, '#ffffff'); }
}
function drawTrophies(px, trophies, gold) {
  const S = sprites();
  shelfBoard(px, 20, 112, 134);
  for (let i = 0; i < 8; i++) { if (i < trophies) px.blit(S.trophy, 24 + i * 16, 100); else px.rect(28 + i * 16, 109, 4, 2, '#b9a58a'); }
  for (let i = 0; i < gold; i++) px.blit(S.star, 24 + i * 11, 118);
}

// ---------- backdrops ----------
export function drawBackdrop(px, name, opts = {}) {
  const S = sprites(), t = opts.t || 0;
  switch (name) {
    case 'office': {
      wallpaper(px, '#d9b98c', 0, 126, 'diamonds');
      wainscot(px, 126, 12, '#8b5a2b');
      floorPlanks(px, 138, '#b07a3c');
      windowFrame(px, 214, 22, 80, 62, { curtain: '#b8433a', view: 'town', t });
      // Corkboard with pins
      px.rect(20, 16, 134, 84, K); px.rect(21, 17, 132, 82, '#c58b4a'); px.rect(24, 20, 126, 76, '#d9a066'); dither(px, 24, 20, 126, 76, '#d9a066', '#d4985c');
      for (const [x, y, c] of [[26, 22, P.red], [146, 22, P.blue], [26, 92, P.green], [146, 92, P.yellow]]) { px.rect(x, y, 3, 3, c); px.rect(x, y, 1, 1, tint(c, 0.4)); }
      // Diploma and wall clock
      px.rect(166, 40, 26, 20, K); px.rect(167, 41, 24, 18, '#fffdf5'); for (let i = 0; i < 4; i++) px.rect(170, 44 + i * 3, 18 - (i % 2) * 6, 1, '#c9c0aa'); px.rect(184, 54, 4, 4, P.red);
      px.rect(168, 8, 22, 22, K); px.rect(169, 9, 20, 20, '#fffdf5'); px.rect(178, 12, 2, 7, K); px.rect(178, 18, 6, 2, K); px.rect(179, 19, 1, 1, P.red);
      // Bookshelf right
      shelfBoard(px, 300, 60, 20); shelfBoard(px, 300, 80, 20); for (let i = 0; i < 3; i++) book(px, 301 + i * 6, 48, 12, [P.red, P.blue, P.green][i]); for (let i = 0; i < 3; i++) book(px, 301 + i * 6, 68, 12, [P.yellow, '#8b5a2b', P.blue][i]);
      // Desk with typewriter and lamp
      dropShadow(px, 168, 160, 134);
      px.rect(166, 110, 134, 12, K); px.rect(167, 111, 132, 10, '#8b5a2b'); px.rect(167, 111, 132, 2, '#a5764a');
      px.rect(172, 122, 8, 38, '#6f3f1c'); px.rect(286, 122, 8, 38, '#6f3f1c'); px.rect(172, 122, 2, 38, '#8b5a2b'); px.rect(286, 122, 2, 38, '#8b5a2b');
      px.rect(184, 122, 60, 28, K); px.rect(185, 123, 58, 26, '#6f3f1c'); px.rect(190, 127, 24, 5, '#c58b4a'); px.rect(190, 136, 24, 5, '#c58b4a'); px.rect(200, 129, 4, 1, K); px.rect(200, 138, 4, 1, K);
      // Typewriter
      px.rect(196, 98, 30, 12, K); px.rect(197, 99, 28, 10, '#4a4a4a'); px.rect(200, 101, 22, 3, '#6b6b6b'); for (let i = 0; i < 6; i++) px.rect(199 + i * 4, 106, 2, 2, '#c9c0aa'); px.rect(202, 92, 18, 7, '#fffdf5');
      // Lamp with glow
      px.ctx.fillStyle = 'rgba(255,233,138,0.25)'; px.ctx.fillRect(256, 84, 30, 26);
      px.rect(270, 82, 2, 28, '#4a4a4a'); px.rect(256, 80, 30, 5, K); px.rect(257, 81, 28, 3, P.green); px.rect(260, 76, 22, 5, P.green); px.rect(260, 76, 22, 1, tint(P.green, 0.3)); px.rect(258, 85, 26, 1, '#ffe98a');
      // Donut box
      px.rect(230, 100, 26, 10, K); px.rect(231, 101, 24, 8, P.pink); px.rect(231, 101, 24, 2, tint(P.pink, 0.3)); px.rect(240, 96, 8, 6, '#e8a35b'); px.rect(243, 98, 2, 2, P.pink);
      // Rug
      px.rect(24, 154, 120, 18, '#b8433a'); px.rect(28, 157, 112, 12, P.red); px.rect(32, 160, 104, 6, '#b8433a'); px.rect(36, 162, 96, 2, P.red);
      if (opts.decor) drawDecor(px, opts.decor, t);
      if (opts.trophies !== undefined) drawTrophies(px, opts.trophies, opts.gold || 0);
      break;
    }
    case 'bakery': {
      wallpaper(px, '#fff1d6', 0, 108, 'stripes');
      // Oven at left with glow
      px.rect(8, 60, 50, 48, K); px.rect(9, 61, 48, 46, '#5d6470'); px.rect(9, 61, 48, 3, '#7d8590'); px.rect(14, 70, 38, 22, K); px.rect(15, 71, 36, 20, '#3a3a3a'); dither(px, 17, 76, 32, 12, '#f0842c', '#ffcc4d'); px.rect(20, 82, 10, 3, '#e8a35b'); px.rect(34, 82, 10, 3, '#e8a35b'); for (let i = 0; i < 4; i++) px.rect(14 + i * 10, 96, 6, 3, P.yellow);
      // Shelves with pastries
      for (const y of [20, 46]) { shelfBoard(px, 64, y + 14, 100); for (let i = 0; i < 5; i++) { const x = 68 + i * 20; if ((i + y) % 3 === 0) { px.rect(x, y + 4, 16, 8, '#e8a35b'); px.rect(x, y + 4, 16, 2, '#f2c27b'); px.rect(x + 2, y + 2, 12, 2, '#e8a35b'); px.rect(x + 3, y + 7, 10, 1, '#c58b4a'); } else if ((i + y) % 3 === 1) { px.rect(x + 2, y + 2, 12, 10, '#f6b8c8'); px.rect(x + 2, y + 2, 12, 2, '#ffd9e3'); px.rect(x, y + 6, 16, 6, '#fffdf5'); px.rect(x + 6, y, 3, 3, P.red); } else { px.rect(x, y + 6, 16, 6, '#c58b4a'); px.rect(x + 1, y + 4, 14, 3, '#e8a35b'); px.rect(x + 4, y + 2, 8, 3, '#e8a35b'); } } }
      // Mirror on the wall (clue) and hanging sign
      px.rect(262, 16, 34, 46, K); px.rect(264, 18, 30, 42, '#c58b4a'); px.rect(264, 18, 30, 2, '#e0a86a'); px.rect(268, 22, 22, 34, '#cfe9ff'); px.rect(270, 26, 2, 22, '#ffffff'); px.rect(273, 24, 1, 10, '#ffffff'); dither(px, 280, 40, 8, 14, '#cfe9ff', '#b8d8f0');
      px.rect(190, 4, 2, 10, K); px.rect(228, 4, 2, 10, K); px.rect(184, 12, 52, 14, K); px.rect(185, 13, 50, 12, '#fffdf5'); px.text('MUFFINS', 210, 16, K, { align: 'center' });
      // Counter with register, display case, pie with steam
      px.rect(0, 108, PW, 6, shade('#a5642f', 0.6)); px.rect(0, 108, PW, 1, '#d98a4a'); px.rect(0, 114, PW, PH - 114, '#a5642f');
      for (let x = 0; x < PW; x += 40) { px.rect(x, 114, 1, PH - 114, shade('#a5642f', 0.7)); px.rect(x + 1, 114, 1, PH - 114, tint('#a5642f', 0.15)); }
      px.rect(0, 150, PW, 2, shade('#a5642f', 0.7));
      px.rect(256, 84, 60, 24, K); px.rect(257, 85, 58, 22, '#dff4ff'); px.rect(257, 85, 58, 2, '#ffffff'); for (let i = 0; i < 3; i++) { px.rect(262 + i * 18, 94, 12, 9, '#e8a35b'); px.rect(262 + i * 18, 94, 12, 2, '#f2c27b'); px.rect(266 + i * 18, 97, 4, 3, P.pink); }
      px.rect(230, 96, 22, 12, K); px.rect(231, 97, 20, 10, '#8b5a2b'); px.rect(233, 99, 16, 4, '#e8a35b'); px.rect(235, 100, 12, 1, '#c58b4a'); steam(px, 236, 96, t);
      break;
    }
    case 'harbor': {
      skyGradient(px, 0, 100, '#6fbfff', '#d6f0ff', 5);
      sun(px, 276, 26, 10, t);
      cloud(px, 20 + ((t * 5) % 340) - 20, 22, 44); cloud(px, 150 + ((t * 3) % 340) - 20, 36, 30); cloud(px, 90 + ((t * 4 + 120) % 340) - 20, 14, 22);
      // Far lighthouse with beam
      px.rect(40, 58, 14, 42, '#ffffff'); px.rect(40, 58, 3, 42, '#e0e0e0'); px.rect(40, 66, 14, 6, P.red); px.rect(40, 82, 14, 6, P.red); px.rect(37, 52, 20, 8, K); px.rect(38, 53, 18, 6, P.yellow); px.rect(38, 48, 18, 5, '#5d6470');
      const beam = Math.sin(t * 1.5); px.ctx.fillStyle = 'rgba(255,240,150,0.35)'; px.ctx.beginPath(); px.ctx.moveTo(47, 56); px.ctx.lineTo(47 + beam * 90, 20); px.ctx.lineTo(47 + beam * 90 + 26, 30); px.ctx.closePath(); px.ctx.fill();
      // Sea with waves and a boat
      px.rect(0, 100, PW, 40, P.water); px.rect(0, 100, PW, 2, '#7fd1f5');
      for (let row = 0; row < 4; row++) for (let i = 0; i < PW; i += 28) { const wx = (i + Math.floor(t * (6 + row * 2))) % (PW + 28) - 14; px.rect(wx, 106 + row * 8, 10, 1, '#7fd1f5'); px.rect(wx + 4, 107 + row * 8, 4, 1, '#ffffff'); }
      const bob = Math.round(Math.sin(t * 2) * 1.5); px.rect(120, 112 + bob, 30, 8, K); px.rect(121, 113 + bob, 28, 6, '#8b5a2b'); px.rect(134, 96 + bob, 2, 17, K); px.rect(136, 98 + bob, 12, 12, '#ffffff'); px.rect(136, 98 + bob, 12, 1, '#c9c0aa');
      // Dock
      px.rect(0, 134, PW, 46, '#a5642f'); px.rect(0, 132, PW, 2, K); px.rect(0, 134, PW, 1, '#d98a4a');
      for (let i = 0; i < PW; i += 20) { px.rect(i, 134, 1, 46, shade('#a5642f', 0.7)); px.rect(i + 1, 134, 1, 46, tint('#a5642f', 0.15)); }
      for (const x of [14, 296]) { px.rect(x, 120, 8, 16, K); px.rect(x + 1, 121, 6, 14, '#6f3f1c'); px.rect(x + 1, 121, 2, 14, '#8b5a2b'); px.rect(x - 2, 124, 12, 2, '#c58b4a'); }
      // Fish stand with striped awning and hanging fish
      dropShadow(px, 192, 136, 112);
      px.rect(190, 74, 112, 62, K); px.rect(191, 75, 110, 60, '#f6e2c0'); px.rect(191, 75, 110, 2, '#fff2dc'); px.rect(196, 118, 100, 14, '#e8c99a'); px.rect(196, 118, 100, 1, K);
      px.rect(184, 60, 124, 8, K); px.rect(185, 61, 122, 6, P.red);
      for (let i = 0; i < 9; i++) { px.rect(186 + i * 14, 67, 12, 9, i % 2 ? P.red : '#ffffff'); px.rect(186 + i * 14, 74, 12, 2, i % 2 ? shade(P.red, 0.8) : '#dddddd'); }
      for (let i = 0; i < 3; i++) { const x = 204 + i * 32; px.rect(x + 6, 78, 1, 8, K); px.blit(S.fish, x, 84); px.blit(S.fish, x + 12, 96); }
      px.rect(200, 106, 40, 10, K); px.rect(201, 107, 38, 8, '#fffdf5'); px.text('FISH', 220, 108, K, { align: 'center' });
      // Barrel and seagull
      px.blit(S.barrel, 60, 116); px.rect(90 + Math.round(Math.sin(t) * 6), 40, 6, 1, '#ffffff'); px.rect(92 + Math.round(Math.sin(t) * 6), 39, 2, 1, '#ffffff');
      break;
    }
    case 'store': {
      wallpaper(px, '#e8d6b0', 0, 126, 'dots');
      // Shelves with jars and sacks
      for (const y of [24, 60, 96]) { shelfBoard(px, 10, y + 16, 300); for (let i = 0; i < 9; i++) { const x = 20 + i * 33; if ((i + y / 12) % 4 === 3) { px.rect(x - 2, y + 2, 16, 14, '#c8b48c'); px.rect(x - 2, y + 2, 16, 2, '#d9c8a8'); px.rect(x + 1, y + 4, 8, 3, '#8b5a2b'); px.rect(x + 2, y + 9, 8, 1, '#8b5a2b'); } else jar(px, x, y + 2, [P.red, P.yellow, P.green, '#7fd1f5'][i % 4]); } }
      // Counter with register and scale, floor
      px.rect(0, 126, PW, 8, K); px.rect(0, 127, PW, 6, '#a5642f'); px.rect(0, 127, PW, 1, '#d98a4a');
      floorPlanks(px, 134, '#8b6a45');
      px.rect(236, 100, 36, 26, K); px.rect(237, 101, 34, 24, '#5d6470'); px.rect(240, 104, 28, 8, '#dff4ff'); px.text('12', 254, 105, K, { align: 'center' }); for (let i = 0; i < 6; i++) px.rect(240 + (i % 3) * 9, 114 + Math.floor(i / 3) * 5, 6, 3, '#c9c0aa');
      px.rect(280, 108, 2, 18, '#4a4a4a'); px.rect(272, 106, 18, 3, '#4a4a4a'); px.rect(270, 112, 8, 2, '#c58b4a'); px.rect(284, 112, 8, 2, '#c58b4a'); px.rect(272, 109, 1, 4, K); px.rect(288, 109, 1, 4, K);
      // Acorn barrel
      px.rect(40, 88, 40, 44, K); px.rect(41, 89, 38, 42, '#8b5a2b'); px.rect(41, 89, 6, 42, '#a5764a'); px.rect(36, 92, 48, 4, '#4a4a4a'); px.rect(36, 118, 48, 4, '#4a4a4a'); for (let i = 0; i < 10; i++) px.blit(S.acorn, 40 + (i % 5) * 8, 76 - Math.floor(i / 5) * 6);
      // Price signs
      px.rect(120, 108, 30, 14, K); px.rect(121, 109, 28, 12, '#fffdf5'); px.text('5C', 135, 112, P.red, { align: 'center' });
      break;
    }
    case 'street': {
      skyGradient(px, 0, 128, '#6fbfff', '#d6f0ff', 5);
      sun(px, 44, 26, 10, t);
      cloud(px, 100 + ((t * 4) % 340) - 20, 20, 40); cloud(px, 220 + ((t * 3 + 60) % 340) - 20, 34, 26);
      const cols = [P.pink, P.yellow, '#7fd1f5', '#9be07d', P.orange];
      for (let i = 0; i < 5; i++) {
        const x = i * 66 - 4, h = 60 + (i % 3) * 14, y = 126 - h, c = cols[i];
        for (let r = 0; r < 8; r++) px.rect(x - 2 + (8 - r) * 4, y - 8 + r, 62 - (8 - r) * 8, 1, r % 2 ? P.woodDark : '#8b5a2b');
        px.rect(x, y, 58, h, K); px.rect(x + 1, y + 1, 56, h - 1, c);
        if (i % 2) for (let by = y + 4; by < y + h; by += 6) for (let bx = x + 2 + (by % 12 ? 0 : 5); bx < x + 54; bx += 10) px.rect(bx, by, 8, 1, shade(c, 0.85)); else for (let by = y + 3; by < y + h; by += 5) px.rect(x + 1, by, 56, 1, shade(c, 0.9));
        for (let j = 0; j < 2; j++) for (let k = 0; k < 2; k++) { const wx = x + 10 + k * 26, wy = y + 8 + j * 22; px.rect(wx, wy, 12, 14, K); px.rect(wx + 1, wy + 1, 10, 12, '#dff4ff'); px.rect(wx + 1, wy + 1, 4, 5, '#ffffff'); px.rect(wx - 1, wy + 14, 14, 2, shade(c, 0.7)); }
        px.rect(x + 22, y + h - 16, 14, 16, K); px.rect(x + 23, y + h - 15, 12, 15, P.woodDark); px.rect(x + 32, y + h - 8, 2, 2, P.yellow);
        px.rect(x + 6, y + h - 22, 46, 5, shade(c, 0.6)); px.rect(x + 6, y + h - 22, 46, 1, tint(c, 0.3));
      }
      // Lamp post and cobbles
      px.rect(150, 96, 3, 32, '#4a4a4a'); px.rect(146, 90, 11, 8, K); px.rect(147, 91, 9, 6, '#ffe98a'); px.rect(148, 88, 7, 3, '#4a4a4a');
      px.rect(0, 128, PW, PH - 128, '#9aa0ad'); px.rect(0, 128, PW, 2, '#6f7a8f');
      for (let j = 0; j < 6; j++) for (let i = 0; i < 20; i++) { const cx = i * 18 + (j % 2) * 9, cy = 131 + j * 9; px.rect(cx, cy, 15, 6, '#b9bfc9'); px.rect(cx, cy, 15, 1, '#cfd5de'); px.rect(cx, cy + 5, 15, 1, '#7d8590'); }
      break;
    }
    case 'school': {
      wallpaper(px, '#f1e6c8', 0, 120, 'stripes');
      // Alphabet strip and chalkboard
      px.rect(20, 6, 200, 8, '#fffdf5'); px.rect(20, 6, 200, 1, K); px.rect(20, 13, 200, 1, K); px.text('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 120, 7, K, { align: 'center' });
      px.rect(40, 18, 200, 68, K); px.rect(42, 20, 196, 64, '#2f6b4f'); dither(px, 42, 20, 196, 64, '#2f6b4f', '#2b634a'); px.rect(40, 86, 200, 4, P.woodDark); px.rect(40, 86, 200, 1, '#a5764a'); px.rect(60, 84, 10, 2, '#ffffff'); px.rect(80, 84, 10, 2, P.yellow);
      px.text('2 + 3 = 5', 140, 30, '#f5f0d8', { align: 'center', scale: 2 }); px.text('10 9 8 7 6 5', 140, 56, '#f5f0d8', { align: 'center' }); px.rect(60, 70, 8, 8, '#f5f0d8'); px.rect(72, 70, 8, 8, P.yellow); px.rect(84, 70, 8, 8, '#f5f0d8');
      // Clock, flag, window
      px.rect(258, 16, 26, 26, K); px.rect(259, 17, 24, 24, '#fffdf5'); px.rect(270, 21, 2, 8, K); px.rect(270, 28, 7, 2, K); px.rect(271, 29, 1, 1, P.red);
      px.rect(292, 26, 2, 44, P.woodDark); px.rect(294, 26, 20, 13, P.red); px.rect(294, 30, 20, 2, '#ffffff'); px.rect(294, 35, 20, 2, '#ffffff'); px.rect(294, 26, 9, 7, P.blue);
      windowFrame(px, 262, 52, 40, 36, { curtain: '#9be07d', view: 'sky', t });
      // Floor and desks with books
      tileFloor(px, 120, '#e3cf9d', '#d1b782');
      for (const x of [16, 116, 216]) { dropShadow(px, x + 2, 164, 60); px.rect(x, 132, 62, 10, K); px.rect(x + 1, 133, 60, 8, '#8b5a2b'); px.rect(x + 1, 133, 60, 2, '#a5764a'); px.rect(x + 4, 142, 4, 22, '#6f3f1c'); px.rect(x + 54, 142, 4, 22, '#6f3f1c'); book(px, x + 10, 124, 8, P.red); book(px, x + 16, 126, 6, P.blue); px.rect(x + 34, 126, 12, 6, '#fffdf5'); px.rect(x + 36, 128, 8, 1, '#c9c0aa'); }
      // Globe
      px.rect(20, 100, 2, 20, P.woodDark); px.ctx.fillStyle = K; px.ctx.beginPath(); px.ctx.arc(21, 96, 9, 0, Math.PI * 2); px.ctx.fill(); px.ctx.fillStyle = P.sky; px.ctx.beginPath(); px.ctx.arc(21, 96, 8, 0, Math.PI * 2); px.ctx.fill(); px.rect(16, 92, 6, 5, P.green); px.rect(22, 98, 5, 4, P.green);
      break;
    }
    case 'clock': {
      wallpaper(px, '#b9b3a6', 0, 130, 'stone');
      // Gears turning
      gear(px, 40, 40, 22, 10, t * 0.6, '#c58b4a'); gear(px, 86, 74, 16, 8, -t * 0.9, '#d9a066'); gear(px, 128, 34, 12, 6, t * 1.2, '#c58b4a');
      // Clock face from behind
      px.rect(196, 12, 112, 112, K); px.rect(200, 16, 104, 104, '#f5f0d8'); dither(px, 200, 16, 104, 104, '#f5f0d8', '#eee8cc'); px.rect(196, 12, 112, 2, '#e0e0e0');
      for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6, big = i % 3 === 0; px.rect(Math.round(252 + Math.sin(a) * 46) - (big ? 2 : 1), Math.round(68 - Math.cos(a) * 46) - (big ? 2 : 1), big ? 4 : 2, big ? 4 : 2, K); }
      const ha = ((t * 0.05) % 1) * Math.PI * 2, ma = ((t * 0.6) % 1) * Math.PI * 2;
      for (let i = 0; i < 26; i++) px.rect(Math.round(252 + Math.sin(ha) * i) - 1, Math.round(68 - Math.cos(ha) * i) - 1, 3, 3, K);
      for (let i = 0; i < 38; i++) px.rect(Math.round(252 + Math.sin(ma) * i), Math.round(68 - Math.cos(ma) * i), 2, 2, K);
      px.rect(249, 65, 6, 6, P.red);
      // Bell and rope
      px.rect(160, 8, 2, 40, '#8b5a2b'); px.rect(150, 46, 22, 18, K); px.rect(151, 47, 20, 16, '#c9a227'); px.rect(151, 47, 20, 2, '#e8c24a'); px.rect(147, 62, 28, 4, '#a68520'); px.rect(159, 66, 4, 4, K);
      // Floor and stairs
      px.rect(0, 130, PW, 50, '#7d786f'); px.rect(0, 130, PW, 2, '#5d5850'); for (let i = 0; i < PW; i += 26) px.rect(i, 132, 1, 48, '#5d5850');
      for (let i = 0; i < 6; i++) { const sx = i * 22, sy = 170 - i * 8; px.rect(sx, sy, 26, 9, K); px.rect(sx + 1, sy + 1, 24, 7, '#a5a5a5'); px.rect(sx + 1, sy + 1, 24, 1, '#c9c9c9'); }
      // Dust motes
      for (let i = 0; i < 6; i++) px.rect(Math.round(60 + i * 40 + Math.sin(t + i) * 6), Math.round(20 + ((t * 3 + i * 17) % 100)), 1, 1, '#f5f0d8');
      break;
    }
    case 'studio': {
      wallpaper(px, '#f4efe6', 0, 122, 'dots');
      // Skylight
      windowFrame(px, 120, 10, 70, 30, { view: 'sky', t, wood: '#5d6470' });
      // Paint splats
      for (const [x, y, c] of [[24, 30, P.red], [56, 64, P.blue], [98, 50, P.yellow], [80, 96, P.green], [34, 100, P.pink]]) { px.rect(x, y, 8, 8, c); px.rect(x - 3, y + 3, 3, 3, c); px.rect(x + 8, y - 2, 3, 3, c); px.rect(x + 2, y + 9, 2, 3, c); px.rect(x + 1, y + 1, 2, 2, tint(c, 0.4)); }
      // Canvases on the wall
      px.rect(206, 18, 52, 42, K); px.rect(207, 19, 50, 40, '#fffdf5'); px.rect(210, 40, 44, 16, P.green); px.rect(210, 22, 44, 18, P.sky); px.rect(240, 26, 8, 8, P.yellow); px.rect(214, 36, 10, 6, '#ffffff');
      px.rect(266, 24, 40, 32, K); px.rect(267, 25, 38, 30, '#fffdf5'); for (let i = 0; i < 4; i++) px.rect(272 + i * 8, 30 + (i % 2) * 10, 6, 6, [P.red, P.blue, P.yellow, P.green][i]);
      // Floor with drop cloth, easel, paint pots
      floorPlanks(px, 122, '#c9b7a0');
      px.rect(200, 130, 110, 40, '#f2ede2'); for (const [x, y, c] of [[220, 140, P.red], [270, 150, P.blue], [240, 160, P.yellow]]) px.rect(x, y, 5, 3, c);
      px.rect(276, 60, 3, 100, P.woodDark); px.rect(300, 60, 3, 100, P.woodDark); px.rect(272, 84, 34, 3, P.woodDark); px.rect(286, 130, 3, 30, P.woodDark);
      px.rect(268, 40, 44, 44, K); px.rect(269, 41, 42, 42, '#fffdf5'); px.rect(274, 46, 8, 8, P.red); px.rect(284, 46, 8, 8, P.blue); px.rect(294, 46, 8, 8, P.yellow); px.rect(274, 56, 8, 8, P.blue); px.rect(284, 56, 8, 8, P.yellow); px.rect(294, 56, 8, 8, P.red); px.rect(274, 66, 28, 8, P.green);
      for (let i = 0; i < 4; i++) { const x = 110 + i * 16; px.rect(x, 110, 12, 14, K); px.rect(x + 1, 111, 10, 12, '#c9c0aa'); px.rect(x + 2, 108, 8, 4, [P.red, P.blue, P.yellow, P.green][i]); px.rect(x + 4, 100, 2, 10, P.woodDark); }
      // Palette
      px.rect(20, 130, 30, 18, K); px.rect(21, 131, 28, 16, '#d9a066'); for (const [dx, dy, c] of [[4, 3, P.red], [12, 3, P.blue], [20, 3, P.yellow], [8, 9, P.green], [16, 9, P.pink]]) px.rect(21 + dx, 131 + dy, 4, 4, c);
      break;
    }
    case 'workshop': {
      px.clear('#d9c8a8'); px.rect(0, 0, PW, 3, '#8b6a45');
      for (let y = 10; y < 110; y += 8) for (let x = 6; x < PW; x += 8) { px.rect(x, y, 2, 2, '#b9a888'); px.rect(x, y, 1, 1, '#a89878'); }
      // Tools
      px.rect(30, 20, 4, 30, P.woodDark); px.rect(31, 20, 1, 30, '#a5764a'); px.rect(24, 12, 16, 9, K); px.rect(25, 13, 14, 7, '#5d6470'); px.rect(25, 13, 14, 2, '#8a94a0');
      px.rect(60, 16, 3, 34, P.woodDark); for (let i = 0; i < 8; i++) { px.rect(63, 18 + i * 4, 6, 2, '#a5a5a5'); px.rect(63, 18 + i * 4, 6, 1, '#d0d0d0'); }
      px.rect(90, 20, 40, 8, K); px.rect(91, 21, 38, 6, P.yellow); for (let i = 0; i < 8; i++) px.rect(93 + i * 5, 24, 1, 3, K);
      px.rect(150, 18, 6, 30, P.red); px.rect(150, 18, 2, 30, '#ff8a80'); px.rect(148, 14, 10, 6, '#5d6470');
      px.rect(176, 14, 22, 36, K); px.rect(177, 15, 20, 34, '#c58b4a'); px.rect(180, 18, 14, 10, '#5d6470'); px.rect(180, 32, 14, 10, '#5d6470'); px.rect(184, 20, 6, 2, '#a5a5a5');
      // Hanging lamp
      px.rect(240, 0, 2, 20, '#4a4a4a'); px.rect(230, 20, 22, 6, K); px.rect(231, 21, 20, 4, '#5d6470'); px.ctx.fillStyle = 'rgba(255,233,138,0.28)'; px.ctx.beginPath(); px.ctx.moveTo(232, 26); px.ctx.lineTo(206, 100); px.ctx.lineTo(276, 100); px.ctx.closePath(); px.ctx.fill();
      // Window
      windowFrame(px, 262, 30, 44, 34, { view: 'town', t });
      // Floor, bench, planks, toolbox, sawdust
      px.rect(0, 118, PW, 6, '#5d4a30'); floorPlanks(px, 124, '#8b6a45');
      dropShadow(px, 172, 152, 140);
      px.rect(170, 90, 140, 12, K); px.rect(171, 91, 138, 10, '#8b5a2b'); px.rect(171, 91, 138, 2, '#a5764a'); px.rect(176, 102, 6, 50, '#6f3f1c'); px.rect(298, 102, 6, 50, '#6f3f1c'); px.rect(176, 102, 2, 50, '#8b5a2b');
      for (let i = 0; i < 3; i++) { px.rect(180 + i * 4, 78 - i * 6, 90 - i * 20, 7, K); px.rect(181 + i * 4, 79 - i * 6, 88 - i * 20, 5, '#a5642f'); px.rect(181 + i * 4, 79 - i * 6, 88 - i * 20, 1, '#c58b4a'); }
      px.rect(280, 70, 22, 20, K); px.rect(281, 71, 20, 18, '#4a4a4a'); px.rect(286, 66, 10, 6, '#4a4a4a'); px.rect(283, 74, 16, 4, P.red);
      px.rect(40, 150, 40, 10, '#e8c99a'); px.rect(48, 146, 24, 4, '#e8c99a'); px.rect(56, 144, 8, 2, '#f2dfb8');
      // Ladder against the wall
      for (let i = 0; i < 6; i++) px.rect(110, 34 + i * 14, 24, 3, P.woodDark); px.rect(108, 30, 3, 90, P.woodDark); px.rect(133, 30, 3, 90, P.woodDark);
      break;
    }
    case 'lighthouse': {
      wallpaper(px, '#fff1d6', 0, 128, 'stripes');
      // Porthole with sea
      px.ctx.fillStyle = K; px.ctx.beginPath(); px.ctx.arc(250, 52, 40, 0, Math.PI * 2); px.ctx.fill();
      px.ctx.save(); px.ctx.beginPath(); px.ctx.arc(250, 52, 36, 0, Math.PI * 2); px.ctx.clip(); skyGradient(px, 10, 52, '#7fc8ff', '#d6f0ff', 3); px.rect(210, 52, 80, 40, P.water); for (let i = 0; i < 4; i++) px.rect(216 + ((i * 19 + Math.floor(t * 6)) % 70), 58 + i * 7, 8, 1, '#7fd1f5'); cloud(px, 230 + ((t * 4) % 60) - 10, 26, 16); px.rect(226, 36 + Math.round(Math.sin(t * 2)), 12, 4, '#8b5a2b'); px.rect(231, 28 + Math.round(Math.sin(t * 2)), 1, 8, K); px.rect(232, 29 + Math.round(Math.sin(t * 2)), 6, 6, '#ffffff'); px.ctx.restore();
      for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; px.rect(Math.round(250 + Math.cos(a) * 38) - 1, Math.round(52 + Math.sin(a) * 38) - 1, 3, 3, '#c9a227'); }
      // Lamp with sweeping beam
      const beam = Math.sin(t * 1.2); px.ctx.fillStyle = 'rgba(255,240,150,0.3)'; px.ctx.beginPath(); px.ctx.moveTo(150, 60); px.ctx.lineTo(150 + beam * 120, 0); px.ctx.lineTo(150 + beam * 120 + 40, 0); px.ctx.closePath(); px.ctx.fill();
      px.rect(118, 28, 64, 64, K); px.rect(120, 30, 60, 60, '#c9a227'); px.rect(126, 36, 48, 48, '#ffe98a'); dither(px, 126, 36, 48, 48, '#ffe98a', '#fff5c0'); px.rect(140, 50, 20, 20, '#ffffff'); px.rect(120, 30, 60, 2, '#e8c24a');
      px.rect(110, 92, 80, 8, K); px.rect(111, 93, 78, 6, '#5d6470'); px.rect(111, 93, 78, 1, '#8a94a0');
      // Ropes, life ring, log book
      px.rect(10, 10, 3, 80, '#c58b4a'); for (let i = 0; i < 10; i++) px.rect(10, 12 + i * 8, 3, 2, '#a5764a');
      px.ctx.fillStyle = K; px.ctx.beginPath(); px.ctx.arc(50, 40, 16, 0, Math.PI * 2); px.ctx.fill(); px.ctx.fillStyle = '#ffffff'; px.ctx.beginPath(); px.ctx.arc(50, 40, 15, 0, Math.PI * 2); px.ctx.fill(); px.ctx.fillStyle = '#fff1d6'; px.ctx.beginPath(); px.ctx.arc(50, 40, 8, 0, Math.PI * 2); px.ctx.fill(); px.rect(46, 25, 8, 6, P.red); px.rect(46, 49, 8, 6, P.red); px.rect(35, 36, 6, 8, P.red); px.rect(59, 36, 6, 8, P.red);
      // Spiral stairs and floor
      floorPlanks(px, 134, '#a5642f');
      for (let i = 0; i < 7; i++) { const sx = 20 + i * 12, sy = 128 - i * 10; px.rect(sx, sy, 42, 9, K); px.rect(sx + 1, sy + 1, 40, 7, '#c9c0aa'); px.rect(sx + 1, sy + 1, 40, 1, '#e0dccc'); }
      px.rect(60, 100, 3, 40, '#4a4a4a');
      break;
    }
    default:
      px.clear(P.sky);
  }
}

export function corkboardRect() { return { x: 20, y: 16, w: 134, h: 84 }; }
