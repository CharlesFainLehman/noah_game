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

// Chef Gaston: white goose, chef hat, blue apron. 20 wide.
export const GASTON = [
  '......kkkkkkk.......',
  '.....kwwwwwwwk......',
  '....kwwwwwwwwwk.....',
  '....kwwwwwwwwwk.....',
  '.....kkkkkkkkk......',
  '......kwwwwwk.......',
  '.....kwwwwwwwk......',
  '.....kwkwwwkwk......',
  '.....kwwwwwwwk......',
  '.....kwwwkkkkkk.....',
  '......kwwkooook.....',
  '......kwwwkkkkk.....',
  '.......kwwk.........',
  '.......kwwk.........',
  '.......kwwk.........',
  '......kkwwkk........',
  '....kkwwwwwwkk......',
  '...kwwwwwwwwwwk.....',
  '..kwwwwwwwwwwwwk....',
  '..kwwwaaaaaawwwk....',
  '..kwwaaaaaaaawwk....',
  '..kwwaaaaaaaawwk....',
  '..kwwaaaaaaaawwk....',
  '..kwwaaaaaaaawwk....',
  '..kwwwaaaaaawwwk....',
  '...kwwwwwwwwwwk.....',
  '....kkwwwwwwkk......',
  '......kkkkkk........',
  '......koo.oo........',
  '......koo.oo........',
  '.....kooo.ooo.......',
  '.....kkkk.kkk.......',
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

export const ALL = { MUFFIN, BELL, STAR, GASTON, ARROW, CHECK, LOCK };
