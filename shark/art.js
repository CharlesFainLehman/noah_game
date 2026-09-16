// Cartoon drawing: sea, fish, nets of ten, the shark, and the reward gags. Vector, 960x540.
import { ctx, W, H, INK, label, circle, ellipse, poly, rr, card } from './engine.js';

export const C = { shark: '#7fb3d9', sharkDark: '#5a8fbd', belly: '#eef6fb', fishY: '#ffd23f', fishO: '#ff8c42', fishR: '#ff5c5c', net: '#e9d8a6', netLine: '#b8955a', sand: '#f2dd9a', weed: '#3fbf7f', weedDark: '#2a9a62' };

const STROKE = 5;

export function drawSea(t, { dim = 0 } = {}) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#5fc6ef'); g.addColorStop(0.5, '#2a8fcf'); g.addColorStop(1, '#155f9e');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // Sunbeams
  ctx.save(); ctx.globalAlpha = 0.12; ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 4; i++) { const x = 120 + i * 240 + Math.sin(t * 0.4 + i) * 20; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 70, 0); ctx.lineTo(x + 200, 520); ctx.lineTo(x - 40, 520); ctx.closePath(); ctx.fill(); }
  ctx.restore();
  // Surface waves
  ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 4; ctx.lineCap = 'round';
  for (let k = 0; k < 2; k++) { ctx.beginPath(); for (let x = -40; x <= W + 40; x += 10) { const y = 14 + k * 14 + Math.sin((x + t * 60 + k * 90) / 45) * 5; x === -40 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); }
  // Bubbles
  for (let i = 0; i < 12; i++) { const ph = (t * 0.12 + i * 0.083) % 1, x = (i * 97 + 30) % W + Math.sin(t * 1.5 + i) * 8, y = H - ph * (H + 40), r = 4 + (i % 3) * 3; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 2; ctx.stroke(); ctx.beginPath(); ctx.arc(x - r * 0.35, y - r * 0.35, r * 0.25, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.fill(); }
  // Sand
  ctx.fillStyle = C.sand; ctx.beginPath(); ctx.moveTo(0, 500); for (let x = 0; x <= W; x += 40) ctx.quadraticCurveTo(x + 20, 490 + (x / 40 % 2) * 14, x + 40, 500); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#d9c078'; ctx.lineWidth = 4; ctx.stroke();
  for (let i = 0; i < 9; i++) { const x = 60 + i * 105; ctx.beginPath(); ctx.arc(x, 522, 9, Math.PI, 0); ctx.strokeStyle = '#d9c078'; ctx.lineWidth = 3; ctx.stroke(); }
  // Seaweed
  for (const [x, h, c] of [[70, 110, C.weed], [125, 70, C.weedDark], [840, 130, C.weed], [900, 80, C.weedDark], [500, 60, C.weedDark]]) {
    ctx.beginPath(); ctx.moveTo(x, 505);
    for (let j = 0; j <= h; j += 10) ctx.lineTo(x + Math.sin(t * 2 + j * 0.08 + x) * (j / h) * 18, 505 - j);
    ctx.lineWidth = 14; ctx.strokeStyle = INK; ctx.lineCap = 'round'; ctx.stroke();
    ctx.lineWidth = 8; ctx.strokeStyle = c; ctx.stroke();
  }
  // Starfish and shell
  ctx.save(); ctx.translate(680, 512); for (let i = 0; i < 5; i++) { ctx.rotate(Math.PI * 2 / 5); poly([[0, 0], [-6, -8], [0, -22], [6, -8]], C.fishO, INK, 3); } ctx.restore();
  ctx.beginPath(); ctx.arc(300, 516, 12, Math.PI, 0); ctx.fillStyle = '#f7b7c9'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke();
  if (dim) { ctx.fillStyle = `rgba(0,20,50,${dim})`; ctx.fillRect(0, 0, W, H); }
}

