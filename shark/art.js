// Drawing: sea, fish, ten-bars, the shark, and reward gags. All on the 320x180 canvas.
import { ctx, PW, PH, rect, box, panel, ellipse, poly, text, outlined } from './engine.js';

export const C = { line: '#0b2a45', deep: '#0e4a7a', mid: '#1b6fa8', light: '#3aa0d8', sand: '#e8d28a', sandDark: '#c9b06a', shark: '#5f8fb0', sharkDark: '#476f8c', belly: '#e6eef3', fishY: '#ffcc4d', fishO: '#f0842c', fishR: '#e0453b', net: '#d9c48f' };

export function drawSea(t, { dim = false } = {}) {
  const bands = ['#1b6fa8', '#1a67a0', '#186098', '#175890', '#155088', '#134880'];
  for (let i = 0; i < bands.length; i++) rect(0, i * 30, PW, 30, bands[i]);
  // Light rays
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  for (let i = 0; i < 4; i++) { const x = 30 + i * 80 + Math.sin(t * 0.5 + i) * 6; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 30, 0); ctx.lineTo(x + 70, 150); ctx.lineTo(x - 10, 150); ctx.closePath(); ctx.fill(); }
  // Surface ripples
  for (let i = 0; i < PW; i += 24) rect((i + Math.floor(t * 8)) % (PW + 24) - 12, 3 + Math.round(Math.sin(t * 2 + i) * 1), 10, 1, 'rgba(255,255,255,0.35)');
  // Bubbles rising
  for (let i = 0; i < 10; i++) { const ph = (t * 0.15 + i * 0.1) % 1, x = (i * 37 + 11) % PW + Math.round(Math.sin(t * 2 + i) * 3), y = 170 - ph * 175; ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(x, y, 2 + (i % 2), 2 + (i % 2)); ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.fillRect(x, y, 1, 1); }
  // Sand and seaweed
  rect(0, 168, PW, 12, C.sand); rect(0, 168, PW, 1, C.sandDark); for (let i = 0; i < PW; i += 17) rect(i + 5, 172 + (i % 3), 4, 1, C.sandDark);
  for (const [x, h, c] of [[14, 22, '#2f9e5a'], [40, 16, '#3bb56a'], [270, 26, '#2f9e5a'], [300, 18, '#3bb56a'], [150, 14, '#2f9e5a']]) {
    for (let j = 0; j < h; j += 3) { const sway = Math.round(Math.sin(t * 2 + j * 0.3 + x) * (j / h) * 3); rect(x + sway, 168 - j, 3, 3, c); if (j % 6 === 0) rect(x + sway + 3, 168 - j, 2, 2, c); }
  }
  // Shells and starfish
  rect(90, 171, 5, 3, '#f6b8c8'); rect(91, 170, 3, 1, '#f6b8c8'); poly([[220, 170], [224, 176], [216, 176]], C.fishO); rect(219, 168, 2, 2, C.fishO);
  if (dim) { ctx.fillStyle = 'rgba(0,20,40,0.35)'; ctx.fillRect(0, 0, PW, PH); }
}

export function drawFish(x, y, color = C.fishY, t = 0, big = false) {
  const s = big ? 2 : 1;
  const flap = Math.round(Math.sin(t * 8 + x)) ;
  poly([[x + 7 * s, y + 3 * s], [x + 10 * s, y + (flap < 0 ? 0 : 1) * s], [x + 10 * s, y + (flap < 0 ? 6 : 5) * s]], color);
  ellipse(x + 4 * s, y + 3 * s, 4 * s, 2.5 * s, color);
  ellipse(x + 4 * s, y + 3.5 * s, 3 * s, 1.5 * s, 'rgba(255,255,255,0.35)');
  rect(x + 1 * s, y + 2 * s, s, s, C.line);
}

// A net of ten fish.
export function drawTenBar(x, y, glow = false, t = 0) {
  if (glow) { ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.fillRect(x - 1, y - 1, 17, 10); }
  box(x, y, 15, 8, C.net, C.line);
  for (let i = 0; i < 10; i++) { const fx = x + 1 + (i % 5) * 3 - (i % 5 === 4 ? 1 : 0), fy = y + 1 + Math.floor(i / 5) * 3; rect(fx, fy, 2, 2, C.fishO); rect(fx, fy, 1, 1, C.line); }
}

