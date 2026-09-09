// Pick the explanation that fits the clues.
import { svgRoot } from '../engine/svg.js';
import { div, bubble } from '../engine/ui.js';
import { character, place } from '../art/characters.js';
import { backdrop } from '../art/backdrops.js';
import { clueIcon } from '../art/clues.js';
import { makeRng } from '../engine/rng.js';
import { sfx } from '../engine/audio.js';
import { fmt } from './comic.js';

export function deduction(c, onSolved) {
  return {
    enter(root) {
      const svg = svgRoot();
      svg.append(backdrop('office'));
      svg.append(place(character('basset', { expr: 'normal' }), 150, 528, 1.15));
      root.append(svg);

      let bub;
      const say = (t, expr) => {
        if (bub) bub.remove();
        bub = bubble('Bart', t, { x: 300, y: 14, w: 640, side: 'left' });
        bub.classList.add('pop'); root.append(bub);
        svg.querySelector('.char').replaceWith(place(character('basset', { expr }), 150, 528, 1.15));
      };
      say(fmt(c.deduction.question), 'normal');

      const cards = {};
      c.locations.forEach((loc, i) => {
        const card = div('card', { left: (300 + i * 220) + 'px', top: '140px', width: '200px', height: '104px', padding: '4px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'default' });
        const s = svgRoot(80, 80); s.setAttribute('viewBox', '0 0 100 100'); s.style.position = 'static';
        s.append(clueIcon(loc.clue.icon));
        card.append(s, div('', { fontSize: '17px', textAlign: 'left', lineHeight: '1.15' }, `<b>Clue ${i + 1}</b><br>${loc.clue.title}`));
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
