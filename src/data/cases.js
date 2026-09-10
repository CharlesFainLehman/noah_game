// Story data for all eight cases. Text may contain {name}, replaced with the player's name.
// A case: intro panels, four suspects (one guilty), five locations (each with a game, a
// character, a backdrop, one panel before, one or two after, and a clue), a two-step
// deduction (who, then how), and closing panels.

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

// Cases open in order. Case n needs case n-1 closed.
export function isAvailable(id, caseState) {
  if (id === 1) return true;
  return caseState(id - 1).status === 'closed';
}

const bart = (bg, text, expr = 'normal') => ({ bg, who: 'basset', expr, text });
const say = (who, bg, text, expr = 'normal') => ({ bg, who, expr, text });

// ---------------------------------------------------------------- Case 1
const CASE1 = {
  id: 1,
  title: 'The Case of the Missing Acorns',
  intro: [
    say('pigeon', 'office', 'Detective! Mrs. Nutley says her acorns are DISAPPEARING. Every morning there are fewer!', 'surprised'),
    bart('office', 'Acorns do not walk away on their own. Or do they? Hmm.'),
    say('squirrel', 'store', 'Every night I count my barrel. Every morning, some are gone! Somebody is taking them!', 'sad'),
    bart('store', '{name}, you are our new junior detective. Four suspects are on the board. Visit the five places on the map. Every clue helps.'),
  ],
  suspects: [
    { id: 'nibbles', species: 'raccoon', name: 'Nibbles', theory: 'Eats acorns at night.', clearedBy: 'muffins', reply: 'Not Nibbles. Gaston says he hates acorns and spits them out. Clue two.' },
    { id: 'pip', species: 'pigeon', name: 'Pip', theory: 'Carries acorns off to his nest.', clearedBy: 'sneeze', reply: 'Not Pip. Acorns make him sneeze. Ms. Heron told us. Clue three.' },
    { id: 'bruno', species: 'beaver', name: 'Bruno', theory: 'Uses acorns to build things.', clearedBy: 'stairs', reply: 'Not Bruno. He has been at the lighthouse all week fixing stairs. Clue five.' },
    { id: 'barrel', sprite: 'barrel', name: 'The Old Barrel', theory: 'Has a secret hole.', guilty: true },
  ],
  locations: [
    {
      id: 'store', name: "Nutley's Store", game: 'countPile', who: 'squirrel', bg: 'store', customer: 'MRS. NUTLEY', item: 'acorn',
      before: [say('squirrel', 'store', 'Count my piles for me, {name}. I want to be sure my numbers are right.')],
      after: [say('squirrel', 'store', 'So my counts ARE right. The acorns really do vanish. And only from the BOTTOM of the barrel!', 'surprised'), bart('store', 'Clue found. Acorns vanish from the bottom of the barrel.')],
      clue: { id: 'bottom', title: 'Gone from the bottom', icon: 'wall' },
    },
    {
      id: 'bakery', name: 'Bakery', game: 'compare', who: 'goose', bg: 'bakery', customer: 'GASTON',
      before: [say('goose', 'bakery', 'Ah, {name}! Tell me which tray has more, and I will tell you about Nibbles.')],
      after: [say('goose', 'bakery', 'Nibbles? He hates acorns! I gave him one once. He spat it across the room. He only eats MUFFINS.', 'happy'), bart('bakery', 'Clue found. Nibbles hates acorns.')],
      clue: { id: 'muffins', title: 'Nibbles hates acorns', icon: 'slip' },
    },
    {
      id: 'school', name: 'School', game: 'jars', who: 'heron', bg: 'school', customer: 'THE CLASS',
      before: [say('heron', 'school', 'Welcome, {name}. Help my class with tens and ones, and I will tell you about Pip.')],
      after: [say('heron', 'school', 'Pip cannot go near an acorn. He sneezes for an hour. ACHOO. He would never carry one.', 'happy'), bart('school', 'Clue found. Acorns make Pip sneeze.')],
      clue: { id: 'sneeze', title: 'Pip sneezes at acorns', icon: 'slip' },
    },
    {
      id: 'fish', name: "Otto's Fish Stand", game: 'countPile', who: 'otter', bg: 'harbor', customer: 'OTTO', item: 'fish',
      before: [say('otter', 'harbor', 'Count my fish, {name}, and I will tell you about that barrel. I sold it to Mrs. Nutley.')],
      after: [say('otter', 'harbor', 'That barrel is OLD. It has a knot hole in the bottom the size of an acorn. I told her to plug it!', 'surprised'), bart('harbor', 'Clue found. The barrel has a knot hole in the bottom.')],
      clue: { id: 'hole', title: 'A hole in the barrel', icon: 'wall' },
    },
    {
      id: 'lighthouse', name: 'Lighthouse', game: 'compare', who: 'turtle', bg: 'lighthouse', customer: 'CAPTAIN MABEL',
      before: [say('turtle', 'lighthouse', 'Slow down, young detective. Help an old turtle compare some numbers first.')],
      after: [say('turtle', 'lighthouse', 'Bruno? He has been up here all week fixing my stairs. Hammering. All. Week. I have not slept.', 'sad'), bart('lighthouse', 'Clue found. Bruno was at the lighthouse all week. That is five clues. Back to the office, {name}.')],
      clue: { id: 'stairs', title: 'Bruno was at the lighthouse', icon: 'slip' },
    },
  ],
  deduction: {
    who: 'So, {name}. Five clues. Four suspects. Who is taking the acorns?',
    whoRight: 'The barrel! Yes! But HOW does a barrel take acorns?',
    how: 'How do the acorns disappear?',
    methods: [
      { text: 'They roll out through the knot hole, under the floor.', ok: true },
      { text: 'They grow legs at night and walk away.', ok: false, reply: 'Acorns do not have legs. Think about the hole and the floor.' },
      { text: 'The barrel eats them.', ok: false, reply: 'Barrels do not eat. But this one has a hole in the bottom...' },
    ],
    solved: 'That is it! Under the floor! Let us go look.',
  },
  closed: [
    bart('store', 'Mrs. Nutley, your barrel has a hole. Every night the acorns roll out and under the floorboards.', 'happy'),
    say('squirrel', 'store', 'Under the floor? Bruno, pull up that board! ... Oh my. There must be a hundred acorns down there!', 'surprised'),
    say('squirrel', 'store', 'And look, an old paper was under there too. {name}, you keep it. You earned it.', 'happy'),
    bart('store', "A piece of the Founder's map! Well done, junior detective. Case closed.", 'happy'),
  ],
};

