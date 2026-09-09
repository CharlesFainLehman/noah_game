// Low-resolution canvas (320x180) scaled up 3x with crisp pixels.
import { drawText } from '../art/font.js';

export const PW = 320, PH = 180;

export class Pixel {
  constructor(root) {
    const c = document.createElement('canvas');
    c.width = PW; c.height = PH; c.className = 'pixel';
    root.appendChild(c);
    this.canvas = c;
    this.ctx = c.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
    this.hits = [];
    c.addEventListener('pointerdown', e => {
      e.preventDefault();
      const p = this.toLocal(e);
      // Last-added hit areas take priority (drawn on top).
      for (let i = this.hits.length - 1; i >= 0; i--) {
        const h = this.hits[i];
        if (p.x >= h.x && p.x < h.x + h.w && p.y >= h.y && p.y < h.y + h.h) { h.fn(p, h); return; }
      }
    });
  }
  toLocal(e) {
    const r = this.canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) / r.width * PW, y: (e.clientY - r.top) / r.height * PH };
  }
  hit(x, y, w, h, fn, data) { this.hits.push({ x, y, w, h, fn, data }); }
  clearHits() { this.hits = []; }
  clear(color) { this.ctx.fillStyle = color; this.ctx.fillRect(0, 0, PW, PH); }
  rect(x, y, w, h, color) { this.ctx.fillStyle = color; this.ctx.fillRect(x, y, w, h); }
  // Filled rect with 1px outline.
  box(x, y, w, h, fill, line = '#2b1b0e') {
    this.rect(x, y, w, h, line);
    this.rect(x + 1, y + 1, w - 2, h - 2, fill);
  }
  text(str, x, y, color, opts) { drawText(this.ctx, str, x, y, color, opts); }
  blit(img, x, y, scale = 1) {
    this.ctx.drawImage(img, Math.round(x), Math.round(y), img.width * scale, img.height * scale);
  }
}

// Build a sprite from rows of palette characters. '.' is transparent.
export function sprite(rows, pal) {
  const h = rows.length, w = rows[0].length;
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const x = c.getContext('2d');
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const col = pal[rows[j][i]];
    if (col) { x.fillStyle = col; x.fillRect(i, j, 1, 1); }
  }
  return c;
}

export function flipX(img) {
  const c = document.createElement('canvas');
  c.width = img.width; c.height = img.height;
  const x = c.getContext('2d');
  x.translate(img.width, 0); x.scale(-1, 1); x.drawImage(img, 0, 0);
  return c;
}
