/**
 * All project content lives here. Media entries reference files produced by `npm run media`
 * (see scripts/optimize-media.mjs). To add a screenshot, GIF or video:
 *   1. drop the file into assets-src/<project-slug>/
 *   2. run `npm run media`
 *   3. add a MediaItem below (kind 'image' uses the manifest key `<slug>/<filename-without-ext>`;
 *      kind 'gif' / 'video' use the copied path under /media/).
 */
export type MediaItem =
  | { kind: 'image'; id: string; alt: string; caption?: string }
  | { kind: 'gif'; src: string; alt: string; caption?: string }
  | { kind: 'video'; src: string; poster?: string; alt: string; caption?: string };

export type ProjectLink = { label: string; href: string };

export type Theme = 'paper' | 'hell' | 'cavern';

export interface FeaturedProject {
  slug: string;
  index: string;
  title: string;
  titleLines: string[];
  theme: Theme;
  award: { headline: string; detail: string; stamp: string };
  meta: { label: string; value: string }[];
  hero: MediaItem;
  gallery: MediaItem[];
  summary: string;
  description: string[];
  role: string;
  contributions: string[];
  highlights: { title: string; body: string }[];
  links: ProjectLink[];
}

export interface SheetProject {
  slug: string;
  index: string;
  title: string;
  kicker: string;
  stack: string[];
  media: MediaItem[];
  description: string;
  systems: { title: string; body: string }[];
  stats: { value: string; label: string }[];
  links: ProjectLink[];
  demonstrates: string;
}

export interface SmallProject {
  title: string;
  context: string;
  note: string;
  href: string;
}

export const featured: FeaturedProject[] = [
  {
    slug: 'through-hell-for-you',
    index: '01',
    title: 'Through Hell For You',
    titleLines: ['Through Hell', 'For You'],
    theme: 'hell',
    award: {
      headline: 'SGX Audience Choice',
      detail: 'Winner of the audience vote at the Stout Game Expo',
      stamp: 'SGX AUDIENCE CHOICE · STOUT GAME EXPO · ',
    },
    meta: [
      { label: 'Engine', value: 'Unity · C#' },
      { label: 'Team', value: '8 people' },
      { label: 'Role', value: 'All non-art development' },
      { label: 'Shown at', value: 'Stout Game Expo' },
    ],
    hero: {
      kind: 'image',
      id: 'through-hell-for-you/boss-encounter',
      alt: 'Top-down boss encounter: a small armored player faces a towering, shrouded boss with glowing orange eyes, under a ceiling lined with watching eyes.',
      caption: 'Boss encounter. The player, lit by a lantern, faces one of the game’s large bosses.',
    },
    gallery: [],
    summary: 'A dark, atmospheric top-down game about going through hell, with large, intimidating boss encounters.',
    description: [
      'Through Hell For You is a short, atmospheric top-down game built in Unity by an eight-person student team, Studio Atemoya, and shown at the Stout Game Expo, where it won the audience vote.',
      'The player descends through a dark environment and faces large bosses that fill the screen. The art team gave it a hand-drawn, oppressive look. My job was to make all of it play.',
    ],
    role: 'I handled essentially everything except the art.',
    contributions: [
      'Gameplay programming across the project',
      'Boss encounters and enemy systems',
      'Technical ownership: integration, problem-solving, keeping an eight-person build moving',
      'Shipped builds for browser (HTML5) and Windows',
    ],
    highlights: [
      {
        title: 'Boss encounters',
        body: 'Large, screen-filling bosses drive the pacing of the game. I built the encounter logic that makes them read as threats rather than sprites.',
      },
      {
        title: 'Enemy systems',
        body: 'The enemies and the systems they share, built so the team could add content without touching the core code.',
      },
      {
        title: 'Working at team scale',
        body: 'Eight people, one build. I owned the technical side so artists could hand off work and see it in the game.',
      },
    ],
    links: [{ label: 'Play on itch.io', href: 'https://team-jabozo.itch.io/through-hell-for-you' }],
  },
  {
    slug: 'crystal-cavern',
    index: '02',
    title: 'Crystal Cavern',
    titleLines: ['Crystal', 'Cavern'],
    theme: 'cavern',
    award: {
      headline: '1st Overall, Mini Jam 220',
      detail: 'First place out of 75 teams · also 1st in Use of the Limitation',
      stamp: '1ST OVERALL · MINI JAM 220 · 75 TEAMS · ',
    },
    meta: [
      { label: 'Engine', value: 'Unity · C#' },
      { label: 'Team', value: 'Me + 1 artist' },
      { label: 'Role', value: 'All programming + music' },
      { label: 'Made in', value: '72 hours' },
    ],
    hero: {
      kind: 'image',
      id: 'crystal-cavern/pickaxe-timing',
      alt: 'Purple pixel-art cave. A pickaxe bounces above a crystal cluster; the word “Miss!” floats in red; a Pickaxe HP bar and score sit in the corners.',
      caption: 'A mistimed click. The pickaxe bounces to the music and every hit has to land on the beat.',
    },
    gallery: [],
    summary: 'A rhythm game in a purple cave: time your clicks to the music and get through every song.',
    description: [
      'Crystal Cavern was made in 72 hours for Mini Jam 220. The theme was “Crystal” and the mandatory limitation was “Timing is everything.” It took first place overall out of 75 teams, and first in Use of the Limitation.',
      'You swing a pickaxe in a crystal cave by clicking in time with the music. Hit on the beat to score; miss and your pickaxe takes damage. Get through all the songs.',
    ],
    role: 'Everything except the art: all programming and the music.',
    contributions: [
      'Rhythm and timing system: beat-synced pickaxe bounces, hit/miss judgement, scoring',
      'Pickaxe HP, song progression, win and fail states',
      'Composed the music the game is timed to',
      'Scoped, built and shipped a complete browser game in three days',
    ],
    highlights: [
      {
        title: 'Timing as the core mechanic',
        body: 'The limitation became the whole game. Clicks are judged against the beat, with feedback on every hit and miss, so the music is the level design.',
      },
      {
        title: 'Ownership under constraint',
        body: 'One programmer, one artist, three days. I owned the entire codebase and the audio, and made the cuts needed to finish.',
      },
      {
        title: 'Rated by other developers',
        body: 'Jam entries are rated by the other entrants. First overall means other developers played it and ranked it above everything else.',
      },
    ],
    links: [
      { label: 'Play on itch.io', href: 'https://catlovermax13.itch.io/crystal-cavern' },
      { label: 'Jam results', href: 'https://itch.io/jam/mini-jam-220-crystal/results' },
    ],
  },
];

