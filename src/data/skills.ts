/** Columns of the evidence matrix: where each skill was actually used. */
export const columns = [
  { id: 'thfy', label: 'Through Hell For You', short: 'THFY' },
  { id: 'cavern', label: 'Crystal Cavern', short: 'Cavern' },
  { id: 'bob', label: 'Bob’s Bullets', short: 'Bob' },
  { id: 'plate', label: 'Roblox Plate Game', short: 'Plate' },
  { id: 'site', label: 'This website', short: 'Site' },
  { id: 'course', label: 'Coursework & other', short: 'Other' },
] as const;

export type ColumnId = (typeof columns)[number]['id'];

export interface SkillRow {
  name: string;
  group: 'Languages' | 'Tools';
  used: ColumnId[];
}

export const rows: SkillRow[] = [
  { name: 'C#', group: 'Languages', used: ['thfy', 'cavern', 'bob'] },
  { name: 'TypeScript', group: 'Languages', used: ['plate', 'site'] },
  { name: 'JavaScript', group: 'Languages', used: ['site', 'course'] },
  { name: 'Python', group: 'Languages', used: ['course'] },
  { name: 'PHP', group: 'Languages', used: ['course'] },
  { name: 'SQL', group: 'Languages', used: ['course'] },
  { name: 'HTML / CSS', group: 'Languages', used: ['site', 'course'] },
  { name: 'Unity', group: 'Tools', used: ['thfy', 'cavern', 'bob'] },
  { name: 'Roblox Studio', group: 'Tools', used: ['plate'] },
  { name: 'roblox-ts', group: 'Tools', used: ['plate'] },
  { name: 'React', group: 'Tools', used: ['plate', 'site'] },
  { name: 'Rojo', group: 'Tools', used: ['plate'] },
  { name: 'MySQL', group: 'Tools', used: ['course'] },
  { name: 'Git & GitHub', group: 'Tools', used: ['thfy', 'cavern', 'bob', 'plate', 'site', 'course'] },
];

export const concepts = [
  { name: 'Gameplay systems', where: 'Every game on this page' },
  { name: 'State machines', where: 'Plate Game enemy AI · Bob’s boss phases' },
  { name: 'AI behavior', where: 'Idle / Patrol / Chase / Attack enemies' },
  { name: 'Client-server architecture', where: 'Server-authoritative Plate Game' },
  { name: 'Object-oriented design', where: 'BaseEvent hierarchy · config-driven enemies' },
  { name: 'Relational databases', where: 'MySQL coursework' },
  { name: 'Team collaboration', where: 'Eight-person SGX team · jam duos' },
];
