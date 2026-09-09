// Vector cartoon characters. Each is an SVG <g> with feet at (0,0), about 250 tall.
import { el } from '../engine/svg.js';

const OUT = '#2b1b0e', SW = 4;
const circ = (cx, cy, r, fill, extra = {}) => el('circle', { cx, cy, r, fill, stroke: OUT, 'stroke-width': SW, ...extra });
const ell = (cx, cy, rx, ry, fill, extra = {}) => el('ellipse', { cx, cy, rx, ry, fill, stroke: OUT, 'stroke-width': SW, ...extra });
const path = (d, fill = 'none', extra = {}) => el('path', { d, fill, stroke: OUT, 'stroke-width': SW, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...extra });
const rect = (x, y, w, h, fill, extra = {}) => el('rect', { x, y, width: w, height: h, fill, stroke: OUT, 'stroke-width': SW, rx: 8, ...extra });

export const SPECIES = {
  basset:   { body: '#b5773f', head: '#b5773f', belly: '#f1dfc0', ears: 'droop', earColor: '#7a4a22', muzzle: '#f1dfc0', nose: '#2b1b0e', hat: 'deerstalker', eyes: 'sleepy', label: 'Bart' },
  goose:    { body: '#ffffff', head: '#ffffff', ears: 'none', beak: 'goose', hat: 'chef', apron: '#7fd1f5', neck: true, label: 'Chef Gaston' },
  pigeon:   { body: '#8e97a8', head: '#6f7a8f', ears: 'none', beak: 'small', wings: true, bag: true, legColor: '#f0842c', label: 'Pip' },
  otter:    { body: '#8a5a3a', head: '#8a5a3a', belly: '#d9b98c', ears: 'round', muzzle: '#d9b98c', nose: '#2b1b0e', whiskers: true, tail: 'otter', label: 'Otto' },
  squirrel: { body: '#c0652d', head: '#c0652d', belly: '#f6e2c0', ears: 'tuft', earInner: '#f6b8c8', muzzle: '#f6e2c0', nose: '#2b1b0e', tail: 'squirrel', glasses: true, label: 'Mrs. Nutley' },
  fox:      { body: '#f0842c', head: '#f0842c', belly: '#fff2dc', ears: 'point', earInner: '#fff2dc', muzzle: '#fff2dc', nose: '#2b1b0e', tail: 'fox', label: 'Fox' },
  rabbit:   { body: '#c9c6d9', head: '#c9c6d9', belly: '#ffffff', ears: 'long', earInner: '#f6b8c8', nose: '#f08aa8', teeth: true, whiskers: true, label: 'Rabbit' },
  hedgehog: { body: '#c99a63', head: '#e8caa0', belly: '#f5e6cc', ears: 'round', spikes: '#6f4a2a', nose: '#2b1b0e', label: 'Hedgehog' },
  cat:      { body: '#f2a33a', head: '#f2a33a', belly: '#fff2dc', ears: 'point', earInner: '#f6b8c8', nose: '#f08aa8', whiskers: true, stripes: '#c67a1c', tail: 'cat', label: 'Cat' },
  raccoon:  { body: '#8e8e8e', head: '#a5a5a5', belly: '#d8d8d8', ears: 'round', earInner: '#d8d8d8', mask: '#3a3a3a', nose: '#2b1b0e', tail: 'raccoon', label: 'Nibbles' },
};

// Head center is at (0, -185), radius 62. Features are placed relative to that.
const HX = 0, HY = -185, HR = 62;

