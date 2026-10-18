import assert from 'node:assert/strict';

import test from 'node:test';
import { chromium } from 'playwright';

import { browserOptions, previewPrefix as prefix, startPreviewServer } from './preview-server.mjs';

// Serve a repository prefix as Pages does, not just a localhost domain root.
test('Endodontics lectures work on desktop and mobile under a repository prefix', { timeout: 120_000 }, async t => {
  const server = await startPreviewServer();
  t.after(server.close);
  const { origin } = server;
  const subjectUrl = `${origin}${prefix}endo-1-main/index.html`;
  const browser = await chromium.launch(browserOptions);
  t.after(() => browser.close());
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => {
    if (response.url().startsWith(origin) && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
  });
  page.on('requestfailed', request => {
    if (request.url().startsWith(origin)) errors.push(`${request.failure()?.errorText} ${request.url()}`);
  });

  await page.goto(`${origin}${prefix}subject.html?id=endo-1-main`);
  await page.getByRole('heading', { name: 'Endodontics', exact: true }).waitFor();
  const subjectNavigation = page.getByRole('navigation', { name: 'Endodontics lectures' });
  await subjectNavigation.getByRole('link', { name: 'Lecture 2', exact: true }).click();
  await page.getByRole('heading', { name: 'Pulpal Neurophysiology & Nociception', exact: true }).waitFor();
  assert.equal(new URL(page.url()).hash, '#lecture-2');
  await page.reload();
  await page.getByRole('heading', { name: 'Pulpal Neurophysiology & Nociception', exact: true }).waitFor();

  async function topic(name) {
    const toggle = page.getByRole('button', { name: 'Toggle Lecture 2 topics' });
    if (await toggle.isVisible()) {
      if (await toggle.getAttribute('aria-expanded') !== 'true') await toggle.click();
      await page.locator('#lecture-2-mobile-topics').getByRole('button', { name }).click();
      assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
    } else {
      await page.getByRole('navigation', { name: 'Lecture 2 topics' }).getByRole('button', { name }).click();
    }
  }

  // Visit every section so lazy UI/rendering errors are caught.
  for (const name of [/Pharmacology/, /Mandibular/, /Maxillary/, /Referred/, /Visualizer/, /Clinical Sims/, /Quiz Engine/]) {
    await topic(name);
    assert.ok((await page.locator('main').innerText()).length > 100, `Empty topic ${name}`);
  }

  async function setRange(slider, value) {
    const min = Number(await slider.getAttribute('min'));
    const step = Number(await slider.getAttribute('step') ?? 1);
    await slider.press('Home');
    for (let current = min; current < value; current += step) await slider.press('ArrowRight');
  }

  await topic(/Maxillary/);
  const timeline = page.getByRole('slider', { name: 'Procedure elapsed time in minutes' });
  await setRange(timeline, 0);
  await page.getByText('ONSET PENDING (3–5 min)', { exact: true }).waitFor();
  await setRange(timeline, 5);
  await page.getByText('25 minutes remaining', { exact: true }).waitFor();
  await setRange(timeline, 30);
  await page.getByText('EXPIRED - Sensation Returning!', { exact: true }).waitFor();

  await topic(/Visualizer/);
  await page.getByRole('button', { name: 'Neurogenic Inflammation: ACTIVE', exact: true }).click();
  const pressure = page.getByRole('slider', { name: 'Intrapulpal pressure in mmHg' });
  await setRange(pressure, 10);
  const cFiber = page.locator('div').filter({ has: page.getByText('C-Fibers Response:', { exact: true }) }).filter({ hasText: 'NEGATIVE' });
  assert.ok(await cFiber.count() > 0);
  await setRange(pressure, 30);
  const response = page.getByText('C-Fibers Response:', { exact: true }).locator('..');
  assert.ok((await response.innerText()).includes('POSITIVE'));
  await page.getByRole('button', { name: 'Pause', exact: true }).click();
  const trace = page.locator('svg[viewBox="0 0 300 40"] circle').first();
  const position = await trace.getAttribute('cx');
  await page.waitForTimeout(150);
  assert.equal(await trace.getAttribute('cx'), position, 'Paused oscilloscope marker must not move');
  await page.getByRole('button', { name: 'Run', exact: true }).click();
  await topic(/Quiz Engine/);

  const exam = page.getByRole('button', { name: 'Submit Exam & View Rationale' });
  assert.equal(await exam.isDisabled(), true);
  const answers = [
    'C fibers',
    'Lower tissue pH (5-6) inhibits the conversion to the lipid-soluble free-base form needed to cross the nerve sheath.',
    '3.6 mL (two cartridges)',
    'Intraosseous (Stabident IO) anesthesia',
    'Electric pulp testing (EPT) or cold testing showing a negative response',
  ];
  for (const answer of answers) await page.getByRole('button').filter({ hasText: answer }).click();
  await exam.click();
  await page.getByText('5 / 5', { exact: true }).waitFor();
  await page.getByRole('button', { name: 'Retake Knowledge Check' }).click();
  assert.equal(await exam.isDisabled(), true);

  await topic(/Clinical Sims/);
  const decision = page.getByRole('button', { name: 'Submit Clinical Decision' });
  assert.equal(await decision.isDisabled(), true);
  await page.getByRole('button').filter({ hasText: 'Akinosi-Vazirani Closed-Mouth V3 Block' }).click();
  await decision.click();
  await page.getByText('Correct Clinical Protocol!', { exact: true }).waitFor();
  await page.getByRole('button', { name: 'Try Again' }).click();
  assert.equal(await decision.isDisabled(), true);
  await page.getByRole('button').filter({ hasText: "The 'Hot Tooth' Failure" }).click();
  assert.equal(await decision.isDisabled(), true);

  await subjectNavigation.getByRole('link', { name: 'Lecture 1', exact: true }).click();
  await page.getByRole('button', { name: '3D Blueprint', exact: true }).waitFor();
  await page.getByRole('button', { name: 'Lecture Notes', exact: true }).click();
  assert.ok((await page.locator('body').innerText()).includes('Lecture 1'));
  await subjectNavigation.getByRole('link', { name: 'Endodontics', exact: true }).click();
  await page.getByRole('heading', { name: 'Endodontics', exact: true }).waitFor();
  await page.goBack();
  assert.equal(new URL(page.url()).hash, '#lecture-1');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${subjectUrl}#lecture-2`);
  await page.getByRole('heading', { name: 'Pulpal Neurophysiology & Nociception', exact: true }).waitFor();
  for (const name of [/Neurophysiology/, /Pharmacology/, /Mandibular/, /Maxillary/, /Referred/, /Fiber/, /Clinical Anesthesia Simulator/, /Knowledge Check/]) {
    await topic(name);
    const overflow = await page.evaluate(() => [...document.querySelectorAll('main, header')]
      .filter(element => element.scrollWidth > element.clientWidth + 2)
      .map(element => ({
        element: element.tagName,
        width: element.clientWidth,
        scrollWidth: element.scrollWidth,
        children: [...element.querySelectorAll('*')].filter(child => {
          const box = child.getBoundingClientRect();
          return box.right > window.innerWidth + 2 && box.width > 0;
        }).slice(0, 8).map(child => ({ tag: child.tagName, class: child.getAttribute('class'), text: child.textContent?.slice(0, 100) }))
      })));
    assert.deepEqual(overflow, [], `Mobile horizontal overflow in ${name}: ${JSON.stringify(overflow)}`);
  }
  await subjectNavigation.getByRole('link', { name: 'Endodontics', exact: true }).click();
  await page.getByRole('heading', { name: 'Endodontics', exact: true }).waitFor();
  await subjectNavigation.getByRole('link', { name: 'All subjects', exact: true }).click();
  assert.equal(new URL(page.url()).pathname, `${prefix}index.html`);
  assert.deepEqual(errors, [], 'Browser errors or missing local assets');
});
