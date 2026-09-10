// Pixel-art town map. Tap a lit building to investigate there.
import { Pixel, PW, PH } from '../engine/pixel.js';
import { P } from '../art/palette.js';
import { sprites } from '../art/sprites.js';
import { shade, tint } from '../art/pixel-characters.js';
import { sfx } from '../engine/audio.js';

const K = P.k;
// x,y = top-left of walls; w,h = wall size.
export const TOWN = [
  { id: 'bakery', name: 'BAKERY', x: 20, y: 38, w: 44, h: 28, wall: '#f6b8c8', roof: P.red, sign: 'muffin', texture: 'plank' },
  { id: 'studio', name: 'STUDIO', x: 84, y: 42, w: 40, h: 24, wall: '#dcb8ff', roof: P.blue, sign: 'paint', texture: 'plank' },
  { id: 'clock', name: 'CLOCK', x: 150, y: 20, w: 24, h: 46, wall: '#e8d6b0', roof: P.greyDark, sign: 'clock', texture: 'stone', tower: true },
  { id: 'workshop', name: 'WORKSHOP', x: 190, y: 42, w: 46, h: 24, wall: '#e8c99a', roof: P.woodDark, sign: 'hammer', texture: 'plank' },
  { id: 'store', name: 'STORE', x: 254, y: 38, w: 44, h: 28, wall: P.yellow, roof: P.green, sign: 'acorn', texture: 'brick' },
  { id: 'fish', name: 'FISH', x: 24, y: 110, w: 46, h: 22, wall: '#f6e2c0', roof: P.blue, sign: 'fish', texture: 'plank', awning: true },
  { id: 'agency', name: 'AGENCY', x: 138, y: 94, w: 48, h: 32, wall: '#c58b4a', roof: P.woodDark, sign: 'glass', texture: 'brick' },
  { id: 'school', name: 'SCHOOL', x: 236, y: 98, w: 56, h: 28, wall: P.red, roof: P.greyDark, sign: 'book', texture: 'brick', bell: true },
  { id: 'lighthouse', name: 'LIGHT', x: 288, y: 118, w: 14, h: 28, wall: P.w, roof: P.red, sign: 'none', light: true },
];

function drawSign(px, kind, cx, cy) {
  const S = sprites();
  switch (kind) {
    case 'muffin': px.blit(S.muffinBlue, cx - 6, cy - 6); break;
    case 'clock': break;
    case 'acorn': px.blit(S.acorn, cx - 6, cy - 6); break;
    case 'glass': px.blit(S.glass, cx - 8, cy - 8); break;
    case 'book': px.rect(cx - 6, cy - 4, 12, 9, K); px.rect(cx - 5, cy - 3, 10, 7, P.blue); px.rect(cx, cy - 3, 1, 7, P.w); px.rect(cx - 4, cy - 2, 3, 1, '#9db8ff'); break;
    case 'fish': px.blit(S.fish, cx - 6, cy - 6); break;
    case 'paint': for (const [dx, dy, c] of [[-5, -3, P.red], [-1, -3, P.blue], [3, -3, P.yellow], [-3, 1, P.green], [1, 1, P.pink]]) px.rect(cx + dx, cy + dy, 3, 3, c); break;
    case 'hammer': px.rect(cx - 1, cy - 4, 2, 10, P.woodDark); px.rect(cx - 4, cy - 6, 8, 3, P.greyDark); px.rect(cx - 4, cy - 6, 8, 1, '#8a94a0'); break;
  }
}

