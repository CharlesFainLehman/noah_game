// Who Ate It: some were eaten. Subtraction.
import { numberGame } from './numgame.js';
import { genSub } from './logic.js';

export function whoAte(loc, onDone) {
  return numberGame({
    game: 'whoAte', gen: genSub, bg: loc.bg, who: loc.who, item: loc.item || 'fish', item2: loc.item2 || loc.item || 'fish',
    title: `${loc.customer} ATE SOME`, prompt: 'HOW MANY ARE LEFT?', onDone,
  });
}
