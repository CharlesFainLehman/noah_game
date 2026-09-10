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

// Three distinct positive answer choices around n.
const near = n => [n, n + 1, n > 1 ? n - 1 : n + 2];

// ---- Count the Pile ----
// L1 1-10. L2 11-20. L3 20-50 shown in groups of ten. L4 50-100.
export function genCount(level, rng) {
  const n = level === 1 ? rng.int(1, 10) : level === 2 ? rng.int(11, 20) : level === 3 ? rng.int(20, 50) : rng.int(50, 100);
  return { kind: 'count', n, answer: n, text: 'HOW MANY?', groups: [n] };
}

// ---- More or Less ----
// L1 two piles, which has more. L2 two numbers to 20, which is bigger.
// L3 pick >, <, = for numbers to 20. L4 same with two-digit numbers.
export function genCompare(level, rng) {
  if (level <= 2) {
    const max = level === 1 ? 10 : 20;
    let a = rng.int(1, max), b = rng.int(1, max);
    while (b === a) b = rng.int(1, max);
    const more = rng.next() < 0.5;
    const answer = more ? (a > b ? 0 : 1) : (a < b ? 0 : 1);
    const options = level === 1 ? [{ type: 'pile', n: a }, { type: 'pile', n: b }] : [{ type: 'text', text: String(a) }, { type: 'text', text: String(b) }];
    return { kind: 'compare', a, b, more, answer, text: more ? (level === 1 ? 'WHICH HAS MORE?' : 'WHICH IS BIGGER?') : (level === 1 ? 'WHICH HAS LESS?' : 'WHICH IS SMALLER?'), options };
  }
  const max = level === 3 ? 20 : 99;
  const a = rng.int(1, max), b = rng.next() < 0.2 ? a : rng.int(1, max);
  const sym = a > b ? '>' : a < b ? '<' : '=';
  const options = [{ type: 'text', text: '>' }, { type: 'text', text: '<' }, { type: 'text', text: '=' }];
  return { kind: 'symbol', a, b, answer: options.findIndex(o => o.text === sym), text: `${a} ? ${b}`, options, hint: 'THE OPEN SIDE FACES THE BIGGER NUMBER' };
}

// ---- Jars of Ten (place value) ----
// L1 how many more fill the jar of ten. L2 read tens and ones (to 50).
// L3 how many tens in a number. L4 tens and ones to 99, both directions.
export function genTens(level, rng) {
  if (level === 1) { const k = rng.int(1, 9); return { kind: 'fill', k, answer: 10 - k, text: `${k} + ? = 10`, prompt: 'HOW MANY MORE FILL THE JAR?' }; }
  if (level === 2) { const n = rng.int(11, 50); return { kind: 'rods', n, answer: n, text: 'WHAT NUMBER?', prompt: 'COUNT THE TENS, THEN THE ONES' }; }
  if (level === 3) { const n = rng.int(10, 99); return { kind: 'tens', n, answer: Math.floor(n / 10), text: `${n} HAS ? TENS`, prompt: 'HOW MANY TENS?' }; }
  const n = rng.int(10, 99), t = Math.floor(n / 10), o = n % 10;
  if (rng.next() < 0.5) return { kind: 'build', n, t, o, answer: n, text: `${t} TENS ${o} ONES = ?`, prompt: 'WHAT NUMBER IS THAT?' };
  return { kind: 'ones', n, t, o, answer: o, text: `${n} = ${t} TENS ? ONES`, prompt: 'HOW MANY ONES?' };
}

// ---- Clock Fixer ----
// L1 read an o'clock (pick the words). L2 pick the clock for an o'clock.
// L3 read a half hour. L4 pick the clock for a half hour or o'clock.
const timeText = (h, m) => (m === 0 ? `${h} O'CLOCK` : `HALF PAST ${h}`);
export function genClock(level, rng) {
  const m = level <= 2 ? 0 : rng.next() < 0.7 ? 30 : 0;
  const h = rng.int(1, 12);
  const others = new Set([h]);
  while (others.size < 4) others.add(rng.int(1, 12));
  const hours = rng.shuffle([...others]);
  if (level === 1 || level === 3) {
    const options = hours.map(x => ({ type: 'text', text: timeText(x, m) }));
    return { kind: 'readClock', h, m, answer: hours.indexOf(h), text: 'WHAT TIME IS IT?', show: { type: 'clock', h, m }, options };
  }
  const options = hours.map(x => ({ type: 'clock', h: x, m }));
  return { kind: 'pickClock', h, m, answer: hours.indexOf(h), text: `SHOW ${timeText(h, m)}`, options };
}

