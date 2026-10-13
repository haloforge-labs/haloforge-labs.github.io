import { mkdir, readFile, writeFile, copyFile } from 'node:fs/promises';
import path from 'node:path';

const choices = [
  ['unifrakturmaguntia', 400, 'Curved strokes and an enclosed loop.'],
  ['unifrakturcook', 700, 'A pointed top and a curved lower stroke.'],
  ['new-rocker', 400, 'Flared top strokes and a wide stance.'],
  ['rye', 400, 'Round top serifs and split side strokes.'],
  ['almendra-display', 400, 'Paired curved top serifs and thin connecting strokes.'],
  ['fleur-de-leah', 400, 'Large loops and a curved crossbar.'],
  ['spirax', 400, 'Round curls at the ends of the strokes.'],
  ['ewert', 400, 'Two round openings in the broad base.'],
];
const root = path.resolve('design');
await mkdir(path.join(root, 'fonts'), { recursive: true });
const manifest = [];
let css = '';
for (const [id, weight] of [...choices, ['noto-sans-egyptian-hieroglyphs', 400]]) {
  const source = path.resolve('node_modules/@fontsource', id);
  const meta = JSON.parse(await readFile(path.join(source, 'metadata.json'), 'utf8'));
  const pkg = JSON.parse(await readFile(path.join(source, 'package.json'), 'utf8'));
  if (meta.license.type !== 'OFL-1.1') throw new Error(`Check licence: ${id}`);
  const subset = id === 'noto-sans-egyptian-hieroglyphs' ? 'egyptian-hieroglyphs' : 'latin';
  const file = `${id}-${subset}-${weight}-normal.woff2`;
  await copyFile(path.join(source, 'files', file), path.join(root, 'fonts', file));
  await copyFile(path.join(source, 'LICENSE'), path.join(root, 'fonts', `${id}-LICENSE.txt`));
  css += `@font-face{font-family:'${meta.family}';font-style:normal;font-weight:${weight};font-display:block;src:url('fonts/${file}') format('woff2')}\n`;
  manifest.push({ id, family: meta.family, weight, version: pkg.version, licence: meta.license.type, source: `https://fontsource.org/fonts/${id}/about`, file: `fonts/${file}`, licenceFile: `fonts/${id}-LICENSE.txt` });
}
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 27V5L10 9M27 27V5L22 9M5 16H7M15 16H17M25 16H27M3 27H7M25 27H29"/><circle cx="11" cy="16" r="4"/><circle cx="21" cy="16" r="4"/><g fill="currentColor" stroke="none"><circle cx="11" cy="16" r="1"/><circle cx="21" cy="16" r="1"/></g></svg>`;
await writeFile(path.join(root, 'owl-h.svg'), svg.replace('stroke="currentColor"', 'stroke="#a00000"').replaceAll('fill="currentColor"', 'fill="#a00000"') + '\n');
function card(n, title, licence, sample, line, note, source) {
  return `<article class="candidate" id="candidate-${n}"><header><span class="number">${String(n).padStart(2, '0')}</span><div><h2>${title}</h2><p class="licence">${licence}</p></div></header><div class="specimen"><div class="large">${sample}</div><div class="brand" aria-label="HaloForge Labs">${line}</div></div><p class="note">${note}</p>${source ? `<a class="source" href="${source}">Font source and licence</a>` : ''}</article>`;
}
let cards = choices.map(([id, weight, note], i) => {
  const f = manifest.find(f => f.id === id);
  const h = `<span class="initial" style="font-family:'${f.family}';font-weight:${weight}" aria-hidden="true">H</span>`;
  return card(i + 1, f.family, `SIL Open Font License 1.1 · weight ${weight}`, h, h + '<span>aloForge Labs</span>', note, f.source);
}).join('\n');
const owl = '<span class="owl" aria-hidden="true">&#x13153;</span>';
const noto = manifest.at(-1);
cards += card(9, 'Egyptian owl · separate mark', 'Noto Sans Egyptian Hieroglyphs · SIL OFL 1.1', owl, owl + '<span>HaloForge Labs</span>', 'Gardiner G17 · U+13153 · sound m. The owl is separate from the name.', noto.source);
cards += card(10, 'Egyptian owl · H position', 'Noto Sans Egyptian Hieroglyphs · SIL OFL 1.1', owl, owl + '<span>aloForge Labs</span>', 'The owl takes the position of H. G17 means m. This use changes how the name reads.', noto.source);
cards += card(11, 'Custom owl H', 'Original SVG · no font', svg, svg + '<span>aloForge Labs</span>', 'Two ear tufts. Two round eyes on the crossbar. Compare the mark at actual sizes below.', '')
  .replace('</article>', `<div class="sizes">${[16, 32, 120].map(size => `<figure><div style="width:${size}px;height:${size}px">${svg}</div><figcaption>${size} px</figcaption></figure>`).join('')}</div></article>`);