// ---------------------------------------------------------------- Case 2
const CASE2 = {
  id: 2,
  title: 'The Case of the Crooked Clock',
  intro: [
    say('pigeon', 'office', 'Detective! The town clock is CROOKED. It rang for school at breakfast and for bedtime at lunch!', 'surprised'),
    say('penguin', 'clock', 'This is a disaster! Nobody knows what time it is. The bakery opened at midnight!', 'sad'),
    bart('clock', 'Hmm. A clock that cannot tell time. Four suspects, {name}. Five places. Find the clues.'),
  ],
  suspects: [
    { id: 'nibbles', species: 'raccoon', name: 'Nibbles', theory: 'Climbed the tower and spun the hands.', clearedBy: 'snore', reply: 'Not Nibbles. Ms. Heron heard him snoring in the school attic all day. Clue three.' },
    { id: 'pip', species: 'pigeon', name: 'Pip', theory: 'Bumped the hands while flying.', clearedBy: 'fishing', reply: 'Not Pip. He was fishing with Otto all morning. Clue four.' },
    { id: 'bruno', species: 'beaver', name: 'Bruno', theory: 'Put in the wrong gear.', clearedBy: 'gears', reply: 'Not Bruno. The gears are perfect. The hands turn just right. Clue one.' },
    { id: 'priscilla', species: 'peacock', name: 'Priscilla', theory: 'Repainted the clock face.', guilty: true },
  ],
  locations: [
    {
      id: 'clock', name: 'Clock Tower', game: 'clock', who: 'penguin', bg: 'clock', customer: 'THE MAYOR',
      before: [say('penguin', 'clock', 'Junior detective! Check these little clocks for me. I cannot tell which is right anymore.')],
      after: [say('penguin', 'clock', 'The gears tick perfectly. Bruno fixed them last month. The hands move just right. So why is it WRONG?', 'surprised'), bart('clock', 'Clue found. The gears and hands work fine.')],
      clue: { id: 'gears', title: 'The gears work fine', icon: 'wall' },
    },
    {
      id: 'studio', name: "Priscilla's Studio", game: 'pattern', who: 'peacock', bg: 'studio', customer: 'PRISCILLA',
      before: [say('peacock', 'studio', 'A detective, how nice, come see my art. Finish my patterns, if you please, it is not hard.')],
      after: [say('peacock', 'studio', 'I painted the clock face last week, you know. Twelve numbers in a pretty pattern, all in a row!', 'happy'), bart('studio', 'Clue found. Priscilla painted the clock face in a pattern. Hmm.')],
      clue: { id: 'painted', title: 'Priscilla painted the clock', icon: 'mirror' },
    },
    {
      id: 'school', name: 'School', game: 'clock', who: 'heron', bg: 'school', customer: 'THE CLASS',
      before: [say('heron', 'school', 'My class keeps arriving at the wrong time. Help them read these clocks, {name}.')],
      after: [say('heron', 'school', 'Nibbles? He was snoring in the school attic all day. We could hear it through the ceiling.'), bart('school', 'Clue found. Nibbles snored in the attic all day.')],
      clue: { id: 'snore', title: 'Nibbles snored all day', icon: 'slip' },
    },
    {
      id: 'fish', name: "Otto's Fish Stand", game: 'skipHop', who: 'otter', bg: 'harbor', customer: 'OTTO',
      before: [say('otter', 'harbor', 'I count my fish by fives. Help me hop along, {name}!')],
      after: [say('otter', 'harbor', 'Pip? He was right here fishing with me all morning. He caught a boot.', 'happy'), bart('harbor', 'Clue found. Pip was fishing with Otto.')],
      clue: { id: 'fishing', title: 'Pip was fishing', icon: 'slip' },
    },
    {
      id: 'lighthouse', name: 'Lighthouse', game: 'clock', who: 'turtle', bg: 'lighthouse', customer: 'CAPTAIN MABEL',
      before: [say('turtle', 'lighthouse', 'Read my clocks, young one. My eyes are old.')],
      after: [say('turtle', 'lighthouse', 'Through my telescope I can see the town clock. The numbers go 12, 3, 6, 9, then 1, 2, 4... They are not in order!', 'surprised'), bart('lighthouse', 'Clue found. The numbers on the clock are out of order. Five clues. Back to the office, {name}.')],
      clue: { id: 'order', title: 'Numbers out of order', icon: 'wall' },
    },
  ],
  deduction: {
    who: 'Five clues, {name}. Who made the clock crooked?',
    whoRight: 'Priscilla! Yes. She did not mean to. But HOW?',
    how: 'How did Priscilla make the clock wrong?',
    methods: [
      { text: 'She painted the numbers in a pattern instead of in order.', ok: true },
      { text: 'She painted the clock purple so nobody can see it.', ok: false, reply: 'We can see it fine. Mabel read the numbers. What was wrong with them?' },
      { text: 'She made the hands out of chocolate and they melted.', ok: false, reply: 'The hands work fine. Clue one. Think about the numbers.' },
    ],
    solved: 'That is it! The numbers! Let us go tell Priscilla.',
  },
  closed: [
    bart('studio', 'Priscilla, your pattern is lovely. But a clock needs its numbers in ORDER: 1, 2, 3, all the way to 12.', 'happy'),
    say('peacock', 'studio', 'In order? Oh dear, oh my, how very plain. But if it helps the town, I shall paint it again!', 'surprised'),
    say('peacock', 'studio', 'For you, detective, from my great-aunt Petunia. She said it was part of a map.', 'happy'),
    bart('studio', "A piece of the Founder's map! Two pieces now. Case closed, {name}.", 'happy'),
  ],
};

