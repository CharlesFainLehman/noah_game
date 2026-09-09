// The agency office: hub screen with the case board.
import { Pixel } from '../engine/pixel.js';
import { div, button, bubble } from '../engine/ui.js';
import { pixelCharacter, iconCanvas, CH } from '../art/pixel-characters.js';
import { drawBackdrop } from '../art/pixel-backdrops.js';
import { sprites, clueSprite } from '../art/sprites.js';
import { save, commit, caseState } from '../engine/save.js';
import { go } from '../engine/stage.js';
import { CASES, AVAILABLE, CASE_DATA } from '../data/cases.js';
import { startCase } from './caseflow.js';
import { sfx } from '../engine/audio.js';

export function office() {
  return {
    enter(root) {
      const S = sprites();
      const px = new Pixel(root);
      drawBackdrop(px, 'office');
      px.blit(pixelCharacter(save.player.avatar, 'happy'), 96, 174 - CH * 2, 2);
      px.blit(pixelCharacter('basset', 'normal'), 252, 174 - CH * 2, 2);

      const say = t => {
        root.querySelectorAll('.bubble').forEach(b => b.remove());
        const b = bubble('Bart', t, { x: 440, y: 290, w: 300, side: 'right' });
        b.style.fontSize = '24px';
        b.classList.add('pop'); root.append(b);
      };
      const closedCount = CASES.filter(c => caseState(c.id).status === 'closed').length;
      say(closedCount ? `Welcome back, ${save.player.name}. Pick a case from the board.` : `Welcome, ${save.player.name}. Your first case is on the board. Tap it!`);

      // Case board cards
      CASES.forEach((c, i) => {
        const st = caseState(c.id), open = AVAILABLE.includes(c.id);
        const card = div('card' + (open ? '' : ' locked') + (st.status === 'closed' ? ' done' : ''), {
          left: (78 + (i % 4) * 96) + 'px', top: (66 + Math.floor(i / 4) * 110) + 'px', width: '84px', height: '100px',
        });
        if (open) card.append(div('num', {}, String(c.id)));
        else { const l = div('lock'); l.append(iconCanvas(S.lock, 3)); card.append(l); }
        card.append(div('ttl', {}, c.title));
        if (st.status === 'closed') { const b = div('badge'); b.append(iconCanvas(S.check, 3)); card.append(b); }
        card.addEventListener('pointerdown', e => {
          e.stopPropagation(); sfx.tap();
          if (!open) { say('That case is not open yet. Try case 3.'); return; }
          startCase(CASE_DATA[c.id]);
        });
        root.append(card);
      });

      root.append(div('label', { left: '20px', top: '410px', fontSize: '20px' }, `Map pieces: ${save.mapPieces.length} / 8`));
      root.append(button('Notebook', { x: 20, y: 456, cls: 'blue small', onTap: () => openNotebook(root) }));
      const mute = button(save.muted ? 'Sound: off' : 'Sound: on', { x: 760, y: 12, cls: 'small', onTap: () => { save.muted = !save.muted; commit(); mute.textContent = save.muted ? 'Sound: off' : 'Sound: on'; } });
      root.append(mute);
    },
  };
}

function openNotebook(root) {
  const p = div('panel', { left: '120px', top: '40px', width: '720px', height: '460px' });
  p.innerHTML = '<h2>Detective Notebook</h2>';
  const clues = [];
  for (const c of Object.values(CASE_DATA)) for (const loc of c.locations) {
    if (caseState(c.id).clues.includes(loc.clue.id)) clues.push(loc.clue);
  }
  const row = div('', { display: 'flex', gap: '16px', flexWrap: 'wrap', minHeight: '120px' });
  if (!clues.length) row.textContent = 'No clues yet. Solve puzzles to find clues.';
  for (const cl of clues) {
    const item = div('', { textAlign: 'center', width: '150px', fontSize: '18px', display: 'flex', flexDirection: 'column', alignItems: 'center' });
    item.append(iconCanvas(clueSprite(cl.icon), 5), div('', {}, cl.title)); row.append(item);
  }
  p.append(row);
  const h = document.createElement('h2'); h.textContent = 'Map pieces'; p.append(h);
  const pr = div('', { display: 'flex', gap: '10px' });
  for (let i = 1; i <= 8; i++) {
    const slot = div('', { width: '70px', height: '70px', border: '3px dashed #8b5a2b', background: save.mapPieces.includes(i) ? '#f6e2c0' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' });
    if (save.mapPieces.includes(i)) slot.append(iconCanvas(clueSprite('piece'), 4));
    pr.append(slot);
  }
  p.append(pr);
  p.append(button('Close', { x: 560, y: 380, cls: 'small', onTap: () => p.remove() }));
  root.append(p);
}
