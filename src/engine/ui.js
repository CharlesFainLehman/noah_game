import { sfx } from './audio.js';

export function div(cls, style = {}, html = '') {
  const d = document.createElement('div');
  d.className = cls;
  Object.assign(d.style, style);
  if (html) d.innerHTML = html;
  return d;
}

export function button(label, { x, y, w, cls = '', onTap }) {
  const b = div('btn ' + cls, { left: x + 'px', top: y + 'px', width: w ? w + 'px' : '' }, label);
  b.addEventListener('pointerdown', e => { e.stopPropagation(); e.preventDefault(); sfx.tap(); onTap && onTap(); });
  return b;
}

export function bubble(who, txt, { x, y, w, side = 'left' }) {
  const b = div('bubble ' + side, { left: x + 'px', top: y + 'px', width: w + 'px' });
  if (who) b.appendChild(div('who', {}, who));
  const t = document.createElement('div');
  t.textContent = txt;
  b.appendChild(t);
  return b;
}
