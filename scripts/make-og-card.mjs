// Renders public/og-card.png (light) and public/og-card-dark.png (dark), 1200x630.
// Numbers: Bubo 0.1.1, RB-1 on build d69b7c07 (decode-rb1-c4, table sha256 B5DDBCAB...FB125C).
import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';

const fonts = await Promise.all(['et-book-roman-line-figures', 'et-book-display-italic-old-style-figures'].map(async f => `data:font/woff;base64,${(await readFile(`public/fonts/${f}.woff`)).toString('base64')}`));
const owl = await readFile('public/owl.svg', 'utf8');
const themes = {
  light: { paper: '#faf8f1', ink: '#222', accent: '#a00000', muted: '#595959', line: '#ddd', file: 'public/og-card.png' },
  dark: { paper: '#1a1a1a', ink: '#e6e6e6', accent: '#f35555', muted: '#b0b0b0', line: '#333', file: 'public/og-card-dark.png' },
};
const stats = [
  ['68.5', 'tok/s writing in a long agent session, at about 70 W'],
  ['107.5', 'tok/s on code edits'],
  ['1,384', 'tok/s reading a 32K prompt'],
];
const html = t => `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:ET;font-style:normal;src:url('${fonts[0]}')}
@font-face{font-family:ET;font-style:italic;src:url('${fonts[1]}')}
*{box-sizing:border-box}
body{margin:0;width:1200px;height:630px;background:${t.paper};color:${t.ink};font-family:ET,Palatino,Georgia,serif;border-top:10px solid ${t.accent};padding:56px 72px}
.brand{display:flex;align-items:center;gap:22px;font-size:38px}
.brand svg{width:60px;height:60px;color:${t.accent}}
.brand svg path{fill:${t.accent};stroke:${t.accent};stroke-width:.5;stroke-linejoin:round}
h1{font-weight:400;font-style:italic;color:${t.accent};font-size:88px;line-height:1.05;letter-spacing:-.02em;margin:26px 0 30px;text-wrap:balance}
.sub{font-size:30px;color:${t.muted};margin:0 0 30px}
.stats{display:flex;gap:48px;border-top:1px solid ${t.line};padding-top:26px}
.stat{flex:1}
.num{font-size:66px;color:${t.accent};line-height:1;font-variant-numeric:tabular-nums}
.lab{font-size:25px;color:${t.muted};line-height:1.3;margin-top:10px}
</style><div class="brand">${owl}<span>HaloForge Labs · Halowin Bubo</span></div>
<h1>The most intelligence a laptop can fit</h1>
<p class="sub">Qwen3.8 Flash Next, 125B parameters, on a Windows laptop.</p>
<div class="stats">${stats.map(s => `<div class="stat"><div class="num">${s[0]}</div><div class="lab">${s[1]}</div></div>`).join('')}</div>`;

const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--disable-gpu'] });
try {
  for (const t of Object.values(themes)) {
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
    await page.setContent(html(t));
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: t.file });
    await page.close();
  }
} finally { await browser.close(); }
