// Dev harness: dev.html?game=compare&level=3  mounts one mini-game at a level.
import { go } from './engine/stage.js';
import { save, mastery } from './engine/save.js';
import { GAMES } from './games/games.js';

const qs = new URLSearchParams(location.search);
const game = qs.get('game') || 'orderUp', level = Number(qs.get('level') || 1);
save.player = save.player || { name: 'Tester', avatar: 'fox' };
save.muted = true;
mastery(game).level = level;
const loc = { bg: qs.get('bg') || 'store', who: qs.get('who') || 'squirrel', customer: 'TESTER', item: qs.get('item') || 'acorn' };
go(GAMES[game](loc, () => { document.body.innerHTML = '<h1 style="color:#fff">DONE</h1>'; }));
