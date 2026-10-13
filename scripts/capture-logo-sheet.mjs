import { chromium } from 'playwright';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
await mkdir('.tmp', { recursive: true });
process.env.TEMP = path.resolve('.tmp');
process.env.TMP = path.resolve('.tmp');
const manifest = JSON.parse(await readFile('design/font-manifest.json', 'utf8'));
const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--disable-gpu'] });
const errors = [];
const checks = [];
try {
  for (const [size, width, height] of [['desktop', 1440, 1000], ['phone', 390, 844]]) {
    for (const theme of ['light', 'dark']) {
      const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
      const page = await context.newPage();
      page.on('pageerror', error => errors.push(error.message));
      page.on('requestfailed', request => errors.push(`${size}/${theme}: ${request.url()} ${request.failure()?.errorText}`));
      const url = pathToFileURL(path.resolve('design/logo-candidates.html'));
      url.searchParams.set('theme', theme);
      await page.goto(url.href, { waitUntil: 'load' });
      const fonts = await page.evaluate(async manifest => {
        for (const font of manifest) await document.fonts.load(`${font.weight} 120px "${font.family}"`, font.id.startsWith('noto-') ? '\u{13153}' : 'H');
        await document.fonts.ready;
        return manifest.map(font => ({ family: font.family, loaded: document.fonts.check(`${font.weight} 120px "${font.family}"`, font.id.startsWith('noto-') ? '\u{13153}' : 'H') }));
      }, manifest);
      if (fonts.some(font => !font.loaded)) errors.push(`${size}/${theme}: missing font`);
      const overflow = await page.evaluate(() => [...document.querySelectorAll('.candidate, .brand')].filter(el => el.scrollWidth > el.clientWidth + 1).map(el => el.closest('.candidate').id));
      if (overflow.length) errors.push(`${size}/${theme}: card overflow ${overflow}`);
      const contentWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      if (contentWidth > width) errors.push(`${size}/${theme}: page overflow`);
      if (await page.locator('.candidate').count() !== 11) errors.push('Candidate count differs from 11');
      const file = `logo-candidates-${size}-${theme}.png`;
      await page.screenshot({ path: path.resolve('design', file), fullPage: true });
      checks.push({ width, theme, screenshot: file, fonts, overflow, contentWidth });
      if (size === 'desktop' && theme === 'light') {
        for (let row = 0; row < 6; row++) {
          const first = await page.locator('.candidate').nth(row * 2).boundingBox();
          const second = row < 5 ? await page.locator('.candidate').nth(row * 2 + 1).boundingBox() : first;
          await page.screenshot({ path: path.resolve('.tmp', `logo-review-row-${row + 1}.png`), fullPage: true, clip: { x: 0, y: first.y, width, height: Math.max(first.height, second.height) } });
        }
      }
      await page.getByRole('button').click();
      if (await page.locator('html').getAttribute('data-theme') === theme) errors.push('Theme button failed');
      await context.close();
    }
  }
} finally {
  await browser.close();
  await writeFile('design/verification.json', JSON.stringify({ checkedAt: new Date().toISOString(), checks, errors }, null, 2) + '\n');
}
console.log(JSON.stringify({ screenshots: checks.map(c => c.screenshot), errors }, null, 2));
if (errors.length) process.exitCode = 1;