// ---------------------------------------------------------------- Case 3
const CASE3 = {
  id: 3,
  title: 'The Case of the Backwards Bakery',
  intro: [
    say('pigeon', 'office', 'Detective! Detective! Chef Gaston needs help. His bakery has gone BACKWARDS!', 'surprised'),
    bart('office', 'Backwards? Hmm. Muffins do not usually go backwards.'),
    say('goose', 'bakery', 'Every order comes out wrong! Mrs. Nutley asked for 3 muffins. I gave her 30! Someone is doing this to me!', 'sad'),
    bart('bakery', '{name}, I have four suspects on the board. Visit the five places on the map. Each clue can clear a suspect. Then tell me who did it, and how.'),
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
      before: [say('goose', 'bakery', 'Please, {name}. Read the order slips and fill the trays. I cannot get them right!', 'sad')],
      after: [say('goose', 'bakery', 'Magnifique! Every tray is right. So the slips say the right numbers...', 'happy'), bart('bakery', 'Clue found. The order slips are written correctly. Nobody scribbled on them.')],
      clue: { id: 'slips', title: 'The slips are correct', icon: 'slip' },
    },
    {
      id: 'fish', name: "Otto's Fish Stand", game: 'whoAte', who: 'otter', bg: 'harbor', customer: 'OTTO', item: 'fish',
      before: [say('otter', 'harbor', 'I ordered 4 muffins for lunch. Gaston gave me 40! I ate some fish to feel better. Can you count what is left, {name}?', 'sad')],
      after: [say('otter', 'harbor', 'Thanks! You know, Gaston never even looked at my slip. He kept looking at the WALL behind him.', 'happy'), bart('harbor', 'Clue found. Gaston reads the wall, not the slip. Curious.')],
      clue: { id: 'wall', title: 'Gaston looks at the wall', icon: 'wall' },
    },
    {
      id: 'store', name: "Nutley's Store", game: 'coins', who: 'squirrel', bg: 'store', customer: 'MRS. NUTLEY',
      before: [say('squirrel', 'store', 'My coin jar is a mess, dear. Count the coins for me, and I will tell you what I sold Gaston last week.')],
      after: [say('squirrel', 'store', 'Thank you, dear. I sold Gaston a big shiny mirror. He hung it on the bakery wall, right behind the counter.', 'happy'), bart('store', 'A mirror on the wall! Clue found. Two more places to visit, {name}.', 'surprised')],
      clue: { id: 'mirror', title: 'A big new mirror', icon: 'mirror' },
    },
    {
      id: 'school', name: 'School', game: 'orderUp', who: 'heron', bg: 'school', customer: 'THE CLASS', item: 'cookie', item2: 'cookie',
      before: [say('heron', 'school', 'Welcome, {name}. My class needs cookies for snack time. Add up the orders for me.')],
      after: [say('heron', 'school', 'Well done. Oh, and Pip? He was here ALL morning delivering report cards. He never went near the bakery.', 'happy'), bart('school', 'Clue found. Pip was at school all morning.')],
      clue: { id: 'report', title: 'Pip was at school', icon: 'slip' },
    },
    {
      id: 'clock', name: 'Clock Tower', game: 'whoAte', who: 'penguin', bg: 'clock', customer: 'THE MAYOR', item: 'donut',
      before: [say('penguin', 'clock', 'Junior detective! I climbed up here to fix the clock and got STUCK. For a week! I have been eating donuts. Count what is left.', 'sad')],
      after: [say('penguin', 'clock', 'Thank you! Now help me down these stairs. I have not left this tower in seven days.', 'happy'), bart('clock', 'Clue found. The Mayor was stuck up the tower all week. That is all five clues. Back to the office, {name}.')],
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
    bart('bakery', 'Chef Gaston! Nobody did this to you. You have been reading your slips in the mirror. A mirror flips everything backwards. 12 looks like 21!', 'happy'),
    say('goose', 'bakery', 'Sacre bleu! The mirror! I hung it there to admire my hat.', 'surprised'),
    say('goose', 'bakery', '{name}, you saved my bakery. Take this. I found it inside my oldest cookbook.', 'happy'),
    bart('bakery', "A piece of the Founder's map! Well done, junior detective. Case closed.", 'happy'),
  ],
};

