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
