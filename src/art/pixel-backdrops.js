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

export function drawBackdrop(px, name) {
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
    default:
      px.clear(P.sky);
  }
}
