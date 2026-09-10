// The agency office: hub screen with the case board, notebook, daily case, decor shop, parent screen.
import { Pixel } from '../engine/pixel.js';
import { div, button, bubble } from '../engine/ui.js';
import { pixelCharacter, portrait, iconCanvas, CH } from '../art/pixel-characters.js';
import { drawBackdrop, DECOR } from '../art/pixel-backdrops.js';
import { sprites, clueSprite } from '../art/sprites.js';
import { save, commit, caseState, mastery } from '../engine/save.js';
import { isMastered } from '../engine/mastery.js';
import { go } from '../engine/stage.js';
import { CASES, CASE_DATA, isAvailable } from '../data/cases.js';
import { GAME_NAMES } from '../games/games.js';
import { startCase } from './caseflow.js';
import { dailyCase, dailyDone } from './daily.js';
import { parentScreen } from './parent.js';
import { sfx } from '../engine/audio.js';

export function suspectIcon(s, scale = 3) {
  return s.species ? iconCanvas(portrait(s.species), scale) : iconCanvas(sprites()[s.sprite], scale + 2);
}

export function office(greeting) {
  return {
    enter(root) {
      const S = sprites();
      const px = new Pixel(root);
      const closed = CASES.filter(c => caseState(c.id).status === 'closed').length;
      const gold = Object.keys(GAME_NAMES).filter(g => save.mastery[g] && isMastered(save.mastery[g])).length;
      drawBackdrop(px, 'office', { decor: save.decor, trophies: closed, gold });
      px.blit(pixelCharacter(save.player.avatar, 'happy'), 96, 174 - CH * 2, 2);
      px.blit(pixelCharacter('basset', closed === 8 ? 'happy' : 'normal'), 252, 174 - CH * 2, 2);

      const say = t => {
        root.querySelectorAll('.bubble').forEach(b => b.remove());
        const b = bubble('Bart', t, { x: 440, y: 290, w: 300, side: 'right' });
        b.style.fontSize = '24px';
        b.classList.add('pop'); root.append(b);
      };
      const next = CASES.find(c => caseState(c.id).status !== 'closed');
      say(greeting || (closed === 8 ? `Every case solved, ${save.player.name}. The town is proud of you. Try the daily case file!`
        : closed ? `Welcome back, ${save.player.name}. Case ${next.id} is open on the board.`
        : `Welcome, ${save.player.name}. Your first case is on the board. Tap it!`));

      // Case board cards
      CASES.forEach((c, i) => {
        const st = caseState(c.id), open = isAvailable(c.id, caseState);
        const card = div('card' + (open ? '' : ' locked') + (st.status === 'closed' ? ' done' : ''), {
          left: (78 + (i % 4) * 96) + 'px', top: (66 + Math.floor(i / 4) * 110) + 'px', width: '84px', height: '100px',
        });
        if (open) card.append(div('num', {}, String(c.id)));
        else { const l = div('lock'); l.append(iconCanvas(S.lock, 3)); card.append(l); }
        card.append(div('ttl', {}, c.title));
        if (st.status === 'closed') { const b = div('badge'); b.append(iconCanvas(S.check, 3)); card.append(b); }
        card.addEventListener('pointerdown', e => {
          e.stopPropagation(); sfx.tap();
          if (!open) { say(`That case is not open yet. Solve case ${c.id - 1} first.`); return; }
          startCase(CASE_DATA[c.id]);
        });
        root.append(card);
      });

      root.append(div('label', { left: '20px', top: '404px', fontSize: '18px' }, `Map pieces ${save.mapPieces.length}/8 · Badges ${save.badges}`));
      root.append(button('Notebook', { x: 20, y: 456, cls: 'blue small', onTap: () => openNotebook(root) }));
      root.append(button(dailyDone() ? 'Daily ✓' : 'Daily case', { x: 176, y: 456, cls: 'green small', onTap: () => dailyCase() }));
      root.append(button('Decorate', { x: 340, y: 456, cls: 'small', onTap: () => openShop(root, say) }));
      const mute = button(save.muted ? 'Sound: off' : 'Sound: on', { x: 760, y: 12, cls: 'small', onTap: () => { save.muted = !save.muted; commit(); mute.textContent = save.muted ? 'Sound: off' : 'Sound: on'; } });
      root.append(mute);
      // Parents: hold for two seconds.
      const pb = button('Parents (hold)', { x: 560, y: 12, cls: 'small', onTap: () => {} });
      pb.style.fontSize = '18px';
      let hold = null;
      pb.addEventListener('pointerdown', () => { hold = setTimeout(() => go(parentScreen()), 2000); });
      for (const ev of ['pointerup', 'pointerleave', 'pointercancel']) pb.addEventListener(ev, () => { clearTimeout(hold); });
      root.append(pb);
    },
  };
}

