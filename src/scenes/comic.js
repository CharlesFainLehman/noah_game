// Story panels: backdrop, one character, one speech bubble. Tap to advance.
import { el, svgRoot } from '../engine/svg.js';
import { div, bubble } from '../engine/ui.js';
import { character, place, SPECIES } from '../art/characters.js';
import { backdrop } from '../art/backdrops.js';
import { save } from '../engine/save.js';
import { sfx } from '../engine/audio.js';

export function fmt(t) {
  return t.replace(/\{name\}/g, save.player ? save.player.name : 'Detective');
}

export function speaker(who) {
  if (who === 'player') return { species: save.player.avatar, label: save.player.name };
  return { species: who, label: SPECIES[who].label };
}

export function comic(panels, onDone) {
  let i = 0, root = null, lastTap = 0;

  function show() {
    root.innerHTML = '';
    const p = panels[i];
    const sp = speaker(p.who);
    const right = p.side === 'right';
    const svg = svgRoot();
    svg.append(backdrop(p.bg));
    svg.append(place(character(sp.species, { expr: p.expr }), right ? 760 : 200, 528, 1.25, right));
    root.append(svg);
    const b = bubble(sp.label, fmt(p.text), right ? { x: 40, y: 50, w: 520, side: 'right' } : { x: 400, y: 50, w: 520, side: 'left' });
    b.classList.add('pop');
    root.append(b);
    // Panel dots
    const dots = div('', { position: 'absolute', left: '0', right: '0', bottom: '14px', textAlign: 'center', fontSize: '28px', color: '#fff', textShadow: '0 2px 0 #000' });
    dots.textContent = panels.map((_, j) => (j === i ? '●' : '○')).join(' ');
    root.append(dots);
    root.append(div('hint', { right: '24px', bottom: '16px' }, 'Tap to continue ▶'));
  }

  return {
    enter(r) {
      root = r;
      root.addEventListener('pointerdown', e => {
        e.preventDefault();
        const now = performance.now();
        if (now - lastTap < 400) return;
        lastTap = now;
        sfx.tap();
        i++;
        if (i >= panels.length) onDone(); else show();
      });
      show();
    },
  };
}