// ---------------------------------------------------------------- Case 4
const CASE4 = {
  id: 4,
  title: 'The Case of the Muddled Market',
  intro: [
    say('pigeon', 'office', 'Detective! Otto says his money box is MUDDLED. Every day he ends up with less money and more fish!', 'surprised'),
    say('otter', 'harbor', 'I sell fish all day. I count my coins at night. There is never enough! Somebody is taking my money!', 'sad'),
    bart('harbor', 'Money troubles. Four suspects, {name}. Five places. Look closely at the coins.'),
  ],
  suspects: [
    { id: 'nibbles', species: 'raccoon', name: 'Nibbles', theory: 'Steals shiny coins.', clearedBy: 'flour', reply: 'Not Nibbles. He slept in a flour sack all day. Gaston saw him. Clue four.' },
    { id: 'mayor', species: 'penguin', name: 'The Mayor', theory: 'Collects a secret fish tax.', clearedBy: 'speech', reply: 'Not the Mayor. He gave a speech at school all morning. A long one. Clue five.' },
    { id: 'nutley', species: 'squirrel', name: 'Mrs. Nutley', theory: 'Swaps coins for buttons.', clearedBy: 'taxes', reply: 'Not Mrs. Nutley. She was at town hall paying taxes with exact change. Clue three.' },
    { id: 'otto', species: 'otter', name: 'Otto', theory: 'Gives the wrong change.', guilty: true },
  ],
  locations: [
    {
      id: 'fish', name: "Otto's Fish Stand", game: 'coins', who: 'otter', bg: 'harbor', customer: 'OTTO',
      before: [say('otter', 'harbor', 'Count my coins, {name}. Tell me what is missing.')],
      after: [say('otter', 'harbor', 'Nothing is missing? All my coins are here? Then why is it never enough...', 'surprised'), bart('harbor', 'Clue found. No coins are missing from the box.')],
      clue: { id: 'nothing', title: 'No coins are missing', icon: 'wall' },
    },
    {
      id: 'store', name: "Nutley's Store", game: 'coins', who: 'squirrel', bg: 'store', customer: 'MRS. NUTLEY',
      before: [say('squirrel', 'store', 'Coins again, dear? Help me sort mine, and I will tell you something odd about Otto.')],
      after: [say('squirrel', 'store', 'Otto gave me three DIMES as change for a nickel. He said dimes are tiny, so they must be worth less!', 'surprised'), bart('store', 'Clue found. Otto thinks small coins are worth less. A dime is small but worth ten!')],
      clue: { id: 'dimes', title: 'Otto thinks dimes are worth less', icon: 'mirror' },
    },
    {
      id: 'clock', name: 'Clock Tower', game: 'whoAte', who: 'penguin', bg: 'clock', customer: 'THE MAYOR', item: 'donut',
      before: [say('penguin', 'clock', 'Junior detective! I have eaten some donuts. Count the rest and I will tell you who paid their taxes.')],
      after: [say('penguin', 'clock', 'Mrs. Nutley paid her taxes at town hall this morning. Exact change. Every penny. She was there for hours.'), bart('clock', 'Clue found. Mrs. Nutley was paying taxes.')],
      clue: { id: 'taxes', title: 'Nutley was paying taxes', icon: 'slip' },
    },
    {
      id: 'bakery', name: 'Bakery', game: 'orderUp', who: 'goose', bg: 'bakery', customer: 'GASTON', item: 'muffin', item2: 'muffin2',
      before: [say('goose', 'bakery', 'Fill my orders, {name}, and I will tell you where Nibbles has been.')],
      after: [say('goose', 'bakery', 'Nibbles slept in my flour sack all day. He came out white as a ghost. He scared the customers.', 'happy'), bart('bakery', 'Clue found. Nibbles was asleep in the flour.')],
      clue: { id: 'flour', title: 'Nibbles slept in the flour', icon: 'slip' },
    },
    {
      id: 'school', name: 'School', game: 'tally', who: 'heron', bg: 'school', customer: 'THE CLASS',
      before: [say('heron', 'school', 'The Mayor gave a speech to my class today. Help me count the tallies of how many times he said "fish".')],
      after: [say('heron', 'school', 'He spoke ALL morning. The children fell asleep. He never left the school.'), bart('school', 'Clue found. The Mayor was giving a speech. Five clues. Back to the office, {name}.')],
      clue: { id: 'speech', title: 'Mayor gave a long speech', icon: 'slip' },
    },
  ],
  deduction: {
    who: 'Five clues, {name}. Who is muddling the market money?',
    whoRight: 'Otto himself! Yes. But HOW?',
    how: 'How does Otto lose his own money?',
    methods: [
      { text: 'He thinks the smallest coin is worth the least. A dime is small but worth 10!', ok: true },
      { text: 'His fish eat the coins.', ok: false, reply: 'No coins are missing. Clue one. Think about the dimes.' },
      { text: 'He counts with his eyes closed.', ok: false, reply: 'His eyes are open. He just does not know what a dime is worth.' },
    ],
    solved: 'That is it! The dimes! Let us go teach Otto about coins.',
  },
  closed: [
    bart('harbor', 'Otto, a dime is small, but it is worth ten cents. A nickel is bigger, but it is only five. Size does not tell you the value!', 'happy'),
    say('otter', 'harbor', 'Ten? That tiny thing? I have been giving away my money all year! Oh, fish sticks.', 'surprised'),
    say('otter', 'harbor', 'Thank you, {name}. Here, my grandmother kept this in her tackle box. Looks like a map.', 'happy'),
    bart('harbor', "A piece of the Founder's map! Case closed, {name}.", 'happy'),
  ],
};