function openShop(root, say) {
  const p = div('panel', { left: '120px', top: '40px', width: '720px', height: '460px' });
  p.innerHTML = `<h2>Decorate the office · Badges: ${save.badges}</h2><div style="font-size:18px;margin-bottom:10px">Earn a badge each day with the daily case file.</div>`;
  const grid = div('', { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' });
  for (const d of DECOR) {
    const owned = save.decor.includes(d.id);
    const row = div('', { display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '3px solid #2b1b0e', padding: '6px 10px', background: owned ? '#dff5d0' : '#fff', fontSize: '20px' });
    row.append(div('', {}, `${d.name} <span style="color:#7a4a22">(${d.cost} badge${d.cost > 1 ? 's' : ''})</span>`));
    if (owned) row.append(div('', { fontWeight: 'bold' }, 'Owned'));
    else {
      const b = button('Buy', { x: 0, y: 0, cls: 'small' }); b.style.position = 'static'; b.style.minHeight = '44px'; b.style.fontSize = '18px';
      b.addEventListener('pointerdown', e => {
        e.stopPropagation();
        if (save.badges < d.cost) { say('Not enough badges yet. Do the daily case file!'); return; }
        save.badges -= d.cost; save.decor.push(d.id); commit(); sfx.fanfare(); p.remove(); go(office(`A ${d.name.toLowerCase()}! The office looks great, ${save.player.name}.`));
      });
      row.append(b);
    }
    grid.append(row);
  }
  p.append(grid);
  p.append(button('Close', { x: 600, y: 392, cls: 'small', onTap: () => p.remove() }));
  root.append(p);
}

function openNotebook(root) {
  const p = div('panel', { left: '120px', top: '40px', width: '720px', height: '460px', overflow: 'hidden' });
  p.innerHTML = '<h2>Detective Notebook</h2>';
  // Open case: clues and suspects
  const open = Object.values(CASE_DATA).find(c => caseState(c.id).status === 'open');
  if (open) {
    const st = caseState(open.id);
    const h = document.createElement('div'); h.style.fontWeight = 'bold'; h.textContent = `Case ${open.id}: clues`; p.append(h);
    const row = div('', { display: 'flex', gap: '8px', minHeight: '60px' });
    for (const loc of open.locations) {
      const found = st.clues.includes(loc.clue.id);
      const item = div('', { textAlign: 'center', width: '132px', fontSize: '14px', lineHeight: '1.1', display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: found ? 1 : .4 });
      item.append(iconCanvas(clueSprite(loc.clue.icon), 3), div('', {}, found ? loc.clue.title : '???')); row.append(item);
    }
    p.append(row);
    const h2 = document.createElement('div'); h2.style.fontWeight = 'bold'; h2.style.marginTop = '6px'; h2.textContent = 'Suspects'; p.append(h2);
    const sr = div('', { display: 'flex', gap: '10px' });
    for (const s of open.suspects) {
      const cleared = s.clearedBy && st.clues.includes(s.clearedBy);
      const card = div('', { width: '160px', textAlign: 'center', fontSize: '14px', lineHeight: '1.1', opacity: cleared ? .45 : 1, display: 'flex', flexDirection: 'column', alignItems: 'center' });
      card.append(suspectIcon(s, 2), div('', { fontWeight: 'bold' }, s.name), div('', {}, cleared ? 'CLEARED' : s.theory));
      sr.append(card);
    }
    p.append(sr);
  } else {
    p.append(div('', { fontSize: '18px', minHeight: '40px' }, 'No case open. Pick one from the board.'));
  }
  const h = document.createElement('div'); h.style.fontWeight = 'bold'; h.style.marginTop = '8px'; h.textContent = `Map pieces · Daily streak: ${save.daily.streak} day${save.daily.streak === 1 ? '' : 's'}`; p.append(h);
  const pr = div('', { display: 'flex', gap: '8px' });
  for (let i = 1; i <= 8; i++) {
    const slot = div('', { width: '52px', height: '52px', border: '3px dashed #8b5a2b', background: save.mapPieces.includes(i) ? '#f6e2c0' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' });
    if (save.mapPieces.includes(i)) slot.append(iconCanvas(clueSprite('piece'), 3));
    pr.append(slot);
  }
  p.append(pr);
  p.append(button('Close', { x: 600, y: 392, cls: 'small', onTap: () => p.remove() }));
  root.append(p);
}