function ears(S, headColor) {
  const g = el('g');
  const inner = S.earInner || headColor;
  switch (S.ears) {
    case 'droop':
      g.append(ell(HX - 58, HY + 20, 18, 52, S.earColor), ell(HX + 58, HY + 20, 18, 52, S.earColor));
      break;
    case 'point':
      g.append(path(`M ${HX - 52} ${HY - 30} L ${HX - 58} ${HY - 105} L ${HX - 8} ${HY - 58} Z`, headColor),
               path(`M ${HX - 44} ${HY - 40} L ${HX - 50} ${HY - 88} L ${HX - 18} ${HY - 58} Z`, inner, { stroke: 'none' }),
               path(`M ${HX + 52} ${HY - 30} L ${HX + 58} ${HY - 105} L ${HX + 8} ${HY - 58} Z`, headColor),
               path(`M ${HX + 44} ${HY - 40} L ${HX + 50} ${HY - 88} L ${HX + 18} ${HY - 58} Z`, inner, { stroke: 'none' }));
      break;
    case 'long':
      g.append(ell(HX - 28, HY - 100, 15, 58, headColor, { transform: `rotate(-8 ${HX - 28} ${HY - 100})` }),
               ell(HX - 28, HY - 100, 7, 42, inner, { stroke: 'none', transform: `rotate(-8 ${HX - 28} ${HY - 100})` }),
               ell(HX + 28, HY - 100, 15, 58, headColor, { transform: `rotate(8 ${HX + 28} ${HY - 100})` }),
               ell(HX + 28, HY - 100, 7, 42, inner, { stroke: 'none', transform: `rotate(8 ${HX + 28} ${HY - 100})` }));
      break;
    case 'round':
      g.append(circ(HX - 48, HY - 48, 18, S.body), circ(HX - 48, HY - 48, 9, inner, { stroke: 'none' }),
               circ(HX + 48, HY - 48, 18, S.body), circ(HX + 48, HY - 48, 9, inner, { stroke: 'none' }));
      break;
    case 'tuft':
      g.append(path(`M ${HX - 50} ${HY - 30} L ${HX - 54} ${HY - 95} L ${HX - 40} ${HY - 105} L ${HX - 12} ${HY - 58} Z`, headColor),
               path(`M ${HX + 50} ${HY - 30} L ${HX + 54} ${HY - 95} L ${HX + 40} ${HY - 105} L ${HX + 12} ${HY - 58} Z`, headColor));
      break;
  }
  return g;
}

function tail(S) {
  const g = el('g');
  switch (S.tail) {
    case 'fox':
      g.append(ell(62, -70, 42, 24, S.body, { transform: 'rotate(-30 62 -70)' }), circ(92, -88, 14, '#fff2dc'));
      break;
    case 'cat':
      g.append(path('M 40 -60 C 100 -60 110 -130 70 -140', 'none', { 'stroke-width': 18, stroke: OUT }),
               path('M 40 -60 C 100 -60 110 -130 70 -140', 'none', { 'stroke-width': 10, stroke: S.body }));
      break;
    case 'otter':
      g.append(path('M 30 -30 C 90 -20 110 -60 100 -80 L 80 -70 C 85 -50 60 -45 30 -55 Z', S.body));
      break;
    case 'squirrel':
      g.append(path('M 35 -60 C 120 -70 130 -180 80 -230 C 60 -250 20 -240 40 -210 C 90 -190 90 -110 35 -95 Z', S.body),
               path('M 55 -95 C 100 -110 100 -180 70 -215', 'none', { stroke: '#f6e2c0', 'stroke-width': 10 }));
      break;
    case 'raccoon':
      g.append(ell(70, -60, 40, 20, S.body, { transform: 'rotate(-40 70 -60)' }),
               path('M 58 -50 L 72 -66 M 72 -70 L 86 -86', 'none', { stroke: '#3a3a3a', 'stroke-width': 10 }));
      break;
  }
  return g;
}

function hat(S) {
  const g = el('g');
  if (S.hat === 'deerstalker') {
    const col = '#8b5a2b';
    g.append(rect(HX - 66, HY - 62, 22, 44, col, { rx: 6 }), rect(HX + 44, HY - 62, 22, 44, col, { rx: 6 }));
    g.append(path(`M ${HX - 64} ${HY - 40} Q ${HX} ${HY - 130} ${HX + 64} ${HY - 40} Z`, col));
    g.append(path(`M ${HX - 40} ${HY - 60} Q ${HX} ${HY - 115} ${HX + 40} ${HY - 60}`, 'none', { stroke: '#c58b4a', 'stroke-width': 3 }));
    g.append(path(`M ${HX - 20} ${HY - 48} Q ${HX} ${HY - 118} ${HX + 20} ${HY - 48}`, 'none', { stroke: '#c58b4a', 'stroke-width': 3 }));
    g.append(ell(HX, HY - 40, 80, 13, col));
  } else if (S.hat === 'chef') {
    g.append(circ(HX - 30, HY - 108, 26, '#fff'), circ(HX + 30, HY - 108, 26, '#fff'), circ(HX, HY - 122, 30, '#fff'));
    g.append(rect(HX - 42, HY - 100, 84, 46, '#fff', { rx: 10 }));
  }
  return g;
}

