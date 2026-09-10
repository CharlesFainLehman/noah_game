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
    fish: sprite(R.FISH, { k: P.k, s: '#7fd1f5', b: '#3d8fb8', w: P.w }),
    donut: sprite(R.DONUT, { k: P.k, p: '#e8a35b' }),
    donutPink: sprite(R.DONUT, { k: P.k, p: P.pink }),
    cookie: sprite(R.COOKIE, { k: P.k, c: '#d9a066', d: P.choc }),
    acorn: sprite(R.ACORN, { k: P.k, d: P.woodDark, a: '#c58b4a' }),
    penny: sprite(R.circleRows(10), { k: P.k, c: '#c8763a' }),
    nickel: sprite(R.circleRows(12), { k: P.k, c: '#c9ced6' }),
    dime: sprite(R.circleRows(9), { k: P.k, c: '#dfe4ea' }),
    quarter: sprite(R.circleRows(14), { k: P.k, c: '#c9ced6' }),
  };
  return cache;
}

export function clueSprite(icon) {
  const S = sprites();
  return { slip: S.clueSlip, wall: S.clueWall, mirror: S.clueMirror, piece: S.cluePiece }[icon];
}

export function itemSprite(name) {
  const S = sprites();
  return { muffin: S.muffinBlue, muffin2: S.muffinChoc, fish: S.fish, donut: S.donut, donut2: S.donutPink, cookie: S.cookie, acorn: S.acorn }[name] || S.muffinBlue;
}
