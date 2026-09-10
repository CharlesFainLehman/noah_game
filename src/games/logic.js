// Problem generators. Pure; tested in node.
// Each returns { kind, text, answer, ... } . text uses ? for the unknown.

// ---- Addition (Order Up) ----
// L1 sums to 10. L2 sums 11-20. L3 missing addend or three addends (to 20).
// L4 two-digit plus one-digit (to 99), mixed with subtraction within 20.
export function genAdd(level, rng) {
  if (level === 1) { const a = rng.int(1, 9), b = rng.int(1, 10 - a); return { kind: 'add', a, b, answer: a + b, text: `${a} + ${b} = ?`, groups: [a, b] }; }
  if (level === 2) { const s = rng.int(11, 20), a = rng.int(1, s - 1), b = s - a; return { kind: 'add', a, b, answer: s, text: `${a} + ${b} = ?`, groups: [a, b] }; }
  if (level === 3) {
    if (rng.next() < 0.5) {
      const s = rng.int(6, 20), a = rng.int(1, s - 1), b = s - a;
      return { kind: 'missing', a, b, sum: s, answer: b, text: `${a} + ? = ${s}`, groups: [a, b], missingIndex: 1 };
    }
    const s = rng.int(6, 20), a = rng.int(1, s - 2), b = rng.int(1, s - a - 1), c = s - a - b;
    return { kind: 'add3', a, b, c, answer: s, text: `${a} + ${b} + ${c} = ?`, groups: [a, b, c] };
  }
  if (rng.next() < 0.35) {
    const n = rng.int(11, 20), m = rng.int(2, n - 1);
    return { kind: 'sub', n, m, answer: n - m, text: `${n} - ${m} = ?`, groups: [n], crossed: m };
  }
  const a = rng.int(11, 89), b = rng.int(2, 9);
  return { kind: 'add', a, b, answer: a + b, text: `${a} + ${b} = ?`, groups: [a, b], big: true };
}

// ---- Subtraction (Who Ate It) ----
// L1 within 10. L2 within 20. L3 missing part (n - ? = r). L4 two-digit minus one-digit, mixed with addition within 20.
export function genSub(level, rng) {
  if (level === 1) { const n = rng.int(2, 10), m = rng.int(1, n - 1); return { kind: 'sub', n, m, answer: n - m, text: `${n} - ${m} = ?`, groups: [n], crossed: m }; }
  if (level === 2) { const n = rng.int(11, 20), m = rng.int(2, n - 1); return { kind: 'sub', n, m, answer: n - m, text: `${n} - ${m} = ?`, groups: [n], crossed: m }; }
  if (level === 3) {
    const n = rng.int(6, 20), r = rng.int(1, n - 1), m = n - r;
    return { kind: 'missingSub', n, m, r, answer: m, text: `${n} - ? = ${r}`, groups: [n], crossed: m };
  }
  if (rng.next() < 0.35) {
    const s = rng.int(11, 20), a = rng.int(2, s - 2), b = s - a;
    return { kind: 'add', a, b, answer: s, text: `${a} + ${b} = ?`, groups: [a, b] };
  }
  const n = rng.int(12, 99), m = rng.int(2, 9);
  return { kind: 'sub', n, m, answer: n - m, text: `${n} - ${m} = ?`, groups: [n], crossed: m, big: true };
}

// ---- Coins (Coin Purse) ----
export const COIN_VALUE = { penny: 1, nickel: 5, dime: 10, quarter: 25 };
// L1 pennies and nickels to 10c. L2 dimes and pennies to 30c. L3 all coins to 60c.
// L4 make the amount: target to 50c, player picks coins.
export function genCoins(level, rng) {
  const coins = [];
  let total = 0;
  const add = (type, n) => { for (let i = 0; i < n; i++) { coins.push(type); total += COIN_VALUE[type]; } };
  if (level === 1) { const nick = rng.int(0, 1); add('nickel', nick); add('penny', rng.int(nick ? 1 : 2, 10 - nick * 5)); }
  else if (level === 2) { const d = rng.int(1, 2); add('dime', d); add('penny', rng.int(1, 9)); if (total > 30) total = total; }
  else if (level === 3) {
    add('quarter', rng.int(0, 1)); add('dime', rng.int(0, 2)); add('nickel', rng.int(0, 2)); add('penny', rng.int(1, 4));
    if (coins.length < 2) add('penny', 1);
  } else {
    const target = rng.int(6, 50);
    return { kind: 'make', target, answer: target, text: `MAKE ${target} CENTS`, coins: [] };
  }
  return { kind: 'count', coins: rng.shuffle(coins), answer: total, text: 'HOW MANY CENTS?' };
}

export function coinTotal(list) { return list.reduce((s, c) => s + COIN_VALUE[c], 0); }
