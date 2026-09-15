// Two-digit addition problems by level. Pure; tested in node.
// 1: two-digit + one-digit, no carry.   2: two-digit + two-digit, no carry.
// 3: two-digit + one-digit, with carry. 4: two-digit + two-digit, with carry, sum to 99.
// 5: two-digit + two-digit, sum 100 to 198.
export const MAX_LEVEL = 5;
export const UP_STREAK = 4, DOWN_STREAK = 2;

export function genProblem(level, rng) {
  let a, b;
  for (let tries = 0; tries < 200; tries++) {
    if (level === 1) { a = rng.int(10, 89); b = rng.int(1, 9); if (a % 10 + b <= 9) break; }
    else if (level === 2) { a = rng.int(10, 79); b = rng.int(10, 89); if (a % 10 + b % 10 <= 9 && a + b <= 99) break; }
    else if (level === 3) { a = rng.int(11, 89); b = rng.int(1, 9); if (a % 10 + b >= 10 && a + b <= 99) break; }
    else if (level === 4) { a = rng.int(11, 79); b = rng.int(11, 79); if (a % 10 + b % 10 >= 10 && a + b <= 99) break; }
    else { a = rng.int(21, 99); b = rng.int(21, 99); if (a + b >= 100) break; }
  }
  return describe(a, b);
}

export function describe(a, b) {
  const onesSum = a % 10 + b % 10;
  const carry = onesSum >= 10 ? 1 : 0;
  const tensSum = Math.floor(a / 10) + Math.floor(b / 10) + carry;
  return { a, b, sum: a + b, onesSum, carry, tensSum, onesDigit: onesSum % 10 };
}

// Adaptive level: returns 'up', 'down', or null. Mutates the record.
export function record(m, ok) {
  if (ok) { m.correct = (m.correct || 0) + 1; m.wrong = 0; if (m.correct >= UP_STREAK && m.level < MAX_LEVEL) { m.level++; m.correct = 0; return 'up'; } }
  else { m.wrong = (m.wrong || 0) + 1; m.correct = 0; if (m.wrong >= DOWN_STREAK && m.level > 1) { m.level--; m.wrong = 0; return 'down'; } }
  return null;
}