function drawBuilding(px, b, dim, t) {
  const wall = dim ? '#c9c3b6' : b.wall, roof = dim ? '#8d887f' : b.roof;
  const wallD = shade(wall, 0.85), wallL = tint(wall, 0.2), roofD = shade(roof, 0.7), roofL = tint(roof, 0.25);
  const rh = b.tower ? 12 : 9;
  // Shadow on the ground
  px.ctx.fillStyle = 'rgba(0,0,0,0.15)'; px.ctx.fillRect(b.x + 3, b.y + b.h, b.w, 3);
  // Roof: tiled, tapering
  for (let r = 0; r < rh; r++) {
    const inset = Math.floor((rh - r) * (b.tower ? 1.0 : 1.5)), y = b.y - rh + r;
    const x0 = b.x - 3 + inset, w = b.w + 6 - inset * 2;
    px.rect(x0, y, w, 1, r % 2 ? roofD : roof);
    for (let x = x0 + (r % 2) * 3; x < x0 + w; x += 6) px.rect(x, y, 1, 1, roofL);
  }
  px.rect(b.x - 4, b.y - 1, b.w + 8, 2, K); px.rect(b.x - 3, b.y - 2, b.w + 6, 1, roofL);
  // Chimney with smoke
  if (!b.tower && !b.light) { const cx = b.x + b.w - 10; px.rect(cx, b.y - rh - 2, 5, rh - 2, K); px.rect(cx + 1, b.y - rh - 1, 3, rh - 4, '#8b5a2b'); for (let i = 0; i < 3; i++) { const ph = (t * 0.5 + i * 0.33 + b.x * 0.01) % 1; px.ctx.fillStyle = `rgba(255,255,255,${0.8 - ph * 0.7})`; px.ctx.fillRect(cx + 1 + Math.round(Math.sin(ph * 5) * 2), b.y - rh - 3 - Math.round(ph * 12), 3, 3); } }
  // Walls with texture
  px.rect(b.x, b.y, b.w, b.h, K); px.rect(b.x + 1, b.y + 1, b.w - 2, b.h - 2, wall);
  if (b.texture === 'brick') for (let y = b.y + 3; y < b.y + b.h - 1; y += 4) for (let x = b.x + 2 + ((y - b.y) % 8 ? 0 : 4); x < b.x + b.w - 2; x += 8) px.rect(x, y, 6, 1, wallD);
  if (b.texture === 'plank') for (let y = b.y + 3; y < b.y + b.h - 1; y += 4) px.rect(b.x + 1, y, b.w - 2, 1, wallD);
  if (b.texture === 'stone') for (let y = b.y + 3; y < b.y + b.h - 1; y += 5) for (let x = b.x + 1 + ((y - b.y) % 10 ? 0 : 5); x < b.x + b.w - 1; x += 10) { px.rect(x, y, 8, 3, wallL); px.rect(x, y + 3, 8, 1, wallD); }
  px.rect(b.x + 1, b.y + 1, b.w - 2, 1, wallL); px.rect(b.x + 1, b.y + 1, 1, b.h - 2, wallL);
  // Door and windows
  const dx = b.x + Math.floor(b.w / 2) - 4;
  px.rect(dx, b.y + b.h - 11, 9, 11, K); px.rect(dx + 1, b.y + b.h - 10, 7, 10, dim ? '#5d6470' : P.woodDark); px.rect(dx + 1, b.y + b.h - 10, 7, 1, dim ? '#7d8590' : '#a5764a'); px.rect(dx + 6, b.y + b.h - 5, 1, 1, P.yellow);
  if (b.w > 30) for (const wx of [b.x + 4, b.x + b.w - 13]) { px.rect(wx, b.y + 5, 9, 8, K); px.rect(wx + 1, b.y + 6, 7, 6, dim ? '#dcd8cf' : '#dff4ff'); px.rect(wx + 1, b.y + 6, 3, 2, '#ffffff'); px.rect(wx + 4, b.y + 6, 1, 6, K); px.rect(wx - 1, b.y + 13, 11, 1, wallD); }
  if (b.awning) { for (let i = 0; i < b.w + 4; i += 4) px.rect(b.x - 2 + i, b.y + 2, 4, 4, (i / 4) % 2 ? P.red : '#ffffff'); px.rect(b.x - 2, b.y + 6, b.w + 4, 1, K); }
  if (b.bell) { px.rect(b.x + b.w - 8, b.y - rh - 8, 6, 8, K); px.rect(b.x + b.w - 7, b.y - rh - 7, 4, 6, '#c9a227'); }
  if (b.tower) { px.rect(b.x + 3, b.y + 3, 18, 18, K); px.rect(b.x + 4, b.y + 4, 16, 16, '#fffdf5'); const a = (t * 0.4) % (Math.PI * 2); px.rect(b.x + 12, b.y + 6, 1, 6, K); px.rect(Math.round(b.x + 12 + Math.sin(a) * 5), Math.round(b.y + 12 - Math.cos(a) * 5), 1, 1, K); px.rect(b.x + 12, b.y + 12, 4, 1, K); }
  if (b.light) { px.rect(b.x + 1, b.y + 6, b.w - 2, 5, P.red); px.rect(b.x + 1, b.y + 17, b.w - 2, 5, P.red); px.rect(b.x - 2, b.y - 8, b.w + 4, 8, K); px.rect(b.x - 1, b.y - 7, b.w + 2, 6, P.yellow); const beam = Math.sin(t * 1.5); px.ctx.fillStyle = 'rgba(255,240,150,0.35)'; px.ctx.beginPath(); px.ctx.moveTo(b.x + 7, b.y - 4); px.ctx.lineTo(b.x + 7 + beam * 40 - 30, b.y - 30); px.ctx.lineTo(b.x + 7 + beam * 40 - 12, b.y - 30); px.ctx.closePath(); px.ctx.fill(); }
  if (b.sign !== 'none' && !b.tower) {
    // Sign board hanging over the door
    const sx = b.x + Math.floor(b.w / 2), sy = b.y + Math.floor(b.h / 2) - 2;
    px.rect(sx - 8, sy - 8, 16, 16, K); px.rect(sx - 7, sy - 7, 14, 14, '#fffdf5'); px.rect(sx - 7, sy - 7, 14, 1, '#ffffff');
    drawSign(px, b.sign, sx, sy);
  }
}