export function drawFish(x, y, color = C.fishY, t = 0, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const flap = Math.sin(t * 8 + x * 0.1) * 3;
  poly([[14, 0], [26, -9 + flap], [26, 9 + flap]], color, INK, 3);
  ellipse(0, 0, 16, 10, color, INK, 3);
  ellipse(-2, 3, 9, 4, 'rgba(255,255,255,0.35)');
  circle(-7, -2, 3.2, '#ffffff', INK, 1.5); circle(-6.5, -2, 1.6, INK);
  ctx.restore();
}

// A net holding ten fish.
export function drawTenNet(x, y, glow = false, t = 0) {
  if (glow) { ctx.fillStyle = 'rgba(255,255,255,0.45)'; rr(x - 5, y - 5, 66, 42, 12); ctx.fill(); }
  rr(x, y, 56, 32, 10); ctx.fillStyle = C.net; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke();
  for (let i = 0; i < 10; i++) { const fx = x + 9 + (i % 5) * 10, fy = y + 9 + Math.floor(i / 5) * 14; ellipse(fx, fy, 4, 2.6, C.fishO); poly([[fx + 3.5, fy], [fx + 6.5, fy - 2.5], [fx + 6.5, fy + 2.5]], C.fishO); }
  ctx.save(); ctx.beginPath(); rr(x, y, 56, 32, 10); ctx.clip(); ctx.strokeStyle = 'rgba(184,149,90,0.55)'; ctx.lineWidth = 1.5;
  for (let d = -40; d < 100; d += 9) { ctx.beginPath(); ctx.moveTo(x + d, y); ctx.lineTo(x + d + 32, y + 32); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x + d + 32, y); ctx.lineTo(x + d, y + 32); ctx.stroke(); }
  ctx.restore();
  label('10', x + 28, y + 16, { size: 20, fill: '#ffffff', stroke: INK, width: 5 });
}