function face(S, expr) {
  const g = el('g');
  const ey = HY - 10, ex = 24;
  if (S.mask) g.append(ell(HX, ey + 2, 56, 24, S.mask, { stroke: 'none' }));
  if (S.stripes) {
    for (const dx of [-16, 0, 16]) g.append(path(`M ${HX + dx} ${HY - 60} L ${HX + dx} ${HY - 40}`, 'none', { stroke: S.stripes, 'stroke-width': 6 }));
  }
  if (S.muzzle) g.append(ell(HX, HY + 22, 34, 24, S.muzzle, { stroke: 'none' }));
  // Eyes
  const big = expr === 'surprised';
  const er = big ? 17 : 14, pr = big ? 8 : 6;
  for (const sx of [-1, 1]) {
    g.append(circ(HX + sx * ex, ey, er, '#fff'));
    g.append(circ(HX + sx * ex + sx * 2, ey + 2, pr, OUT, { stroke: 'none' }));
    g.append(circ(HX + sx * ex - 2, ey - 3, 2.5, '#fff', { stroke: 'none' }));
  }
  const sleepy = S.eyes === 'sleepy' && expr !== 'surprised' && expr !== 'happy';
  if (sleepy) {
    for (const sx of [-1, 1]) {
      const cx = HX + sx * ex;
      g.append(path(`M ${cx - 15} ${ey - 1} A 15 15 0 0 1 ${cx + 15} ${ey - 1} Z`, S.head, { stroke: 'none' }));
      g.append(path(`M ${cx - 14} ${ey - 1} L ${cx + 14} ${ey - 1}`));
    }
  }
  if (expr === 'sad') {
    g.append(path(`M ${HX - 38} ${ey - 30} L ${HX - 12} ${ey - 22}`), path(`M ${HX + 38} ${ey - 30} L ${HX + 12} ${ey - 22}`));
  }
  if (S.glasses) {
    g.append(circ(HX - ex, ey, 19, 'none', { 'stroke-width': 3 }), circ(HX + ex, ey, 19, 'none', { 'stroke-width': 3 }),
             path(`M ${HX - 5} ${ey} L ${HX + 5} ${ey}`, 'none', { 'stroke-width': 3 }));
  }
  // Nose or beak
  if (S.beak === 'goose') {
    g.append(path(`M ${HX - 24} ${HY + 8} Q ${HX} ${HY + 2} ${HX + 24} ${HY + 8} Q ${HX + 20} ${HY + 34} ${HX} ${HY + 36} Q ${HX - 20} ${HY + 34} ${HX - 24} ${HY + 8} Z`, '#f0842c'));
    g.append(path(`M ${HX - 20} ${HY + 18} Q ${HX} ${HY + (expr === 'happy' ? 30 : 22)} ${HX + 20} ${HY + 18}`));
  } else if (S.beak === 'small') {
    g.append(path(`M ${HX - 12} ${HY + 8} L ${HX + 12} ${HY + 8} L ${HX} ${HY + 26} Z`, '#f0842c'));
  } else {
    g.append(ell(HX, HY + 10, S.nose === OUT ? 11 : 9, 7, S.nose));
  }
  // Mouth (not for beaks)
  if (!S.beak) {
    const my = HY + 30;
    if (expr === 'happy') g.append(path(`M ${HX - 22} ${my - 4} Q ${HX} ${my + 26} ${HX + 22} ${my - 4} Z`, '#c0392b'));
    else if (expr === 'sad') g.append(path(`M ${HX - 14} ${my + 8} Q ${HX} ${my - 6} ${HX + 14} ${my + 8}`));
    else if (expr === 'surprised') g.append(ell(HX, my + 6, 10, 13, '#c0392b'));
    else g.append(path(`M ${HX - 14} ${my} Q ${HX} ${my + 12} ${HX + 14} ${my}`));
    if (S.teeth) g.append(rect(HX - 9, my + 2, 8, 12, '#fff', { rx: 2, 'stroke-width': 2 }), rect(HX + 1, my + 2, 8, 12, '#fff', { rx: 2, 'stroke-width': 2 }));
  }
  if (S.whiskers) {
    for (const sx of [-1, 1]) for (const dy of [-4, 6]) {
      g.append(path(`M ${HX + sx * 30} ${HY + 16 + dy} L ${HX + sx * 66} ${HY + 12 + dy * 2}`, 'none', { 'stroke-width': 3 }));
    }
  }
  return g;
}

