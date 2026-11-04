// Benchmark data for the front page and the Benchmarks page. One file to edit.
//
// Bubo 0.1.2 normal speeds: Q4_K_XL from one run of Bubo 0.1.2 (2026-11-01 20:21, A.base; cold 100K from the
// 2026-11-02 final-CLI ABBA gate). "vs 0.1.0" = that run divided by the 0.1.0 arm of the 2026-11-01 17:09 RB-1.
// Ratios against other engines = Bubo's speed in the SAME slot as the rival (2026-11-02, RB-2, slot RQ4B, one
// start per cell) divided by the rival's speed in that slot. The Benchmarks page shows the ratios; the front table shows the rival's speed (`rival`).
// The session row keeps the client-stream definition of the earlier table (66.2; server definition 67.9).
// Rate definition for every engine: client first-to-last delta, (tokens - 1) / time.
//
// Level rule: 0.97 <= ratio <= 1.03 shows "level"; above 1.03 shows "+N %"; below 0.97 shows "-N %".
//
// Three model files: 'q4' (Huihui UD-Q4_K_XL, the file every engine runs), 'iq3' (ISTA IQ3_S, 55 GB) and
// 'iq2' (ISTA IQ2_XS, 39 GB). Each file has its own table. A row has one `arms` entry per file; a file's table
// appears when any row has an entry for it.
// `fast` is text: the percentage of Bubo with Fast prefill mode over Bubo normal in the same run ('+16.8 %'),
// or 'same' when the row is under 4,096 new tokens or a decode row. A rival that does not load a file is listed in
// LOADS with the exact error, and its cells show "does not load".
// Rulith Inference 0.6.10 runs its own EXL3 file and has no result on the agent-session prompts; its cells are on the Q4_K_XL table only.

export type EngineId = 'E' | 'J' | 'R';
export type FileId = 'q4' | 'iq3' | 'iq3x' | 'iq2';

export interface Engine {
  id: EngineId;
  name: string;          // visible name, no handles
  sub: string;           // what exactly was measured
  url: string;
}

export const ENGINES: Engine[] = [
  { id: 'E', name: 'gufo Windows 0.24.0', sub: 'build b72e01b',
    url: 'https://github.com/endyjasmi/gufo/releases/tag/windows-v0.24.0-b72e01b' },
  { id: 'J', name: 'gufo-win 0.5.0', sub: 'release v0.5.0',
    url: 'https://github.com/jaacMusic/gufo-win/releases/tag/v0.5.0' },
  { id: 'R', name: 'Rulith Inference 0.6.10', sub: 'its own model file',
    url: 'https://github.com/rulith-dev/rulith-inference/releases/tag/v0.6.10' },
];
export const eng = (id: EngineId) => ENGINES.find(e => e.id === id)!;
export const RULITH_MODEL_URL = 'https://huggingface.co/Rulith/Qwen3.8-Flash-Next-Rulith-EXL3-GGUF';

export interface FileInfo { id: FileId; title: string; note: string; }
export const FILES: FileInfo[] = [
  { id: 'q4', title: 'Huihui UD-Q4_K_XL', note: 'The model file that every engine ran.' },
  { id: 'iq3', title: 'ISTA-DASLab IQ3_S, 55 GB', note: 'The ISTA file that scores the same as full precision on ISTA’s benchmarks. The other engines were pointed at the published file as it is.' },
  { id: 'iq3x', title: 'ISTA-DASLab IQ3_XXS', note: 'Bubo only. The other engines were not run on this file.' },
  { id: 'iq2', title: 'ISTA-DASLab IQ2_XS, 39 GB', note: 'The smaller ISTA file. The other engines were pointed at the published file as it is.' },
];

// Exact error text of an engine that does not load a file (its first lines, 2 November 2026).
const ISTA_ERR = (tensor: string) =>
  `Failed to open GGUF: Invalid GGUF tensor shape or unsupported storage type: ${tensor}`;
export const LOADS: Partial<Record<FileId, Partial<Record<EngineId, string>>>> = {
  iq3: { E: ISTA_ERR('blk.0.ffn_gate_exps.weight'), J: ISTA_ERR('blk.0.ffn_gate_exps.weight') },
  iq2: { E: ISTA_ERR('blk.0.ffn_down_exps.weight'), J: ISTA_ERR('blk.0.ffn_down_exps.weight') },
};

