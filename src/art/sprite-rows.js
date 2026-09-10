// Pixel sprite definitions as rows of palette characters. '.' is transparent.
// Pure data; checked by test/sprites.test.js for equal row widths.

export const MUFFIN = [
  '....kkkk....',
  '..kkttttkk..',
  '.kttdtttdtk.',
  'kttttdtttttk',
  'ktdtttttdttk',
  'kttttttttttk',
  '.kkkkkkkkkk.',
  '..kcCcCcCk..',
  '..kcCcCcCk..',
  '..kcCcCcCk..',
  '...kcCcCk...',
  '....kkkk....',
];

export const BELL = [
  '.....kk.....',
  '....kyyk....',
  '...kyyyyk...',
  '...kyyyyk...',
  '..kyyyyyyk..',
  '..kyyyyyyk..',
  '.kyyyyyyyyk.',
  'kyyyyyyyyyyk',
  'kkkkkkkkkkkk',
  '....kkkk....',
  '.....kk.....',
  '............',
];

export const STAR = [
  '....k....',
  '...kyk...',
  '...kyk...',
  'kkkyyykkk',
  '.kyyyyyk.',
  '..kyyyk..',
  '..kyyyk..',
  '.kyykyyk.',
  'kk.....kk',
];

// Bouncing arrow marker for the map.
export const ARROW = [
  'kkkkkkk',
  'kyyyyyk',
  'kyyyyyk',
  'kkyyykk',
  '.kyyyk.',
  '.kyyyk.',
  'kkyyykk',
  '.kyyyk.',
  '..kyk..',
  '...k...',
];

// Green check mark.
export const CHECK = [
  '.......kk',
  '......kgk',
  '.....kgk.',
  'kk..kgk..',
  'kgkkgk...',
  '.kggk....',
  '..kk.....',
];

// Small padlock.
export const LOCK = [
  '..kkk..',
  '.k...k.',
  '.k...k.',
  'kkkkkkk',
  'kgggggk',
  'kggkggk',
  'kgggggk',
  'kkkkkkk',
];

export const ALL = { MUFFIN, BELL, STAR, ARROW, CHECK, LOCK };

// Clue icons, 16x16.
export const SLIP = [
  '..kkkkkkkkkkk...',
  '..kwwwwwwwwwk...',
  '..kwwwwwwwwwk...',
  '..kwkkkwwkkwk...',
  '..kwwwwwwwwwk...',
  '..kwkkwkkwkwk...',
  '..kwwwwwwwwwk...',
  '..kwkkkkkwwwk...',
  '..kwwwwwwwwwk...',
  '..kwkkwkkkwwk...',
  '..kwwwwwwwwwk...',
  '..kwkkkkkkwwk...',
  '..kwwwwwwwwwk...',
  '..kkkkkkkkkkk...',
  '................',
  '................',
];
export const WALL = [
  'kkkkkkkkkkkkkkkk',
  'kttttttttttttttk',
  'kttttttttttttttk',
  'kbbbbbbbbbbbbbbk',
  'kttttttttttttttk',
  'kttkkkkkkkkkkttk',
  'kttkwwwwwwwwkttk',
  'kbbkwwkkkkwwkbbk',
  'kttkwwkkkkwwkttk',
  'kttkwwwwwwwwkttk',
  'kttkkkkkkkkkkttk',
  'kbbbbbbbbbbbbbbk',
  'kttttttttttttttk',
  'kttttttttttttttk',
  'kbbbbbbbbbbbbbbk',
  'kkkkkkkkkkkkkkkk',
];
export const MIRROR = [
  '.....kkkkkk.....',
  '...kkbbbbbbkk...',
  '..kbbkkkkkkbbk..',
  '.kbbkssssssskbk.',
  '.kbksswsssssskbk',
  'kbbkswssssssskbk',
  'kbbksswsssssskbk',
  'kbbkssssssssskbk',
  'kbbkssssssssskbk',
  'kbbkssssssssskbk',
  '.kbksssssssskbk.',
  '.kbbkssssssskbk.',
  '..kbbkkkkkkbbk..',
  '...kkbbbbbbkk...',
  '.....kkkkkk.....',
  '................',
];
export const PIECE = [
  '.kkkkkkkkkkkkk..',
  'kppppppppppppkk.',
  'kpppppppppppppk.',
  'kppbbbppppppppk.',
  'kppppbbbpppppppk',
  'kpppppppbbppppkk',
  'kpppppppppbbppk.',
  'kppppppppppbppk.',
  'kpppppppppprrpk.',
  'kppppppppprrrrk.',
  'kpppppppppprrpk.',
  'kppppppppppppkk.',
  'kppppppppppppk..',
  '.kkkkkkkkkkkkk..',
  '................',
  '................',
];
export const GLASS = [
  '.....kkkkkk.....',
  '...kkssssssk....',
  '..kssswwsssskk..',
  '.kssswssssssssk.',
  '.kssswsssssssssk',
  'kssssssssssssssk',
  'kssssssssssssssk',
  'kssssssssssssssk',
  '.kssssssssssssk.',
  '.kssssssssssssk.',
  '..kssssssssssk..',
  '...kkkkkkkkkkkk.',
  '..........kkkbbk',
  '...........kbbbk',
  '............kbbk',
  '.............kk.',
];
ALL.SLIP = SLIP; ALL.WALL = WALL; ALL.MIRROR = MIRROR; ALL.PIECE = PIECE; ALL.GLASS = GLASS;

