import { test } from 'node:test';
import assert from 'node:assert/strict';
import { genProblem, describe, record, MAX_LEVEL } from '../shark/logic.js';
import { makeRng } from '../shark/engine-rng.js';

for (const level of [1, 2, 3, 4, 5]) {
  test(`shark level ${level} problems match the rules`, () => {
    const rng = makeRng(level * 31);
    for (let i = 0; i < 400; i++) {
      const q = genProblem(level, rng);
      assert.equal(q.sum, q.a + q.b);
      assert.equal(q.onesDigit + q.carry * 10, q.onesSum);
      assert.equal(q.tensSum * 10 + q.onesDigit, q.sum, 'columns rebuild the sum');
      assert.ok(q.a >= 10 && q.a <= 99);
      if (level === 1) { assert.ok(q.b <= 9 && q.carry === 0 && q.sum <= 99); }
      if (level === 2) { assert.ok(q.b >= 10 && q.carry === 0 && q.sum <= 99); }
      if (level === 3) { assert.ok(q.b <= 9 && q.carry === 1 && q.sum <= 99); }
      if (level === 4) { assert.ok(q.b >= 10 && q.carry === 1 && q.sum <= 99); }
      if (level === 5) { assert.ok(q.b >= 10 && q.sum >= 100 && q.sum <= 198); }
    }
  });
}

test('describe splits columns', () => {
  assert.deepEqual(describe(27, 35), { a: 27, b: 35, sum: 62, onesSum: 12, carry: 1, tensSum: 6, onesDigit: 2 });
  assert.deepEqual(describe(23, 14), { a: 23, b: 14, sum: 37, onesSum: 7, carry: 0, tensSum: 3, onesDigit: 7 });
});

test('level moves up after a streak and down after misses', () => {
  const m = { level: 1, correct: 0, wrong: 0 };
  for (let i = 0; i < 3; i++) assert.equal(record(m, true), null);
  assert.equal(record(m, true), 'up'); assert.equal(m.level, 2);
  assert.equal(record(m, false), null); assert.equal(record(m, false), 'down'); assert.equal(m.level, 1);
  for (let i = 0; i < 40; i++) record(m, true);
  assert.equal(m.level, MAX_LEVEL);
});
