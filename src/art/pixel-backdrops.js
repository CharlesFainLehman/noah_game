// Pixel scene backgrounds drawn onto a 320x180 Pixel canvas.
import { PW, PH } from '../engine/pixel.js';
import { P } from './palette.js';
import { sprites } from './sprites.js';

function stripes(px, color, w = 12, period = 24, h = 108) {
  for (let i = 0; i < PW; i += period) px.rect(i, 0, w, h, color);
}

function windowPane(px, x, y, w, h) {
  px.box(x, y, w, h, P.sky);
  px.rect(x + w - 16, y + 8, 8, 8, '#ffe98a');
  px.rect(x + 6, y + 18, 18, 4, P.w); px.rect(x + 10, y + 16, 10, 2, P.w);
  px.rect(x + Math.floor(w / 2) - 1, y, 2, h, P.k); px.rect(x, y + Math.floor(h / 2) - 1, w, 2, P.k);
  px.rect(x - 3, y - 3, w + 6, 3, P.woodDark); px.rect(x - 3, y + h, w + 6, 3, P.woodDark);
}

export function corkboardRect() { return { x: 20, y: 16, w: 134, h: 84 }; }

export const DECOR = [
  { id: 'fishbowl', name: 'Goldfish bowl', cost: 1 },
  { id: 'plant', name: 'Potted plant', cost: 2 },
  { id: 'hatrack', name: 'Hat rack', cost: 2 },
  { id: 'rug', name: 'Fancy rug', cost: 3 },
  { id: 'portrait', name: 'Portrait of Nibbles', cost: 3 },
  { id: 'globe', name: 'Globe', cost: 4 },
];

function drawDecor(px, decor) {
  if (decor.includes('fishbowl')) { px.box(196, 96, 18, 14, '#cfe9ff'); px.rect(200, 92, 10, 4, '#cfe9ff'); px.rect(203, 102, 5, 3, P.orange); px.rect(207, 101, 2, 5, P.orange); }
  if (decor.includes('plant')) { px.box(300, 96, 16, 14, '#c8763a'); px.rect(302, 80, 12, 16, P.green); px.rect(298, 86, 6, 8, P.green); px.rect(312, 84, 6, 8, P.green); px.rect(306, 74, 4, 8, P.green); }
  if (decor.includes('hatrack')) { px.rect(170, 60, 3, 66, P.woodDark); px.rect(160, 70, 23, 3, P.woodDark); px.rect(160, 62, 12, 4, '#8b5a2b'); px.rect(163, 58, 6, 5, '#8b5a2b'); px.rect(176, 62, 10, 6, P.red); }
  if (decor.includes('rug')) { px.rect(24, 154, 120, 18, P.blue); px.rect(30, 158, 108, 10, '#7fd1f5'); for (let i = 0; i < 6; i++) px.rect(36 + i * 18, 161, 6, 4, P.yellow); }
  if (decor.includes('portrait')) { px.box(164, 20, 30, 36, '#c58b4a'); px.rect(168, 24, 22, 28, '#e8d6b0'); px.rect(172, 30, 14, 10, '#a5a5a5'); px.rect(174, 33, 10, 4, '#3a3a3a'); px.rect(175, 34, 2, 2, P.w); px.rect(181, 34, 2, 2, P.w); px.rect(172, 40, 14, 10, '#8e8e8e'); }
  if (decor.includes('globe')) { px.rect(250, 96, 2, 12, P.woodDark); px.rect(246, 108, 10, 2, P.woodDark); px.ctx.fillStyle = P.k; px.ctx.beginPath(); px.ctx.arc(251, 92, 8, 0, Math.PI * 2); px.ctx.fill(); px.ctx.fillStyle = P.sky; px.ctx.beginPath(); px.ctx.arc(251, 92, 7, 0, Math.PI * 2); px.ctx.fill(); px.rect(247, 89, 5, 4, P.green); px.rect(252, 94, 4, 3, P.green); }
}

function drawTrophies(px, trophies, gold) {
  const S = sprites();
  px.rect(20, 112, 134, 3, P.woodDark);
  for (let i = 0; i < 8; i++) { if (i < trophies) px.blit(S.trophy, 24 + i * 16, 100); else px.rect(28 + i * 16, 109, 4, 2, '#b9a58a'); }
  for (let i = 0; i < gold; i++) px.blit(S.star, 24 + i * 11, 118);
}

