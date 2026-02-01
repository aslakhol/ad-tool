export type DimensionSplit = 'antimatter' | 'infinity' | 'time';
export type PaceSplit = 'active' | 'passive' | 'idle';

export interface ECCompletion {
  level: number; // 1-5
  notes: string;
  ipReq: string;
  tt: string;
  dimensionSplit: DimensionSplit;
  paceSplit: PaceSplit;
  timeStudies: number[];
}

export interface EternityChallenge {
  id: number; // 1-12
  completions: ECCompletion[];
}

function detectDimensionSplit(studies: number[]): DimensionSplit {
  if (studies.includes(71)) return 'antimatter';
  if (studies.includes(72)) return 'infinity';
  if (studies.includes(73)) return 'time';
  return 'antimatter'; // default
}

function detectPaceSplit(studies: number[]): PaceSplit {
  if (studies.includes(121)) return 'active';
  if (studies.includes(122)) return 'passive';
  if (studies.includes(123)) return 'idle';
  return 'active'; // default
}

// Data extracted from Excel using scripts/extract-challenges.ts
// Only includes visible (non-white-text) time studies from the spreadsheet
const rawData: Array<{
  ec: string;
  notes: string;
  ipReq: string;
  tt: string;
  studies: number[];
}> = [
  { ec: 'EC1x1', notes: '-', ipReq: '1800', tt: '130', studies: [11,22,32,42,51,61,72,82,92,102,111,121,131,141,151,161,171] },
  { ec: 'EC2x1', notes: '-', ipReq: '975', tt: '135', studies: [11,22,32,42,51,61,73,83,93,103,111,121,131,141,151,161,171] },
  { ec: 'EC1x2', notes: '60000 Eternities Needed', ipReq: '2000', tt: '140', studies: [11,21,22,32,42,51,61,72,82,92,102,111,121,131,141,151,161,162,171] },
  { ec: 'EC3x1', notes: 'Use TS73 path to buy EC, For EC change to →', ipReq: '600', tt: '"', studies: [11,22,32,42,51,61,71,81,91,101,111,122,132,142,151,161,162,171] },
  { ec: 'EC4x1', notes: 'Fail 1 for Achievement (+21 at 145TT)', ipReq: '2750', tt: '142', studies: [11,21,22,32,33,42,51,61,73,83,93,103,111,123,133,143] },
  { ec: 'EC5x1', notes: '-', ipReq: '750', tt: '147', studies: [11,21,22,32,42,51] },
  { ec: 'EC1x3', notes: 'Not recommended to run Idle', ipReq: '2200', tt: '"', studies: [11,21,22,32,33,42,51,61,62,72,82,92,102,111,121,131,141,151,161,162,171] },
  { ec: 'EC3x2', notes: 'Use TS73 path to buy EC, For EC change to →', ipReq: '675', tt: '155', studies: [11,21,22,31,32,33,41,42,51,61,62,71,81,91,101,111,121,131,141,151,161,162,171] },
  { ec: 'EC2x2', notes: '-', ipReq: '1150', tt: '157', studies: [11,21,22,31,32,33,41,42,51,61,62,73,83,93,103,111,121,131,141,151,161,162,171] },
  { ec: 'EC6x1', notes: '1e15 last crunch, wait for RG (+21 at 163TT)', ipReq: '850', tt: '160', studies: [11,21,22,32,33,42,51,61,62,72,82,92,102,111,121,131,141] },
  { ec: 'EC1x4', notes: 'Not recommended to run Idle', ipReq: '2400', tt: '163', studies: [11,21,22,31,32,33,41,42,51,61,62,72,82,92,102,111,121,131,141,151,161,162,171] },
  { ec: 'EC3x3', notes: 'Use TS73 path to buy EC, For EC change to →', ipReq: '750', tt: '"', studies: [11,21,22,31,32,33,41,42,51,61,62,72,82,92,102,111,121,131,141,151,161,162,171] },
  { ec: 'EC7x1', notes: '-', ipReq: '2000', tt: '166', studies: [11,21,22,32,42,51,61,62,71,81,91,101,111] },
  { ec: 'EC4x2', notes: '+TS33 / TS62 if you farm to 172TT / 173TT', ipReq: '3300', tt: '170', studies: [11,22,32,33,42,51,61,62,73,83,93,103,111,123,133,143,151,162,171] },
  { ec: 'EC4x3', notes: '-', ipReq: '3850', tt: '175', studies: [11,22,32,33,42,51,61,62,73,83,93,103,111,123,133,143,151,162,171] },
  { ec: 'EC6x2', notes: '-', ipReq: '1100', tt: '"', studies: [11,21,22,32,42,51,61,62,72,82,92,102,111,121,131,141,151,162] },
  { ec: 'EC1x5', notes: 'Not recommended to run Idle', ipReq: '2600', tt: '"', studies: [11,21,22,31,32,33,41,42,51,61,62,72,82,92,102,111,121,131,141,151,161,162,171] },
  { ec: 'EC5x2', notes: '-', ipReq: '1150', tt: '182', studies: [11,22,32,42,51,61,72,82,92,102,111] },
  { ec: 'EC2x3', notes: '-', ipReq: '1325', tt: '"', studies: [11,21,22,31,32,33,41,42,51,61,62,73,83,93,103,111,121,131,141,151,161,162,171] },
  { ec: 'EC3x4', notes: 'Use TS73 path to buy EC, For EC change to →', ipReq: '825', tt: '"', studies: [11,21,22,31,32,33,41,42,51,61,62,72,82,92,102,111,121,131,141,151,161,162,171] },
  { ec: 'EC7x2', notes: 'Use TS73 path to buy EC, For EC change to →', ipReq: '2530', tt: '193', studies: [11,21,22,31,32,33,41,42,51,61,62,71,81,91,101,111,121,131,141] },
  { ec: 'EC5x3', notes: '-', ipReq: '1550', tt: '200', studies: [11,22,32,42,51,61,72,82,92,102,111,121,131,141] },
  { ec: 'EC8x1', notes: '0RG, 9% Chance, remaining to Interval, All ID1 ', ipReq: '1300', tt: '"', studies: [11,22,32,42,51,61,73,83,93,103,111,123,133,143,151,162] },
  { ec: 'EC3x5', notes: 'Use TS73 path to buy EC, For EC change to →', ipReq: '900', tt: '"', studies: [11,21,22,31,32,33,41,42,51,61,62,72,82,92,102,111,121,131,141,151,161,162,171] },
  { ec: 'EC6x3', notes: '-', ipReq: '1350', tt: '"', studies: [11,21,22,32,33,42,51,61,62,72,82,92,102,111,121,131,141,151,161,162,171] },
  { ec: 'EC2x4', notes: '-', ipReq: '1500', tt: '"', studies: [11,21,22,31,32,33,41,42,51,61,62,73,83,93,103,111,121,131,141,151,161,162,171] },
  { ec: 'EC5x4', notes: '+TS33 if you farm to 218TT', ipReq: '1950', tt: '215', studies: [11,21,22,32,33,42,51,61,62,72,82,92,102,111,121,131,141,151] },
  { ec: 'EC7x3', notes: 'Use TS73 path to buy EC, For EC change to →', ipReq: '3060', tt: '215', studies: [11,21,22,31,32,33,41,42,51,61,62,71,81,91,101,111,121,131,141,151,161,162] },
  { ec: 'EC2x5', notes: '-', ipReq: '1675', tt: '240', studies: [11,21,22,31,32,33,41,42,51,61,62,73,83,93,103,111,121,131,141,151,161,162,171] },
  { ec: 'EC5x5', notes: '+TS31 and TS41 if you farm to 252TT', ipReq: '2350', tt: '245', studies: [11,21,22,31,32,33,41,42,51,61,62,72,82,92,102,111,121,131,141,151,161,162,171] },
  { ec: 'EC4x4', notes: '-', ipReq: '4400', tt: '"', studies: [11,21,22,31,32,33,41,42,51,61,62,73,83,93,103,111,123,133,143,151,161,162,171] },
  { ec: 'EC6x4', notes: '-', ipReq: '1600', tt: '264', studies: [11,21,22,31,32,33,41,42,51,61,62,72,82,92,102,111,121,131,141,151,161,162,171] },
  { ec: 'EC7x4', notes: 'Use TS73 path to buy EC, For EC change to →', ipReq: '3590', tt: '"', studies: [11,21,22,31,32,33,41,42,51,61,62,71,81,91,101,111,121,131,141,151,161,162,171] },
  { ec: 'EC8x2', notes: '0RG, 9% Chance, remaining to Interval, All ID1', ipReq: '2200', tt: '310', studies: [11,21,22,31,32,33,41,42,51,61,62,73,83,93,103,111,123,133,143,151,161,162,171] },
  { ec: 'EC6x5', notes: 'Get Eternity Upgrade 5 (1e40EP) before EC', ipReq: '1850', tt: '320', studies: [11,21,22,31,32,33,41,42,51,61,62,72,82,92,102,111,121,131,141,151,161,162,171] },
  { ec: 'EC4x5', notes: 'TS181 Required', ipReq: '4950', tt: '370', studies: [11,22,32,42,51,61,73,83,93,103,111,123,133,143,151,162,171,181] },
  { ec: 'EC8x3', notes: '4RG, 9% Chance, remaining to Interval, All ID1', ipReq: '3100', tt: '450', studies: [11,21,22,31,32,33,41,42,51,61,62,73,83,93,103,111,123,133,143,151,161,162,171,181] },
  { ec: 'EC9x1', notes: '-', ipReq: '1750', tt: '522', studies: [11,22,32,42,51,61,73,83,93,103,111,121,131,141,151,161,162,171] },
  { ec: 'EC9x2', notes: '-', ipReq: '2000', tt: '575', studies: [11,21,22,31,32,33,41,42,51,61,62,73,83,93,103,111,121,131,141,151,161,162,171] },
  { ec: 'EC8x4', notes: '4RG, 9% Chance, remaining to Interval, All ID1', ipReq: '4000', tt: '600', studies: [11,21,22,31,32,33,41,42,51,61,62,73,83,93,103,111,123,133,143,151,161,162,171,181] },
  { ec: 'EC9x3', notes: '-', ipReq: '2250', tt: '660', studies: [11,21,22,31,32,33,41,42,51,61,62,73,83,93,103,111,121,131,141,151,161,162,171] },
  { ec: 'EC9x4', notes: '-', ipReq: '2500', tt: '760', studies: [11,21,22,31,32,33,41,42,51,61,62,73,83,93,103,111,121,131,141,151,161,162,171,181] },
  { ec: 'EC8x5', notes: '0RG, 9% Chance, remaining to Interval, All ID1', ipReq: '4900', tt: '825', studies: [11,21,22,31,32,33,41,42,51,61,62,73,83,93,103,111,123,133,143,151,161,162,171,181] },
  { ec: 'EC9x5', notes: '-', ipReq: '2750', tt: '830', studies: [11,21,22,31,32,33,41,42,51,61,62,73,83,93,103,111,121,131,141,151,161,162,171,181] },
  { ec: 'EC10x1', notes: 'Farm 150M+ Infinities inside Challenge', ipReq: '3000', tt: '858', studies: [11,21,22,31,32,33,41,42,51,61,62,71,81,91,101,111,121,131,141,151,161,171,181] },
  { ec: 'EC7x5', notes: '-', ipReq: '4120', tt: '"', studies: [11,21,22,31,32,33,41,42,51,61,62,71,81,91,101,111,121,131,141,151,161,162,171,181,193,214] },
  { ec: 'EC10x2', notes: '10M+ BInfs Recommended', ipReq: '3300', tt: '1820', studies: [11,21,22,31,32,33,41,42,51,61,62,71,81,91,101,111,121,131,141,151,161,162,171,181,191,193,211,214] },
  { ec: 'EC10x3', notes: '20M+ BInfs Recommended', ipReq: '3600', tt: '2050', studies: [11,21,22,31,32,33,41,42,51,61,62,71,81,91,101,111,121,131,141,151,161,162,171,181,192,193,214] },
  { ec: 'EC10x4', notes: '30M+ BInfs Recommended', ipReq: '3900', tt: '2740', studies: [11,21,22,31,32,33,41,42,51,61,62,71,81,91,101,111,121,131,141,151,161,162,171,181,191,192,193,211,213,214] },
  { ec: 'EC11x1', notes: 'Get "Popular Music" before EC11s', ipReq: '450', tt: '2886', studies: [11,21,22,31,32,33,41,42,51,61,62,71,81,91,101,111,121,131,141,151,161,162,171,181,191,193,211,212,213,222,231] },
  { ec: 'EC10x5', notes: '45M+ BInfs Recommended', ipReq: '4200', tt: '3615', studies: [11,21,22,31,32,33,41,42,51,61,62,71,81,91,101,111,122,132,142,151,161,162,171,181,192,193,213,214,225,233] },
  { ec: 'EC11x2', notes: 'Get "Popular Music" before EC11s', ipReq: '650', tt: '4870', studies: [11,21,22,31,32,33,41,42,51,61,62,71,81,91,101,111,122,132,142,151,161,162,171,181,191,192,193,211,213,222,225,231,233] },
  { ec: 'EC11x3', notes: '-', ipReq: '850', tt: '5950', studies: [11,21,22,31,32,33,41,42,51,61,62,71,81,91,101,111,122,132,142,151,161,162,171,181,191,192,193,211,212,213,222,223,225,231,233] },
  { ec: 'EC11x4', notes: '-', ipReq: '1050', tt: '"', studies: [11,21,22,31,32,33,41,42,51,61,62,71,81,91,101,111,123,133,143,151,161,162,171,181,191,192,193,211,212,213,222,223,225,231,233] },
  { ec: 'EC11x5', notes: '± 1h45m', ipReq: '1250', tt: '"', studies: [11,21,22,31,32,33,41,42,51,61,62,71,81,91,101,111,123,133,143,151,161,162,171,181,191,192,193,211,212,213,222,223,225,231,233] },
  { ec: 'EC12x1', notes: 'Enable Auto-Eternity for all EC12', ipReq: '110000', tt: '9800', studies: [11,21,22,31,32,33,41,42,51,61,62,73,83,93,103,111,122,132,142,151,161,162,171,181,191,193,211,212,213,214,222,224,226,227,232,234] },
  { ec: 'EC12x2', notes: 'Enable Auto-Eternity for all EC12', ipReq: '122000', tt: '"', studies: [11,21,22,31,32,33,41,42,51,61,62,73,83,93,103,111,122,132,142,151,161,162,171,181,191,193,211,212,213,214,222,224,226,227,232,234] },
  { ec: 'EC12x3', notes: 'Enable Auto-Eternity for all EC12', ipReq: '134000', tt: '10750', studies: [11,21,22,31,32,33,41,42,51,61,62,73,83,93,103,111,122,132,142,151,161,162,171,181,191,193,211,212,213,214,222,224,226,227,232,234] },
  { ec: 'EC12x4', notes: '150M+ BInfs Recommended', ipReq: '146000', tt: '11200', studies: [11,21,22,31,32,33,41,42,51,61,62,73,83,93,103,111,122,132,142,151,161,162,171,181,191,193,211,212,213,214,222,224,226,227,232,234] },
  { ec: 'EC12x5', notes: 'Can be done without "Achievement R134"    →', ipReq: '158000', tt: '12350', studies: [11,21,22,31,32,33,41,42,51,61,62,73,83,93,103,111,122,132,142,151,161,162,171,181,191,193,211,212,213,214,222,224,226,227,232,234] },
];

