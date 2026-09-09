// Vector scene backgrounds, 960x540.
import { el } from '../engine/svg.js';

const OUT = '#2b1b0e';
const R = (x, y, w, h, fill, extra = {}) => el('rect', { x, y, width: w, height: h, fill, ...extra });
const RO = (x, y, w, h, fill, extra = {}) => el('rect', { x, y, width: w, height: h, fill, stroke: OUT, 'stroke-width': 4, ...extra });
const C = (cx, cy, r, fill, extra = {}) => el('circle', { cx, cy, r, fill, ...extra });
const E = (cx, cy, rx, ry, fill, extra = {}) => el('ellipse', { cx, cy, rx, ry, fill, ...extra });
const P = (d, fill, extra = {}) => el('path', { d, fill, stroke: OUT, 'stroke-width': 4, ...extra });

function window_(x, y, w, h) {
  const g = el('g');
  g.append(RO(x, y, w, h, '#8fd3ff', { rx: 6 }));
  g.append(C(x + w * 0.7, y + h * 0.3, 22, '#ffe98a'));
  g.append(E(x + w * 0.3, y + h * 0.5, 40, 16, '#fff'), E(x + w * 0.4, y + h * 0.45, 30, 14, '#fff'));
  g.append(RO(x + w / 2 - 4, y, 8, h, '#fff'), RO(x, y + h / 2 - 4, w, 8, '#fff'));
  g.append(RO(x - 10, y - 10, w + 20, 14, '#8b5a2b', { rx: 4 }), RO(x - 10, y + h - 4, w + 20, 14, '#8b5a2b', { rx: 4 }));
  return g;
}

export function corkboard(x, y, w, h) {
  const g = el('g');
  g.append(RO(x, y, w, h, '#c58b4a', { rx: 8 }));
  g.append(R(x + 12, y + 12, w - 24, h - 24, '#d9a066'));
  return g;
}