// The shark. Faces left. opts: mouth 0..1, expr normal|happy|puzzled|sleepy, rot (radians), flip, hat, shades, board, scale
export function drawShark(x, y, o = {}) {
  const { mouth = 0, expr = 'normal', rot = 0, flip = false, hat = false, shades = false, board = false, scale = 1, t = 0 } = o;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(flip ? -scale : scale, scale);
  if (board) { poly([[-40, 16], [40, 16], [34, 22], [-34, 22]], C.fishY); rect(-30, 18, 60, 1, C.fishR); rect(-36, 16, 72, 1, C.line); }
  const wag = Math.sin(t * 6) * 3;
  // Tail
  poly([[22, 0], [36, -12 + wag], [34, 0], [36, 12 + wag]], C.sharkDark); poly([[22, 0], [35, -11 + wag], [33, 0], [35, 11 + wag]], C.shark);
  // Body
  ellipse(0, 0, 27, 12, C.line); ellipse(0, 0, 26, 11, C.shark);
  ellipse(-2, 4, 20, 6, C.belly);
  // Dorsal fin and pectoral fin
  poly([[-2, -10], [8, -22], [14, -9]], C.line); poly([[-1, -10], [8, -20], [12, -9]], C.sharkDark);
  poly([[-4, 5], [4, 16], [10, 5]], C.line); poly([[-3, 5], [4, 14], [8, 5]], C.sharkDark);
  // Gills
  for (let i = 0; i < 3; i++) rect(6 + i * 3, -4, 1, 6, C.sharkDark);
  // Mouth: closed line or open wedge with teeth
  const m = Math.max(0, Math.min(1, mouth));
  if (m < 0.15) {
    ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-24, 3); ctx.quadraticCurveTo(-14, 8 + (expr === 'happy' ? 3 : expr === 'puzzled' ? -2 : 0), -4, 5); ctx.stroke();
    for (let i = 0; i < 4; i++) poly([[-21 + i * 4, 4], [-19 + i * 4, 4], [-20 + i * 4, 7]], '#ffffff');
  } else {
    const open = 4 + m * 10;
    poly([[-25, 2], [-4, 2], [-6, 2 + open], [-22, 2 + open]], C.line); poly([[-24, 3], [-5, 3], [-7, 1 + open], [-21, 1 + open]], '#7a2438');
    for (let i = 0; i < 5; i++) { poly([[-23 + i * 4, 3], [-20 + i * 4, 3], [-21.5 + i * 4, 6]], '#ffffff'); poly([[-22 + i * 4, 1 + open], [-19 + i * 4, 1 + open], [-20.5 + i * 4, open - 2]], '#ffffff'); }
  }
  // Eye
  ellipse(-12, -4, 3.5, 3.5, C.line); ellipse(-12, -4, 2.8, 2.8, '#ffffff');
  const px = expr === 'puzzled' ? -11 : -13, py = expr === 'sleepy' ? -3 : -4;
  rect(px, py, 2, 2, C.line); rect(px, py, 1, 1, '#ffffff');
  if (expr === 'sleepy') rect(-15, -7, 7, 3, C.shark);
  if (expr === 'puzzled') { rect(-16, -10, 7, 1, C.line); rect(-16, -9, 1, 1, C.line); }
  if (expr === 'happy') { rect(-17, -1, 3, 2, 'rgba(240,110,110,0.5)'); }
  if (shades) { rect(-18, -7, 12, 5, C.line); rect(-17, -6, 4, 3, '#1b1b1b'); rect(-11, -6, 4, 3, '#1b1b1b'); rect(-6, -6, 3, 1, C.line); }
  if (hat) { poly([[8, -21], [18, -21], [13, -38]], C.fishR); for (let i = 0; i < 3; i++) rect(10 + i * 3, -27 + i * 2, 2, 2, C.fishY); ellipse(13, -38, 2.5, 2.5, C.fishY); }
  ctx.restore();
}

export function drawCrab(x, y, t) {
  const bob = Math.round(Math.sin(t * 10) * 2);
  ellipse(x, y + bob, 8, 5, C.line); ellipse(x, y + bob, 7, 4, C.fishR);
  for (const sx of [-1, 1]) { rect(x + sx * 9 - 1, y + bob - 6, 2, 2, C.line); rect(x + sx * 10 - 2, y + bob - 9, 4, 3, C.fishR); rect(x + sx * 10 - 2, y + bob - 9, 4, 1, C.line); for (let i = 0; i < 3; i++) rect(x + sx * (4 + i * 2), y + bob + 3 + i, 1, 2, C.line); }
  rect(x - 3, y + bob - 2, 2, 2, '#ffffff'); rect(x + 1, y + bob - 2, 2, 2, '#ffffff'); rect(x - 2, y + bob - 2, 1, 1, C.line); rect(x + 2, y + bob - 2, 1, 1, C.line);
}

export function drawJelly(x, y, t, color) {
  const bob = Math.sin(t * 3 + x) * 3;
  ellipse(x, y + bob, 8, 6, color); rect(x - 8, y + bob, 16, 3, color);
  for (let i = 0; i < 4; i++) rect(x - 6 + i * 4 + Math.round(Math.sin(t * 5 + i) * 1), y + bob + 3, 1, 8 + (i % 2) * 3, color);
  rect(x - 3, y + bob - 1, 1, 1, C.line); rect(x + 2, y + bob - 1, 1, 1, C.line);
}

export function drawBubbleText(x, y, str, scale = 1) {
  const w = String(str).length * 6 * scale + 10, h = 7 * scale + 8;
  ellipse(x, y, w / 2 + 2, h / 2 + 2, C.line); ellipse(x, y, w / 2, h / 2, '#eaf6ff');
  rect(x - w / 2 + 3, y - h / 2 + 2, 3, 2, '#ffffff');
  text(str, x, y - Math.floor(7 * scale / 2), C.line, { scale, align: 'center' });
}