export function drawBackdrop(px, name, opts = {}) {
  const S = sprites();
  switch (name) {
    case 'office': {
      px.clear('#d9b98c'); stripes(px, '#d2ae7e', 10, 20, 126);
      px.rect(0, 126, PW, 10, P.woodDark); px.rect(0, 136, PW, PH - 136, P.wood);
      for (let i = 0; i < PW; i += 40) px.rect(i, 136, 1, PH - 136, P.woodDark);
      windowPane(px, 214, 20, 80, 64);
      const cb = corkboardRect();
      px.box(cb.x, cb.y, cb.w, cb.h, '#c58b4a'); px.rect(cb.x + 4, cb.y + 4, cb.w - 8, cb.h - 8, '#d9a066');
      // Desk
      px.box(166, 110, 134, 10, P.woodDark); px.rect(172, 120, 8, 40, P.woodDark); px.rect(286, 120, 8, 40, P.woodDark);
      px.box(184, 120, 60, 26, P.woodDark); px.rect(192, 126, 20, 3, P.tan); px.rect(192, 134, 20, 3, P.tan);
      // Lamp
      px.rect(270, 82, 2, 28, '#4a4a4a'); px.rect(258, 80, 26, 4, P.green); px.rect(262, 76, 18, 4, P.green);
      // Donut box
      px.box(230, 100, 26, 10, P.pink); px.rect(240, 96, 8, 6, '#e8a35b'); px.rect(243, 98, 2, 2, P.pink);
      // Rug
      px.rect(24, 154, 120, 18, '#b8433a'); px.rect(30, 158, 108, 10, P.red);
      if (opts.decor) drawDecor(px, opts.decor);
      if (opts.trophies !== undefined) drawTrophies(px, opts.trophies, opts.gold || 0);
      break;
    }
    case 'bakery': {
      px.clear(P.cream); stripes(px, '#ffe4e8');
      px.rect(0, 108, PW, 6, P.woodDark); px.rect(0, 114, PW, PH - 114, P.wood);
      for (let i = 0; i < PW; i += 40) px.rect(i, 114, 1, PH - 114, P.woodDark);
      for (const y of [30, 60]) {
        px.rect(6, y, 56, 3, P.woodDark);
        for (let i = 0; i < 3; i++) { px.rect(10 + i * 18, y - 8, 14, 8, P.brown); px.rect(11 + i * 18, y - 9, 12, 1, P.tan); }
      }
      // Mirror on the wall
      px.rect(262, 20, 34, 46, P.k); px.rect(264, 22, 30, 42, '#c58b4a'); px.rect(268, 26, 22, 34, '#cfe9ff'); px.rect(270, 30, 2, 20, P.w);
      // Display case with donuts
      px.box(256, 84, 60, 24, '#dff4ff');
      for (let i = 0; i < 3; i++) { px.rect(262 + i * 18, 92, 10, 8, '#e8a35b'); px.rect(266 + i * 18, 95, 2, 2, P.pink); }
      break;
    }
    case 'harbor': {
      px.clear(P.sky);
      px.rect(268, 14, 24, 24, '#ffe98a'); px.rect(272, 10, 16, 32, '#ffe98a'); px.rect(264, 18, 32, 16, '#ffe98a');
      for (const [x, y, w] of [[30, 20, 50], [120, 34, 40], [200, 16, 46]]) { px.rect(x, y, w, 8, P.w); px.rect(x + 8, y - 4, w - 16, 4, P.w); px.rect(x + 4, y + 8, w - 8, 3, P.w); }
      px.rect(0, 100, PW, 80, P.water);
      for (let i = 0; i < PW; i += 20) px.rect(i, 112, 8, 1, '#7fd1f5');
      // Lighthouse far off
      px.rect(40, 60, 14, 40, P.w); px.rect(40, 68, 14, 6, P.red); px.rect(40, 84, 14, 6, P.red); px.box(37, 52, 20, 8, P.yellow);
      // Dock
      px.rect(0, 134, PW, 46, P.wood); px.rect(0, 132, PW, 2, P.k);
      for (let i = 0; i < PW; i += 20) px.rect(i, 134, 1, 46, P.woodDark);
      px.rect(20, 124, 6, 14, P.woodDark); px.rect(290, 124, 6, 14, P.woodDark);
      // Fish stand
      px.box(190, 74, 112, 62, '#f6e2c0');
      px.rect(186, 62, 120, 6, P.red);
      for (let i = 0; i < 8; i++) px.rect(188 + i * 15, 66, 12, 10, i % 2 ? P.red : P.w);
      for (let i = 0; i < 3; i++) { const x = 202 + i * 32; px.rect(x, 100, 16, 8, '#7fd1f5'); px.rect(x + 16, 98, 4, 12, '#7fd1f5'); px.rect(x + 3, 102, 2, 2, P.k); }
      break;
    }
    case 'store': {
      px.clear('#e8d6b0');
      for (const y of [20, 56, 92]) {
        px.rect(10, y + 20, 300, 4, P.woodDark);
        for (let i = 0; i < 9; i++) {
          const x = 24 + i * 33, col = [P.red, P.yellow, P.green, '#7fd1f5'][i % 4];
          px.box(x, y, 14, 20, col); px.rect(x + 2, y - 3, 10, 4, P.woodDark);
        }
      }
      px.rect(0, 126, PW, 8, P.woodDark); px.rect(0, 134, PW, PH - 134, P.wood);
      px.box(40, 86, 40, 44, P.woodDark); px.rect(36, 90, 48, 4, '#4a4a4a'); px.rect(36, 116, 48, 4, '#4a4a4a');
      for (let i = 0; i < 8; i++) px.rect(44 + (i % 4) * 9, 82 - Math.floor(i / 4) * 5, 6, 5, '#c58b4a');
      break;
    }
    case 'street': {
      px.clear(P.sky);
      px.rect(38, 22, 20, 20, '#ffe98a'); px.rect(42, 18, 12, 28, '#ffe98a'); px.rect(34, 26, 28, 12, '#ffe98a');
      const cols = [P.pink, P.yellow, '#7fd1f5', '#9be07d', P.orange];
      for (let i = 0; i < 5; i++) {
        const x = i * 66, h = 60 + (i % 3) * 14, y = 126 - h;
        for (let r = 0; r < 8; r++) px.rect(x - 2 + Math.floor((8 - r) * 4), y - 8 + r, 62 - Math.floor((8 - r) * 8), 1, P.woodDark);
        px.box(x, y, 58, h, cols[i]);
        for (let j = 0; j < 2; j++) for (let k = 0; k < 2; k++) px.box(x + 10 + k * 26, y + 8 + j * 22, 12, 14, P.w);
        px.box(x + 23, y + h - 14, 12, 14, P.woodDark);
      }
      px.rect(0, 126, PW, PH - 126, P.grey);
      for (let j = 0; j < 5; j++) for (let i = 0; i < 20; i++) px.rect(i * 18 + (j % 2) * 9, 130 + j * 10, 14, 6, '#b9bfc9');
      break;
    }
    case 'school': {
      px.clear('#f1e6c8'); stripes(px, '#e9dcb8', 8, 32, 120);
      px.rect(0, 120, PW, 6, P.woodDark); px.rect(0, 126, PW, PH - 126, '#c9a26a');
      for (let i = 0; i < PW; i += 32) px.rect(i, 126, 1, PH - 126, '#a5824f');
      // Chalkboard
      px.box(40, 14, 200, 70, '#2f6b4f'); px.rect(40, 84, 200, 4, P.woodDark);
      px.text('2 + 3 = 5', 140, 30, '#f5f0d8', { align: 'center', scale: 2 });
      px.text('10 9 8 7 6 5', 140, 58, '#f5f0d8', { align: 'center' });
      // Desks
      for (const x of [20, 120, 220]) { px.box(x, 132, 60, 8, P.woodDark); px.rect(x + 4, 140, 4, 22, P.woodDark); px.rect(x + 52, 140, 4, 22, P.woodDark); }
      // Clock and flag
      px.box(262, 20, 24, 24, P.w); px.rect(273, 24, 2, 8, P.k); px.rect(273, 31, 6, 2, P.k);
      px.rect(290, 30, 2, 40, P.woodDark); px.rect(292, 30, 18, 12, P.red); px.rect(292, 30, 8, 6, P.blue);
      break;
    }
    case 'clock': {
      px.clear('#b9b3a6'); stripes(px, '#aaa497', 6, 18, 130);
      px.rect(0, 130, PW, 50, '#7d786f');
      for (let i = 0; i < PW; i += 26) px.rect(i, 130, 1, 50, '#5d6470');
      // Big clock face from behind (round window)
      px.rect(196, 14, 110, 110, P.k); px.rect(200, 18, 102, 102, '#f5f0d8');
      px.rect(249, 20, 4, 8, P.k); px.rect(249, 110, 4, 8, P.k); px.rect(202, 67, 8, 4, P.k); px.rect(292, 67, 8, 4, P.k);
      px.rect(249, 40, 4, 32, P.k); px.rect(249, 67, 30, 4, P.k); px.rect(247, 65, 8, 8, P.k);
      // Gears
      for (const [x, y, r] of [[40, 40, 22], [90, 80, 16], [130, 36, 12]]) {
        px.rect(x - r, y - 4, r * 2, 8, '#8b5a2b'); px.rect(x - 4, y - r, 8, r * 2, '#8b5a2b');
        px.rect(x - r + 4, y - r + 4, r * 2 - 8, r * 2 - 8, '#c58b4a'); px.rect(x - 3, y - 3, 6, 6, P.k);
      }
      // Stairs
      for (let i = 0; i < 6; i++) px.box(i * 22, 130 - i * 8 + 40, 24, 8, '#a5a5a5');
      break;
    }
    case 'studio': {
      px.clear('#f4efe6'); stripes(px, '#ece5d8', 6, 30, 122);
      px.rect(0, 122, PW, 6, P.woodDark); px.rect(0, 128, PW, PH - 128, '#c9b7a0');
      for (let i = 0; i < PW; i += 36) px.rect(i, 128, 1, PH - 128, '#a08e78');
      // Paint splats
      for (const [x, y, c] of [[30, 30, P.red], [60, 60, P.blue], [110, 40, P.yellow], [90, 90, P.green], [40, 100, P.pink]]) { px.rect(x, y, 8, 8, c); px.rect(x - 3, y + 3, 3, 3, c); px.rect(x + 8, y - 2, 3, 3, c); }
      // Canvases on the wall
      px.box(150, 20, 50, 40, P.w); for (let i = 0; i < 4; i++) px.rect(156 + i * 10, 28 + (i % 2) * 8, 8, 8, [P.red, P.blue, P.yellow, P.green][i]);
      px.box(220, 24, 40, 32, P.w); px.rect(226, 30, 28, 20, P.sky); px.rect(226, 42, 28, 8, P.green);
      // Easel
      px.rect(276, 60, 3, 100, P.woodDark); px.rect(300, 60, 3, 100, P.woodDark); px.rect(272, 80, 34, 3, P.woodDark);
      px.box(270, 40, 40, 40, P.w); px.rect(276, 46, 6, 6, P.red); px.rect(284, 46, 6, 6, P.blue); px.rect(292, 46, 6, 6, P.yellow); px.rect(276, 54, 6, 6, P.blue);
      break;
    }
    case 'workshop': {
      px.clear('#d9c8a8');
      for (let y = 10; y < 110; y += 8) for (let x = 6; x < PW; x += 8) px.rect(x, y, 2, 2, '#b9a888'); // pegboard
      px.rect(0, 118, PW, 6, P.woodDark); px.rect(0, 124, PW, PH - 124, '#8b6a45');
      // Tools on pegboard
      px.rect(30, 20, 4, 30, P.woodDark); px.rect(24, 14, 16, 8, P.greyDark); // hammer
      px.rect(60, 16, 3, 34, P.woodDark); for (let i = 0; i < 8; i++) px.rect(63, 18 + i * 4, 6, 2, P.grey); // saw
      px.box(90, 20, 40, 8, P.yellow); for (let i = 0; i < 8; i++) px.rect(92 + i * 5, 24, 1, 4, P.k); // ruler
      px.rect(150, 18, 6, 30, P.red); px.rect(148, 14, 10, 6, P.greyDark); // screwdriver
      // Workbench with planks
      px.box(170, 90, 140, 12, P.woodDark);
      px.rect(176, 102, 6, 50, P.woodDark); px.rect(298, 102, 6, 50, P.woodDark);
      for (let i = 0; i < 3; i++) px.box(180 + i * 4, 78 - i * 6, 90 - i * 20, 6, P.wood);
      // Sawdust pile
      px.rect(40, 150, 40, 10, '#e8c99a'); px.rect(48, 146, 24, 4, '#e8c99a');
      break;
    }
    case 'lighthouse': {
      px.clear('#fff1d6'); stripes(px, '#ffe4e8', 14, 40, 120);
      // Round window with sea
      px.rect(210, 20, 80, 70, P.k); px.rect(214, 24, 72, 62, P.sky); px.rect(214, 60, 72, 26, P.water);
      px.rect(240, 30, 16, 12, P.w); px.rect(244, 26, 8, 4, P.w); px.rect(226, 50, 20, 6, P.w);
      // Spiral stairs suggestion
      for (let i = 0; i < 7; i++) px.box(20 + i * 12, 120 - i * 10, 40, 8, '#c9c0aa');
      // Big lamp
      px.box(120, 30, 60, 60, P.yellow); px.rect(128, 38, 44, 44, '#ffe98a'); px.rect(140, 50, 20, 20, P.w);
      px.rect(110, 90, 80, 8, P.greyDark);
      px.rect(0, 128, PW, 6, P.woodDark); px.rect(0, 134, PW, PH - 134, P.wood);
      for (let i = 0; i < PW; i += 32) px.rect(i, 134, 1, PH - 134, P.woodDark);
      break;
    }
    default:
      px.clear(P.sky);
  }
}