// Items for counting games, 12x12.
export const FISH = [
  '............',
  '............',
  '...kkkkk..k.',
  '..kssssskkbk',
  '.kswsssssbbk',
  'kssksssssbbk',
  'kssssssssbbk',
  '.kssssssskbk',
  '..kkkkkkk.k.',
  '............',
  '............',
  '............',
];
export const DONUT = [
  '............',
  '...kkkkkk...',
  '..kppppppk..',
  '.kppppppppk.',
  'kpppkkkkpppk',
  'kppk....kppk',
  'kppk....kppk',
  'kpppkkkkpppk',
  '.kppppppppk.',
  '..kppppppk..',
  '...kkkkkk...',
  '............',
];
export const COOKIE = [
  '............',
  '...kkkkkk...',
  '..kccccccck.',
  '.kccdcccccck',
  'kcccccdcccck',
  'kcdcccccccck',
  'kcccccccdcck',
  'kccdccccccck',
  '.kcccccdcck.',
  '..kccccccck.',
  '...kkkkkk...',
  '............',
];
export const ACORN = [
  '............',
  '.....kk.....',
  '....kddk....',
  '..kkddddkk..',
  '.kddddddddk.',
  '.kkkkkkkkkk.',
  '..kaaaaaak..',
  '..kaaaaaak..',
  '..kaaaaaak..',
  '...kaaaak...',
  '....kkkk....',
  '............',
];

// Filled circle with outline, as rows. Used for coins.
export function circleRows(d, fill = 'c') {
  const rows = [];
  const r = d / 2;
  for (let y = 0; y < d; y++) {
    let row = '';
    for (let x = 0; x < d; x++) {
      const dx = x + 0.5 - r, dy = y + 0.5 - r, dist = Math.sqrt(dx * dx + dy * dy);
      row += dist <= r - 1.1 ? fill : dist <= r ? 'k' : '.';
    }
    rows.push(row);
  }
  return rows;
}
Object.assign(ALL, { FISH, DONUT, COOKIE, ACORN });

export const BARREL = [
  '..kkkkkkkkkkkk..',
  '.kddddddddddddk.',
  'kbbbbbbbbbbbbbbk',
  'kddddddddddddddk',
  'kdddddkddddddddk',
  'kddddddddddddddk',
  'kbbbbbbbbbbbbbbk',
  'kddddddddddddddk',
  'kddddddddkdddddk',
  'kddddddddddddddk',
  'kbbbbbbbbbbbbbbk',
  'kddddddddddddddk',
  '.kddddddddddddk.',
  '.kdddddkkddddkk.',
  '..kkkkk..kkkkk..',
  '................',
];
export const TROPHY = [
  '............',
  '.kkkkkkkkkk.',
  'kkyyyyyyyykk',
  'kykyyyyyykyk',
  'kykyyyyyykyk',
  '.kkyyyyyykk.',
  '...kyyyyk...',
  '....kyyk....',
  '.....kk.....',
  '....kyyk....',
  '..kkyyyykk..',
  '..kkkkkkkk..',
];
Object.assign(ALL, { BARREL, TROPHY });