export const GAGS = ['flip', 'party', 'shades', 'burp', 'crab', 'disco', 'surf'];

// Reward: chomp then a gag. p in [0, 1] over the whole reward. q is the problem.
export function drawReward(gag, p, q, t, streak) {
  const chompEnd = 0.3;
  drawSea(t, { dim: gag === 'disco' && p > chompEnd ? false : false });
  if (gag === 'disco' && p > chompEnd) { const cols = ['rgba(255,0,120,0.18)', 'rgba(0,255,200,0.18)', 'rgba(255,230,0,0.18)', 'rgba(120,0,255,0.18)']; ctx.fillStyle = cols[Math.floor(t * 6) % 4]; ctx.fillRect(0, 0, PW, PH); }
  if (p < chompEnd) {
    // Shark swims in from the right, fish fly into its mouth.
    const k = p / chompEnd, sx = 300 - k * 150, mouth = k < 0.6 ? k / 0.6 : 1 - (k - 0.6) / 0.4;
    for (let i = 0; i < 8; i++) { const fk = Math.min(1, k * 1.4 + i * 0.05); const fx = 30 + i * 12 + (sx - 24 - (30 + i * 12)) * fk, fy = 80 + Math.sin(i) * 20 * (1 - fk); if (fk < 0.98) drawFish(fx, fy, [C.fishY, C.fishO, C.fishR][i % 3], t); }
    drawShark(sx, 90, { mouth, t, expr: 'happy' });
    if (k > 0.55) outlined('CHOMP!', 160, 30 - Math.round((k - 0.55) * 20), C.fishY, 3);
    return;
  }
  const g = (p - chompEnd) / (1 - chompEnd);
  switch (gag) {
    case 'flip': { const rot = g < 0.8 ? -(g / 0.8) * Math.PI * 2 : 0; drawShark(160, 90 - Math.sin(g * Math.PI) * 30, { rot, t, expr: 'happy', mouth: 0.2 }); outlined('WHEEEE!', 160, 150, C.fishY, 2); break; }
    case 'party': { drawShark(160, 92, { t, expr: 'happy', hat: true, mouth: 0.3 }); for (let i = 0; i < 24; i++) { const cx = (i * 53 + 17) % PW, cy = (g * 200 + i * 23) % 180; rect(cx, cy, 3, 2, [C.fishY, C.fishR, '#3bb56a', '#7fd1f5', '#f6b8c8'][i % 5]); } outlined('PARTY!', 160, 30, '#ffffff', 3); break; }
    case 'shades': { const drop = Math.min(1, g * 3); if (drop < 1) { rect(148, 20 + drop * 62, 12, 5, C.line); } drawShark(160, 90, { t, expr: 'happy', shades: drop >= 1, mouth: 0.15 }); if (drop >= 1) outlined('COOL.', 160, 140, '#ffffff', 3); break; }
    case 'burp': { const bp = Math.min(1, g * 1.5); drawShark(160, 96, { t, mouth: bp < 0.3 ? bp / 0.3 : 0.9, expr: 'happy' }); if (bp > 0.2) { const r = 8 + bp * 30, by = 96 - bp * 60; ellipse(126, by, r + 2, r * 0.8 + 2, C.line); ellipse(126, by, r, r * 0.8, 'rgba(200,235,255,0.85)'); rect(126 - r / 2, by - r / 2, 3, 3, '#ffffff'); if (bp > 0.5) outlined(String(q.sum), 126, by - 10, C.line, 3); } outlined('BURP!', 240, 40, C.fishY, 3); break; }
    case 'crab': { drawShark(140, 92 + Math.round(Math.sin(t * 10) * 3), { t, expr: 'happy', mouth: 0.3 }); drawCrab(210, 100 + Math.round(Math.sin(t * 10 + 1.5) * 3), t); for (let i = 0; i < 5; i++) rect(100 + i * 30 + Math.round(Math.sin(t * 8 + i) * 4), 40 + (i % 2) * 10, 3, 3, C.fishY); outlined('DANCE!', 160, 24, '#ffffff', 3); break; }
    case 'disco': { for (let i = 0; i < 5; i++) drawJelly(40 + i * 60, 40 + (i % 2) * 20, t, ['#f6b8c8', '#9db8ff', '#ffcc4d', '#9be07d', '#ff8a80'][i]); drawShark(160, 100 - Math.abs(Math.sin(t * 8)) * 16, { t, expr: 'happy', mouth: 0.4, rot: Math.sin(t * 8) * 0.2 }); outlined('DISCO!', 160, 140, '#ffffff', 3); break; }
    case 'surf': { const wave = Math.sin(t * 4) * 6; for (let i = 0; i < PW; i += 6) rect(i, 60 + Math.round(Math.sin(t * 4 + i * 0.1) * 6), 6, 4, '#ffffff'); drawShark(60 + g * 200, 52 + wave, { t, expr: 'happy', shades: true, board: true, rot: 0.2, mouth: 0.3 }); outlined('RADICAL!', 160, 120, C.fishY, 3); outlined(`${streak} IN A ROW!`, 160, 150, '#ffffff', 2); break; }
  }
}