type Ratio = number | string | null; // number = Bubo / rival; string = shown as is; null = n/a

export interface Arm {
  bubo: number;                              // Bubo 0.1.2 normal, tok/s
  fast?: string;                             // Bubo 0.1.2 with Fast prefill mode: '+16.8 %' or 'same'
  fastTok?: number;                          // front table and hero: measured tok/s with Fast prefill mode, the 32K row only (1639.4, 2 Nov decode-rival5 RGQ4 gate run)
  vsPrev?: string;                           // 'level' or '+7 %' (only the q4 arm compares with 0.1.0)
  ratios?: Partial<Record<EngineId, Ratio>>;
  rival?: Partial<Record<EngineId, number>>; // the other engine's own tok/s in the slot behind `ratios` (front page table)
}

export interface Row {
  id: string;
  label: string;        // Benchmarks page row name
  setting: string;
  decimals: number;
  arms: Partial<Record<FileId, Arm>>;
  front?: { label: string; what: string };
}

const SEE = { E: 'see below', J: 'see below' };
const NOT = { E: 'not measured', J: 'not measured', R: 'not measured' };

export const ROWS: Row[] = [
  { id: 'prose', label: 'Prose', setting: 'sampled', decimals: 1,
    arms: {
      q4: { bubo: 57.1, vsPrev: '+9 %', fast: 'same', ratios: { R: 55.6 / 51.9, E: 56.3 / 45.3, J: 56.3 / 53.4 }, rival: { E: 45.3, J: 53.4 } },
      iq3: { bubo: 58.7 },
      iq3x: { bubo: 64.6, fast: 'same' },
      iq2: { bubo: 65.3, fast: 'same' },
    },
    front: { label: 'Prose', what: 'Writing speed (decode). tok/s' } },
  { id: 'python', label: 'Python code', setting: 'sampled', decimals: 1,
    arms: {
      q4: { bubo: 66.3, vsPrev: '+4 %', fast: 'same', ratios: { R: 65.4 / 57.8, E: 64.9 / 55.6, J: 64.9 / 58.9 } },
      iq3: { bubo: 66.9 },
      iq3x: { bubo: 70.0, fast: 'same' },
      iq2: { bubo: 78.0, fast: 'same' },
    } },
  { id: 'cpp', label: 'C++ code', setting: 'sampled', decimals: 1,
    arms: {
      q4: { bubo: 77.5, vsPrev: '+11 %', fast: 'same', ratios: { R: 76.9 / 54.1, E: 76.6 / 50.4, J: 76.6 / 56.8 } },
      iq3: { bubo: 70.2 },
      iq3x: { bubo: 71.9, fast: 'same' },
      iq2: { bubo: 77.8, fast: 'same' },
    } },
  { id: 'mix', label: 'Six-prompt mix (agent, code, prose)', setting: 'sampled', decimals: 1,
    arms: {
      q4: { bubo: 65.6, vsPrev: '+12 %', fast: 'same', ratios: { E: 64.4 / 51.1, J: 64.4 / 54.1 } },
      iq3: { bubo: 63.7 },
      iq3x: { bubo: 70.0, fast: 'same' },
      iq2: { bubo: 73.4, fast: 'same' },
    } },
  { id: 'session', label: 'Long agent session, writing (10 turns, 31K to 37K)', setting: 'sampled', decimals: 1,
    arms: {
      q4: { bubo: 66.2, vsPrev: '+7 %', fast: 'same', ratios: { E: 64.0 / 48.0, J: 64.0 / 54.7 }, rival: { E: 48.0, J: 54.7 } },
      iq3: { bubo: 64.9 },
      iq3x: { bubo: 68.6, fast: 'same' },
      iq2: { bubo: 68.3, fast: 'same' },
    },
    front: { label: 'Agent session', what: 'Writing speed (decode). Long session, thinking on. tok/s' } },
  { id: 'sessionprefill', label: 'Long agent session, reading new text', setting: 'sampled', decimals: 0,
    arms: {
      q4: { bubo: 971, vsPrev: 'level', fast: 'same', ratios: SEE },
      iq3: { bubo: 813 },
      iq3x: { bubo: 814, fast: 'same' },
    } },
  { id: 'rename', label: 'Code edit, rename', setting: 'greedy', decimals: 1,
    arms: {
      q4: { bubo: 109.0, vsPrev: '+12 %', fast: 'same', ratios: { R: 108.2 / 70.0, E: 108.6 / 44.0, J: 108.6 / 110.6 }, rival: { E: 44.0, J: 110.6 } },
      iq3: { bubo: 106.9 },
      iq3x: { bubo: 115.4 },
      iq2: { bubo: 131.4, fast: 'same' },
    },
    front: { label: 'Code edits', what: 'Writing speed (decode). Edits that reuse your file’s text. tok/s' } },
  { id: 'comment', label: 'Code edit, comment change', setting: 'greedy', decimals: 1,
    arms: {
      q4: { bubo: 97.6, vsPrev: '+7 %', fast: 'same', ratios: { R: 97.1 / 66.3, E: 97.1 / 42.7, J: 97.1 / 100.9 } },
      iq3: { bubo: 97.2 },
      iq3x: { bubo: 105.5 },
      iq2: { bubo: 118.7, fast: 'same' },
    } },
  { id: 'cold32', label: 'Cold 32K prompt', setting: 'natural text', decimals: 0,
    arms: {
      q4: { bubo: 1415, fastTok: 1639, vsPrev: '+6 %', fast: '+16.8 %', ratios: { E: 1420.6 / 1412.9, J: 1420.6 / 1443.7 }, rival: { E: 1412.9, J: 1443.7 } },
      iq3: { bubo: 1229 },
      iq3x: { bubo: 1225, fast: '+16.8 %' },
      iq2: { bubo: 1170, fast: '+17.1 %' },
    },
    front: { label: 'Reading a 32K prompt', what: 'Reading speed (prefill). tok/s' } },
  { id: 'cold100', label: 'Cold 100K prompt', setting: 'natural text', decimals: 0,
    arms: {
      q4: { bubo: 1384, fast: '+16.5 %', ratios: NOT },
      iq3: { bubo: 1198 },
      iq2: { bubo: 1147, fast: '+16.5 %' },
    } },
  { id: 'cold2', label: 'Cold 2K prompt', setting: 'natural text', decimals: 0,
    arms: {
      q4: { bubo: 1320, vsPrev: '+6 %', fast: 'same', ratios: { R: 1265.5 / 1036.8, E: 1255.0 / 1202.5, J: 1255.0 / 1184.5 } },
      iq3: { bubo: 1078 },
      iq3x: { bubo: 1094, fast: 'same' },
      iq2: { bubo: 1136, fast: 'same' },
    } },
];