export function backdrop(name) {
  const g = el('g', { class: 'backdrop ' + name });
  switch (name) {
    case 'office': {
      g.append(R(0, 0, 960, 540, '#d9b98c'));
      for (let i = 0; i < 960; i += 60) g.append(R(i, 0, 30, 380, '#d2ae7e'));
      g.append(R(0, 380, 960, 30, '#8b5a2b'), R(0, 410, 960, 130, '#b07a3c'));
      for (let i = 0; i < 960; i += 120) g.append(R(i, 410, 4, 130, '#8b5a2b'));
      g.append(window_(640, 60, 240, 190));
      g.append(corkboard(60, 50, 400, 250));
      // Desk
      g.append(RO(500, 330, 400, 34, '#8b5a2b', { rx: 6 }), RO(520, 364, 30, 120, '#6f3f1c'), RO(850, 364, 30, 120, '#6f3f1c'));
      g.append(RO(540, 364, 200, 70, '#6f3f1c', { rx: 4 }), RO(560, 380, 60, 12, '#c58b4a', { rx: 3 }), RO(560, 405, 60, 12, '#c58b4a', { rx: 3 }));
      // Lamp
      g.append(RO(800, 240, 8, 90, '#4a4a4a'), P('M 760 250 L 848 250 L 830 205 L 778 205 Z', '#4e9a35'));
      // Donut box
      g.append(RO(700, 300, 80, 30, '#f6b8c8', { rx: 6 }), C(740, 300, 16, '#e8a35b', { stroke: OUT, 'stroke-width': 4 }), C(740, 300, 5, '#f6b8c8', { stroke: OUT, 'stroke-width': 3 }));
      // Rug
      g.append(E(300, 500, 260, 40, '#b8433a', { stroke: OUT, 'stroke-width': 4 }), E(300, 500, 200, 26, '#e0453b'));
      break;
    }
    case 'bakery': {
      g.append(R(0, 0, 960, 540, '#fff1d6'));
      for (let i = 0; i < 960; i += 80) g.append(R(i, 0, 40, 340, '#ffe4e8'));
      // Shelves with bread
      for (const y of [70, 170]) {
        g.append(RO(40, y + 40, 420, 14, '#8b5a2b', { rx: 3 }));
        for (let i = 0; i < 5; i++) {
          const x = 80 + i * 80;
          g.append(E(x, y + 24, 30, 16, i % 2 ? '#e8a35b' : '#c58b4a', { stroke: OUT, 'stroke-width': 4 }));
          g.append(P(`M ${x - 14} ${y + 16} Q ${x - 6} ${y + 8} ${x} ${y + 16} Q ${x + 6} ${y + 8} ${x + 14} ${y + 16}`, 'none'));
        }
      }
      // Mirror on the wall (the clue)
      g.append(E(760, 150, 90, 120, '#c58b4a', { stroke: OUT, 'stroke-width': 4 }), E(760, 150, 74, 104, '#cfe9ff', { stroke: OUT, 'stroke-width': 3 }));
      g.append(P('M 720 90 Q 700 150 720 210', 'none', { stroke: '#fff', 'stroke-width': 6 }));
      // Counter and display case
      g.append(R(0, 340, 960, 200, '#e8c99a'), RO(0, 340, 960, 40, '#a5642f'), R(0, 380, 960, 160, '#c58b4a'));
      g.append(RO(500, 245, 300, 100, '#dff4ff', { rx: 8, 'fill-opacity': .7 }));
      for (let i = 0; i < 4; i++) {
        const x = 540 + i * 70;
        g.append(C(x, 300, 22, '#e8a35b', { stroke: OUT, 'stroke-width': 4 }), C(x, 300, 7, '#f6b8c8', { stroke: OUT, 'stroke-width': 3 }));
      }
      // Sign
      g.append(RO(60, 300, 200, 50, '#fff', { rx: 8 }));
      const t = el('text', { x: 160, y: 335, 'text-anchor': 'middle', 'font-size': 28, 'font-weight': 'bold', fill: OUT, 'font-family': 'inherit' });
      t.textContent = 'MUFFINS';
      g.append(t);
      break;
    }
    case 'harbor': {
      g.append(R(0, 0, 960, 540, '#8fd3ff'));
      g.append(C(820, 90, 50, '#ffe98a', { stroke: OUT, 'stroke-width': 4 }));
      g.append(E(200, 90, 90, 30, '#fff'), E(260, 80, 70, 26, '#fff'), E(600, 60, 80, 24, '#fff'));
      g.append(R(0, 300, 960, 240, '#4aa3df'));
      for (let i = 0; i < 960; i += 90) g.append(P(`M ${i} 360 Q ${i + 22} 350 ${i + 45} 360 Q ${i + 68} 370 ${i + 90} 360`, 'none', { stroke: '#7fd1f5', 'stroke-width': 5 }));
      // Dock
      g.append(RO(0, 400, 960, 140, '#a5642f'));
      for (let i = 0; i < 960; i += 60) g.append(R(i, 400, 4, 140, '#6f3f1c'));
      for (const x of [80, 880]) g.append(RO(x, 380, 22, 60, '#6f3f1c'));
      // Fish stand
      g.append(RO(560, 220, 340, 200, '#f6e2c0', { rx: 8 }));
      for (let i = 0; i < 6; i++) g.append(R(560 + i * 56, 190, 28, 40, i % 2 ? '#e0453b' : '#fff', { stroke: OUT, 'stroke-width': 3 }));
      g.append(RO(556, 180, 348, 16, '#e0453b'));
      for (let i = 0; i < 3; i++) {
        const x = 620 + i * 90;
        g.append(P(`M ${x} 320 Q ${x + 30} 290 ${x + 60} 320 Q ${x + 30} 350 ${x} 320 Z`, '#7fd1f5'), P(`M ${x} 320 L ${x - 18} 305 L ${x - 18} 335 Z`, '#7fd1f5'));
      }
      // Lighthouse far off
      g.append(P('M 120 300 L 140 180 L 180 180 L 200 300 Z', '#fff'), R(140, 200, 40, 24, '#e0453b'), R(140, 250, 40, 24, '#e0453b'));
      g.append(RO(136, 160, 48, 24, '#ffe98a', { rx: 4 }));
      break;
    }
    case 'store': {
      g.append(R(0, 0, 960, 540, '#e8d6b0'));
      // Shelves with jars
      for (const y of [60, 170, 280]) {
        g.append(RO(40, y + 60, 880, 14, '#8b5a2b', { rx: 3 }));
        for (let i = 0; i < 9; i++) {
          const x = 90 + i * 100, col = ['#e0453b', '#ffcc4d', '#4e9a35', '#7fd1f5'][i % 4];
          g.append(RO(x - 22, y, 44, 60, col, { rx: 8 }), RO(x - 16, y - 10, 32, 14, '#8b5a2b', { rx: 4 }));
        }
      }
      // Counter with acorn barrel
      g.append(RO(0, 380, 960, 40, '#a5642f'), R(0, 420, 960, 120, '#c58b4a'));
      g.append(RO(120, 250, 120, 130, '#8b5a2b', { rx: 12 }), R(110, 260, 140, 14, '#4a4a4a'), R(110, 340, 140, 14, '#4a4a4a'));
      for (let i = 0; i < 8; i++) g.append(E(140 + (i % 4) * 26, 245 - Math.floor(i / 4) * 16, 12, 9, '#c58b4a', { stroke: OUT, 'stroke-width': 3 }));
      break;
    }
    case 'street': {
      g.append(R(0, 0, 960, 540, '#8fd3ff'));
      g.append(C(140, 90, 50, '#ffe98a', { stroke: OUT, 'stroke-width': 4 }));
      const cols = ['#f6b8c8', '#ffcc4d', '#7fd1f5', '#9be07d', '#f0842c'];
      for (let i = 0; i < 5; i++) {
        const x = i * 200, h = 200 + (i % 3) * 40;
        g.append(RO(x, 380 - h, 180, h, cols[i]));
        g.append(P(`M ${x - 10} ${380 - h} L ${x + 90} ${330 - h} L ${x + 190} ${380 - h} Z`, '#8b5a2b'));
        for (let j = 0; j < 2; j++) for (let k = 0; k < 2; k++) g.append(RO(x + 30 + k * 80, 400 - h + j * 70, 40, 44, '#fff', { rx: 4 }));
      }
      g.append(R(0, 380, 960, 160, '#9aa0ad'));
      for (let j = 0; j < 4; j++) for (let i = 0; i < 12; i++) g.append(E(i * 84 + (j % 2) * 42, 400 + j * 40, 34, 14, '#b9bfc9', { stroke: '#5d6470', 'stroke-width': 3 }));
      break;
    }
    default:
      g.append(R(0, 0, 960, 540, '#8fd3ff'));
  }
  return g;
}
