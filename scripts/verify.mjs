import { chromium } from 'playwright';
import { readdir, mkdir, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';

const base = 'http://127.0.0.1:4321';
const evidence = path.resolve('evidence');
const temp = path.resolve('.tmp');
await mkdir(evidence, { recursive: true });
await mkdir(temp, { recursive: true });
process.env.TEMP = temp;
process.env.TMP = temp;
const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--disable-gpu'] });
const errors = [];
const checks = [];
const fontRequests = new Set();
const screenshotRoutes = new Map([['/', 'home'], ['/bubo/', 'bubo'], ['/docs/', 'docs-overview'], ['/docs/system-setup/', 'system-setup'], ['/404.html', '404']]);
const routes = [];
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full);
    else if (entry.name.endsWith('.html')) {
      const relative = path.relative('dist', full).replaceAll('\\', '/');
      routes.push(relative === '404.html' ? '/404.html' : '/' + relative.replace(/index\.html$/, ''));
    }
  }
}
await walk('dist');
const links = new Set();
try {
  for (const [label, width, height] of [['desktop', 1440, 1000], ['phone', 390, 844]]) {
    const context = await browser.newContext({ viewport: { width, height }, colorScheme: 'light', reducedMotion: 'reduce' });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(`${label}: ${error.message}`));
    page.on('console', msg => { if (msg.type() === 'error') errors.push(`${label}: ${msg.text()}`); });
    page.on('response', response => { if (response.status() >= 400) errors.push(`${label}: HTTP ${response.status()} ${response.url()}`); });
    page.on('request', request => { if (/\.(woff2?|ttf|otf)(\?|$)/i.test(request.url())) fontRequests.add(request.url()); });
    page.on('requestfailed', request => errors.push(`${label}: asset failed ${request.url()}`));
    for (const route of routes) {
      const response = await page.goto(base + route, { waitUntil: 'networkidle' });
      if (!response?.ok()) errors.push(`${label} ${route}: failed document response`);
      await page.evaluate(() => document.fonts.ready);
      const info = await page.evaluate(() => ({
        width: window.innerWidth,
        contentWidth: document.documentElement.scrollWidth,
        headings: [...document.querySelectorAll('h1')].map(x => x.textContent.trim()),
        links: [...document.querySelectorAll('a[href]')].map(x => x.getAttribute('href')),
        fontLoaded: document.fonts.check('700 40px "UnifrakturCook"', 'H'),
        brandFont: getComputedStyle(document.querySelector('.brand-initial')).fontFamily,
        brandWeight: getComputedStyle(document.querySelector('.brand-initial')).fontWeight,
      }));
      if (info.contentWidth > width) errors.push(`${label} ${route}: overflow ${info.contentWidth} > ${width}`);
      if (info.headings.length !== 1) errors.push(`${label} ${route}: expected one h1`);
      if (!info.fontLoaded || !info.brandFont.includes('UnifrakturCook') || info.brandWeight !== '700') errors.push(`${label} ${route}: selected H font did not load`);
      if (await page.locator('link[rel="apple-touch-icon"]').count() !== 1) errors.push(`${label} ${route}: missing Apple icon`);
      if (route === '/404.html' && !textContentIncludes(await page.locator('main').innerText(), 'This page is not here. The owl looked everywhere.')) errors.push(`${label}: missing owl line on 404`);
      for (const href of info.links) if (href.startsWith('/') || href.startsWith('#')) links.add(new URL(href, base + route).href);
      const text = await page.locator('main').innerText();
      if (/lorem ipsum|yourusername/i.test(text)) errors.push(`${label} ${route}: invalid placeholder`);
      if (screenshotRoutes.has(route)) {
        const file = `${screenshotRoutes.get(route)}-${label}.png`;
        await page.screenshot({ path: path.join(evidence, file), fullPage: true });
        checks.push({ route, viewport: `${width}x${height}`, screenshot: file, ...info, links: undefined });
      } else checks.push({ route, viewport: `${width}x${height}`, ...info, links: undefined });
      console.log(`Checked ${label}: ${route}`);
    }
    await page.goto(base + '/');
    await page.getByRole('button', { name: 'Switch colour theme' }).click();
    if (await page.locator('html').getAttribute('data-theme') !== 'dark') errors.push(`${label}: home theme toggle failed`);
    for (const [route, name] of [['/', 'home'], ['/bubo/', 'bubo']]) {
      await page.goto(base + route, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: path.join(evidence, `${name}-dark-${label}.png`), fullPage: true });
    }
    await page.goto(base + '/docs/system-setup/');
    if (await page.locator('html').getAttribute('data-theme') !== 'dark') errors.push(`${label}: docs theme persistence failed`);
    await page.screenshot({ path: path.join(evidence, `system-setup-dark-${label}.png`), fullPage: true });
    if (label === 'phone') {
      const menu = page.locator('button[popovertarget="starlight__sidebar"]');
      await menu.click();
      if (!await page.locator('#starlight__sidebar').evaluate(el => el.matches(':popover-open'))) errors.push('phone: docs menu did not open');
      await page.screenshot({ path: path.join(evidence, 'docs-menu-phone.png'), fullPage: true });
      await page.getByRole('link', { name: 'Profiles', exact: true }).click();
      if (!page.url().endsWith('/docs/profiles/')) errors.push('phone: docs menu navigation failed');
    }
    await context.close();
  }
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, colorScheme: 'light' });
  const page = await context.newPage();
  for (const link of links) {
    const url = new URL(link);
    const response = await context.request.get(url.origin + url.pathname);
    if (!response.ok()) errors.push(`Broken internal link: ${link} (${response.status()})`);
    if (url.hash) {
      await page.goto(url.origin + url.pathname);
      const id = decodeURIComponent(url.hash.slice(1));
      if (!await page.evaluate(id => !!document.getElementById(id), id)) errors.push(`Broken anchor: ${link}`);
    }
  }
  await page.goto(base + '/docs/system-setup/');
  await page.locator('site-search button[data-open-modal]').click();
  await page.locator('.pagefind-ui__search-input').fill('page file');
  await page.locator('.pagefind-ui__result-link').first().waitFor({ state: 'visible', timeout: 15000 });
  const results = await page.locator('.pagefind-ui__result-link').allTextContents();
  if (!results.some(x => x.includes('System setup'))) errors.push('Search: no System setup result for page file');
  await page.screenshot({ path: path.join(evidence, 'docs-search-desktop.png'), fullPage: true });
  checks.push({ searchQuery: 'page file', results, internalLinksChecked: links.size });
  await page.setViewportSize({ width: 760, height: 440 });
  await page.setContent((await readFile('evidence/favicon-close-up.html', 'utf8')).replace('<meta charset="utf-8">', `<meta charset="utf-8"><base href="${base}/">`));
  await page.locator('img').evaluateAll(images => Promise.all(images.map(img => img.decode())));
  await page.screenshot({ path: path.join(evidence, 'favicon-close-up.png') });
  for (const asset of ['/favicon.svg', '/favicon.ico', '/favicon-16.png', '/favicon-32.png', '/apple-touch-icon.png', '/fonts/unifrakturcook-LICENSE.txt', '/fonts/noto-sans-egyptian-hieroglyphs-LICENSE.txt']) {
    const response = await context.request.get(base + asset);
    if (!response.ok()) errors.push(`Icon or licence failed: ${asset}`);
  }
  if ([...fontRequests].some(url => /egyptian|updock/i.test(url))) errors.push('Unused font loaded on site');
  checks.push({ fontRequests: [...fontRequests], iconAndLicenceChecks: true, faviconScreenshot: 'favicon-close-up.png' });
  await context.close();
} catch (error) {
  errors.push(error.stack || error.message);
} finally {
  await browser.close();
  const report = { base, browser: 'Headless Microsoft Edge via Playwright (GPU disabled)', checkedAt: new Date().toISOString(), routes, checks, errors };
  await writeFile(path.join(evidence, 'verification.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
  if (errors.length) process.exitCode = 1;
}
function textContentIncludes(text, expected) { return text.replace(/\s+/g, ' ').includes(expected); }
