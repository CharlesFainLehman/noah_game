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
    arrow: sprite(R.ARROW, { k: P.k, y: P.yellow }),
    check: sprite(R.CHECK, { k: P.k, g: P.green }),
    lock: sprite(R.LOCK, { k: P.k, g: P.grey }),
    clueSlip: sprite(R.SLIP, { k: P.k, w: P.w }),
    clueWall: sprite(R.WALL, { k: P.k, t: P.tan, b: '#c58b4a', w: P.w }),
    clueMirror: sprite(R.MIRROR, { k: P.k, b: '#c58b4a', s: '#cfe9ff', w: P.w }),
    cluePiece: sprite(R.PIECE, { k: P.k, p: '#f6e2c0', b: '#8b5a2b', r: P.red }),
    glass: sprite(R.GLASS, { k: P.k, s: P.sky, w: P.w, b: P.wood }),
  };
  return cache;
}

export function clueSprite(icon) {
  const S = sprites();
  return { slip: S.clueSlip, wall: S.clueWall, mirror: S.clueMirror, piece: S.cluePiece }[icon];
}