// ---------------------------------------------------------------- Case 5
const CASE5 = {
  id: 5,
  title: 'The Case of the Puzzling Painter',
  intro: [
    say('pigeon', 'office', "Detective! Priscilla's paintings have HOLES in them. Circle holes! Triangle holes! Somebody is cutting up her art!", 'surprised'),
    say('peacock', 'studio', 'My paintings, my darlings, all full of holes! Each morning a new one. Who could be so bold?', 'sad'),
    bart('studio', 'Shapes cut from paintings. Four suspects, {name}. Five places. Watch for patterns.'),
  ],
  suspects: [
    { id: 'nibbles', species: 'raccoon', name: 'Nibbles', theory: 'Nibbles holes in things.', clearedBy: 'counting', reply: 'Not Nibbles. He was at the bakery all night counting muffins in a pattern. Clue four.' },
    { id: 'bruno', species: 'beaver', name: 'Bruno', theory: 'Cut them with his saw.', clearedBy: 'straight', reply: 'Not Bruno. His saws only cut straight lines. The holes are circles. Clue two.' },
    { id: 'pip', species: 'pigeon', name: 'Pip', theory: 'Pecked the holes.', clearedBy: 'kites', reply: 'Not Pip. He flew kites with the class all day and slept like a rock. Clue three.' },
    { id: 'priscilla', species: 'peacock', name: 'Priscilla', theory: 'Did it herself and forgot.', guilty: true },
  ],
  locations: [
    {
      id: 'studio', name: "Priscilla's Studio", game: 'pattern', who: 'peacock', bg: 'studio', customer: 'PRISCILLA',
      before: [say('peacock', 'studio', 'Look at my paintings, look at the holes. Tell me what comes next, and then we will know!')],
      after: [say('peacock', 'studio', 'Circle, triangle, circle, triangle... the holes make a PATTERN. How odd. How pretty. How odd.', 'surprised'), bart('studio', 'Clue found. The holes follow a pattern. Someone who loves patterns did this.')],
      clue: { id: 'pattern', title: 'The holes make a pattern', icon: 'mirror' },
    },
    {
      id: 'workshop', name: "Bruno's Workshop", game: 'shapes', who: 'beaver', bg: 'workshop', customer: 'BRUNO',
      before: [say('beaver', 'workshop', 'Name my shapes, {name}. Then I will show you what my saws can do.')],
      after: [say('beaver', 'workshop', 'See? My saws cut STRAIGHT. Squares, rectangles, triangles. I cannot cut a circle. Nobody can with a saw!'), bart('workshop', 'Clue found. Saws only cut straight lines.')],
      clue: { id: 'straight', title: 'Saws cut straight only', icon: 'slip' },
    },
    {
      id: 'school', name: 'School', game: 'shapes', who: 'heron', bg: 'school', customer: 'THE CLASS',
      before: [say('heron', 'school', 'We are learning shapes this week. Help the class, {name}.')],
      after: [say('heron', 'school', 'Pip? He flew kites with the class all day. Then he fell asleep on the flagpole. He is still there.', 'happy'), bart('school', 'Clue found. Pip flew kites all day.')],
      clue: { id: 'kites', title: 'Pip flew kites all day', icon: 'slip' },
    },
    {
      id: 'bakery', name: 'Bakery', game: 'pattern', who: 'goose', bg: 'bakery', customer: 'GASTON',
      before: [say('goose', 'bakery', 'Nibbles and I have been arranging muffins in patterns. Blueberry, chocolate, blueberry... Help us!')],
      after: [say('goose', 'bakery', 'Nibbles was here ALL night counting muffins in patterns with me. He fell asleep in the tray.', 'happy'), bart('bakery', 'Clue found. Nibbles was at the bakery all night.')],
      clue: { id: 'counting', title: 'Nibbles was at the bakery', icon: 'slip' },
    },
    {
      id: 'lighthouse', name: 'Lighthouse', game: 'shapes', who: 'turtle', bg: 'lighthouse', customer: 'CAPTAIN MABEL',
      before: [say('turtle', 'lighthouse', 'I see many shapes from up here. Name them for me, young one.')],
      after: [say('turtle', 'lighthouse', 'Last night I saw a light in the studio. Someone was cutting shapes. In a nightgown. With feathers. Walking very slowly, eyes closed.', 'surprised'), bart('lighthouse', 'Clue found. Someone with feathers cut shapes at midnight, eyes closed. Five clues. Back to the office, {name}.')],
      clue: { id: 'nightgown', title: 'Feathers, midnight, eyes closed', icon: 'wall' },
    },
  ],
  deduction: {
    who: 'Five clues, {name}. Who is cutting shapes from the paintings?',
    whoRight: 'Priscilla herself! Yes! But HOW?',
    how: 'How does Priscilla cut up her own paintings?',
    methods: [
      { text: 'She cuts shapes in her sleep, for her pattern quilt.', ok: true },
      { text: 'The paintings are shy and hide their shapes.', ok: false, reply: 'Paintings are not shy. Mabel saw someone with feathers, eyes closed, at midnight.' },
      { text: 'Circles roll away on their own.', ok: false, reply: 'Triangles do not roll. Think about the feathers and the closed eyes.' },
    ],
    solved: 'That is it! She sleepwalks! Let us go tell her, gently.',
  },
  closed: [
    bart('studio', 'Priscilla, you walk in your sleep. Every night you cut shapes for a quilt and never remember.', 'happy'),
    say('peacock', 'studio', 'In my sleep? Cutting? Oh my, oh dear! ... But the quilt is rather pretty, is it not?', 'surprised'),
    say('peacock', 'studio', 'For you, dear detective, the paper I found stitched inside the quilt. I thought it was a pattern.', 'happy'),
    bart('studio', "A piece of the Founder's map! Case closed, {name}.", 'happy'),
  ],
};

