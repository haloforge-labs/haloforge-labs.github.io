// Benchmark data for the front page and the Benchmarks page. One file to edit.
//
// Bubo 0.1.1 speeds and "vs 0.1.0" come from one run on build d69b7c07.
// Ratios against other engines come from earlier same-slot runs.
// The page shows no absolute speed for another engine.
//
// Level rule: 0.97 <= ratio <= 1.03 shows "level"; above 1.03 shows "+N %";
// below 0.97 shows "-N %".

export interface Engine {
  id: 'T' | 'E' | 'J' | 'R';
  name: string;          // visible name, no handles
  sub: string;           // what exactly was measured
  url: string;
  frontSub?: string;     // front page: who made it, only for T
}

export const ENGINES: Engine[] = [
  { id: 'T', name: 'gufo-windows', sub: 'build e99e620b', frontSub: 'by thomas9120',
    url: 'https://github.com/thomas9120/gufo-windows/commit/e99e620b02916870a57acc9884a536a6ea687f72' },
  { id: 'E', name: 'gufo Windows 0.22.0', sub: 'build 6d3c691',
    url: 'https://github.com/endyjasmi/gufo/releases/tag/windows-v0.22.0-6d3c691' },
  { id: 'J', name: 'gufo-win 0.2.0', sub: 'release v0.2.0',
    url: 'https://github.com/jaacMusic/gufo-win/releases/tag/v0.2.0' },
  { id: 'R', name: 'Rulith Inference 0.6.5', sub: 'measured version 0.6.5, its own model file',
    url: 'https://github.com/rulith-dev/rulith-inference/releases/tag/v0.6.5' },
];
export const eng = (id: Engine['id']) => ENGINES.find(e => e.id === id)!;
export const RULITH_MODEL_URL = 'https://huggingface.co/Rulith/Qwen3.8-Flash-Next-Rulith-EXL3-GGUF';

type Ratio = number | string | null; // number = A/rival; string = shown as is; null = n/a

export interface Row {
  id: string;
  label: string;        // Benchmarks page row name
  setting: string;
  bubo: number;         // Bubo 0.1.1, tok/s (RB-1)
  decimals: number;
  vsPrev: string;       // 'level' or '+7 %' (RB-1)
  T: Ratio; E: Ratio; J: Ratio; R: Ratio;
  front?: { label: string; what: string };
}

export const ROWS: Row[] = [
  { id: 'prose', label: 'Prose', setting: 'sampled', bubo: 56.4, decimals: 1, vsPrev: '+6 %',
    T: 1.12, E: 1.24, J: 1.09, R: 1.23,
    front: { label: 'Prose', what: 'Writing speed (decode). tok/s' } },
  { id: 'python', label: 'Python code', setting: 'sampled', bubo: 68.7, decimals: 1, vsPrev: 'level',
    T: 1.44, E: 1.33, J: 1.29, R: 1.39 },
  { id: 'cpp', label: 'C++ code', setting: 'sampled', bubo: 74.8, decimals: 1, vsPrev: '+7 %',
    T: 1.65, E: 1.62, J: 1.15, R: 1.52 },
  { id: 'mix', label: 'Six-prompt mix (agent, code, prose)', setting: 'sampled', bubo: 66.0, decimals: 1, vsPrev: '+11 %',
    T: 1.35, E: 1.34, J: 1.20, R: null },
  { id: 'session', label: 'Long agent session, writing (10 turns, 31K to 37K)', setting: 'sampled', bubo: 68.5, decimals: 1, vsPrev: '+10 %',
    T: 1.42, E: 1.33, J: 1.22, R: null,
    front: { label: 'Agent session', what: 'Writing speed (decode). Long session, thinking on. tok/s' } },
  { id: 'sessionprefill', label: 'Long agent session, reading new text', setting: 'sampled', bubo: 946, decimals: 0, vsPrev: 'level',
    T: 1.04, E: 0.99, J: 'see below', R: null },
  { id: 'rename', label: 'Code edit, rename', setting: 'greedy', bubo: 107.5, decimals: 1, vsPrev: '+10 %',
    T: 1.02, E: 2.38, J: 1.08, R: 1.82,
    front: { label: 'Code edits', what: 'Writing speed (decode). Edits that reuse your file’s text. tok/s' } },
  { id: 'comment', label: 'Code edit, comment change', setting: 'greedy', bubo: 97.4, decimals: 1, vsPrev: '+7 %',
    T: 1.06, E: 2.22, J: 1.11, R: 1.73 },
  { id: 'cold32', label: 'Cold 32K prompt', setting: 'natural text', bubo: 1384, decimals: 0, vsPrev: '+5 %',
    T: 1.01, E: 1.00, J: 0.99, R: 1.23,
    front: { label: 'Reading a 32K prompt', what: 'Reading speed (prefill). tok/s' } },
  { id: 'cold2', label: 'Cold 2K prompt', setting: 'natural text', bubo: 1328, decimals: 0, vsPrev: '+8 %',
    T: 1.02, E: 1.03, J: 1.10, R: 1.30 },
];

export const fmt = (n: number, decimals: number) =>
  decimals === 0 ? n.toLocaleString('en-US') : n.toFixed(decimals);

// Cell text for "Bubo is faster by".
export function cell(r: Ratio): string {
  if (r === null) return 'n/a';
  if (typeof r === 'string') return r;
  if (r >= 0.97 && r <= 1.03) return 'level';
  const n = Math.round((r - 1) * 100);
  return n > 0 ? `+${n} %` : `−${Math.abs(n)} %`;
}
// Front page: no plus sign.
export const cellShort = (r: Ratio) => cell(r).replace(/^\+/, '');

// Total wait for the first token over the ten agent turns, seconds (RB-2 note 2).
export const FIRST_TOKEN_WAIT: { who: string; wait: string; note?: string }[] = [
  { who: 'Bubo 0.1.1', wait: '9.0 to 9.9' },
  { who: 'gufo-windows', wait: '9.8 to 10.0' },
  { who: 'gufo Windows 0.22.0', wait: '13.6 to 14.4' },
  { who: 'gufo-win 0.2.0', wait: '45.2 to 45.4', note: '30.4 with its disk cache (one run)' },
];
