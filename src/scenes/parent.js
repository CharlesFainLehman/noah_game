// Parent screen: progress by game, level limits, reset, export and import.
import { div, button } from '../engine/ui.js';
import { save, commit, resetSave, exportCode, importCode, mastery } from '../engine/save.js';
import { MAX_LEVEL } from '../engine/mastery.js';
import { GAME_NAMES } from '../games/games.js';
import { go } from '../engine/stage.js';

export function parentScreen() {
  return {
    enter(root) {
      root.style.background = '#e8d6b0';
      const p = div('panel', { left: '20px', top: '16px', width: '920px', height: '508px', fontSize: '18px', overflow: 'hidden' });
      p.innerHTML = `<h2 style="margin-bottom:6px">Parent screen · ${save.player ? save.player.name : ''}</h2>`;
      const table = document.createElement('table');
      table.style.cssText = 'border-collapse:collapse;font-size:16px;width:560px;float:left';
      table.innerHTML = '<tr><th style="text-align:left">Game</th><th>Level</th><th>Right / total</th><th>Set level</th></tr>';
      for (const [id, name] of Object.entries(GAME_NAMES)) {
        const m = mastery(id);
        const tr = document.createElement('tr');
        tr.innerHTML = `<td style="padding:2px 6px;border-bottom:1px solid #c9b78f">${name}</td><td style="text-align:center">${m.level}</td><td style="text-align:center">${m.right} / ${m.total}</td><td style="text-align:center"></td>`;
        const cell = tr.lastElementChild;
        for (const d of [-1, 1]) {
          const b = document.createElement('button');
          b.textContent = d < 0 ? '−' : '+'; b.style.cssText = 'font-size:18px;width:36px;height:30px;margin:0 3px';
          b.addEventListener('pointerdown', () => { m.level = Math.max(1, Math.min(MAX_LEVEL, m.level + d)); m.correct = 0; m.wrong = 0; commit(); go(parentScreen()); });
          cell.append(b);
        }
        table.append(tr);
      }
      p.append(table);

      const side = div('', { float: 'right', width: '320px' });
      const bounds = div('', { marginBottom: '10px' });
      bounds.innerHTML = `<b>Level limits</b> (games stay between these)<br>`;
      const mk = (label, key) => {
        const row = div('', { display: 'flex', gap: '8px', alignItems: 'center', margin: '4px 0' });
        row.append(div('', { width: '90px' }, label));
        for (let L = 1; L <= MAX_LEVEL; L++) {
          const b = document.createElement('button'); b.textContent = String(L);
          b.style.cssText = `font-size:16px;width:36px;height:30px;${save[key] === L ? 'background:#ffcc4d' : ''}`;
          b.addEventListener('pointerdown', () => { save[key] = L; if (save.levelMin > save.levelMax) save[key === 'levelMin' ? 'levelMax' : 'levelMin'] = L; commit(); go(parentScreen()); });
          row.append(b);
        }
        return row;
      };
      bounds.append(mk('Lowest', 'levelMin'), mk('Highest', 'levelMax'));
      side.append(bounds);

      const ex = div('', { marginBottom: '8px' });
      ex.innerHTML = '<b>Save code</b> (copy to move progress to another device)';
      const ta = document.createElement('textarea'); ta.style.cssText = 'width:300px;height:56px;font-size:11px'; ta.value = exportCode(); ta.readOnly = true;
      ta.addEventListener('pointerdown', () => ta.select());
      ex.append(ta);
      const im = document.createElement('textarea'); im.style.cssText = 'width:300px;height:40px;font-size:11px'; im.placeholder = 'Paste a save code here';
      const imBtn = document.createElement('button'); imBtn.textContent = 'Import code'; imBtn.style.cssText = 'font-size:16px;height:32px;margin-top:4px';
      const status = div('', { fontSize: '14px', minHeight: '18px' });
      imBtn.addEventListener('pointerdown', () => { try { importCode(im.value); status.textContent = 'Imported.'; go(parentScreen()); } catch (e) { status.textContent = 'That code did not work.'; } });
      ex.append(im, imBtn, status);
      side.append(ex);

      let armed = false;
      const reset = document.createElement('button'); reset.textContent = 'Erase all progress'; reset.style.cssText = 'font-size:16px;height:32px;background:#ff8a80';
      reset.addEventListener('pointerdown', () => { if (!armed) { armed = true; reset.textContent = 'Tap again to erase everything'; return; } resetSave(); import('./title.js').then(m => go(m.title())); });
      side.append(reset);
      p.append(side);

      p.append(button('Back to the office', { x: 620, y: 430, cls: 'small', onTap: () => import('./office.js').then(m => go(m.office())) }));
      root.append(p);
    },
  };
}
