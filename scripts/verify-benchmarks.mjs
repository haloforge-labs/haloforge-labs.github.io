import { chromium } from 'playwright';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';

const evidence = path.resolve('evidence/benchmark-20261010');
const temp = path.resolve('.tmp');
await mkdir(temp, { recursive: true });
process.env.TEMP = temp;
process.env.TMP = temp;
const base = 'http://127.0.0.1:4321';
const errors = [];
const checks = [];
const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--disable-gpu'] });
const routes = [['/', 'home'], ['/bubo/', 'bubo'], ['/docs/benchmarks/', 'benchmarks']];
const forbidden = /\bB(?:4d|5c|6(?:\.1)?)\b|1,372|1,674|1,825|35\.5|78\.2|78 tok\/s|77\.9|89[–-]97|8 users|4 users|sub-agents|1,700\.52|91\.0|\bbeats\b|reasoning-check/i;
const hold = '<!-- MULTI-USER HOLD: restore after the diagnostic -->';
try {
  for (const theme of ['light', 'dark']) {
    for (const [label, width, height] of [['desktop', 1440, 1000], ['phone', 390, 844]]) {
      const context = await browser.newContext({ viewport: { width, height }, colorScheme: theme, reducedMotion: 'reduce' });
      await context.addInitScript(theme => localStorage.setItem('starlight-theme', theme), theme);
      const page = await context.newPage();
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
      page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
      page.on('requestfailed', request => errors.push(`Failed asset: ${request.url()}`));
      for (const [route, name] of routes) {
        const response = await page.goto(base + route, { waitUntil: 'networkidle' });
        await page.evaluate(() => document.fonts.ready);
        const text = await page.locator('main').innerText();
        const info = await page.evaluate(() => ({
          theme: document.documentElement.dataset.theme,
          overflow: document.documentElement.scrollWidth > innerWidth,
          columns: document.querySelector('.benchmark-strip') ? getComputedStyle(document.querySelector('.benchmark-strip')).gridTemplateColumns.split(' ').length : null,
          tiles: [...document.querySelectorAll('.benchmark-value')].map(el => el.textContent.trim().replace(/\s+/g, ' ')),
          headings: [...document.querySelectorAll('main h2')].map(el => el.textContent.trim()),
          tables: document.querySelectorAll('main table').length,
          font: document.querySelector('.benchmark-value') ? getComputedStyle(document.querySelector('.benchmark-value')).fontFamily : null,
          colour: document.querySelector('.benchmark-value') ? getComputedStyle(document.querySelector('.benchmark-value')).color : null,
        }));
        const key = `${name}-${theme}-${label}`;
        if (!response?.ok()) errors.push(`${key}: document failed`);
        if (info.theme !== theme) errors.push(`${key}: wrong theme`);
        if (info.overflow) errors.push(`${key}: horizontal overflow`);
        if (forbidden.test(text)) errors.push(`${key}: forbidden copy: ${text.match(forbidden)?.[0]}`);
        if (name === 'home' && JSON.stringify(info.tiles) !== JSON.stringify(['1,325', '51–55', 'up to 93.8', '51.6'])) errors.push(`${key}: headline order`);
        if (name === 'home' && info.columns !== (label === 'desktop' ? 4 : 2)) errors.push(`${key}: strip layout`);
        if (name === 'bubo' && (info.tiles.length !== 6 || info.columns !== (label === 'desktop' ? 3 : 1))) errors.push(`${key}: six-number layout`);
        if (name === 'benchmarks' && info.tables !== 5) errors.push(`${key}: table count`);
        if (name !== 'home') {
          const html = await response.text();
          if (!html.includes(hold)) errors.push(`${key}: missing hold comment`);
          if (!html.includes('HEADLINE-NUMBERS-B61-20261010-1947.md')) errors.push(`${key}: missing source comments`);
          if (!text.includes('power not stated') || !text.includes('level with')) errors.push(`${key}: comparison wording`);
        }
        for (const link of await page.locator('main a[href^="/"]').all()) {
          const href = await link.getAttribute('href');
          const result = await context.request.get(base + href);
          if (!result.ok()) errors.push(`${key}: broken link ${href}`);
        }
        const screenshot = `${key}.png`;
        await page.screenshot({ path: path.join(evidence, screenshot), fullPage: true });
        checks.push({ route, viewport: `${width}x${height}`, screenshot, ...info });
        console.log(`Checked ${key}`);
      }
      await context.close();
    }
  }
  for (const item of JSON.parse(await readFile(path.join(evidence, 'baseline-hashes.json'), 'utf8'))) {
    if (!['src/components/Brand.astro', 'src/components/Owl.astro', 'src/layouts/SiteLayout.astro', 'src/pages/404.astro'].includes(item.path)) continue;
    const hash = createHash('sha256').update(await readFile(item.path)).digest('hex').toUpperCase();
    if (hash !== item.sha256) errors.push(`Branding changed: ${item.path}`);
    checks.push({ preserved: item.path, hashMatch: hash === item.sha256 });
  }
} catch (error) { errors.push(error.stack || error.message); }
finally {
  await browser.close();
  const report = { checkedAt: new Date().toISOString(), browser: 'Headless Microsoft Edge via Playwright', checks, errors };
  await writeFile(path.join(evidence, 'verification.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ errors, checks: checks.length }));
  if (errors.length) process.exitCode = 1;
}
