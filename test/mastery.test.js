import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newMastery, record, isMastered, UP_STREAK, DOWN_STREAK, MAX_LEVEL } from '../src/engine/mastery.js';

test('levels up after a streak of correct answers', () => {
  const m = newMastery();
  for (let i = 0; i < UP_STREAK - 1; i++) assert.equal(record(m, true), null);
  assert.equal(record(m, true), 'up');
  assert.equal(m.level, 2);
  assert.equal(m.correct, 0);
});

test('levels down after wrong answers in a row, never below 1', () => {
  const m = newMastery();
  m.level = 2;
  for (let i = 0; i < DOWN_STREAK - 1; i++) assert.equal(record(m, false), null);
  assert.equal(record(m, false), 'down');
  assert.equal(m.level, 1);
  for (let i = 0; i < 5; i++) record(m, false);
  assert.equal(m.level, 1);
});

test('a wrong answer resets the correct streak', () => {
  const m = newMastery();
  record(m, true); record(m, true); record(m, false);
  assert.equal(m.correct, 0);
});

test('never above max level, and mastered at the top', () => {
  const m = newMastery();
  for (let i = 0; i < UP_STREAK * 5; i++) record(m, true);
  assert.equal(m.level, MAX_LEVEL);
  assert.equal(MAX_LEVEL, 4);
  assert.ok(isMastered(m));
});
