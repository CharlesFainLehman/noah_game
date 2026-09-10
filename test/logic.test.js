import { test } from 'node:test';
import assert from 'node:assert/strict';
import { genAdd, genSub, genCoins, coinTotal } from '../src/games/logic.js';
import { makeRng } from '../src/engine/rng.js';

const evalText = q => {
  // Check the displayed equation is consistent with the answer.
  const t = q.text.replace('?', String(q.answer));
  if (!t.includes('=')) return true;
  const [l, r] = t.split('=').map(s => s.trim());
  const sum = s => s.split(/\s+/).reduce((acc, tok, i, arr) => {
    if (tok === '+' || tok === '-') return acc;
    const prev = arr[i - 1];
    return prev === '-' ? acc - Number(tok) : acc + Number(tok);
  }, 0);
  return sum(l) === sum(r);
};

for (const level of [1, 2, 3, 4]) {
  test(`genAdd level ${level}`, () => {
    const rng = makeRng(level * 7);
    for (let i = 0; i < 400; i++) {
      const q = genAdd(level, rng);
      assert.ok(q.answer >= 0 && Number.isInteger(q.answer));
      assert.ok(evalText(q), `equation inconsistent: ${q.text} -> ${q.answer}`);
      if (level === 1) assert.ok(q.answer <= 10);
      if (level === 2) assert.ok(q.answer >= 11 && q.answer <= 20);
      if (level === 3) { assert.ok(['missing', 'add3'].includes(q.kind)); assert.ok(q.answer >= 1 && q.answer <= 20); }
      if (level === 4) { assert.ok(q.answer <= 98); if (q.kind === 'add') assert.ok(q.a >= 11); }
      for (const g of q.groups) assert.ok(g >= 1, 'every pictured group has at least one item');
    }
  });
  test(`genSub level ${level}`, () => {
    const rng = makeRng(level * 13);
    for (let i = 0; i < 400; i++) {
      const q = genSub(level, rng);
      assert.ok(q.answer >= 0 && Number.isInteger(q.answer));
      assert.ok(evalText(q), `equation inconsistent: ${q.text} -> ${q.answer}`);
      if (level === 1) assert.ok(q.n <= 10 && q.answer >= 1);
      if (level === 2) assert.ok(q.n >= 11 && q.n <= 20);
      if (level === 3) assert.equal(q.kind, 'missingSub');
      if (q.crossed !== undefined) assert.ok(q.crossed <= q.groups[0], 'cannot cross out more than shown');
    }
  });
  test(`genCoins level ${level}`, () => {
    const rng = makeRng(level * 17);
    for (let i = 0; i < 400; i++) {
      const q = genCoins(level, rng);
      if (q.kind === 'count') {
        assert.equal(q.answer, coinTotal(q.coins));
        assert.ok(q.coins.length >= 2 && q.coins.length <= 12, `coin count ${q.coins.length}`);
        if (level === 1) { assert.ok(q.answer <= 10); assert.ok(q.coins.every(c => c === 'penny' || c === 'nickel')); }
        if (level === 2) { assert.ok(q.answer <= 30); assert.ok(q.coins.every(c => c === 'penny' || c === 'dime')); }
        if (level === 3) assert.ok(q.answer <= 60);
      } else {
        assert.equal(level, 4);
        assert.ok(q.target >= 6 && q.target <= 50);
      }
    }
  });
}

test('generation is seeded', () => {
  assert.deepEqual(genAdd(3, makeRng(5)), genAdd(3, makeRng(5)));
  assert.deepEqual(genCoins(3, makeRng(5)), genCoins(3, makeRng(5)));
});