export const fmt = (n: number, decimals: number) =>
  decimals === 0 ? Math.round(n).toLocaleString('en-US') : n.toFixed(decimals);

// Cell text for "Bubo is faster than".
export function cell(r: Ratio | undefined): string {
  if (r === null || r === undefined) return 'n/a';
  if (typeof r === 'string') return r;
  if (r >= 0.97 && r <= 1.03) return 'level';
  const n = Math.round((r - 1) * 100);
  return n > 0 ? `+${n} %` : `−${Math.abs(n)} %`;
}
// Front page: no plus sign.
export const cellShort = (r: Ratio | undefined) => cell(r).replace(/^\+/, '');

// Rows that have an arm for a file, and whether any of them has a Fast value.
export const rowsFor = (file: FileId) => ROWS.filter(r => r.arms[file]);
export const hasFast = (file: FileId) => rowsFor(file).some(r => r.arms[file]!.fast !== undefined);

// Total wait for the first token over turns 1 to 9 of the ten-turn agent session, seconds (RB-2, slot RQ4B).
export const FIRST_TOKEN_WAIT: { who: string; wait: string; note?: string }[] = [
  { who: 'Bubo 0.1.2', wait: '8.8' },
  { who: 'gufo Windows 0.24.0', wait: '13.7' },
  { who: 'gufo-win 0.5.0', wait: '15.7' },
];
