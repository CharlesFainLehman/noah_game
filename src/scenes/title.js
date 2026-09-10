import { Pixel } from '../engine/pixel.js';
import { div, button } from '../engine/ui.js';
import { pixelCharacter, iconCanvas, CW, CH, idle } from '../art/pixel-characters.js';
import { drawBackdrop } from '../art/pixel-backdrops.js';
import { sprites } from '../art/sprites.js';
import { P } from '../art/palette.js';
import { save, commit, resetSave } from '../engine/save.js';
import { go } from '../engine/stage.js';
import { office } from './office.js';
import { sfx } from '../engine/audio.js';

const AVATARS = ['fox', 'rabbit', 'hedgehog', 'cat'];

export function title() {
  let t = 0;
  return {
    update(dt) { t += dt; if (this.paint) this.paint(t); },
    enter(root) {
      const px = new Pixel(root);
      const S = sprites();
      this.paint = t => {
        drawBackdrop(px, 'street', { t });
        const { frame, bob } = idle(t);
        px.blit(pixelCharacter('basset', 'happy', frame), 274, 176 - CH + bob, 1);
        // Logo: drop shadow, then fill, then a thin outline
        const logo = (str, x, y, scale, fill) => {
          px.text(str, x + scale, y + scale, 'rgba(0,0,0,0.35)', { align: 'center', scale });
          for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) px.text(str, x + dx, y + dy, P.k, { align: 'center', scale });
          px.text(str, x, y, fill, { align: 'center', scale });
        };
        // Banner behind the logo
        px.rect(40, 6, 240, 62, 'rgba(43,27,14,0.55)'); px.rect(40, 6, 240, 2, P.yellow); px.rect(40, 66, 240, 2, P.yellow);
        logo('THE PEBBLETON', 160, 12, 2, '#ffe98a');
        logo('DETECTIVE', 160, 30, 3, P.yellow);
        logo('AGENCY', 160, 50, 2, P.yellow);
        px.blit(S.glass, 250, 40, 1);
      };
      this.paint(0);

      if (save.player) {
        root.append(button(`Continue, ${save.player.name}!`, { x: 60, y: 280, cls: 'green', onTap: () => go(office()) }));
        let armed = false;
        const nb = button('New detective', { x: 60, y: 380, cls: 'small', onTap: () => {
          if (!armed) { armed = true; nb.textContent = 'Erase everything? Tap again'; nb.classList.add('red'); return; }
          resetSave(); go(title());
        } });
        root.append(nb);
        return;
      }

      root.append(div('label', { left: '40px', top: '236px' }, 'What is your name, detective?'));
      const input = document.createElement('input');
      input.className = 'name'; input.maxLength = 12; input.placeholder = 'Type your name';
      input.style.left = '40px'; input.style.top = '284px';
      input.addEventListener('pointerdown', e => e.stopPropagation());
      root.append(input);

      root.append(div('label', { left: '400px', top: '236px' }, 'Pick your detective:'));
      let chosen = 'fox';
      const picks = [];
      AVATARS.forEach((a, i) => {
        const d = div('avatar-pick' + (a === chosen ? ' sel' : ''), { left: (396 + i * 104) + 'px', top: '292px' });
        d.append(iconCanvas(pixelCharacter(a, 'happy'), 2));
        d.addEventListener('pointerdown', () => { sfx.pop(); chosen = a; picks.forEach(p => p.classList.remove('sel')); d.classList.add('sel'); });
        picks.push(d); root.append(d);
      });

      root.append(button('Start!', { x: 40, y: 372, cls: 'green', onTap: () => {
        const name = input.value.trim() || 'Detective';
        save.player = { name: name.slice(0, 12), avatar: chosen };
        commit();
        sfx.fanfare();
        go(office());
      } }));
    },
  };
}
