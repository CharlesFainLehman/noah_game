// Order Up question generator. Pure; tested in node.
// Level 1: sums to 5 with pictures. Level 2: sums to 10. Level 3: sums 11 to 20.
export const LIMITS = { 1: 5, 2: 10, 3: 20 };

export function generate(level, rng) {
  let a, b;
  if (level === 1) { a = rng.int(1, 4); b = rng.int(1, 5 - a); }
  else if (level === 2) { a = rng.int(1, 9); b = rng.int(1, 10 - a); }
  else { const sum = rng.int(11, 20); a = rng.int(1, sum - 1); b = sum - a; }
  return { a, b, sum: a + b };
}

// Number pad range shown for a level (inclusive).
export function padMax(level) { return level >= 3 ? 20 : 10; }