// ---------------------------------------------------------------- Case 6
const CASE6 = {
  id: 6,
  title: 'The Case of the Long Lost Ladder',
  intro: [
    say('pigeon', 'office', "Detective! Bruno's ladders are all WRONG. Too short for the lighthouse! Too long for the bakery!", 'surprised'),
    say('beaver', 'workshop', 'I measure everything twice! But my ladders come out the wrong size. Somebody is messing with my measuring!', 'sad'),
    bart('workshop', 'Ladders of the wrong size. Four suspects, {name}. Five places. Measure carefully.'),
  ],
  suspects: [
    { id: 'nibbles', species: 'raccoon', name: 'Nibbles', theory: 'Chews the rungs off.', clearedBy: 'napping', reply: 'Not Nibbles. The Mayor watched him nap in the clock tower all day. Clue four.' },
    { id: 'otto', species: 'otter', name: 'Otto', theory: 'Borrows ladders and swaps them.', clearedBy: 'lesson', reply: 'Not Otto. He taught fishing at school all day. Clue three.' },
    { id: 'mayor', species: 'penguin', name: 'The Mayor', theory: 'Mixed up the orders.', clearedBy: 'contest', reply: 'Not the Mayor. He judged the muffin contest all week. Clue five.' },
    { id: 'bruno', species: 'beaver', name: 'Bruno', theory: 'Measured wrong by accident.', guilty: true },
  ],
  locations: [
    {
      id: 'workshop', name: "Bruno's Workshop", game: 'planks', who: 'beaver', bg: 'workshop', customer: 'BRUNO',
      before: [say('beaver', 'workshop', 'Help me pick planks, {name}. Longer, shorter, I need them all right.')],
      after: [say('beaver', 'workshop', 'When I measure alone with my tail, every plank is perfect. It is only the big ladders that go wrong. Pip helps me with those.'), bart('workshop', 'Clue found. Bruno measures with his tail. Pip helps with big ladders.')],
      clue: { id: 'tail', title: 'Bruno measures with his tail', icon: 'wall' },
    },
    {
      id: 'lighthouse', name: 'Lighthouse', game: 'planks', who: 'turtle', bg: 'lighthouse', customer: 'CAPTAIN MABEL',
      before: [say('turtle', 'lighthouse', 'My new ladder is too short by half. Help me measure these, young one.')],
      after: [say('turtle', 'lighthouse', 'I watched them measure it. Bruno used his tail. Then Pip measured the other half with his WING. A wing is much shorter than a tail!', 'surprised'), bart('lighthouse', 'Clue found. Pip measured with his wing. Different units!')],
      clue: { id: 'wing', title: 'Pip measured with his wing', icon: 'mirror' },
    },
    {
      id: 'school', name: 'School', game: 'planks', who: 'heron', bg: 'school', customer: 'THE CLASS',
      before: [say('heron', 'school', 'We are measuring with blocks today. Show the class how, {name}.')],
      after: [say('heron', 'school', 'Otto taught the class fishing all day. Every child caught a boot. He never left.'), bart('school', 'Clue found. Otto was teaching at school.')],
      clue: { id: 'lesson', title: 'Otto taught fishing', icon: 'slip' },
    },
    {
      id: 'clock', name: 'Clock Tower', game: 'skipHop', who: 'penguin', bg: 'clock', customer: 'THE MAYOR',
      before: [say('penguin', 'clock', 'The stairs go up by tens. Count them with me, junior detective.')],
      after: [say('penguin', 'clock', 'Nibbles? He napped on step 40 all day. I had to step over him. Twelve times.'), bart('clock', 'Clue found. Nibbles napped in the tower.')],
      clue: { id: 'napping', title: 'Nibbles napped all day', icon: 'slip' },
    },
    {
      id: 'bakery', name: 'Bakery', game: 'compare', who: 'goose', bg: 'bakery', customer: 'GASTON',
      before: [say('goose', 'bakery', 'Which tray is bigger? Help me judge, {name}. The Mayor is no help at all.')],
      after: [say('goose', 'bakery', 'The Mayor has judged my muffin contest ALL week. He has eaten 200 muffins. He cannot move.', 'happy'), bart('bakery', 'Clue found. The Mayor judged muffins all week. Five clues. Back to the office, {name}.')],
      clue: { id: 'contest', title: 'Mayor judged muffins', icon: 'slip' },
    },
  ],
  deduction: {
    who: 'Five clues, {name}. Who made the ladders the wrong size?',
    whoRight: 'Bruno himself! Not on purpose. But HOW?',
    how: 'How did the ladders come out wrong?',
    methods: [
      { text: 'Bruno measured with his tail and Pip with his wing. Different sizes!', ok: true },
      { text: 'The ladders shrink in the rain.', ok: false, reply: 'Wood does not shrink that much. Think about the tail and the wing.' },
      { text: 'Nibbles ate the extra rungs.', ok: false, reply: 'Nibbles was napping. Clue four. Think about how they measured.' },
    ],
    solved: 'That is it! Different units! Let us go tell Bruno.',
  },
  closed: [
    bart('workshop', 'Bruno, a tail and a wing are not the same length. When you measure, everyone must use the SAME unit.', 'happy'),
    say('beaver', 'workshop', 'The same unit! Of course! From now on, blocks. Only blocks. Blocks for everyone!', 'surprised'),
    say('beaver', 'workshop', 'Take this, {name}. It was nailed inside my grandfather\'s toolbox. I never knew what it was.', 'happy'),
    bart('workshop', "A piece of the Founder's map! Case closed, {name}.", 'happy'),
  ],
};