export const sheets: SheetProject[] = [
  {
    slug: 'bobs-bullets',
    index: '03',
    title: 'Bob’s Bullets',
    kicker: 'Solo bullet hell · Bullet Hell Jam 7 · 10 days',
    stack: ['Unity', 'C#'],
    media: [
      {
        kind: 'image',
        id: 'bobs-bullets/bullet-rain',
        alt: 'Bullet-hell gameplay: a red square boss named Bob at the top fires orange bullets in patterns at a small cyan player square below.',
        caption: 'Phase one. Bullet patterns are sequenced to the song.',
      },
      {
        kind: 'image',
        id: 'bobs-bullets/dialogue',
        alt: 'A large white-faced cube boss grins while a dialogue box reads “Oh really, WOW”.',
        caption: 'Story dialogue between phases.',
      },
    ],
    description:
      'A rhythmic bullet-hell boss fight built alone in ten days. The jam theme was “Shrink,” which became a shrinking mechanic: make yourself small to slip through gaps in Bob’s attacks. Survive all five phases and hear what Bob has to say.',
    systems: [
      { title: 'Five boss phases', body: 'One escalating fight with distinct attack sets per phase.' },
      { title: 'Rhythmic attack patterns', body: 'Bullet patterns authored against the song, so dodging feels like reading music.' },
      { title: 'Shrink mechanic', body: 'A hold-to-shrink ability that trades mobility for a smaller hitbox.' },
      { title: 'Story dialogue', body: 'A dialogue system that plays between phases and carries the fight’s personality.' },
    ],
    stats: [
      { value: '3,000+', label: 'lines of C#' },
      { value: '5', label: 'boss phases' },
      { value: '10', label: 'days' },
      { value: '1', label: 'developer' },
    ],
    links: [
      { label: 'Play on itch.io', href: 'https://catlovermax13.itch.io/bobs-bullets' },
      { label: 'Source on GitHub', href: 'https://github.com/marleeseverson/BobsBullets' },
    ],
    demonstrates: 'Attack-pattern design, boss-fight pacing, and building a larger single-player system end to end.',
  },
  {
    slug: 'roblox-plate-game',
    index: '04',
    title: 'Roblox Plate Game',
    kicker: 'Round-based multiplayer survival · engineering project',
    stack: ['Roblox', 'roblox-ts', 'TypeScript', 'React', 'Rojo'],
    media: [],
    description:
      'A round-based multiplayer party game: every player stands on a plate, and each round an event changes the rules. Built in TypeScript on roblox-ts with a Rojo workflow, so the whole thing is typed, modular, and version-controlled like any other software project.',
    systems: [
      { title: 'Extensible event architecture', body: 'A BaseEvent class defines the lifecycle; seven configurable plate events extend it. Adding an eighth is one new file.' },
      { title: 'Enemy AI state machine', body: 'Idle, Patrol, Chase and Attack states with explicit transitions. Enemy types are configuration-driven, not hard-coded.' },
      { title: 'Server-side inventory and tools', body: 'Inventory and tool systems live on the server, so clients can’t fake them.' },
      { title: 'Client-server communication', body: 'Signals and remotes carry messages between the server simulation and the React UI.' },
    ],
    stats: [
      { value: '2,500+', label: 'lines of TypeScript' },
      { value: '7', label: 'plate events' },
      { value: '4', label: 'AI states' },
      { value: '1', label: 'BaseEvent class' },
    ],
    links: [{ label: 'Source on GitHub', href: 'https://github.com/marleeseverson/RobloxPlateGame' }],
    demonstrates: 'Architecture, client-server design and AI outside of Unity and C#. The agents at the top of this page run the same four-state machine.',
  },
];

export const small: SmallProject[] = [
  {
    title: 'Tree of Life',
    context: 'Mini Jam 209: Deep · 72 h · with one artist',
    note: 'My first game jam. Defend the last sapling from asteroids and enemies, with one life.',
    href: 'https://catlovermax13.itch.io/tree-of-life',
  },
  {
    title: 'Fish Can Fly',
    context: 'Ooga Booga Jam 2026 · 3 days · solo',
    note: 'Fly a fish to the moon. Three required themes (cloud, helmet, fish) folded into one mechanic.',
    href: 'https://catlovermax13.itch.io/fish-can-fly',
  },
  {
    title: 'Planet Swap',
    context: 'Personal · Unity',
    note: 'The first project I saw through to completion. Scoped small on purpose, and finished.',
    href: 'https://catlovermax13.itch.io/planet-swap',
  },
];