function drawLabel(px, b) {
  if (!b.name) return;
  const w = b.name.length * 6 + 5, lx = b.x + Math.floor(b.w / 2) - Math.floor(w / 2), ly = b.y + b.h + 3;
  px.rect(lx, ly, w, 11, K); px.rect(lx + 1, ly + 1, w - 2, 9, '#fffdf5'); px.rect(lx + 1, ly + 1, w - 2, 1, '#ffffff');
  px.text(b.name, b.x + Math.floor(b.w / 2), ly + 2, K, { align: 'center' });
}

function tree(px, x, y, t) {
  const sway = Math.round(Math.sin(t * 1.3 + x) * 0.6);
  px.rect(x + 3, y + 8, 3, 6, P.woodDark); px.rect(x + 4, y + 8, 1, 6, '#8b5a2b');
  px.rect(x + sway, y + 2, 9, 7, K); px.rect(x + 1 + sway, y + 3, 7, 5, P.grassDark); px.rect(x + 2 + sway, y, 5, 3, K); px.rect(x + 3 + sway, y + 1, 3, 3, P.grassDark);
  px.rect(x + 2 + sway, y + 3, 3, 2, '#7fcf5a'); px.rect(x + 4 + sway, y + 1, 1, 1, '#7fcf5a');
  px.ctx.fillStyle = 'rgba(0,0,0,0.12)'; px.ctx.fillRect(x + 1, y + 13, 9, 2);
}