// ---------------------------------------------------------------- Case 7
const CASE7 = {
  id: 7,
  title: 'The Case of the Crowded Classroom',
  intro: [
    say('pigeon', 'office', 'Detective! Ms. Heron has TOO MANY students every morning, and too FEW every afternoon!', 'surprised'),
    say('heron', 'school', 'I count twenty students at nine. Thirty-two at ten! Twenty again at lunch. It makes no sense.', 'sad'),
    bart('school', 'Students that come and go. Four suspects, {name}. Five places. Keep a tally.'),
  ],
  suspects: [
    { id: 'nibbles', species: 'raccoon', name: 'Nibbles', theory: 'Sneaks in for snack time.', clearedBy: 'crumbs', reply: 'Not Nibbles. He eats crumbs at the bakery every morning. Clue three.' },
    { id: 'mayor', species: 'penguin', name: 'The Mayor', theory: 'Sends extra students to fill the school.', clearedBy: 'bell', reply: 'Not the Mayor. He rings the bell all morning and never leaves the tower. Clue four.' },
    { id: 'pip', species: 'pigeon', name: 'Pip', theory: 'Brings his cousins.', clearedBy: 'delivery', reply: 'Not Pip. He delivers fish with Otto every morning. Clue five.' },
    { id: 'turtles', species: 'turtle', name: 'Baby Turtles', theory: 'Sneak in for story time.', guilty: true },
  ],
  locations: [
    {
      id: 'school', name: 'School', game: 'tally', who: 'heron', bg: 'school', customer: 'THE CLASS',
      before: [say('heron', 'school', 'Help me read my tally chart, {name}. I counted every hour.')],
      after: [say('heron', 'school', 'Twelve extra students at story time. They are very small. And very, very slow to leave.', 'surprised'), bart('school', 'Clue found. Twelve extra students, small and slow.')],
      clue: { id: 'twelve', title: 'Twelve small, slow extras', icon: 'wall' },
    },
    {
      id: 'lighthouse', name: 'Lighthouse', game: 'tally', who: 'turtle', bg: 'lighthouse', customer: 'CAPTAIN MABEL',
      before: [say('turtle', 'lighthouse', 'I keep a chart of my grandchildren. Twelve of them. Help me read it.')],
      after: [say('turtle', 'lighthouse', 'My twelve grandchildren leave every morning at nine. They come back at lunch. They say they go "to hear stories". I thought they meant the sea.', 'happy'), bart('lighthouse', 'Clue found. Twelve baby turtles go out every morning.')],
      clue: { id: 'grandkids', title: 'Twelve turtles go out', icon: 'mirror' },
    },
    {
      id: 'bakery', name: 'Bakery', game: 'whoAte', who: 'goose', bg: 'bakery', customer: 'GASTON', item: 'cookie',
      before: [say('goose', 'bakery', 'Somebody eats my cookies every morning. Count what is left, {name}.')],
      after: [say('goose', 'bakery', 'It is Nibbles. He is under the counter eating crumbs every morning from eight to noon. I can hear him munching.'), bart('bakery', 'Clue found. Nibbles eats crumbs at the bakery every morning.')],
      clue: { id: 'crumbs', title: 'Nibbles eats crumbs', icon: 'slip' },
    },
    {
      id: 'clock', name: 'Clock Tower', game: 'tally', who: 'penguin', bg: 'clock', customer: 'THE MAYOR',
      before: [say('penguin', 'clock', 'I ring the bell every hour and keep a tally. Help me count it, junior detective.')],
      after: [say('penguin', 'clock', 'Every morning I ring the bell nine times, then ten, then eleven. I never leave. My arms are very tired.'), bart('clock', 'Clue found. The Mayor rings the bell all morning.')],
      clue: { id: 'bell', title: 'Mayor rings the bell', icon: 'slip' },
    },
    {
      id: 'fish', name: "Otto's Fish Stand", game: 'countPile', who: 'otter', bg: 'harbor', customer: 'OTTO', item: 'fish',
      before: [say('otter', 'harbor', 'Pip and I deliver fish every morning. Count today\'s catch for me, {name}.')],
      after: [say('otter', 'harbor', 'Pip is with me every morning, nine to noon. He carries the small fish. He drops most of them.', 'happy'), bart('harbor', 'Clue found. Pip delivers fish every morning. Five clues. Back to the office, {name}.')],
      clue: { id: 'delivery', title: 'Pip delivers fish', icon: 'slip' },
    },
  ],
  deduction: {
    who: 'Five clues, {name}. Who is crowding the classroom?',
    whoRight: 'The baby turtles! Yes! But HOW do they come and go?',
    how: 'How does the class grow and shrink?',
    methods: [
      { text: 'Twelve baby turtles sneak in for story time, then slowly walk home.', ok: true },
      { text: 'The chairs run away at lunch.', ok: false, reply: 'Chairs do not run. Think about twelve small, slow visitors.' },
      { text: 'Ms. Heron counts her own feathers by mistake.', ok: false, reply: 'She counts very well. The extra students are real, and very slow.' },
    ],
    solved: 'That is it! Story time! Let us go see the turtles.',
  },
  closed: [
    bart('school', 'Ms. Heron, your extra students are Captain Mabel\'s twelve grandchildren. They love your stories.', 'happy'),
    say('heron', 'school', 'Twelve turtles! Under the desks! Well. I suppose they may stay. If they are quiet. And bring chairs.', 'surprised'),
    say('turtle', 'school', 'Thank you for finding my grandchildren, {name}. Here. This was in the lighthouse logbook, on the page from 100 years ago.', 'happy'),
    bart('school', "A piece of the Founder's map! Seven pieces! One more to go. Case closed, {name}.", 'happy'),
  ],
};