// ---- Paint the Pattern ----
export const TILE_COLORS = ['red', 'blue', 'yellow', 'green'];
export const TILE_SHAPES = ['square', 'circle', 'triangle'];
export function genPattern(level, rng) {
  if (level === 4) {
    const step = rng.pick([1, 2, 5, 10]), start = rng.int(1, 10);
    const seq = [0, 1, 2, 3].map(i => start + i * step);
    const answer = start + 4 * step;
    const wrong = new Set(); while (wrong.size < 2) { const w = answer + rng.pick([-step, step, 1, -1, 2]); if (w !== answer && w > 0) wrong.add(w); }
    const options = rng.shuffle([answer, ...wrong]).map(n => ({ type: 'text', text: String(n) }));
    return { kind: 'numPattern', seq, answer: options.findIndex(o => o.text === String(answer)), text: seq.join(', ') + ', ?', options, hint: `COUNT BY ${step}S` };
  }
  const colors = rng.shuffle(TILE_COLORS).slice(0, 3);
  const shape = rng.pick(TILE_SHAPES);
  let unit;
  if (level === 1) unit = [0, 1];
  else if (level === 2) unit = rng.pick([[0, 1, 2], [0, 0, 1], [0, 1, 1]]);
  else unit = null;
  let tiles = [];
  if (unit) { for (let i = 0; i < 7; i++) tiles.push({ type: 'tile', shape, color: colors[unit[i % unit.length]], size: 1 }); }
  else {
    // Growing: size or count grows 1, 2, 3, ...
    const n = 4;
    for (let i = 0; i < n; i++) tiles.push({ type: 'tile', shape, color: colors[0], size: i + 1 });
  }
  const next = unit ? tiles.pop() : { type: 'tile', shape, color: colors[0], size: 5 };
  const wrongs = [];
  const pool = unit ? colors.filter(c => c !== next.color).map(c => ({ type: 'tile', shape, color: c, size: 1 })) : [3, 6].map(sz => ({ type: 'tile', shape, color: colors[0], size: sz }));
  for (const w of pool) if (wrongs.length < 2) wrongs.push(w);
  if (wrongs.length < 2) wrongs.push({ type: 'tile', shape: TILE_SHAPES.find(s => s !== shape), color: next.color, size: 1 });
  const options = rng.shuffle([next, ...wrongs]);
  return { kind: 'pattern', tiles, answer: options.indexOf(next), text: 'WHAT COMES NEXT?', options, hint: 'SAY THE PATTERN OUT LOUD' };
}

// ---- Shape Sorter ----
export const SHAPES2D = ['circle', 'square', 'triangle', 'rectangle', 'hexagon'];
export const SHAPES3D = ['cube', 'sphere', 'cone', 'cylinder'];
const SIDES = { circle: 0, square: 4, triangle: 3, rectangle: 4, hexagon: 6 };
export function genShape(level, rng) {
  if (level === 4) {
    const shape = rng.pick(['square', 'triangle', 'rectangle', 'hexagon']);
    const answer = SIDES[shape];
    const opts = rng.shuffle([...new Set([answer, 3, 4, 6, 5])]).slice(0, 3);
    if (!opts.includes(answer)) opts[0] = answer;
    const options = rng.shuffle(opts).map(n => ({ type: 'text', text: String(n) }));
    return { kind: 'sides', shape, answer: options.findIndex(o => o.text === String(answer)), text: 'HOW MANY SIDES?', show: { type: 'shape', shape }, options };
  }
  const pool = level === 1 ? SHAPES2D.slice(0, 3) : level === 2 ? SHAPES2D : SHAPES3D;
  const shape = rng.pick(pool);
  const names = rng.shuffle(pool.filter(s => s !== shape)).slice(0, 2);
  const options = rng.shuffle([shape, ...names]).map(s => ({ type: 'text', text: s.toUpperCase() }));
  return { kind: 'name', shape, answer: options.findIndex(o => o.text === shape.toUpperCase()), text: 'WHAT SHAPE IS THIS?', show: { type: 'shape', shape }, options };
}

