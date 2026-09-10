// Order Up: fill orders. Addition.
import { numberGame } from './numgame.js';
import { genAdd } from './logic.js';

export function orderUp(loc, onDone) {
  return numberGame({
    game: 'orderUp', gen: genAdd, bg: loc.bg, who: loc.who, item: loc.item || 'muffin', item2: loc.item2 || 'muffin2',
    title: `ORDER FOR ${loc.customer}`, prompt: 'HOW MANY ALL TOGETHER?', onDone,
  });
}