// ---------------------------------------------------------------- Case 8
const CASE8 = {
  id: 8,
  title: "The Case of the Founder's Treasure",
  intro: [
    bart('office', '{name}, look at the board. Seven map pieces. The treasure is under the biggest tree in town. But one piece is missing, and without it, the map does not line up.'),
    say('turtle', 'lighthouse', 'Ferdinand Frog was my best friend, 100 years ago. He gave the last piece to somebody he trusted. I am old. I forget who.', 'sad'),
    bart('lighthouse', 'Four suspects have old families in Pebbleton. Five places. Find out who has the last piece.'),
  ],
  suspects: [
    { id: 'nibbles', species: 'raccoon', name: 'Nibbles', theory: 'His family kept it.', clearedBy: 'truck', reply: 'Not Nibbles. His family arrived last year on a muffin truck. Clue three.' },
    { id: 'mayor', species: 'penguin', name: 'The Mayor', theory: 'It is in the town hall.', clearedBy: 'arrived', reply: 'Not the Mayor. His family came to town after Ferdinand left. Clue two.' },
    { id: 'pip', species: 'pigeon', name: 'Pip', theory: 'His great-grandpigeon kept it.', clearedBy: 'letters', reply: 'Not Pip. His great-grandpigeon delivered the letters but never got a piece. Clue four.' },
    { id: 'mabel', species: 'turtle', name: 'Captain Mabel', theory: 'Has had it all along.', guilty: true },
  ],
  locations: [
    {
      id: 'lighthouse', name: 'Lighthouse', game: 'skipHop', who: 'turtle', bg: 'lighthouse', customer: 'CAPTAIN MABEL',
      before: [say('turtle', 'lighthouse', 'Ferdinand and I counted stars by tens. Count with me, and maybe I will remember.')],
      after: [say('turtle', 'lighthouse', 'I remember now! He said: "Keep it close, Mabel. Closer than close." Then he laughed. I never understood.', 'surprised'), bart('lighthouse', 'Clue found. "Closer than close." Hmm.')],
      clue: { id: 'close', title: 'Closer than close', icon: 'mirror' },
    },
    {
      id: 'clock', name: 'Clock Tower', game: 'jars', who: 'penguin', bg: 'clock', customer: 'THE MAYOR',
      before: [say('penguin', 'clock', 'The town records are up here, in jars of ten. Help me sort them, junior detective.')],
      after: [say('penguin', 'clock', 'My family came to Pebbleton 90 years ago. Ferdinand had already sailed away. We never met him.'), bart('clock', 'Clue found. The Mayor\'s family came after Ferdinand left.')],
      clue: { id: 'arrived', title: 'Mayor\'s family came later', icon: 'slip' },
    },
    {
      id: 'bakery', name: 'Bakery', game: 'orderUp', who: 'goose', bg: 'bakery', customer: 'GASTON', item: 'muffin', item2: 'muffin2',
      before: [say('goose', 'bakery', 'One last order for the treasure party, {name}! Add them up!')],
      after: [say('goose', 'bakery', 'Nibbles? His family arrived LAST YEAR. On the back of my muffin delivery truck. They ate half the load.', 'happy'), bart('bakery', 'Clue found. Nibbles\' family is new in town.')],
      clue: { id: 'truck', title: 'Nibbles came last year', icon: 'slip' },
    },
    {
      id: 'school', name: 'School', game: 'compare', who: 'heron', bg: 'school', customer: 'THE CLASS',
      before: [say('heron', 'school', 'The old letters are in the school library. Help me compare the dates, {name}.')],
      after: [say('heron', 'school', 'Pip\'s great-grandpigeon delivered every letter Ferdinand wrote. But Ferdinand only ever paid him in seeds. No map piece.'), bart('school', 'Clue found. Pip\'s family got seeds, not a map piece.')],
      clue: { id: 'letters', title: 'Pip\'s family got seeds', icon: 'slip' },
    },
    {
      id: 'store', name: "Nutley's Store", game: 'countPile', who: 'squirrel', bg: 'store', customer: 'MRS. NUTLEY', item: 'acorn',
      before: [say('squirrel', 'store', 'One more count for the party, dear. Then I will tell you something about Mabel.')],
      after: [say('squirrel', 'store', 'Whenever Mabel walks, something under her shell goes "rustle, rustle". Like old paper. For 100 years.', 'surprised'), bart('store', 'Clue found. Something rustles under Mabel\'s shell. Five clues. Back to the office, {name}.')],
      clue: { id: 'rustle', title: 'Rustling under the shell', icon: 'wall' },
    },
  ],
  deduction: {
    who: 'Five clues, {name}. Who has the last piece of the map?',
    whoRight: 'Captain Mabel! She had it all along! But WHERE?',
    how: 'Where is the last piece?',
    methods: [
      { text: 'Under her shell. "Closer than close." It has rustled there for 100 years.', ok: true },
      { text: 'At the bottom of the sea.', ok: false, reply: 'Ferdinand said "closer than close". What is closer than close to a turtle?' },
      { text: 'Nibbles ate it.', ok: false, reply: 'Nibbles was not even born. Think about the rustling.' },
    ],
    solved: 'That is it! Under the shell! To the lighthouse, and then to the biggest tree!',
  },
  closed: [
    say('turtle', 'lighthouse', 'Under my shell? Let me see... rustle, rustle... Well, I never! The last piece! It tickled for 100 years!', 'surprised'),
    bart('street', 'The map lines up! The biggest tree in town, ten steps north, five steps east. Dig, {name}!', 'happy'),
    say('pigeon', 'street', 'A chest! Gold coins! And a letter: "To whoever finds this: spend it on a party for the whole town. Your friend, Ferdinand."', 'surprised'),
    bart('street', 'You did it, {name}. Every case solved. The Founder\'s treasure, found. You are not a junior detective anymore. You are a DETECTIVE.', 'happy'),
  ],
};

export const CASE_DATA = { 1: CASE1, 2: CASE2, 3: CASE3, 4: CASE4, 5: CASE5, 6: CASE6, 7: CASE7, 8: CASE8 };
