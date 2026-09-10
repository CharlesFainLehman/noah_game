// Adaptive difficulty. Pure; safe to import in node tests.
export const MIN_LEVEL = 1, MAX_LEVEL = 4;
export const UP_STREAK = 5;    // correct in a row to level up
export const DOWN_STREAK = 2;  // wrong in a row to level down

export function newMastery() {
  return { level: MIN_LEVEL, correct: 0, wrong: 0, total: 0, right: 0 };
}

// Returns 'up', 'down', or null.
export function record(m, ok, lo = MIN_LEVEL, hi = MAX_LEVEL) {
  m.total++;
  if (ok) {
    m.right++;
    m.correct++;
    m.wrong = 0;
    if (m.correct >= UP_STREAK && m.level < hi) {
      m.level++;
      m.correct = 0;
      return 'up';
    }
  } else {
    m.wrong++;
    m.correct = 0;
    if (m.wrong >= DOWN_STREAK && m.level > lo) {
      m.level--;
      m.wrong = 0;
      return 'down';
    }
  }
  return null;
}

export function isMastered(m) {
  return m.level === MAX_LEVEL && m.correct >= UP_STREAK;
}

// Keep a level inside the parent-set bounds.
export function clampLevel(m, lo, hi) {
  m.level = Math.max(lo, Math.min(hi, m.level));
  return m.level;
}
