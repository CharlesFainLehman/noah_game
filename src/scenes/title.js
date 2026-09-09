import { Pixel } from '../engine/pixel.js';
import { div, button } from '../engine/ui.js';
import { pixelCharacter, iconCanvas, CW, CH } from '../art/pixel-characters.js';
import { drawBackdrop } from '../art/pixel-backdrops.js';
import { save, commit, resetSave } from '../engine/save.js';
import { go } from '../engine/stage.js';
import { office } from './office.js';
import { sfx } from '../engine/audio.js';

const AVATARS = ['fox', 'rabbit', 'hedgehog', 'cat'];

export function title() {
  return {
    enter(root) {
      const px = new Pixel(root);
      drawBackdrop(px, 'street');
      px.blit(pixelCharacter('basset', 'happy'), 320 - 12 - CW * 3, 176 - CH * 3, 3);
      root.append(div('title-text', { top: '18px', fontSize: '30px', letterSpacing: '4px' }, 'THE PEBBLETON'));
      root.append(div('title-text', { top: '52px', fontSize: '58px' }, 'DETECTIVE AGENCY'));

      if (save.player) {
        root.append(button(`Continue, ${save.player.name}!`, { x: 300, y: 260, cls: 'green', onTap: () => go(office()) }));
        let armed = false;
        const nb = button('New detective', { x: 300, y: 360, cls: 'small', onTap: () => {
          if (!armed) { armed = true; nb.textContent = 'Erase everything? Tap again'; nb.classList.add('red'); return; }
          resetSave(); go(title());
        } });
        root.append(nb);
        return;
      }

      root.append(div('label', { left: '70px', top: '146px' }, 'What is your name, detective?'));
      const input = document.createElement('input');
      input.className = 'name'; input.maxLength = 12; input.placeholder = 'Type your name';
      input.style.left = '70px'; input.style.top = '196px';
      input.addEventListener('pointerdown', e => e.stopPropagation());
      root.append(input);

      root.append(div('label', { left: '70px', top: '284px' }, 'Pick your detective:'));
      let chosen = 'fox';
      const picks = [];
      AVATARS.forEach((a, i) => {
        const d = div('avatar-pick' + (a === chosen ? ' sel' : ''), { left: (60 + i * 145) + 'px', top: '330px' });
        d.append(iconCanvas(pixelCharacter(a, 'happy'), 3));
        d.addEventListener('pointerdown', () => { sfx.pop(); chosen = a; picks.forEach(p => p.classList.remove('sel')); d.classList.add('sel'); });
        picks.push(d); root.append(d);
      });

      root.append(button('Start!', { x: 460, y: 196, cls: 'green', onTap: () => {
        const name = input.value.trim() || 'Detective';
        save.player = { name: name.slice(0, 12), avatar: chosen };
        commit();
        sfx.fanfare();
        go(office());
      } }));
    },
  };
}
