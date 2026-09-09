import { sprite } from '../engine/pixel.js';
import { P } from './palette.js';
import * as R from './sprite-rows.js';

function muffin(top, dot, cup, cupDark) {
  return sprite(R.MUFFIN, { k: P.k, t: top, d: dot, c: cup, C: cupDark });
}

let cache = null;
export function sprites() {
  if (cache) return cache;
  cache = {
    muffinBlue: muffin(P.tan, P.blueberry, P.pink, '#d98aa0'),
    muffinChoc: muffin(P.chocLight, P.choc, '#7fd1f5', '#3d8fb8'),
    bell: sprite(R.BELL, { k: P.k, y: P.yellow }),
    star: sprite(R.STAR, { k: P.k, y: P.yellow }),
    starOff: sprite(R.STAR, { k: P.k, y: '#c9c0aa' }),
    gaston: sprite(R.GASTON, { k: P.k, w: P.w, o: P.orange, a: '#7fd1f5' }),
    arrow: sprite(R.ARROW, { k: P.k, y: P.yellow }),
    check: sprite(R.CHECK, { k: P.k, g: P.green }),
    lock: sprite(R.LOCK, { k: P.k, g: P.grey }),
  };
  return cache;
}