// The shark. Faces left, centered on its body. opts: mouth 0..1, expr normal|happy|puzzled, rot, flip, hat, shades, board, scale, t
export function drawShark(x, y, o = {}) {
  const { mouth = 0, expr = 'normal', rot = 0, flip = false, hat = false, shades = false, board = false, scale = 1, t = 0 } = o;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(flip ? -scale : scale, scale);
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  if (board) { poly([[-120, 52], [120, 52], [100, 70], [-100, 70]], C.fishY, INK, 5); ctx.strokeStyle = C.fishR; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-90, 61); ctx.lineTo(90, 61); ctx.stroke(); }
  const wag = Math.sin(t * 6) * 10;
  // Tail
  poly([[70, 0], [118, -40 + wag], [104, 0], [118, 40 + wag]], C.sharkDark, INK, STROKE);
  // Dorsal fin
  poly([[-8, -30], [24, -76], [44, -28]], C.sharkDark, INK, STROKE);
  // Body
  ctx.beginPath(); ctx.moveTo(-96, 0); ctx.bezierCurveTo(-96, -40, -40, -46, 10, -40); ctx.bezierCurveTo(50, -36, 76, -20, 80, 0); ctx.bezierCurveTo(76, 22, 50, 40, 10, 42); ctx.bezierCurveTo(-40, 46, -96, 36, -96, 0); ctx.closePath();
  ctx.fillStyle = C.shark; ctx.fill(); ctx.lineWidth = STROKE; ctx.strokeStyle = INK; ctx.stroke();
  // Belly
  ctx.save(); ctx.clip(); ctx.beginPath(); ctx.ellipse(-14, 24, 78, 26, 0, 0, Math.PI * 2); ctx.fillStyle = C.belly; ctx.fill(); ctx.restore();
  // Pectoral fin
  poly([[-10, 18], [8, 58], [30, 20]], C.sharkDark, INK, STROKE);
  // Gills
  ctx.strokeStyle = INK; ctx.lineWidth = 3; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(28 + i * 10, 0, 10, -0.9, 0.9); ctx.stroke(); }
  // Mouth
  const m = Math.max(0, Math.min(1, mouth));
  if (m < 0.12) {
    ctx.beginPath(); ctx.moveTo(-86, 8); ctx.quadraticCurveTo(-50, 24 + (expr === 'happy' ? 10 : expr === 'puzzled' ? -6 : 0), -10, 14); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke();
    for (let i = 0; i < 5; i++) { const tx = -78 + i * 14; poly([[tx, 10 + i * 1.5], [tx + 9, 10 + i * 1.5], [tx + 4.5, 20 + i * 1.5]], '#ffffff', INK, 2); }
  } else {
    const open = 12 + m * 34;
    ctx.beginPath(); ctx.moveTo(-88, 6); ctx.lineTo(-12, 6); ctx.quadraticCurveTo(-14, 6 + open, -30, 8 + open); ctx.lineTo(-80, 8 + open); ctx.quadraticCurveTo(-90, 8 + open * 0.6, -88, 6); ctx.closePath();
    ctx.fillStyle = '#8a2b46'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke();
    ellipse(-48, 10 + open * 0.8, 24, open * 0.25, '#d94b6a');
    for (let i = 0; i < 6; i++) { const tx = -82 + i * 12; poly([[tx, 7], [tx + 9, 7], [tx + 4.5, 17]], '#ffffff', INK, 2); poly([[tx + 2, 7 + open], [tx + 11, 7 + open], [tx + 6.5, open - 3]], '#ffffff', INK, 2); }
  }
  // Eye
  const ex = -46, ey = -16;
  circle(ex, ey, 15, '#ffffff', INK, 4);
  const px = expr === 'puzzled' ? ex + 3 : ex - 3, py = ey + 1;
  circle(px, py, 7.5, INK); circle(px - 2.5, py - 3, 2.5, '#ffffff');
  if (expr === 'puzzled') { ctx.beginPath(); ctx.moveTo(ex - 18, ey - 28); ctx.lineTo(ex + 12, ey - 22); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke(); }
  if (expr === 'happy') { ctx.beginPath(); ctx.arc(ex, ey, 17, Math.PI * 1.15, Math.PI * 1.85); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke(); ellipse(-70, 4, 9, 5, 'rgba(255,120,120,0.45)'); }
  if (shades) { rr(ex - 24, ey - 12, 44, 22, 8); ctx.fillStyle = '#1b1b1b'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke(); ctx.fillStyle = 'rgba(255,255,255,0.35)'; rr(ex - 18, ey - 8, 12, 5, 3); ctx.fill(); ctx.beginPath(); ctx.moveTo(ex + 20, ey - 6); ctx.lineTo(ex + 40, ey - 10); ctx.lineWidth = 4; ctx.stroke(); }
  if (hat) { poly([[10, -72], [46, -72], [28, -128]], C.fishR, INK, 4); for (let i = 0; i < 3; i++) circle(20 + i * 8, -85 - i * 10, 4, C.fishY); circle(28, -128, 8, C.fishY, INK, 3); }
  ctx.restore();
}

export function drawCrab(x, y, t) {
  const bob = Math.sin(t * 10) * 6;
  ctx.save(); ctx.translate(x, y + bob);
  for (const sx of [-1, 1]) { for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(sx * (14 + i * 6), 8); ctx.lineTo(sx * (30 + i * 8), 24 + i * 4); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.lineCap = 'round'; ctx.stroke(); } ctx.beginPath(); ctx.moveTo(sx * 22, -6); ctx.lineTo(sx * 40, -28); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke(); circle(sx * 44, -34, 12, C.fishR, INK, 4); poly([[sx * 40, -46], [sx * 52, -50], [sx * 48, -38]], C.fishR, INK, 3); }
  ellipse(0, 0, 34, 22, C.fishR, INK, 5);
  for (const sx of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sx * 10, -18); ctx.lineTo(sx * 12, -34); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke(); circle(sx * 12, -38, 8, '#ffffff', INK, 3); circle(sx * 12, -38, 3.5, INK); }
  ctx.beginPath(); ctx.arc(0, 4, 12, 0.2, Math.PI - 0.2); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke();
  ctx.restore();
}

