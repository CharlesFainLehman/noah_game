const NS = 'http://www.w3.org/2000/svg';

export function el(tag, attrs = {}, ...kids) {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) if (v !== undefined && v !== null) e.setAttribute(k, v);
  for (const k of kids) if (k) e.appendChild(k);
  return e;
}

export function svgRoot(w = 960, h = 540) {
  return el('svg', { width: w, height: h, viewBox: `0 0 ${w} ${h}` });
}

export function text(x, y, str, attrs = {}) {
  const t = el('text', { x, y, ...attrs });
  t.textContent = str;
  return t;
}