function parseECName(ec: string): { id: number; level: number } {
  const match = ec.match(/EC(\d+)x(\d+)/);
  if (!match) throw new Error(`Invalid EC name: ${ec}`);
  return { id: parseInt(match[1]), level: parseInt(match[2]) };
}

export function getChallenges(): EternityChallenge[] {
  const challengeMap = new Map<number, ECCompletion[]>();

  // Process in spreadsheet order to handle "ditto" marks (empty tt means same as above)
  let lastTT = '';
  for (const raw of rawData) {
    const { id, level } = parseECName(raw.ec);

    // If tt is empty or a ditto mark ("), use the previous row's value
    const tt = (raw.tt === '' || raw.tt === '"') ? lastTT : raw.tt;
    lastTT = tt;

    const completion: ECCompletion = {
      level,
      notes: raw.notes,
      ipReq: raw.ipReq,
      tt,
      dimensionSplit: detectDimensionSplit(raw.studies),
      paceSplit: detectPaceSplit(raw.studies),
      timeStudies: raw.studies,
    };

    if (!challengeMap.has(id)) {
      challengeMap.set(id, []);
    }
    challengeMap.get(id)!.push(completion);
  }

  // Sort completions by level and create final array
  const challenges: EternityChallenge[] = [];
  for (let i = 1; i <= 12; i++) {
    const completions = challengeMap.get(i) || [];
    completions.sort((a, b) => a.level - b.level);
    challenges.push({ id: i, completions });
  }

  return challenges;
}

export const challenges = getChallenges();