export function townMap({ caseTitle, locations, found, onPick, onHome }) {
  let px, t = 0;
  const S = sprites();
  const active = new Set(locations.map(l => l.id));

  function draw() {
    px.clearHits();
    px.clear(P.grass);
    // Grass tufts and flowers
    for (let i = 0; i < 90; i++) { const x = (i * 53) % PW, y = (i * 29) % 148; px.rect(x, y, 2, 1, P.grassDark); px.rect(x + 1, y - 1, 1, 1, P.grassDark); }
    for (let i = 0; i < 24; i++) { const x = (i * 71 + 13) % PW, y = (i * 37 + 7) % 146; px.rect(x, y, 1, 1, [P.yellow, P.pink, '#ffffff'][i % 3]); px.rect(x - 1, y + 1, 3, 1, [P.yellow, P.pink, '#ffffff'][i % 3]); px.rect(x, y + 2, 1, 1, [P.yellow, P.pink, '#ffffff'][i % 3]); }
    // Roads: cobbles
    const road = (x, y, w, h) => { px.rect(x, y, w, h, P.road); px.rect(x, y, w, 1, shade(P.road, 0.8)); px.rect(x, y + h - 1, w, 1, shade(P.road, 0.8)); px.rect(x, y, 1, h, shade(P.road, 0.8)); px.rect(x + w - 1, y, 1, h, shade(P.road, 0.8)); for (let j = y + 2; j < y + h - 2; j += 4) for (let i = x + 2 + ((j - y) % 8 ? 0 : 3); i < x + w - 2; i += 6) px.rect(i, j, 3, 1, shade(P.road, 0.9)); };
    road(0, 74, PW, 14); road(154, 20, 16, 130); road(38, 74, 14, 76); road(258, 74, 14, 76);
    // Water with waves, pier and boat
    px.rect(0, 150, PW, 30, P.water); px.rect(0, 150, PW, 1, '#7fd1f5');
    for (let row = 0; row < 3; row++) for (let i = 0; i < PW; i += 26) { const wx = (i + Math.floor(t * (6 + row * 3))) % (PW + 26) - 13; px.rect(wx, 156 + row * 8, 9, 1, '#7fd1f5'); px.rect(wx + 3, 157 + row * 8, 3, 1, '#ffffff'); }
    px.rect(0, 148, PW, 2, P.tan); px.rect(0, 149, PW, 1, shade(P.tan, 0.8));
    px.rect(100, 150, 30, 6, '#a5642f'); px.rect(100, 150, 30, 1, '#d98a4a'); px.rect(102, 156, 2, 3, K); px.rect(126, 156, 2, 3, K);
    const bob = Math.round(Math.sin(t * 2) * 1); px.rect(200, 164 + bob, 18, 5, K); px.rect(201, 165 + bob, 16, 3, '#8b5a2b'); px.rect(208, 155 + bob, 1, 10, K); px.rect(209, 156 + bob, 7, 7, '#ffffff');
    // Fountain
    px.rect(110, 96, 22, 14, K); px.rect(111, 97, 20, 12, '#9aa0ad'); px.rect(113, 99, 16, 8, P.water); px.rect(119, 90, 4, 10, '#9aa0ad'); for (let i = 0; i < 3; i++) px.rect(118 + i * 2, 88 - Math.round(Math.abs(Math.sin(t * 4 + i)) * 4), 1, 2, '#7fd1f5');
    // Trees
    for (const [x, y] of [[72, 22], [130, 22], [240, 20], [96, 122], [212, 130], [80, 136], [6, 90], [306, 90], [120, 56], [176, 120]]) tree(px, x, y, t);
    // Buildings (back row first)
    for (const b of TOWN) {
      const isActive = active.has(b.id), isHome = b.id === 'agency';
      drawBuilding(px, b, !isActive && !isHome, t);
      const cx = b.x + Math.floor(b.w / 2);
      const top = b.y - (b.tower ? 12 : 9);
      if (isActive && found.includes(b.id)) px.blit(S.check, cx - 4, top - 12);
      else if (isActive) px.blit(S.arrow, cx - 3, top - 16 - Math.round(Math.abs(Math.sin(t * 4)) * 4));
      if (isActive && !found.includes(b.id)) px.hit(b.x - 6, top - 22, b.w + 12, b.h + 34, () => { sfx.tap(); onPick(locations.find(l => l.id === b.id)); });
      if (isHome) px.hit(b.x - 6, top - 6, b.w + 12, b.h + 18, () => { sfx.tap(); onHome(); });
    }
    for (const b of TOWN) drawLabel(px, b);
    // Header
    const head = `${caseTitle}  CLUES ${found.length}/${locations.length}`;
    px.rect(92, 2, 136, 14, K); px.rect(93, 3, 134, 12, P.cream); px.rect(93, 3, 134, 1, '#ffffff');
    px.text(head, 160, 6, K, { align: 'center' });
    px.rect(60, 166, 200, 12, 'rgba(0,0,0,0.35)'); px.text('TAP A BUILDING WITH AN ARROW', 160, 168, P.w, { align: 'center' });
  }

  return {
    enter(root) { px = new Pixel(root); draw(); },
    update(dt) { t += dt; draw(); },
  };
}
