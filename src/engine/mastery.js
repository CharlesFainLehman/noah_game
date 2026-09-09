// Adaptive difficulty. Pure; safe to import in node tests.
export const MIN_LEVEL = 1, MAX_LEVEL = 3;
export const UP_STREAK = 5;    // correct in a row to level up
export const DOWN_STREAK = 2;  // wrong in a row to level down

export function newMastery() {
  return { level: MIN_LEVEL, correct: 0, wrong: 0, total: 0, right: 0 };
}

// Returns 'up', 'down', or null.
export function record(m, ok) {
  m.total++;
  if (ok) {
    m.right++;
    m.correct++;
    m.wrong = 0;
    if (m.correct >= UP_STREAK && m.level < MAX_LEVEL) {
      m.level++;
      m.correct = 0;
      return 'up';
    }
  } else {
    m.wrong++;
    m.correct = 0;
    if (m.wrong >= DOWN_STREAK && m.level > MIN_LEVEL) {
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
