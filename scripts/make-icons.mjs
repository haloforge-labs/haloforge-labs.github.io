import { chromium } from 'playwright';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

await mkdir('.tmp', { recursive: true });
await mkdir('evidence', { recursive: true });
process.env.TEMP = path.resolve('.tmp');
process.env.TMP = path.resolve('.tmp');
const svg = await readFile('public/favicon.svg', 'utf8');
const owl = await readFile('public/owl.svg', 'utf8');
const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--disable-gpu'] });
try {
  for (const size of [16, 32, 180]) {
    const page = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
    await page.setContent(`<style>html,body{margin:0;background:#faf8f1}svg{display:block;width:100vw;height:100vh}</style>${svg}`);
    await page.screenshot({ path: size === 180 ? 'public/apple-touch-icon.png' : `public/favicon-${size}.png` });
    await page.close();
  }
  const page = await browser.newPage({ viewport: { width: 760, height: 440 }, deviceScaleFactor: 1 });
  const html = `<!doctype html><html lang="en"><meta charset="utf-8"><title>Owl icon check</title><style>body{margin:0;padding:32px;background:#faf8f1;color:#222;font:16px Georgia,serif}h1{font-size:24px;font-weight:400}main{display:flex;align-items:center;gap:40px}figure{margin:0}figcaption{margin-top:12px}img{display:block}.large{image-rendering:pixelated}.transparent{background:white}svg{width:96px;height:96px}</style><h1>Owl icon check</h1><main><figure><img src="/favicon-16.png" width="16" height="16"><figcaption>16 px</figcaption></figure><figure><img src="/favicon-32.png" width="32" height="32"><figcaption>32 px</figcaption></figure><figure><img class="large" src="/favicon-32.png" width="192" height="192"><figcaption>32 px enlarged</figcaption></figure><figure><img src="/apple-touch-icon.png" width="120" height="120"><figcaption>Apple icon</figcaption></figure><figure class="transparent">${owl}<figcaption>Transparent</figcaption></figure></main>`;
  await writeFile('evidence/favicon-close-up.html', html);
  execFileSync('python', ['-c', "from PIL import Image; Image.open('public/favicon-32.png').save('public/favicon.ico', sizes=[(16,16),(32,32)])"]);
} finally { await browser.close(); }
