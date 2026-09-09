import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generate, LIMITS, padMax } from '../src/games/orderup-logic.js';
import { makeRng } from '../src/engine/rng.js';

for (const level of [1, 2, 3]) {
  test(`level ${level} questions stay within limits`, () => {
    const rng = makeRng(level * 101);
    for (let i = 0; i < 500; i++) {
      const q = generate(level, rng);
      assert.ok(q.a >= 1 && q.b >= 1, 'both addends at least 1');
      assert.equal(q.sum, q.a + q.b);
      assert.ok(q.sum <= LIMITS[level], `sum ${q.sum} over ${LIMITS[level]}`);
      if (level === 3) assert.ok(q.sum >= 11, 'level 3 sums are above 10');
      assert.ok(q.sum <= padMax(level), 'answer fits on the number pad');
    }
  });
}

test('generation is seeded', () => {
  const a = generate(2, makeRng(5)), b = generate(2, makeRng(5));
  assert.deepEqual(a, b);
});
