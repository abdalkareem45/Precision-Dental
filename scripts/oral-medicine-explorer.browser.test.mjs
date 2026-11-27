import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import test from 'node:test';
import { chromium } from 'playwright';
import { previewPrefix, startPreviewServer, browserOptions } from './preview-server.mjs';

test('Oral Medicine Explorer is linked from the launcher and preserves the original course', { timeout: 60_000 }, async t => {
  await access(new URL('../_site/oral-med-explorer/index.html', import.meta.url)).catch(error => {
    throw new Error('Run the full Pages build first: _site/oral-med-explorer/index.html is required', { cause: error });
  });
  const server = await startPreviewServer();
  let browser;
  t.after(async () => {
    try { await browser?.close(); } finally { await server.close(); }
  });
  browser = await chromium.launch({ ...browserOptions, timeout: 20_000 });
  const page = await browser.newPage();
  const errors = [];
  const apiRequests = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => {
    if (new URL(request.url()).origin === server.origin && new URL(request.url()).pathname.includes('/api/')) {
      apiRequests.push(request.url());
    }
  });

  await page.goto(`${server.origin}${previewPrefix}`);
  const originalCourse = page.getByRole('link', { name: /Oral Medicine — Original Lectures/ });
  const explorerCourse = page.getByRole('link', { name: /Oral Medicine Explorer/ });
  await originalCourse.waitFor();
  await explorerCourse.click();
  await page.getByRole('heading', { name: 'Oral Medicine Explorer', exact: true }).waitFor();

  const previousCourse = page.getByRole('link', { name: 'Open the previous lecture collection', exact: true });
  assert.equal(await previousCourse.getAttribute('href'), '../oral-med-12-main/index.html');
  await page.getByRole('button', { name: 'Open AI Clinical Tutor availability', exact: true }).click();
  const notice = page.getByRole('dialog', { name: 'Not available on this static site' });
  await notice.waitFor();
  await notice.getByText('Not available on this static site', { exact: true }).waitFor();
  assert.deepEqual(apiRequests, [], 'Static deployment makes no tutor API requests');
  assert.deepEqual(errors, [], 'Explorer runs without browser errors');
});
