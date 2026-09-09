// Story data. Text may contain {name}, replaced with the player's name.

export const CASES = [
  { id: 1, title: 'The Missing Acorns' },
  { id: 2, title: 'The Crooked Clock' },
  { id: 3, title: 'The Backwards Bakery' },
  { id: 4, title: 'The Muddled Market' },
  { id: 5, title: 'The Puzzling Painter' },
  { id: 6, title: 'The Long Lost Ladder' },
  { id: 7, title: 'The Crowded Classroom' },
  { id: 8, title: "The Founder's Treasure" },
];

// Cases playable in this build.
export const AVAILABLE = [3];

export const CASE3 = {
  id: 3,
  title: 'The Case of the Backwards Bakery',
  game: 'orderUp',
  intro: [
    { bg: 'office', who: 'pigeon', expr: 'surprised', text: 'Detective! Detective! Chef Gaston needs help. His bakery has gone BACKWARDS!' },
    { bg: 'office', who: 'basset', expr: 'normal', text: 'Backwards? Hmm. Muffins do not usually go backwards.' },
    { bg: 'bakery', who: 'goose', expr: 'sad', text: 'Every order comes out wrong! Mrs. Nutley asked for 3 muffins. I gave her 30!' },
    { bg: 'bakery', who: 'basset', expr: 'normal', text: '{name}, this is a job for a junior detective. Fill the orders. Find three clues. Go to the places marked on the map.' },
  ],
  locations: [
    {
      id: 'bakery', name: 'Bakery', customer: 'Gaston', bg: 'bakery',
      before: [{ bg: 'bakery', who: 'goose', expr: 'sad', text: 'Please, {name}. Read the order slips and fill the trays. I cannot get them right!' }],
      after: [
        { bg: 'bakery', who: 'goose', expr: 'happy', text: 'Magnifique! Every tray is right. So the slips say the right numbers...' },
        { bg: 'bakery', who: 'basset', expr: 'normal', text: 'Clue found. The order slips are written correctly.' },
      ],
      clue: { id: 'slips', title: 'The slips are correct', icon: 'slip' },
    },
    {
      id: 'fish', name: "Otto's Fish Stand", customer: 'Otto', bg: 'harbor',
      before: [
        { bg: 'harbor', who: 'otter', expr: 'sad', text: 'I ordered 4 muffins for lunch. Gaston gave me 40! I am still full.' },
        { bg: 'harbor', who: 'otter', expr: 'normal', text: 'Here are my old order slips. Can you fill them the right way, {name}?' },
      ],
      after: [
        { bg: 'harbor', who: 'otter', expr: 'happy', text: 'Perfect! You know, Gaston never even looked at my slip. He kept looking at the WALL behind him.' },
        { bg: 'harbor', who: 'basset', expr: 'normal', text: 'Clue found. Gaston reads the wall, not the slip.' },
      ],
      clue: { id: 'wall', title: 'Gaston looks at the wall', icon: 'wall' },
    },
    {
      id: 'store', name: "Nutley's Store", customer: 'Mrs. Nutley', bg: 'store',
      before: [{ bg: 'store', who: 'squirrel', expr: 'normal', text: 'Muffin orders? Oh yes. I need muffins for my acorn party. Fill these for me, {name}.' }],
      after: [
        { bg: 'store', who: 'squirrel', expr: 'happy', text: 'Thank you, dear. By the way, I sold Gaston a big shiny mirror last week. He hung it on the bakery wall.' },
        { bg: 'store', who: 'basset', expr: 'surprised', text: 'A mirror! Clue found. Now we have three clues. Back to the office, {name}.' },
      ],
      clue: { id: 'mirror', title: 'A big new mirror', icon: 'mirror' },
    },
  ],
  deduction: {
    question: 'So, {name}. Look at the clues. What made the bakery go backwards?',
    options: [
      { text: 'Nibbles the raccoon swapped all the order slips!', ok: false, clue: 'slips', reply: 'But the slips are correct. Look at clue one. Nibbles is innocent... this time.' },
      { text: 'Gaston reads the slips in his new mirror. A mirror flips things backwards!', ok: true },
      { text: 'The muffins hop off the trays when nobody is looking.', ok: false, clue: 'wall', reply: 'Muffins do not hop. And Otto saw Gaston looking at the wall. Look at clue two.' },
    ],
  },
  closed: [
    { bg: 'bakery', who: 'basset', expr: 'happy', text: 'Chef Gaston! You have been reading your slips in the mirror. A mirror flips everything backwards. 12 looks like 21!' },
    { bg: 'bakery', who: 'goose', expr: 'surprised', text: 'Sacre bleu! The mirror! I hung it there to admire my hat.' },
    { bg: 'bakery', who: 'goose', expr: 'happy', text: '{name}, you saved my bakery. Take this. I found it inside my oldest cookbook.' },
    { bg: 'bakery', who: 'basset', expr: 'happy', text: "A piece of the Founder's map! Well done, junior detective. Case closed." },
  ],
};

export const CASE_DATA = { 3: CASE3 };