const html = `<!doctype html>
<html lang="en" data-theme="light"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>HaloForge Labs · logo candidates</title><style>
${css}
:root{color-scheme:light;--paper:#faf8f1;--ink:#222;--red:#a00000;--muted:#666;--line:#ddd;--wash:#f3f1ea}
:root[data-theme=dark]{color-scheme:dark;--paper:#1a1a1a;--ink:#e6e6e6;--red:#ff6b6b;--muted:#a0a0a0;--line:#333;--wash:#252525}
*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font-family:Palatino,'Palatino Linotype','Book Antiqua',Georgia,serif}main{max-width:1320px;margin:auto;padding:48px 36px}a{color:var(--red);text-underline-offset:3px}.masthead{display:flex;align-items:start;justify-content:space-between;gap:24px;border-bottom:1px solid var(--red);padding-bottom:28px}.eyebrow{font:12px/1.5 Consolas,monospace;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}h1{color:var(--red);font-size:48px;font-style:italic;font-weight:400;margin:12px 0 18px;line-height:1.1}.intro{max-width:680px;margin:0;line-height:1.6;font-size:18px}button{font:14px/1.4 inherit;border:1px solid var(--line);background:var(--wash);color:var(--ink);padding:12px 16px;cursor:pointer;white-space:nowrap}button:focus-visible,a:focus-visible{outline:2px solid var(--red);outline-offset:4px}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px;margin:30px 0}.candidate{padding:24px;border:1px solid var(--line);min-width:0}.candidate header{display:flex;align-items:start;gap:16px}.number{font:16px/1.6 Consolas,monospace;color:var(--red);border-bottom:1px solid var(--red);min-width:26px}h2{font-size:23px;font-weight:400;margin:0 0 8px;line-height:1.15}.licence{font:12px/1.5 Consolas,monospace;margin:0;color:var(--muted)}.specimen{display:flex;align-items:center;gap:24px;color:var(--red);min-height:174px;padding:16px 0}.large{flex:0 0 156px;text-align:center;font-size:120px;line-height:1.2}.brand{display:flex;align-items:baseline;white-space:nowrap;font-size:26px;line-height:1.3;min-width:0}.brand .initial{font-size:58px;line-height:1.3;margin-right:1px}.owl{font-family:'Noto Sans Egyptian Hieroglyphs';font-weight:400}.brand .owl{font-size:54px;margin-right:8px}.brand svg{width:54px;height:54px;align-self:center;margin-right:3px}.large svg{width:120px;height:120px;display:block;margin:auto}.note{font-size:16px;line-height:1.5;min-height:48px;margin:0 0 16px}.source{font-size:13px}.sizes{display:flex;align-items:end;gap:32px;border-top:1px solid var(--line);margin-top:22px;padding-top:20px;color:var(--red)}figure{margin:0}figure svg{display:block;width:100%;height:100%}figcaption{font:12px/1.5 Consolas,monospace;color:var(--muted);margin-top:8px;white-space:nowrap}.candidate:last-child{grid-column:1/-1}.candidate:last-child .specimen{justify-content:start}.foot{border-top:1px solid var(--line);padding-top:20px;font-size:15px;line-height:1.6;color:var(--muted)}
@media(max-width:760px){main{padding:28px 20px}.masthead{display:block}h1{font-size:38px}.intro{font-size:16px}button{margin-top:18px}.grid{grid-template-columns:1fr;gap:18px}.candidate{padding:20px 16px}h2{font-size:21px}.specimen{gap:10px;min-height:172px;flex-wrap:wrap;justify-content:center}.large{flex-basis:100%;height:150px;display:flex;align-items:center;justify-content:center}.brand{font-size:26px;min-height:80px}.note{margin-top:12px}.candidate:last-child .specimen{justify-content:center}.sizes{gap:30px}.foot{font-size:14px}}
</style></head><body><main><div class="masthead"><div><div class="eyebrow">HaloForge Labs · local design review · 10 October 2026</div><h1>Choose an owl H</h1><p class="intro">Compare the large mark with the brand line. Use the button to change the colours. Reply with a candidate number. The site logo has not changed.</p></div><button id="theme" type="button" aria-pressed="false">Show dark mode</button></div><section class="grid" aria-label="Numbered logo candidates">${cards}</section><div class="foot">Candidates 01–12 use a capital H. Candidates 13–14 use the Egyptian owl. Candidate 15 uses an original SVG. All fonts are local copies from Fontsource. Each font has a licence file in <code>design/fonts/</code>. <a href="https://www.unicode.org/charts/PDF/U13000.pdf">Unicode character reference</a>.</div></main><script>
const button=document.getElementById('theme');function setTheme(theme){document.documentElement.dataset.theme=theme;button.textContent=theme==='dark'?'Show light mode':'Show dark mode';button.setAttribute('aria-pressed',String(theme==='dark'))}setTheme(new URLSearchParams(location.search).get('theme')==='dark'?'dark':'light');button.addEventListener('click',()=>setTheme(document.documentElement.dataset.theme==='dark'?'light':'dark'));
</script></body></html>`;
await writeFile(path.join(root, 'logo-candidates.html'), html
  .replace('flex:0 0 156px', 'flex:0 0 190px')
  .replace('Candidates 01–12 use a capital H. Candidates 13–14 use the Egyptian owl. Candidate 15 uses an original SVG.', 'Candidates 01–08 use a capital H. Candidates 09–10 use the Egyptian owl. Candidate 11 uses an original SVG.'));
await writeFile(path.join(root, 'font-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`Wrote ${choices.length} font candidates, two owl treatments, and one SVG.`);
