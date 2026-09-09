// Pick the explanation that fits the clues.
import { Pixel } from '../engine/pixel.js';
import { div, bubble } from '../engine/ui.js';
import { pixelCharacter, iconCanvas, CW, CH } from '../art/pixel-characters.js';
import { drawBackdrop } from '../art/pixel-backdrops.js';
import { clueSprite } from '../art/sprites.js';
import { makeRng } from '../engine/rng.js';
import { sfx } from '../engine/audio.js';
import { fmt } from './comic.js';

export function deduction(c, onSolved) {
  return {
    enter(root) {
      const px = new Pixel(root);
      const drawBart = expr => { drawBackdrop(px, 'office'); px.blit(pixelCharacter('basset', expr), 8, 176 - CH * 3, 3); };
      drawBart('normal');

      let bub;
      const say = (t, expr) => {
        if (bub) bub.remove();
        bub = bubble('Bart', t, { x: 300, y: 14, w: 640, side: 'left' });
        bub.classList.add('pop'); root.append(bub);
        drawBart(expr);
      };
      say(fmt(c.deduction.question), 'normal');

      const cards = {};
      c.locations.forEach((loc, i) => {
        const card = div('card', { left: (300 + i * 220) + 'px', top: '140px', width: '200px', height: '104px', padding: '4px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'default' });
        card.append(iconCanvas(clueSprite(loc.clue.icon), 5), div('', { fontSize: '17px', textAlign: 'left', lineHeight: '1.15' }, `<b>Clue ${i + 1}</b><br>${loc.clue.title}`));
        cards[loc.clue.id] = card; root.append(card);
      });

      const rng = makeRng();
      const opts = rng.shuffle(c.deduction.options);
      let solved = false;
      const opened = performance.now();
      opts.forEach((o, i) => {
        const d = div('option', { top: (262 + i * 92) + 'px' });
        d.append(div('letter', {}, 'ABC'[i]), div('', {}, fmt(o.text)));
        d.addEventListener('pointerdown', e => {
          e.stopPropagation();
          if (solved || d.classList.contains('no') || performance.now() - opened < 500) return;
          if (o.ok) {
            solved = true; sfx.fanfare(); d.style.background = '#dff5d0';
            say('That is it! The mirror! Let us go tell Gaston.', 'happy');
            setTimeout(onSolved, 1800);
          } else {
            sfx.bad(); d.classList.add('no');
            say(fmt(o.reply), 'normal');
            const card = cards[o.clue];
            if (card) { card.classList.remove('flash'); void card.offsetWidth; card.classList.add('flash'); }
          }
        });
        root.append(d);
      });
    },
  };
}
