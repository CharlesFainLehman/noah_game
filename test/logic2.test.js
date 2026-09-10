import { test } from 'node:test';
import assert from 'node:assert/strict';
import { genCount, genCompare, genTens, genClock, genPattern, genShape, genPlank, genTally, genSkip } from '../src/games/logic.js';
import { makeRng } from '../src/engine/rng.js';

const validOption = q => { assert.ok(Array.isArray(q.options) && q.options.length >= 2, 'has options'); assert.ok(q.answer >= 0 && q.answer < q.options.length, `answer index ${q.answer} in range`); };

for (const level of [1, 2, 3, 4]) {
  test(`genCount level ${level}`, () => {
    const rng = makeRng(level);
    for (let i = 0; i < 200; i++) { const q = genCount(level, rng); assert.ok(q.n >= 1 && q.n <= 100); assert.equal(q.answer, q.n); }
  });
  test(`genCompare level ${level}`, () => {
    const rng = makeRng(level + 10);
    for (let i = 0; i < 300; i++) {
      const q = genCompare(level, rng); validOption(q);
      if (q.kind === 'compare') { assert.notEqual(q.a, q.b); const pick = q.answer === 0 ? q.a : q.b, other = q.answer === 0 ? q.b : q.a; assert.ok(q.more ? pick > other : pick < other); }
      else { const sym = q.options[q.answer].text; assert.equal(sym, q.a > q.b ? '>' : q.a < q.b ? '<' : '='); }
    }
  });
  test(`genTens level ${level}`, () => {
    const rng = makeRng(level + 20);
    for (let i = 0; i < 300; i++) {
      const q = genTens(level, rng);
      if (q.kind === 'fill') assert.equal(q.k + q.answer, 10);
      if (q.kind === 'tens') assert.equal(q.answer, Math.floor(q.n / 10));
      if (q.kind === 'build') assert.equal(q.answer, q.t * 10 + q.o);
      if (q.kind === 'ones') assert.equal(q.answer, q.n % 10);
      assert.ok(q.answer >= 0 && q.answer <= 99);
    }
  });
  test(`genClock level ${level}`, () => {
    const rng = makeRng(level + 30);
    for (let i = 0; i < 300; i++) {
      const q = genClock(level, rng); validOption(q);
      assert.equal(q.options.length, 4);
      const o = q.options[q.answer];
      if (o.type === 'clock') assert.ok(o.h === q.h && o.m === q.m); else assert.ok(o.text.includes(String(q.h)));
      if (level <= 2) assert.equal(q.m, 0);
      assert.equal(new Set(q.options.map(o => o.text || `${o.h}:${o.m}`)).size, 4, 'options differ');
    }
  });
  test(`genPattern level ${level}`, () => {
    const rng = makeRng(level + 40);
    for (let i = 0; i < 300; i++) {
      const q = genPattern(level, rng); validOption(q);
      assert.equal(q.options.length, 3);
      if (q.kind === 'pattern') {
        const a = q.options[q.answer];
        const key = t => `${t.shape}${t.color}${t.size}`;
        assert.equal(q.options.filter(o => key(o) === key(a)).length, 1, 'answer unique among options');
      }
    }
  });
  test(`genShape level ${level}`, () => {
    const rng = makeRng(level + 50);
    for (let i = 0; i < 300; i++) {
      const q = genShape(level, rng); validOption(q);
      if (q.kind === 'name') assert.equal(q.options[q.answer].text, q.shape.toUpperCase());
      assert.equal(new Set(q.options.map(o => o.text)).size, q.options.length, 'options differ');
    }
  });
  test(`genPlank level ${level}`, () => {
    const rng = makeRng(level + 60);
    for (let i = 0; i < 300; i++) {
      const q = genPlank(level, rng); validOption(q);
      if (q.kind === 'longer' || q.kind === 'order') { const lens = q.options.map(o => o.len); assert.equal(new Set(lens).size, lens.length); }
      if (q.kind === 'diff') assert.equal(q.options[q.answer].text, String(q.a - q.b));
    }
  });
  test(`genTally level ${level}`, () => {
    const rng = makeRng(level + 70);
    for (let i = 0; i < 300; i++) {
      const q = genTally(level, rng); validOption(q);
      if (q.rows) assert.equal(new Set(q.rows.map(r => r.n)).size, 3, 'graph rows differ');
      assert.equal(new Set(q.options.map(o => o.text)).size, q.options.length, 'options differ');
    }
  });
  test(`genSkip level ${level}`, () => {
    const rng = makeRng(level + 80);
    for (let i = 0; i < 300; i++) {
      const q = genSkip(level, rng);
      assert.ok(q.seq.length >= 3);
      for (let j = 1; j < q.seq.length; j++) assert.equal(q.seq[j] - q.seq[j - 1], q.back ? -q.step : q.step);
      assert.ok(q.answer >= 0 && q.answer <= 100, `answer ${q.answer}`);
      assert.equal(q.answer, q.seq[q.seq.length - 1] + (q.back ? -q.step : q.step));
    }
  });
}
