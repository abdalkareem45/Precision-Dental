import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { after, before, test } from 'node:test';
import { chromium } from 'playwright';
import { browserOptions, previewPrefix, startPreviewServer } from './preview-server.mjs';

const modules = JSON.parse(await readFile(new URL('./modules.json', import.meta.url), 'utf8'));
let server;
let browser;
before(async () => {
  server = await startPreviewServer();
  browser = await chromium.launch(browserOptions);
});
after(async () => {
  await browser?.close();
  await server?.close();
});

test('landing page uses compiled styles and accessible links on mobile', { timeout: 45_000 }, async () => {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  try {
    await page.goto(`${server.origin}${previewPrefix}index.html`);
    assert.equal(await page.locator('#subjects-grid > a').count(), 9);
    assert.equal(await page.evaluate(() => getComputedStyle(document.body).backgroundColor), 'rgb(250, 248, 243)');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false);
    const endodontics = page.locator('#subjects-grid > a').filter({ hasText: 'Endodontics' });
    await endodontics.focus();
    await page.keyboard.press('Enter');
    await page.getByRole('heading', { name: 'Endodontics', exact: true }).waitFor();
  } finally {
    await page.close();
  }
});

test('standalone Periodontics mechanics page uses local production styles', { timeout: 45_000 }, async () => {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'warning') errors.push(message.text()); });
  try {
    await page.goto(`${server.origin}${previewPrefix}perio-1-2-3-4-5-6-7-8--main/periodontics-mechanics.html`);
    await page.getByRole('heading', { name: /Periodontics by Kareem/ }).waitFor();
    assert.equal(await page.evaluate(() => getComputedStyle(document.body).backgroundColor), 'rgb(6, 10, 18)');
    assert.deepEqual(errors, []);
  } finally {
    await page.close();
  }
});

for (const module of modules) {
  test(`${module.name} production entry renders without runtime errors`, { timeout: 45_000 }, async () => {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = [];
    const warnings = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => {
      if (message.type() === 'warning') warnings.push(message.text());
    });
    page.on('response', response => {
      if (response.url().startsWith(server.origin) && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
    });
    try {
      await page.goto(`${server.origin}${previewPrefix}${module.directory}/index.html`, { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => (document.getElementById('root')?.innerText.trim().length ?? 0) > 30);
      // Allow initial effects, canvas setup, and a few animation frames to execute.
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      assert.deepEqual(errors, [], `${module.name}: runtime/local-asset errors`);
      assert.deepEqual(warnings, [], `${module.name}: browser warnings`);
    } finally {
      await page.close();
    }
  });
}
