// Story panels: pixel backdrop, one character, one speech bubble. Tap to advance.
import { Pixel } from '../engine/pixel.js';
import { div, bubble } from '../engine/ui.js';
import { pixelCharacter, SPECIES, CW, CH } from '../art/pixel-characters.js';
import { drawBackdrop } from '../art/pixel-backdrops.js';
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
  let i = 0, root = null, lastTap = 0, px = null;

  function show() {
    root.innerHTML = '';
    const p = panels[i];
    const sp = speaker(p.who);
    const right = p.side === 'right';
    px = new Pixel(root);
    drawBackdrop(px, p.bg);
    px.blit(pixelCharacter(sp.species, p.expr), right ? 320 - 16 - CW * 3 : 16, 176 - CH * 3, 3);
    const b = bubble(sp.label, fmt(p.text), right ? { x: 40, y: 40, w: 520, side: 'right' } : { x: 400, y: 40, w: 520, side: 'left' });
    b.classList.add('pop');
    root.append(b);
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