export function drawJelly(x, y, t, color) {
  const bob = Math.sin(t * 3 + x) * 10;
  ctx.save(); ctx.translate(x, y + bob);
  for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(-24 + i * 12, 14); ctx.quadraticCurveTo(-24 + i * 12 + Math.sin(t * 5 + i) * 10, 40, -24 + i * 12 + Math.sin(t * 4 + i) * 6, 66); ctx.lineWidth = 4; ctx.strokeStyle = color; ctx.lineCap = 'round'; ctx.stroke(); }
  ctx.beginPath(); ctx.arc(0, 8, 34, Math.PI, 0); ctx.quadraticCurveTo(20, 20, 0, 16); ctx.quadraticCurveTo(-20, 20, -34, 8); ctx.closePath(); ctx.fillStyle = color; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke();
  circle(-10, -2, 4, INK); circle(10, -2, 4, INK);
  ctx.restore();
}

// Speech bubble with a tail pointing to (tx, ty).
export function speech(x, y, w, h, tx, ty, fill = '#ffffff') {
  ctx.fillStyle = 'rgba(0,0,0,0.2)'; rr(x + 5, y + 7, w, h, 24); ctx.fill();
  rr(x, y, w, h, 24); ctx.fillStyle = fill; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke();
  const bx = Math.max(x + 30, Math.min(x + w - 30, tx)), by = ty < y ? y : y + h;
  poly([[bx - 16, by], [bx + 16, by], [tx, ty]], fill, INK, 5);
  ctx.fillStyle = fill; ctx.fillRect(bx - 13, by - 3, 26, 6);
}

export const GAGS = ['flip', 'party', 'shades', 'burp', 'crab', 'disco', 'surf'];

