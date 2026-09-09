// Pixel-art town map. Tap a lit building to investigate there.
import { Pixel, PW, PH } from '../engine/pixel.js';
import { P } from '../art/palette.js';
import { sprites } from '../art/sprites.js';
import { sfx } from '../engine/audio.js';

// x,y = top-left of walls; w,h = wall size.
const TOWN = [
  { id: 'bakery', name: 'BAKERY', x: 28, y: 36, w: 46, h: 30, wall: '#f6b8c8', roof: P.red, sign: 'muffin' },
  { id: 'clock', name: 'CLOCK', x: 150, y: 24, w: 24, h: 42, wall: '#e8d6b0', roof: P.greyDark, sign: 'clock' },
  { id: 'store', name: 'STORE', x: 246, y: 36, w: 46, h: 30, wall: P.yellow, roof: P.green, sign: 'acorn' },
  { id: 'agency', name: 'AGENCY', x: 138, y: 92, w: 48, h: 34, wall: '#c58b4a', roof: P.woodDark, sign: 'glass' },
  { id: 'school', name: 'SCHOOL', x: 236, y: 96, w: 56, h: 30, wall: P.red, roof: P.greyDark, sign: 'book' },
  { id: 'fish', name: 'FISH', x: 30, y: 108, w: 46, h: 24, wall: '#f6e2c0', roof: P.blue, sign: 'fish' },
  { id: 'lighthouse', name: '', x: 300, y: 128, w: 14, h: 30, wall: P.w, roof: P.red, sign: 'none' },
];

function drawSign(px, kind, cx, cy) {
  const S = sprites();
  switch (kind) {
    case 'muffin': px.blit(S.muffinBlue, cx - 6, cy - 6); break;
    case 'clock': px.box(cx - 6, cy - 6, 12, 12, P.w); px.rect(cx, cy - 4, 1, 4, P.k); px.rect(cx, cy, 3, 1, P.k); break;
    case 'acorn': px.rect(cx - 3, cy - 4, 6, 3, P.woodDark); px.rect(cx - 3, cy - 1, 6, 5, P.brown); px.rect(cx - 2, cy + 4, 4, 1, P.brown); break;
    case 'glass': px.rect(cx - 5, cy - 5, 8, 8, P.k); px.rect(cx - 4, cy - 4, 6, 6, P.sky); px.rect(cx + 3, cy + 3, 3, 3, P.k); break;
    case 'book': px.box(cx - 6, cy - 4, 12, 9, P.blue); px.rect(cx, cy - 3, 1, 7, P.w); break;
    case 'fish': px.rect(cx - 5, cy - 2, 8, 5, P.sky); px.rect(cx + 3, cy - 3, 2, 7, P.sky); px.rect(cx - 3, cy - 1, 1, 1, P.k); break;
  }
}

function drawBuilding(px, b, dim) {
  const wall = dim ? '#b9b3a6' : b.wall, roof = dim ? '#7d786f' : b.roof;
  // Roof
  for (let i = 0; i < 8; i++) px.rect(b.x - 3 + i * 0 + Math.floor((8 - i) * (b.w + 6) / 16), b.y - 8 + i, (b.w + 6) - Math.floor((8 - i) * (b.w + 6) / 8), 1, roof);
  px.rect(b.x - 3, b.y - 1, b.w + 6, 2, P.k);
  // Walls
  px.box(b.x, b.y, b.w, b.h, wall);
  // Door and windows
  px.box(b.x + Math.floor(b.w / 2) - 4, b.y + b.h - 10, 8, 10, dim ? '#5d6470' : P.woodDark);
  if (b.w > 30) { px.box(b.x + 4, b.y + 6, 8, 7, dim ? '#dcd8cf' : P.sky); px.box(b.x + b.w - 12, b.y + 6, 8, 7, dim ? '#dcd8cf' : P.sky); }
  if (b.id === 'lighthouse') { px.rect(b.x + 1, b.y + 8, b.w - 2, 5, P.red); px.rect(b.x + 1, b.y + 20, b.w - 2, 5, P.red); px.box(b.x - 2, b.y - 8, b.w + 4, 8, P.yellow); }
  if (b.id === 'clock') { px.box(b.x + 4, b.y + 4, 16, 16, P.w); px.rect(b.x + 12, b.y + 7, 1, 5, P.k); px.rect(b.x + 12, b.y + 12, 4, 1, P.k); }
  if (b.sign !== 'none' && b.id !== 'clock') drawSign(px, b.sign, b.x + Math.floor(b.w / 2), b.y + b.h - 18 > b.y + 4 ? b.y + Math.floor(b.h / 2) - 2 : b.y + 6);
  // Label
  if (b.name) px.text(b.name, b.x + Math.floor(b.w / 2), b.y + b.h + 3, P.k, { align: 'center' });
}

export function townMap({ caseTitle, locations, found, onPick, onHome }) {
  let px, t = 0;
  const S = sprites();
  const active = new Set(locations.map(l => l.id));

  function draw() {
    px.clearHits();
    px.clear(P.grass);
    for (let i = 0; i < 60; i++) px.rect((i * 53) % PW, (i * 29) % 150, 2, 1, P.grassDark);
    // Water
    px.rect(0, 150, PW, 30, P.water);
    for (let i = 0; i < PW; i += 16) px.rect(i + (Math.floor(t * 4) % 16), 158, 6, 1, '#7fd1f5');
    px.rect(0, 148, PW, 2, P.tan);
    // Roads
    px.rect(0, 74, PW, 12, P.road); px.rect(156, 20, 12, 130, P.road); px.rect(40, 74, 12, 76, P.road); px.rect(262, 74, 12, 76, P.road);
    // Trees
    for (const [x, y] of [[100, 30], [120, 44], [206, 30], [96, 120], [210, 130], [230, 20]]) {
      px.rect(x + 2, y + 6, 2, 4, P.woodDark); px.rect(x, y, 6, 6, P.grassDark); px.rect(x + 1, y - 1, 4, 1, P.grassDark);
    }
    for (const b of TOWN) {
      const isActive = active.has(b.id), isHome = b.id === 'agency';
      drawBuilding(px, b, !isActive && !isHome);
      const cx = b.x + Math.floor(b.w / 2);
      if (isActive && found.includes(b.id)) px.blit(S.check, cx - 4, b.y - 20);
      else if (isActive) px.blit(S.arrow, cx - 3, b.y - 24 - Math.round(Math.abs(Math.sin(t * 4)) * 4));
      if (isActive && !found.includes(b.id)) px.hit(b.x - 6, b.y - 28, b.w + 12, b.h + 36, () => { sfx.tap(); onPick(locations.find(l => l.id === b.id)); });
      if (isHome) px.hit(b.x - 6, b.y - 10, b.w + 12, b.h + 18, () => { sfx.tap(); onHome(); });
    }
    // Header
    const head = `${caseTitle}  CLUES ${found.length}/${locations.length}`;
    px.box(94, 2, 132, 12, P.cream);
    px.text(head, 160, 5, P.k, { align: 'center' });
    px.text('TAP A BUILDING WITH AN ARROW', 160, 168, P.w, { align: 'center' });
  }

  return {
    enter(root) { px = new Pixel(root); draw(); },
    update(dt) { t += dt; draw(); },
  };
}
