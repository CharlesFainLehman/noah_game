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

// A location: where on the map, which mini-game, who runs it, one panel before and after,
// and the clue it gives. A clue may clear a suspect.
export const CASE3 = {
  id: 3,
  title: 'The Case of the Backwards Bakery',
  intro: [
    { bg: 'office', who: 'pigeon', expr: 'surprised', text: 'Detective! Detective! Chef Gaston needs help. His bakery has gone BACKWARDS!' },
    { bg: 'office', who: 'basset', expr: 'normal', text: 'Backwards? Hmm. Muffins do not usually go backwards.' },
    { bg: 'bakery', who: 'goose', expr: 'sad', text: 'Every order comes out wrong! Mrs. Nutley asked for 3 muffins. I gave her 30! Someone is doing this to me!' },
    { bg: 'bakery', who: 'basset', expr: 'normal', text: '{name}, I have four suspects on the board. Visit the five places on the map. Each clue can clear a suspect. Then tell me who did it, and how.' },
  ],
  suspects: [
    { id: 'nibbles', species: 'raccoon', name: 'Nibbles', theory: 'Scribbled on the order slips.', clearedBy: 'slips', reply: 'Not Nibbles. The slips are written correctly. Clue one. He is innocent... this time.' },
    { id: 'pip', species: 'pigeon', name: 'Pip', theory: 'Delivered the wrong slips.', clearedBy: 'report', reply: 'Not Pip. Ms. Heron says Pip was at school all morning. Clue four.' },
    { id: 'mayor', species: 'penguin', name: 'The Mayor', theory: 'Changed the numbers in town.', clearedBy: 'tower', reply: 'Not the Mayor. He was stuck up the clock tower all week. Clue five.' },
    { id: 'gaston', species: 'goose', name: 'Chef Gaston', theory: 'Did it to himself by accident.', guilty: true },
  ],
  locations: [
    {
      id: 'bakery', name: 'Bakery', game: 'orderUp', who: 'goose', bg: 'bakery', customer: 'GASTON', item: 'muffin', item2: 'muffin2',
      before: [{ bg: 'bakery', who: 'goose', expr: 'sad', text: 'Please, {name}. Read the order slips and fill the trays. I cannot get them right!' }],
      after: [
        { bg: 'bakery', who: 'goose', expr: 'happy', text: 'Magnifique! Every tray is right. So the slips say the right numbers...' },
        { bg: 'bakery', who: 'basset', expr: 'normal', text: 'Clue found. The order slips are written correctly. Nobody scribbled on them.' },
      ],
      clue: { id: 'slips', title: 'The slips are correct', icon: 'slip' },
    },
    {
      id: 'fish', name: "Otto's Fish Stand", game: 'whoAte', who: 'otter', bg: 'harbor', customer: 'OTTO', item: 'fish',
      before: [{ bg: 'harbor', who: 'otter', expr: 'sad', text: 'I ordered 4 muffins for lunch. Gaston gave me 40! I ate some fish to feel better. Can you count what is left, {name}?' }],
      after: [
        { bg: 'harbor', who: 'otter', expr: 'happy', text: 'Thanks! You know, Gaston never even looked at my slip. He kept looking at the WALL behind him.' },
        { bg: 'harbor', who: 'basset', expr: 'normal', text: 'Clue found. Gaston reads the wall, not the slip. Curious.' },
      ],
      clue: { id: 'wall', title: 'Gaston looks at the wall', icon: 'wall' },
    },
    {
      id: 'store', name: "Nutley's Store", game: 'coins', who: 'squirrel', bg: 'store', customer: 'MRS. NUTLEY',
      before: [{ bg: 'store', who: 'squirrel', expr: 'normal', text: 'My coin jar is a mess, dear. Count the coins for me, and I will tell you what I sold Gaston last week.' }],
      after: [
        { bg: 'store', who: 'squirrel', expr: 'happy', text: 'Thank you, dear. I sold Gaston a big shiny mirror. He hung it on the bakery wall, right behind the counter.' },
        { bg: 'store', who: 'basset', expr: 'surprised', text: 'A mirror on the wall! Clue found. Two more places to visit, {name}.' },
      ],
      clue: { id: 'mirror', title: 'A big new mirror', icon: 'mirror' },
    },
    {
      id: 'school', name: 'School', game: 'orderUp', who: 'heron', bg: 'school', customer: 'THE CLASS', item: 'cookie', item2: 'cookie',
      before: [{ bg: 'school', who: 'heron', expr: 'normal', text: 'Welcome, {name}. My class needs cookies for snack time. Add up the orders for me.' }],
      after: [
        { bg: 'school', who: 'heron', expr: 'happy', text: 'Well done. Oh, and Pip? He was here ALL morning delivering report cards. He never went near the bakery.' },
        { bg: 'school', who: 'basset', expr: 'normal', text: 'Clue found. Pip was at school all morning.' },
      ],
      clue: { id: 'report', title: 'Pip was at school', icon: 'slip' },
    },
    {
      id: 'clock', name: 'Clock Tower', game: 'whoAte', who: 'penguin', bg: 'clock', customer: 'THE MAYOR', item: 'donut',
      before: [{ bg: 'clock', who: 'penguin', expr: 'sad', text: 'Junior detective! I climbed up here to fix the clock and got STUCK. For a week! I have been eating donuts. Count what is left.' }],
      after: [
        { bg: 'clock', who: 'penguin', expr: 'happy', text: 'Thank you! Now help me down these stairs. I have not left this tower in seven days.' },
        { bg: 'clock', who: 'basset', expr: 'normal', text: 'Clue found. The Mayor was stuck up the tower all week. That is all five clues. Back to the office, {name}.' },
      ],
      clue: { id: 'tower', title: 'Mayor was stuck all week', icon: 'wall' },
    },
  ],
  deduction: {
    who: 'So, {name}. Five clues. Four suspects. Who made the bakery go backwards?',
    whoRight: 'Yes! Gaston did it to himself! But HOW?',
    how: 'How did Gaston make his own orders come out backwards?',
    methods: [
      { text: 'He reads the slips in his new mirror. A mirror flips things backwards!', ok: true },
      { text: 'He bakes with his eyes closed.', ok: false, reply: 'His eyes were open. Otto saw him looking at the wall. What is on the wall?' },
      { text: 'He whispers the numbers and cannot hear himself.', ok: false, reply: 'Gaston does not whisper. He shouts. Think about the wall and the mirror.' },
    ],
    solved: 'That is it! The mirror! Let us go tell Gaston.',
  },
  closed: [
    { bg: 'bakery', who: 'basset', expr: 'happy', text: 'Chef Gaston! Nobody did this to you. You have been reading your slips in the mirror. A mirror flips everything backwards. 12 looks like 21!' },
    { bg: 'bakery', who: 'goose', expr: 'surprised', text: 'Sacre bleu! The mirror! I hung it there to admire my hat.' },
    { bg: 'bakery', who: 'goose', expr: 'happy', text: '{name}, you saved my bakery. Take this. I found it inside my oldest cookbook.' },
    { bg: 'bakery', who: 'basset', expr: 'happy', text: "A piece of the Founder's map! Well done, junior detective. Case closed." },
  ],
};

export const CASE_DATA = { 3: CASE3 };