export function drawReward(gag, p, q, t, streak) {
  const chompEnd = 0.3;
  drawSea(t);
  if (gag === 'disco' && p > chompEnd) { const cols = ['rgba(255,0,120,0.25)', 'rgba(0,255,200,0.25)', 'rgba(255,230,0,0.25)', 'rgba(120,0,255,0.25)']; ctx.fillStyle = cols[Math.floor(t * 6) % 4]; ctx.fillRect(0, 0, W, H); for (let i = 0; i < 4; i++) { ctx.save(); ctx.globalAlpha = 0.25; ctx.fillStyle = ['#ff4fa3', '#4fffe1', '#fff34f', '#b04fff'][i]; ctx.beginPath(); ctx.moveTo(240 * i + 120, 0); ctx.lineTo(240 * i + 120 + Math.sin(t * 3 + i) * 200 - 80, 520); ctx.lineTo(240 * i + 120 + Math.sin(t * 3 + i) * 200 + 80, 520); ctx.closePath(); ctx.fill(); ctx.restore(); } }
  if (p < chompEnd) {
    const k = p / chompEnd, sx = 900 - k * 440, mouth = k < 0.6 ? k / 0.6 : 1 - (k - 0.6) / 0.4;
    for (let i = 0; i < 8; i++) { const fk = Math.min(1, k * 1.4 + i * 0.05); const fx = 80 + i * 40 + (sx - 90 - (80 + i * 40)) * fk, fy = 260 + Math.sin(i) * 60 * (1 - fk); if (fk < 0.98) drawFish(fx, fy, [C.fishY, C.fishO, C.fishR][i % 3], t, 1.4); }
    drawShark(sx, 270, { mouth, t, expr: 'happy', scale: 1.4 });
    if (k > 0.55) label('CHOMP!', 480, 90 - (k - 0.55) * 60, { size: 96, fill: C.fishY, width: 12 });
    return;
  }
  const g = (p - chompEnd) / (1 - chompEnd);
  switch (gag) {
    case 'flip': { const rot = g < 0.8 ? -(g / 0.8) * Math.PI * 2 : 0; drawShark(480, 270 - Math.sin(g * Math.PI) * 90, { rot, t, expr: 'happy', mouth: 0.2, scale: 1.4 }); label('WHEEEE!', 480, 450, { size: 64, fill: C.fishY, width: 10 }); break; }
    case 'party': { drawShark(480, 290, { t, expr: 'happy', hat: true, mouth: 0.3, scale: 1.4 }); for (let i = 0; i < 40; i++) { const cx = (i * 173 + 50) % W, cy = (g * 600 + i * 61) % H; ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * 3 + i); ctx.fillStyle = [C.fishY, C.fishR, '#3fbf7f', '#7fd1f5', '#f7b7c9'][i % 5]; ctx.fillRect(-7, -4, 14, 8); ctx.restore(); } label('PARTY!', 480, 80, { size: 90, fill: '#ffffff', width: 12 }); break; }
    case 'shades': { const drop = Math.min(1, g * 3); if (drop < 1) { ctx.save(); ctx.translate(410, 40 + drop * 210); rr(-34, -12, 68, 24, 8); ctx.fillStyle = '#1b1b1b'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore(); } drawShark(480, 270, { t, expr: 'happy', shades: drop >= 1, mouth: 0.15, scale: 1.4 }); if (drop >= 1) label('COOL.', 480, 440, { size: 80, fill: '#ffffff', width: 12 }); break; }
    case 'burp': { const bp = Math.min(1, g * 1.5); drawShark(480, 300, { t, mouth: bp < 0.3 ? bp / 0.3 : 0.9, expr: 'happy', scale: 1.4 }); if (bp > 0.2) { const r = 30 + bp * 90, by = 300 - bp * 190; circle(380, by, r, 'rgba(210,240,255,0.9)', INK, 5); circle(380 - r * 0.4, by - r * 0.4, r * 0.15, '#ffffff'); if (bp > 0.5) label(String(q.sum), 380, by, { size: 90, fill: INK, width: 0 }); } label('BURP!', 720, 120, { size: 80, fill: C.fishY, width: 12 }); break; }
    case 'crab': { drawShark(400, 290 + Math.sin(t * 10) * 10, { t, expr: 'happy', mouth: 0.3, scale: 1.3, rot: Math.sin(t * 10) * 0.08 }); drawCrab(660, 330 + Math.sin(t * 10 + 1.5) * 10, t); for (let i = 0; i < 6; i++) label('♪', 300 + i * 80 + Math.sin(t * 8 + i) * 12, 120 + (i % 2) * 40, { size: 40, fill: C.fishY, width: 6 }); label('DANCE!', 480, 70, { size: 90, fill: '#ffffff', width: 12 }); break; }
    case 'disco': { for (let i = 0; i < 5; i++) drawJelly(120 + i * 180, 110 + (i % 2) * 50, t, ['#f7b7c9', '#9db8ff', '#ffd23f', '#9be07d', '#ff8a80'][i]); drawShark(480, 320 - Math.abs(Math.sin(t * 8)) * 50, { t, expr: 'happy', mouth: 0.4, rot: Math.sin(t * 8) * 0.2, scale: 1.3 }); label('DISCO!', 480, 460, { size: 90, fill: '#ffffff', width: 12 }); break; }
    case 'surf': { ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.beginPath(); for (let x = -20; x <= W + 20; x += 12) { const y = 200 + Math.sin(t * 4 + x * 0.03) * 22; x === -20 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); drawShark(180 + g * 600, 180 + Math.sin(t * 4) * 20, { t, expr: 'happy', shades: true, board: true, rot: 0.2, mouth: 0.3, scale: 1.2 }); label('RADICAL!', 480, 380, { size: 90, fill: C.fishY, width: 12 }); label(`${streak} in a row!`, 480, 450, { size: 44, fill: '#ffffff', width: 8 }); break; }
  }
}
