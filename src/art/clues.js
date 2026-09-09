// Small SVG clue icons, drawn in a 100x100 box.
import { el } from '../engine/svg.js';

const OUT = '#2b1b0e';
const P = (d, fill, extra = {}) => el('path', { d, fill, stroke: OUT, 'stroke-width': 4, 'stroke-linejoin': 'round', ...extra });

export function clueIcon(id) {
  const g = el('g');
  if (id === 'slip') {
    g.append(P('M 20 10 L 80 10 L 80 90 L 20 90 Z', '#fffdf5'));
    for (const y of [30, 45, 60, 75]) g.append(P(`M 30 ${y} L 70 ${y}`, 'none', { stroke: '#c9c0aa', 'stroke-width': 3 }));
    const t = el('text', { x: 50, y: 58, 'text-anchor': 'middle', 'font-size': 26, 'font-weight': 'bold', fill: OUT, 'font-family': 'inherit' });
    t.textContent = '3+4=7';
    g.append(t);
  } else if (id === 'wall') {
    g.append(P('M 10 10 L 90 10 L 90 90 L 10 90 Z', '#e8c99a'));
    for (const y of [30, 50, 70]) g.append(P(`M 10 ${y} L 90 ${y}`, 'none', { stroke: '#c58b4a', 'stroke-width': 3 }));
    g.append(P('M 25 40 L 50 40 M 65 40 L 90 40 M 40 60 L 75 60', 'none', { stroke: '#c58b4a', 'stroke-width': 3 }));
    g.append(el('ellipse', { cx: 50, cy: 52, rx: 26, ry: 16, fill: '#fff', stroke: OUT, 'stroke-width': 4 }));
    g.append(el('circle', { cx: 50, cy: 52, r: 9, fill: OUT }));
  } else if (id === 'mirror') {
    g.append(el('ellipse', { cx: 50, cy: 50, rx: 34, ry: 44, fill: '#c58b4a', stroke: OUT, 'stroke-width': 4 }));
    g.append(el('ellipse', { cx: 50, cy: 50, rx: 26, ry: 36, fill: '#cfe9ff', stroke: OUT, 'stroke-width': 3 }));
    g.append(P('M 36 26 Q 28 50 36 74', 'none', { stroke: '#fff', 'stroke-width': 5, 'stroke-linecap': 'round' }));
  } else if (id === 'piece') {
    g.append(P('M 12 20 L 88 12 L 84 88 L 16 80 Z', '#f6e2c0'));
    g.append(P('M 30 30 Q 50 50 70 34 Q 60 60 40 66', 'none', { stroke: '#8b5a2b', 'stroke-width': 3, 'stroke-dasharray': '6 5' }));
    g.append(P('M 62 58 L 74 70 M 74 58 L 62 70', 'none', { stroke: '#e0453b', 'stroke-width': 5, 'stroke-linecap': 'round' }));
  }
  return g;
}
