// Two steps: pick the suspect, then pick how they did it.
import { Pixel } from '../engine/pixel.js';
import { div, bubble } from '../engine/ui.js';
import { pixelCharacter, CH, idle } from '../art/pixel-characters.js';
import { iconCanvas } from '../art/pixel-characters.js';
import { suspectIcon } from './office.js';
import { drawBackdrop } from '../art/pixel-backdrops.js';
import { clueSprite } from '../art/sprites.js';
import { makeRng } from '../engine/rng.js';
import { caseState } from '../engine/save.js';
import { sfx } from '../engine/audio.js';
import { fmt } from './comic.js';

export function deduction(c, onSolved) {
  let t = 0;
  return {
    update(dt) { t += dt; if (this.paint) this.paint(t); },
    exit() { window.__ded = null; },
    enter(root) {
      const px = new Pixel(root);
      let bartExpr = 'normal';
      const drawBart = expr => { bartExpr = expr; };
      this.paint = t => { drawBackdrop(px, 'office', { t }); const { frame, bob } = idle(t); px.blit(pixelCharacter('basset', bartExpr, frame), 10, 176 - CH * 2 + bob, 2); };
      this.paint(0);
      const found = caseState(c.id).clues;

      let bub;
      const say = (t, expr) => {
        if (bub) bub.remove();
        bub = bubble('Bart', t, { x: 300, y: 14, w: 640, side: 'left' });
        bub.style.fontSize = '24px';
        bub.classList.add('pop'); root.append(bub);
        drawBart(expr);
      };
      const opened = performance.now();
      const items = [];
      const clear = () => { items.forEach(i => i.remove()); items.length = 0; };

      // Clue strip along the bottom.
      const clueStrip = () => {
        c.locations.forEach((loc, i) => {
          const card = div('card', { left: (300 + i * 130) + 'px', top: '412px', width: '120px', height: '112px', padding: '4px', cursor: 'default', fontSize: '14px', lineHeight: '1.1' });
          card.append(iconCanvas(clueSprite(loc.clue.icon), 3));
          card.firstChild.style.margin = '0 auto';
          card.append(div('', {}, `<b>Clue ${i + 1}</b><br>${found.includes(loc.clue.id) ? loc.clue.title : '???'}`));
          items.push(card); root.append(card);
        });
      };

      function stepWho() {
        say(fmt(c.deduction.who), 'normal');
        clueStrip();
        const rng = makeRng();
        rng.shuffle(c.suspects).forEach((s, i) => {
          const card = div('card', { left: (300 + i * 160) + 'px', top: '150px', width: '150px', height: '240px', padding: '6px', fontSize: '16px', lineHeight: '1.15' });
          const pic = suspectIcon(s, 3); pic.style.margin = '0 auto';
          card.append(pic, div('', { fontWeight: 'bold', fontSize: '18px', margin: '4px 0' }, s.name), div('', {}, s.theory));
          card.addEventListener('pointerdown', e => {
            e.stopPropagation();
            if (card.classList.contains('locked') || performance.now() - opened < 500) return;
            if (s.guilty) {
              sfx.good(); card.style.background = '#dff5d0';
              say(fmt(c.deduction.whoRight), 'surprised');
              setTimeout(() => { clear(); stepHow(); }, 1600);
            } else {
              sfx.bad(); card.classList.add('locked');
              const stamp = div('', { color: '#e0453b', fontWeight: 'bold', fontSize: '22px', marginTop: '4px' }, 'CLEARED');
              card.append(stamp);
              say(fmt(s.reply), 'normal');
              const idx = c.locations.findIndex(l => l.clue.id === s.clearedBy);
              const cc = items[idx];
              if (cc) { cc.classList.remove('flash'); void cc.offsetWidth; cc.classList.add('flash'); }
            }
          });
          items.push(card); root.append(card);
        });
      }

      function stepHow() {
        say(fmt(c.deduction.how), 'normal');
        const rng = makeRng();
        let solved = false;
        rng.shuffle(c.deduction.methods).forEach((o, i) => {
          const d = div('option', { top: (200 + i * 100) + 'px' });
          d.append(div('letter', {}, 'ABC'[i]), div('', {}, fmt(o.text)));
          d.addEventListener('pointerdown', e => {
            e.stopPropagation();
            if (solved || d.classList.contains('no')) return;
            if (o.ok) {
              solved = true; sfx.fanfare(); d.style.background = '#dff5d0';
              say(fmt(c.deduction.solved), 'happy');
              setTimeout(onSolved, 1800);
            } else { sfx.bad(); d.classList.add('no'); say(fmt(o.reply), 'normal'); }
          });
          items.push(d); root.append(d);
        });
      }

      window.__ded = { who: c.suspects.find(s => s.guilty).name, how: c.deduction.methods.find(m => m.ok).text };
      stepWho();
    },
  };
}