export function character(species, { expr = 'normal' } = {}) {
  const S = SPECIES[species];
  if (!S) throw new Error('unknown species ' + species);
  const g = el('g', { class: 'char ' + species });
  g.append(tail(S));
  // Legs
  const legCol = S.legColor || S.body;
  for (const sx of [-1, 1]) {
    g.append(rect(sx * 24 - 11, -48, 22, 44, legCol, { rx: 10 }));
    g.append(ell(sx * 26, -4, 20, 9, S.legColor || (S.belly || S.body)));
  }
  // Body
  if (S.spikes) {
    for (let a = 180; a <= 360; a += 22) {
      const r = a * Math.PI / 180, cx = 0, cy = -90;
      g.append(path(`M ${cx + Math.cos(r - 0.18) * 50} ${cy + Math.sin(r - 0.18) * 58} L ${cx + Math.cos(r) * 88} ${cy + Math.sin(r) * 95} L ${cx + Math.cos(r + 0.18) * 50} ${cy + Math.sin(r + 0.18) * 58} Z`, S.spikes));
    }
  }
  g.append(ell(0, -88, 50, 62, S.body));
  if (S.belly) g.append(ell(0, -78, 30, 42, S.belly, { stroke: 'none' }));
  if (S.apron) {
    g.append(path('M -36 -110 L 36 -110 L 44 -40 L -44 -40 Z', S.apron));
    g.append(path('M -20 -110 L -20 -125 L 20 -125 L 20 -110', 'none'));
  }
  // Arms or wings
  if (S.wings) {
    g.append(path('M -46 -100 Q -95 -80 -60 -50 Q -50 -70 -46 -100 Z', S.body), path('M 46 -100 Q 95 -80 60 -50 Q 50 -70 46 -100 Z', S.body));
  } else {
    g.append(path('M -46 -100 Q -80 -85 -78 -50', 'none', { 'stroke-width': 18, stroke: OUT }),
             path('M -46 -100 Q -80 -85 -78 -50', 'none', { 'stroke-width': 10, stroke: S.body }),
             circ(-78, -46, 12, S.body),
             path('M 46 -100 Q 80 -85 78 -50', 'none', { 'stroke-width': 18, stroke: OUT }),
             path('M 46 -100 Q 80 -85 78 -50', 'none', { 'stroke-width': 10, stroke: S.body }),
             circ(78, -46, 12, S.body));
  }
  if (S.bag) {
    g.append(path('M -40 -120 L 40 -60', 'none', { 'stroke-width': 8, stroke: '#7a4a22' }));
    g.append(rect(28, -70, 40, 32, '#c58b4a', { rx: 6 }));
  }
  // Head
  if (S.neck) g.append(path('M -22 -130 L 22 -130 L 18 -175 L -18 -175 Z', S.head, { 'stroke-width': SW }));
  if (S.spikes) {
    for (let a = 190; a <= 350; a += 20) {
      const r = a * Math.PI / 180;
      g.append(path(`M ${HX + Math.cos(r - 0.15) * 58} ${HY + Math.sin(r - 0.15) * 58} L ${HX + Math.cos(r) * 98} ${HY + Math.sin(r) * 98} L ${HX + Math.cos(r + 0.15) * 58} ${HY + Math.sin(r + 0.15) * 58} Z`, S.spikes));
    }
  }
  const earsBehind = ['droop', 'long', 'tuft'].includes(S.ears);
  if (earsBehind) g.append(ears(S, S.head));
  g.append(circ(HX, HY, HR, S.head));
  if (!earsBehind) g.append(ears(S, S.head));
  if (S.ears === 'point' || S.ears === 'round') g.append(circ(HX, HY, HR, S.head, { stroke: 'none' })); // cover ear bases
  g.append(face(S, expr));
  g.append(hat(S));
  return g;
}

// Place a character: x,y is the feet point in scene coordinates.
export function place(node, x, y, scale = 1, flip = false) {
  node.setAttribute('transform', `translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`);
  return node;
}
