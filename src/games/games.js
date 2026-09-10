// Registry of every mini-game: id -> factory(loc, onDone) -> scene.
import { numberGame } from './numgame.js';
import { choiceGame } from './choicegame.js';
import { orderUp } from './orderup.js';
import { whoAte } from './whoate.js';
import { coinPurse } from './coins.js';
import { genCount, genCompare, genTens, genClock, genPattern, genShape, genPlank, genTally, genSkip } from './logic.js';

const num = (game, gen, title, prompt, extra = {}) => (loc, onDone) => numberGame({ game, gen, bg: loc.bg, who: loc.who, item: loc.item || 'acorn', item2: loc.item2 || loc.item || 'acorn', title: title(loc), prompt, onDone, ...extra });
const choice = (game, gen, title) => (loc, onDone) => choiceGame({ game, gen, bg: loc.bg, who: loc.who, title: title(loc), onDone });

export const GAMES = {
  orderUp, whoAte, coins: coinPurse,
  countPile: num('countPile', genCount, loc => `${loc.customer}'S PILE`, 'HOW MANY?', { alwaysShow: true, maxDigits: 3 }),
  jars: num('jars', genTens, () => 'JARS OF TEN', 'COUNT THE TENS AND ONES', { alwaysShow: true }),
  skipHop: num('skipHop', genSkip, () => 'SKIP HOP', 'WHAT COMES NEXT?', { alwaysShow: true, maxDigits: 3 }),
  compare: choice('compare', genCompare, () => 'MORE OR LESS'),
  clock: choice('clock', genClock, () => 'CLOCK FIXER'),
  pattern: choice('pattern', genPattern, () => 'PAINT THE PATTERN'),
  shapes: choice('shapes', genShape, () => 'SHAPE SORTER'),
  planks: choice('planks', genPlank, () => 'PLANK PICKER'),
  tally: choice('tally', genTally, () => 'TALLY TIME'),
};

export const GAME_NAMES = {
  orderUp: 'Order Up', whoAte: 'Who Ate It', coins: 'Coin Purse', countPile: 'Count the Pile', jars: 'Jars of Ten', skipHop: 'Skip Hop',
  compare: 'More or Less', clock: 'Clock Fixer', pattern: 'Paint the Pattern', shapes: 'Shape Sorter', planks: 'Plank Picker', tally: 'Tally Time',
};
