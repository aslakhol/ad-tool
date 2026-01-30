import ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const XLSX_PATH = path.join(__dirname, '..', 'Antimatter Dimensions - Eternity and Eternity Challenges.xlsx');
const OUTPUT_PATH = path.join(__dirname, '..', 'src', 'data', 'challenges.ts');

// Gray fill color indicates hidden cells (gray text on gray background = invisible)
const HIDDEN_FILL_COLORS = ['FF666666', 'FF434343'];

interface RawChallenge {
  ec: string;
  notes: string;
  ipReq: string;
  tt: string;
  studies: number[];
}

function isHiddenCell(cell: ExcelJS.Cell): boolean {
  const fill = cell.fill;
  if (!fill || fill.type !== 'pattern') return false;

  const patternFill = fill as ExcelJS.FillPattern;
  const fgColor = patternFill.fgColor;
  if (!fgColor || !fgColor.argb) return false;

  // Check if the fill color matches the hidden (gray) color
  return HIDDEN_FILL_COLORS.includes(fgColor.argb.toUpperCase());
}

function getCellValue(cell: ExcelJS.Cell): string | number | undefined {
  const value = cell.value;
  if (value === null || value === undefined) return undefined;

  // Handle rich text
  if (typeof value === 'object' && 'richText' in value) {
    return (value as ExcelJS.CellRichTextValue).richText.map(rt => rt.text).join('');
  }

  // Handle formula results
  if (typeof value === 'object' && 'result' in value) {
    return (value as ExcelJS.CellFormulaValue).result as string | number;
  }

  return value as string | number;
}

async function extractChallenges(): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(XLSX_PATH);

  // Find the Picturemap sheet
  const sheet = workbook.getWorksheet('Picturemap v2.6');
  if (!sheet) {
    console.error('Could not find "Picturemap v2.6" sheet');
    console.log('Available sheets:', workbook.worksheets.map(s => s.name));
    process.exit(1);
  }

  console.log('Found sheet:', sheet.name);

  // Column layout discovered from debug:
  // Col 3: EC name (e.g., EC1x1)
  // Col 4: Notes
  // Col 5-6: IP Required (merged)
  // Col 7-8: TT (merged)
  // Col 9-52: Time study values (the value IS the TS number)
  const EC_COL = 3;
  const NOTES_COL = 4;
  const IP_REQ_COL = 5;
  const TT_COL = 7;
  const TS_START_COL = 9;
  const TS_END_COL = 52;

  // Extract challenge data
  const challenges: RawChallenge[] = [];

  for (let rowNum = 3; rowNum <= sheet.rowCount; rowNum++) {
    const row = sheet.getRow(rowNum);
    const ecCell = row.getCell(EC_COL);
    const ecValue = String(getCellValue(ecCell) || '');

    // Check if this is an EC row (matches ECNxM pattern)
    if (!ecValue.match(/^EC\d+x\d+$/)) continue;

    const notes = String(getCellValue(row.getCell(NOTES_COL)) || '-');
    const ipReq = String(getCellValue(row.getCell(IP_REQ_COL)) || '');
    const tt = String(getCellValue(row.getCell(TT_COL)) || '');

    // Collect visible time studies (cells without gray fill)
    // The cell value IS the time study number
    const studies: number[] = [];
    for (let col = TS_START_COL; col <= TS_END_COL; col++) {
      const cell = row.getCell(col);
      const val = getCellValue(cell);

      // Skip if cell has no value
      if (val === undefined || val === null || val === '') continue;

      // Skip if the cell is hidden (gray fill color = gray text on gray background)
      if (isHiddenCell(cell)) continue;

      // The value should be a number (the TS id)
      const tsNum = typeof val === 'number' ? val : parseInt(String(val));
      if (!isNaN(tsNum) && tsNum >= 11 && tsNum <= 234) {
        studies.push(tsNum);
      }
    }

    challenges.push({
      ec: ecValue,
      notes: notes === '0' ? '-' : notes,
      ipReq,
      tt,
      studies,
    });

    console.log(`${ecValue}: ${studies.length} studies - ${studies.join(',')}`);
  }

  console.log(`\nExtracted ${challenges.length} challenges`);

  // Generate the output file
  const output = generateOutputFile(challenges);
  fs.writeFileSync(OUTPUT_PATH, output);
  console.log(`\nWritten to ${OUTPUT_PATH}`);
}

function generateOutputFile(challenges: RawChallenge[]): string {
  const rawDataStr = challenges
    .map(c => {
      const studiesStr = c.studies.join(',');
      // Escape single quotes and newlines in notes
      const notesEscaped = c.notes
        .replace(/'/g, "\\'")
        .replace(/\n/g, ' ')
        .replace(/\r/g, '');
      return `  { ec: '${c.ec}', notes: '${notesEscaped}', ipReq: '${c.ipReq}', tt: '${c.tt}', studies: [${studiesStr}] }`;
    })
    .join(',\n');

  return `export type DimensionSplit = 'antimatter' | 'infinity' | 'time';
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
${rawDataStr},
];

function parseECName(ec: string): { id: number; level: number } {
  const match = ec.match(/EC(\\d+)x(\\d+)/);
  if (!match) throw new Error(\`Invalid EC name: \${ec}\`);
  return { id: parseInt(match[1]), level: parseInt(match[2]) };
}

export function getChallenges(): EternityChallenge[] {
  const challengeMap = new Map<number, ECCompletion[]>();

  // Process in spreadsheet order to handle "ditto" marks (empty tt means same as above)
  let lastTT = '';
  for (const raw of rawData) {
    const { id, level } = parseECName(raw.ec);

    // If tt is empty, use the previous row's value (ditto mark in spreadsheet)
    const tt = raw.tt || lastTT;
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
`;
}

extractChallenges().catch(console.error);
