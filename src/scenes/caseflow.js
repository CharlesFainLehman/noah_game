// Drives a case through intro, investigation, deduction, and closing.
import { go } from '../engine/stage.js';
import { save, commit, caseState } from '../engine/save.js';
import { comic } from './comic.js';
import { townMap } from './map.js';
import { deduction } from './deduction.js';
import { orderUp } from '../games/orderup.js';
import { whoAte } from '../games/whoate.js';
import { coinPurse } from '../games/coins.js';

const GAMES = { orderUp, whoAte, coins: coinPurse };

export function startCase(c) {
  const st = caseState(c.id);
  if (st.status === 'new') {
    go(comic(c.intro, () => { st.status = 'open'; commit(); investigate(c); }));
  } else if (st.status === 'closed') {
    // Replay: fresh clues, keep the solved status.
    st.clues = []; st.replay = true; commit();
    investigate(c);
  } else {
    investigate(c);
  }
}

function investigate(c) {
  const st = caseState(c.id);
  if (st.clues.length >= c.locations.length) { deduce(c); return; }
  go(townMap({
    caseTitle: `CASE ${c.id}`,
    locations: c.locations,
    found: st.clues.map(id => c.locations.find(l => l.clue.id === id).id),
    onPick: loc => playLocation(c, loc),
    onHome: () => import('./office.js').then(m => go(m.office())),
  }));
}

function playLocation(c, loc) {
  const st = caseState(c.id);
  const game = GAMES[loc.game];
  go(comic(loc.before, () => go(game(loc, () => go(comic(loc.after, () => {
    if (!st.clues.includes(loc.clue.id)) st.clues.push(loc.clue.id);
    commit();
    investigate(c);
  }))))));
}

function deduce(c) {
  const st = caseState(c.id);
  go(deduction(c, () => go(comic(c.closed, () => {
    st.status = 'closed';
    if (!save.mapPieces.includes(c.id)) save.mapPieces.push(c.id);
    commit();
    import('./office.js').then(m => go(m.office()));
  }))));
}