// ---- Plank Picker (measurement) ----
export function genPlank(level, rng) {
  if (level === 1) {
    let a = rng.int(3, 12), b = rng.int(3, 12); while (b === a) b = rng.int(3, 12);
    const longer = rng.next() < 0.5;
    const answer = longer ? (a > b ? 0 : 1) : (a < b ? 0 : 1);
    return { kind: 'longer', answer, text: longer ? 'WHICH PLANK IS LONGER?' : 'WHICH PLANK IS SHORTER?', options: [{ type: 'plank', len: a }, { type: 'plank', len: b }] };
  }
  if (level === 2) {
    const lens = rng.shuffle([rng.int(2, 4), rng.int(5, 8), rng.int(9, 12)]);
    const longest = rng.next() < 0.5;
    const target = longest ? Math.max(...lens) : Math.min(...lens);
    return { kind: 'order', answer: lens.indexOf(target), text: longest ? 'WHICH IS THE LONGEST?' : 'WHICH IS THE SHORTEST?', options: lens.map(l => ({ type: 'plank', len: l })) };
  }
  if (level === 3) {
    const len = rng.int(2, 9);
    const opts = rng.shuffle(near(len)).map(n => ({ type: 'text', text: String(n) }));
    return { kind: 'measure', len, answer: opts.findIndex(o => o.text === String(len)), text: 'HOW MANY BLOCKS LONG?', show: { type: 'plank', len, units: true }, options: opts, hint: 'COUNT THE BLOCKS UNDER THE PLANK' };
  }
  const a = rng.int(4, 10), b = rng.int(1, a - 1), diff = a - b;
  const opts = rng.shuffle(near(diff)).map(n => ({ type: 'text', text: String(n) }));
  return { kind: 'diff', a, b, answer: opts.findIndex(o => o.text === String(diff)), text: 'TOP IS HOW MUCH LONGER?', show: { type: 'planks', lens: [a, b], units: true }, options: opts, hint: 'COUNT THE EXTRA BLOCKS' };
}

// ---- Tally Time (data) ----
export const GRAPH_ITEMS = ['fish', 'muffin', 'acorn', 'cookie'];
export function genTally(level, rng) {
  if (level === 1) {
    const n = rng.int(3, 15);
    const opts = rng.shuffle(near(n)).map(x => ({ type: 'text', text: String(x) }));
    return { kind: 'tally', n, answer: opts.findIndex(o => o.text === String(n)), text: 'HOW MANY TALLY MARKS?', show: { type: 'tally', n }, options: opts, hint: 'EACH BUNDLE IS 5' };
  }
  const items = rng.shuffle(GRAPH_ITEMS).slice(0, 3);
  let counts = items.map(() => rng.int(1, 8));
  while (new Set(counts).size < 3) counts = items.map(() => rng.int(1, 8));
  const rows = items.map((item, i) => ({ item, n: counts[i] }));
  if (level === 2) {
    const i = rng.int(0, 2), n = counts[i];
    const opts = rng.shuffle(near(n)).map(x => ({ type: 'text', text: String(x) }));
    return { kind: 'graphRead', rows, answer: opts.findIndex(o => o.text === String(n)), text: `HOW MANY ${items[i].toUpperCase()}?`, show: { type: 'graph', rows }, options: opts };
  }
  if (level === 3) {
    const most = rng.next() < 0.5;
    const target = most ? Math.max(...counts) : Math.min(...counts);
    const options = items.map(it => ({ type: 'text', text: it.toUpperCase() }));
    return { kind: 'graphMost', rows, answer: counts.indexOf(target), text: most ? 'WHICH HAS THE MOST?' : 'WHICH HAS THE FEWEST?', show: { type: 'graph', rows }, options };
  }
  const order = counts.map((c, i) => i).sort((x, y) => counts[y] - counts[x]);
  const hi = order[0], lo = order[rng.int(1, 2)], diff = counts[hi] - counts[lo];
  const opts = rng.shuffle(near(diff)).map(x => ({ type: 'text', text: String(x) }));
  return { kind: 'graphDiff', rows, answer: opts.findIndex(o => o.text === String(diff)), text: `MORE ${items[hi].toUpperCase()} THAN ${items[lo].toUpperCase()}?`, prompt: 'HOW MANY MORE?', show: { type: 'graph', rows }, options: opts };
}

// ---- Skip Hop (skip counting) ----
export function genSkip(level, rng) {
  const step = level === 1 ? 10 : level === 2 ? 5 : level === 3 ? 2 : rng.pick([2, 5, 10]);
  const back = level === 4 && rng.next() < 0.4;
  const maxStart = 100 - step * 4;
  let start = step * rng.int(back ? 4 : 0, Math.floor(maxStart / step));
  if (level === 3 && rng.next() < 0.3 && start + 4 * step + 1 <= 100) start += 1; // odd runs: 1, 3, 5
  const seq = [0, 1, 2, 3].map(i => back ? start - i * step : start + i * step).filter(x => x >= 0);
  const answer = back ? seq[seq.length - 1] - step : seq[seq.length - 1] + step;
  return { kind: 'skip', seq, step, back, answer, text: seq.join(' ') + ' ?', prompt: back ? `COUNT BACK BY ${step}S` : `COUNT BY ${step}S`, groups: [] };
}
