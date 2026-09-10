// Daily Case File: three quick rounds from unlocked games. One badge per day.
import { go } from '../engine/stage.js';
import { save, commit, caseState } from '../engine/save.js';
import { CASE_DATA } from '../data/cases.js';
import { GAMES } from '../games/games.js';
import { makeRng } from '../engine/rng.js';
import { comic } from './comic.js';

const today = () => new Date().toISOString().slice(0, 10);
export const dailyDone = () => save.daily.date === today();

// Locations from cases the player has started, so games are ones they have seen.
function unlockedLocations() {
  const locs = [];
  for (const c of Object.values(CASE_DATA)) {
    const st = caseState(c.id);
    if (st.status === 'closed' || st.status === 'open') locs.push(...c.locations);
  }
  return locs.length ? locs : CASE_DATA[1].locations;
}

export function dailyCase() {
  const rng = makeRng();
  const pool = unlockedLocations();
  // Three locations with different games where possible.
  const picked = [];
  for (const loc of rng.shuffle(pool)) { if (picked.length < 3 && !picked.some(p => p.game === loc.game)) picked.push(loc); }
  while (picked.length < 3) picked.push(rng.pick(pool));
  const already = dailyDone();

  const intro = [{ bg: 'office', who: 'basset', expr: 'normal', text: already ? 'You already earned today\'s badge, {name}. Three more puzzles, just for fun?' : 'Daily case file, {name}! Three quick puzzles around town. Solve them all for a badge.' }];
  const runAt = i => {
    if (i >= picked.length) { finish(already); return; }
    const loc = picked[i];
    go(comic([{ bg: loc.bg, who: loc.who, expr: 'normal', text: `Quick puzzle ${i + 1} of 3, {name}!` }], () => go(GAMES[loc.game](loc, () => runAt(i + 1)))));
  };
  go(comic(intro, () => runAt(0)));
}

function finish(already) {
  let text;
  if (already) text = 'Nicely done, {name}. Come back tomorrow for another badge.';
  else {
    const d = new Date(); d.setDate(d.getDate() - 1);
    const yesterday = d.toISOString().slice(0, 10);
    save.daily.streak = save.daily.date === yesterday ? save.daily.streak + 1 : 1;
    save.daily.date = today();
    save.badges++;
    commit();
    text = `Badge earned! That is ${save.badges} badge${save.badges === 1 ? '' : 's'}. Streak: ${save.daily.streak} day${save.daily.streak === 1 ? '' : 's'}. Spend badges on office decorations!`;
  }
  go(comic([{ bg: 'office', who: 'basset', expr: 'happy', text }], () => import('./office.js').then(m => go(m.office()))));
}
