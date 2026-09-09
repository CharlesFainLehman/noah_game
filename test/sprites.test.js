import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ALL } from '../src/art/sprite-rows.js';
import { BASE, ALL_PARTS, SPECIES, PARTS } from '../src/art/char-rows.js';

test('every sprite has rows of equal width', () => {
  for (const [name, rows] of Object.entries(ALL)) {
    const w = rows[0].length;
    rows.forEach((r, i) => assert.equal(r.length, w, `${name} row ${i} width ${r.length} != ${w}`));
  }
});

test('character base and parts have rows of equal width', () => {
  for (const [name, rows] of Object.entries({ BASE, ...ALL_PARTS })) {
    const w = rows[0].length;
    rows.forEach((r, i) => assert.equal(r.length, w, `${name} row ${i} width ${r.length} != ${w}`));
  }
  assert.equal(BASE.length, 48);
  BASE.forEach(r => assert.equal(r.length, 32));
});

test('character parts fit inside the 32x48 canvas', () => {
  for (const [name, p] of Object.entries(PARTS)) {
    assert.ok(p.x >= 0 && p.y >= 0, name);
    assert.ok(p.x + p.rows[0].length <= 32, `${name} too wide`);
    assert.ok(p.y + p.rows.length <= 48, `${name} too tall`);
  }
});

test('every species references real parts', () => {
  for (const [name, S] of Object.entries(SPECIES)) {
    for (const n of [...S.behind, ...S.front, S.hat].filter(Boolean)) assert.ok(PARTS[n], `${name} uses unknown part ${n}`);
  }
});
