import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CASE_DATA, CASES } from '../src/data/cases.js';
import { SPECIES } from '../src/art/char-rows.js';

const GAMES = ['orderUp', 'whoAte', 'coins', 'countPile', 'jars', 'skipHop', 'compare', 'clock', 'pattern', 'shapes', 'planks', 'tally'];
const BGS = ['office', 'bakery', 'harbor', 'store', 'street', 'school', 'clock', 'studio', 'workshop', 'lighthouse'];
const MAP = ['bakery', 'studio', 'clock', 'workshop', 'store', 'fish', 'agency', 'school', 'lighthouse'];

test('all eight cases exist', () => { for (const c of CASES) assert.ok(CASE_DATA[c.id], `case ${c.id}`); });

for (const c of Object.values(CASE_DATA)) {
  test(`case ${c.id} is well formed`, () => {
    assert.equal(c.locations.length, 5, 'five locations');
    assert.equal(c.suspects.length, 4, 'four suspects');
    assert.equal(c.suspects.filter(s => s.guilty).length, 1, 'one guilty');
    const clueIds = c.locations.map(l => l.clue.id);
    assert.equal(new Set(clueIds).size, 5, 'clue ids unique');
    for (const s of c.suspects) {
      if (s.species) assert.ok(SPECIES[s.species], `species ${s.species}`);
      if (!s.guilty) { assert.ok(clueIds.includes(s.clearedBy), `suspect ${s.id} cleared by a real clue`); assert.ok(s.reply); }
    }
    assert.equal(c.suspects.filter(s => s.clearedBy).length, 3, 'three suspects cleared by clues');
    for (const l of c.locations) {
      assert.ok(GAMES.includes(l.game), `game ${l.game}`);
      assert.ok(BGS.includes(l.bg), `bg ${l.bg}`);
      assert.ok(SPECIES[l.who], `who ${l.who}`);
      assert.ok(MAP.includes(l.id), `map building ${l.id}`);
      assert.ok(l.before.length >= 1 && l.after.length >= 1);
    }
    assert.equal(new Set(c.locations.map(l => l.id)).size, 5, 'locations at different buildings');
    assert.equal(c.deduction.methods.filter(m => m.ok).length, 1, 'one right method');
    for (const m of c.deduction.methods) if (!m.ok) assert.ok(m.reply);
    for (const p of [...c.intro, ...c.closed, ...c.locations.flatMap(l => [...l.before, ...l.after])]) {
      assert.ok(SPECIES[p.who], `panel who ${p.who}`); assert.ok(BGS.includes(p.bg), `panel bg ${p.bg}`); assert.ok(p.text.length < 220, `panel text too long: ${p.text.slice(0, 40)}`);
    }
  });
}
