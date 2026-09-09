import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ALL } from '../src/art/sprite-rows.js';

test('every sprite has rows of equal width', () => {
  for (const [name, rows] of Object.entries(ALL)) {
    const w = rows[0].length;
    rows.forEach((r, i) => assert.equal(r.length, w, `${name} row ${i} width ${r.length} != ${w}`));
  }
});
