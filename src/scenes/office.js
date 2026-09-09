// The agency office: hub screen with the case board.
import { el, svgRoot } from '../engine/svg.js';
import { div, button, bubble } from '../engine/ui.js';
import { character, place } from '../art/characters.js';
import { backdrop } from '../art/backdrops.js';
import { clueIcon } from '../art/clues.js';
import { save, commit, caseState } from '../engine/save.js';
import { go } from '../engine/stage.js';
import { CASES, AVAILABLE, CASE_DATA } from '../data/cases.js';
import { startCase } from './caseflow.js';
import { sfx } from '../engine/audio.js';

export function office() {
  return {
    enter(root) {
      const svg = svgRoot();
      svg.append(backdrop('office'));
      svg.append(place(character(save.player.avatar, { expr: 'happy' }), 380, 528, 0.95));
      svg.append(place(character('basset', { expr: 'normal' }), 840, 528, 1.0));
      root.append(svg);

      const say = t => {
        root.querySelectorAll('.bubble').forEach(b => b.remove());
        const b = bubble('Bart', t, { x: 470, y: 300, w: 330, side: 'right' });
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
        card.innerHTML = `<div class="num">${open ? c.id : '🔒'}</div><div class="ttl">${c.title}</div>` +
          (st.status === 'closed' ? '<div class="badge">✓</div>' : '');
        card.addEventListener('pointerdown', e => {
          e.stopPropagation(); sfx.tap();
          if (!open) { say('That case is not open yet. Try case 3.'); return; }
          startCase(CASE_DATA[c.id]);
        });
        root.append(card);
      });

      // Map pieces on the desk
      const pieces = div('label', { left: '20px', top: '410px', fontSize: '20px' }, `Map pieces: ${save.mapPieces.length} / 8`);
      root.append(pieces);

      root.append(button('Notebook', { x: 20, y: 456, cls: 'blue small', onTap: () => openNotebook(root) }));
      const mute = button(save.muted ? '🔇' : '🔊', { x: 880, y: 12, cls: 'small icon', onTap: () => { save.muted = !save.muted; commit(); mute.textContent = save.muted ? '🔇' : '🔊'; } });
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
    const item = div('', { textAlign: 'center', width: '150px', fontSize: '18px' });
    const s = svgRoot(90, 90); s.setAttribute('viewBox', '0 0 100 100'); s.style.position = 'static';
    s.append(clueIcon(cl.icon)); item.append(s, div('', {}, cl.title)); row.append(item);
  }
  p.append(row);
  const h = document.createElement('h2'); h.textContent = 'Map pieces'; p.append(h);
  const pr = div('', { display: 'flex', gap: '10px' });
  for (let i = 1; i <= 8; i++) {
    const slot = div('', { width: '70px', height: '70px', border: '3px dashed #8b5a2b', borderRadius: '8px', background: save.mapPieces.includes(i) ? '#f6e2c0' : 'transparent' });
    if (save.mapPieces.includes(i)) { const s = svgRoot(70, 70); s.setAttribute('viewBox', '0 0 100 100'); s.style.position = 'static'; s.append(clueIcon('piece')); slot.append(s); }
    pr.append(slot);
  }
  p.append(pr);
  p.append(button('Close', { x: 560, y: 380, cls: 'small', onTap: () => p.remove() }));
  root.append(p);
}
