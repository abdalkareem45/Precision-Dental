import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { browserOptions, previewPrefix, startPreviewServer } from './preview-server.mjs';

const subjectDirectory = 'f367df11cf62a3147e0a171e3f35c4a0333a68f9';
const source = new URL('../crown/', import.meta.url);
const storageKey = 'precision_dental_cb_lab_v1';
const expectedIds = ['lec1', 'lec2', 'lec3', 'lec-04', 'lec-05', 'lec-06', 'lec-07a', 'lec-07b', 'lec-10a', 'lec-10b', 'lec-11', 'lec-12'];
const expectedHashes = ['1', '2', '3', '4', '5', '6', '7a', '7b', '10a', '10b', '11', '12'].map(id => `#lecture-${id}`);

async function metadata() {
  // Bundle source metadata in memory using Crown's existing compiler dependency.
  const { build } = createRequire(new URL('package.json', source))('esbuild');
  const { outputFiles } = await build({
    stdin: {
      contents: "export { LECTURES } from './src/lectures/virtual-lab/data/lectures'; export { CROWN_LECTURES, lectureHash } from './src/navigation';",
      resolveDir: fileURLToPath(source), loader: 'ts',
    },
    bundle: true, write: false, platform: 'node', format: 'esm',
    define: { 'import.meta.env.BASE_URL': JSON.stringify('./') },
  });
  const result = await import(`data:text/javascript;base64,${Buffer.from(outputFiles[0].contents).toString('base64')}`);
  assert.deepEqual(result.CROWN_LECTURES.map(lecture => lecture.id), expectedIds);
  assert.deepEqual(result.CROWN_LECTURES.map(lecture => result.lectureHash(lecture.id)), expectedHashes);
  assert.equal(result.LECTURES.length, 9);
  return result;
}

test('Crown: long Lecture 7A checklist labels fit narrow screens', { timeout: 30_000 }, async t => {
  const server = await startPreviewServer();
  t.after(server.close);
  const browser = await chromium.launch(browserOptions);
  t.after(() => browser.close());
  const page = await browser.newPage({ viewport: { width: 360, height: 844 } });
  await page.goto(`${server.origin}${previewPrefix}${subjectDirectory}/#lecture-7a`);
  const panel = await tab(page, 'visuals');
  const card = panel.getByRole('article').filter({
    has: page.getByRole('heading', { name: '4 Objectives of Gingival Retraction', exact: true }),
  });
  await card.scrollIntoViewIfNeeded();
  await card.getByText('Dry Field for Hydrophobic Elastomers', { exact: true }).waitFor();
  const fits = await card.evaluate(element => element.scrollWidth <= element.clientWidth + 2);
  assert.ok(fits, 'Long checklist labels wrap within the card instead of overflowing');
  await noOverflow(page, 'Lecture 7A narrow-screen checklist');
});

async function noOverflow(page, label) {
  const overflow = await page.locator('html, body, main, .crown-virtual-lab, [role="tabpanel"], main section, main article').evaluateAll(elements => elements
    .filter(element => element.clientWidth && element.scrollWidth > element.clientWidth + 2)
    .map(element => ({ element: element.id || element.tagName, width: element.clientWidth, scrollWidth: element.scrollWidth })));
  assert.deepEqual(overflow, [], `${label}: horizontal overflow (intentional inner scrollers excluded)`);
}

async function stored(page) {
  return page.evaluate(key => JSON.parse(localStorage.getItem(key)), storageKey);
}

async function tab(page, id) {
  const control = page.locator(`#virtual-lab-tab-${id}`);
  await control.click();
  await page.locator(`#virtual-lab-tab-${id}[aria-selected="true"]`).waitFor();
  const panel = page.locator(`#virtual-lab-panel-${id}`);
  await panel.waitFor();
  assert.equal(await panel.getAttribute('aria-labelledby'), await control.getAttribute('id'));
  return panel;
}

async function exercise3D(page, lecture, representative) {
  const panel = await tab(page, 'lab3d');
  await panel.getByRole('heading', { name: lecture.threeD.title, exact: true }).waitFor();
  const image = panel.getByRole('img', { name: lecture.threeD.accessibleSummary, exact: true });
  const canvas = image.locator('canvas');
  await canvas.waitFor();
  await canvas.scrollIntoViewIfNeeded();
  // A canvas alone also exists before scene construction. Require actual GPU draw
  // calls on this canvas, plus the app's post-render exploration marker.
  await page.waitForFunction(({ id, key }) => {
    const canvas = document.querySelector('#virtual-lab-panel-lab3d canvas');
    return canvas?.width > 0 && canvas?.height > 0 && window.__crownDraws?.get(canvas) > 0
      && JSON.parse(localStorage.getItem(key) || '{}').completed3D?.[id] === true;
  }, { id: lecture.id, key: storageKey });
  assert.equal(await panel.getByText('Interactive 3D Viewport Fallback', { exact: true }).count(), 0);
  for (const name of ['Reset camera', 'Show structure labels', 'Structure layers', 'Next guided tour step']) {
    assert.equal(await panel.getByRole('button', { name, exact: true }).isVisible(), true, `${lecture.id}: ${name}`);
  }
  assert.equal(await panel.getByRole('slider').count(), 2);
  assert.equal(await panel.getByRole('slider', { name: /Explode Layers/ }).count(), 1);
  for (const mode of lecture.threeD.primaryModes) {
    assert.equal(await panel.getByRole('button', { name: mode.label, exact: true }).count(), 1);
  }
  assert.equal(await panel.getByRole('button', { name: lecture.threeD.toggleLabel, exact: true }).count(), 1);
  if (!representative) return;
  await panel.getByRole('button', { name: 'Collapse 3D parameters', exact: true }).click();
  await panel.getByRole('button', { name: 'Next guided tour step', exact: true }).click();
  await panel.getByText(lecture.threeD.guidedTour[0].description, { exact: true }).waitFor();
  await panel.getByRole('button', { name: 'Close', exact: true }).click();
  const labels = panel.getByRole('button', { name: 'Show structure labels', exact: true });
  const before = await labels.getAttribute('aria-pressed');
  await labels.click();
  assert.notEqual(await labels.getAttribute('aria-pressed'), before);
  await panel.getByRole('button', { name: 'Structure layers', exact: true }).click();
  await panel.getByText('Structure Visibility', { exact: true }).waitFor();
  await panel.getByRole('button', { name: lecture.threeD.structureLayers[0].label, exact: true }).click();
  await panel.getByRole('button', { name: 'Structure layers', exact: true }).click();
  const expand = panel.getByRole('button', { name: 'Expand 3D parameters', exact: true });
  if (await expand.count()) await expand.click();
  const slider = panel.getByRole('slider', { name: new RegExp(lecture.threeD.sliderLabel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) });
  await slider.press('End');
  assert.equal(await slider.inputValue(), String(lecture.threeD.sliderMax));
  await panel.getByRole('slider', { name: /Explode Layers/ }).press('End');
  const toggle = panel.getByRole('button', { name: lecture.threeD.toggleLabel, exact: true });
  const toggled = await toggle.getAttribute('aria-pressed');
  await toggle.click();
  assert.notEqual(await toggle.getAttribute('aria-pressed'), toggled);
  if (lecture.threeD.secondaryModes?.length) {
    const variant = panel.getByRole('combobox', { name: 'Secondary material or variant', exact: true });
    const id = lecture.threeD.secondaryModes.at(-1).id;
    await variant.selectOption(id);
    assert.equal(await variant.inputValue(), id);
  }
  await panel.getByRole('button', { name: 'Reset camera', exact: true }).click();
  await panel.getByRole('button', { name: 'Collapse 3D parameters', exact: true }).click();
  await panel.getByRole('button', { name: 'Pause', exact: true }).click();
  await panel.getByRole('button', { name: 'Play', exact: true }).click();
  await panel.getByRole('button', { name: 'Pause', exact: true }).click();
}

async function sandboxes(page, lecture, representative) {
  const panel = await tab(page, 'sandboxes');
  const configs = [lecture.procedureFlow, lecture.clinicalCase, lecture.materialComparison, lecture.diagnosticPlanner];
  assert.equal(await panel.locator('section').count(), 4);
  for (const config of configs) {
    await panel.getByRole('heading', { level: 3, name: config.title, exact: true }).waitFor();
  }
  if (!representative) return;
  const flow = panel.locator('section[aria-labelledby="proc-flow-heading"]');
  await flow.getByRole('button', { name: 'Show Hints', exact: true }).click();
  await flow.getByText(`Hint: ${lecture.procedureFlow.steps[0].hint}`, { exact: true }).waitFor();
  await flow.getByRole('button', { name: 'Check Sequence', exact: true }).click();
  await flow.locator('[aria-live="polite"]').getByText(/steps matched/).waitFor();
  for (const [target, step] of lecture.procedureFlow.steps.entries()) {
    const row = flow.getByRole('listitem').filter({ has: page.getByText(step.title, { exact: true }) });
    const current = await flow.getByRole('listitem').allTextContents();
    const from = current.findIndex(text => text.includes(step.title));
    assert.ok(from >= target);
    for (let index = from; index > target; index--) {
      await row.getByRole('button', { name: `Move "${step.title}" up`, exact: true }).click();
    }
  }
  await flow.getByRole('button', { name: 'Check Sequence', exact: true }).click();
  await flow.getByText(`Sequence Verified: ${lecture.procedureFlow.steps.length}/${lecture.procedureFlow.steps.length} steps in optimal clinical order.`, { exact: true }).waitFor();
  await flow.getByRole('button', { name: 'Reset', exact: true }).click();
  assert.equal(await flow.getByRole('button', { name: 'Show Hints', exact: true }).count(), 1);

  const clinical = panel.locator('section[aria-labelledby="clinical-case-heading"]');
  for (const stage of lecture.clinicalCase.stages) {
    const option = stage.options[0];
    await clinical.getByRole('button', { name: option.label, exact: true }).click();
    await clinical.getByText(option.rationale, { exact: true }).waitFor();
  }
  await clinical.getByRole('button', { name: 'Reset Case', exact: true }).click();
  assert.equal(await clinical.locator('button[aria-pressed="true"]').count(), 0);

  const compare = panel.locator('section[aria-labelledby="mat-compare-heading"]');
  assert.equal(await compare.getByRole('article').count(), 2);
  const item = lecture.materialComparison.items[0];
  await compare.getByRole('button', { name: item.name, exact: true }).click();
  assert.equal(await compare.getByRole('article').count(), 1);
  assert.equal(await compare.getByRole('heading', { name: item.name, exact: true }).count(), 0);
  await compare.getByRole('button', { name: item.name, exact: true }).click();
  assert.equal(await compare.getByRole('article').count(), 2);

  const planner = panel.locator('section[aria-labelledby="diag-planner-heading"]');
  const output = await planner.locator('svg').textContent();
  const option = lecture.diagnosticPlanner.variables[0].options.at(-1);
  await planner.getByRole('button', { name: option.label, exact: true }).click();
  await planner.getByText(option.note, { exact: true }).waitFor();
  assert.notEqual(await planner.locator('svg').textContent(), output, 'Planner updates its rendered quantitative diagram');
  for (const kind of ['flow', 'case', 'compare', 'planner']) {
    assert.equal((await stored(page)).completedSandboxes[`${lecture.id}-${kind}`], true);
  }
}

async function visuals(page, lecture) {
  const panel = await tab(page, 'visuals');
  await panel.getByRole('heading', { name: 'Visual Learning System', exact: true }).waitFor();
  assert.equal(lecture.visualComponents.length, 10);
  assert.equal(await panel.getByRole('article').count(), 10);
  for (const item of lecture.visualComponents) {
    const card = panel.getByRole('article').filter({ has: page.getByRole('heading', { level: 3, name: item.title, exact: true }) });
    assert.equal(await card.count(), 1);
    assert.ok((await card.textContent()).length > item.title.length + 40, `${lecture.id}: ${item.title} has content`);
  }
  const item = lecture.visualComponents.find(item => item.kind === 'hotspot-diagram' && item.hotspots?.length > 1);
  if (item) {
    const card = panel.getByRole('article').filter({ has: page.getByRole('heading', { name: item.title, exact: true }) });
    const spot = item.hotspots[1];
    await card.getByRole('button', { name: `Inspect ${spot.label}`, exact: true }).click();
    await card.getByText(spot.detail, { exact: true }).waitFor();
  }
}

async function quiz(page, lecture) {
  const panel = await tab(page, 'assessment');
  await panel.getByRole('heading', { name: 'Knowledge & 3D Application Check', exact: true }).waitFor();
  const questions = panel.locator('fieldset');
  assert.equal(lecture.quiz.length, 4);
  assert.equal(await questions.count(), 4);
  await panel.getByRole('button', { name: 'Submit Answers', exact: true }).click();
  await panel.getByText('Please select an answer for all 4 questions (0/4 answered).', { exact: true }).waitFor();
  for (const [index, question] of lecture.quiz.entries()) {
    const fieldset = questions.nth(index);
    await fieldset.getByText(question.prompt, { exact: true }).waitFor();
    assert.equal(await fieldset.getByRole('button').count(), question.options.length);
    await fieldset.getByRole('button', { name: question.options[0].text, exact: true }).click();
  }
  await panel.getByRole('button', { name: 'Submit Answers', exact: true }).click();
  const score = lecture.quiz.filter(question => question.options[0].id === question.correctOptionId).length;
  await panel.locator('[aria-live="polite"]').getByText(`Score: ${score}/4 (${Math.round(score / 4 * 100)}%) — Educational self-assessment only; does not establish clinical competence.`, { exact: true }).waitFor();
  assert.equal(await questions.getByRole('button', { disabled: false }).count(), 0);
  for (const [index, question] of lecture.quiz.entries()) {
    await questions.nth(index).getByText(question.options[0].explanation, { exact: true }).waitFor();
  }
  assert.deepEqual((await stored(page)).quizScores[lecture.id], { score, total: 4 });
  await panel.getByRole('button', { name: 'Reset Quiz', exact: true }).click();
  await panel.getByText('Answered: 0/4', { exact: true }).waitFor();
  assert.equal(await questions.locator('button[aria-pressed="true"]').count(), 0);
  assert.equal(await questions.getByRole('button', { disabled: true }).count(), 0);
  // Reset clears this attempt, not the explicitly labelled last recorded result.
  await panel.getByText(`Last Recorded: ${score}/4 (${Math.round(score / 4 * 100)}%)`, { exact: true }).waitFor();
}

async function dashboard(page, progress) {
  const trigger = page.getByRole('button', { name: /^Open progress dashboard/ });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Precision Dental · Virtual Lab Progress Summary', exact: true });
  await dialog.waitFor();
  if (progress) {
    const metrics = [
      ['3D Sandboxes', `${Object.keys(progress.completed3D).length}/9`],
      ['2D Sandboxes', `${Object.keys(progress.completedSandboxes).length}/36`],
      ['Visual Libraries', `${Object.keys(progress.visitedVisuals).length}/9`],
      ['Quizzes Recorded', `${Object.keys(progress.quizScores).length}/9`],
    ];
    for (const [name, value] of metrics) {
      await dialog.getByText(name, { exact: true }).locator('..').getByText(value, { exact: true }).waitFor();
    }
  }
  const close = dialog.getByRole('button', { name: 'Close progress overview', exact: true });
  assert.equal(await close.evaluate(element => element === document.activeElement), true);
  await close.press('Shift+Tab');
  assert.equal(await dialog.getByRole('button', { name: 'Done', exact: true }).evaluate(element => element === document.activeElement), true);
  await page.keyboard.press('Tab');
  assert.equal(await close.evaluate(element => element === document.activeElement), true);
  assert.equal(await dialog.getByRole('button', { name: /^Open Lecture / }).count(), 9);
  await page.keyboard.press('Escape');
  await dialog.waitFor({ state: 'detached' });
  assert.equal(await trigger.evaluate(element => element === document.activeElement), true);
  await trigger.click();
  await dialog.getByRole('button', { name: 'Done', exact: true }).click();
  await dialog.waitFor({ state: 'detached' });
}

// Serialized by the caller alongside the other browser suites. No fixed sleeps,
// unbounded servers, extra dependencies, or writes to the built site are needed.
test('Crown: original lectures and nine virtual labs on desktop and mobile', { timeout: 240_000 }, async t => {
  const { LECTURES, CROWN_LECTURES, lectureHash } = await metadata();
  const server = await startPreviewServer();
  t.after(server.close);
  const browser = await chromium.launch({ ...browserOptions, timeout: 20_000 });
  t.after(() => browser.close());
  const subjectUrl = `${server.origin}${previewPrefix}${subjectDirectory}/index.html`;
  const checkedPdfs = new Set();

  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
    await t.test(`${viewport.width}px: content, rendering, controls, progress and navigation`, async t => {
      const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
      const page = await context.newPage();
      page.setDefaultTimeout(30_000);
      page.setDefaultNavigationTimeout(30_000);
      const errors = [], warnings = [];
      t.after(async () => {
        await context.close();
        assert.deepEqual({ errors, warnings }, { errors: [], warnings: [] }, 'Runtime failures, browser warnings, or failed local requests');
      });
      page.on('pageerror', error => errors.push(error.stack || error.message));
      page.on('console', message => {
        const { url, lineNumber, columnNumber } = message.location();
        const diagnostic = `${message.text()} [${url || '(unknown location)'}:${lineNumber + 1}:${columnNumber + 1}; page: ${page.url()}]`;
        if (message.type() === 'error') errors.push(diagnostic);
        if (message.type() === 'warning') warnings.push(diagnostic);
      });
      page.on('response', response => {
        if (new URL(response.url()).origin === server.origin && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
      });
      page.on('requestfailed', request => {
        if (new URL(request.url()).origin === server.origin) errors.push(`${request.failure()?.errorText} ${request.url()}`);
      });
      await context.addInitScript(() => {
        window.__crownDraws = new WeakMap();
        for (const Type of [window.WebGLRenderingContext, window.WebGL2RenderingContext]) {
          if (!Type) continue;
          for (const name of ['drawArrays', 'drawElements', 'drawArraysInstanced', 'drawElementsInstanced']) {
            const original = Type.prototype[name];
            if (!original) continue;
            Type.prototype[name] = function (...args) {
              const result = original.apply(this, args);
              window.__crownDraws.set(this.canvas, (window.__crownDraws.get(this.canvas) || 0) + 1);
              return result;
            };
          }
        }
      });
      const select = page.getByRole('combobox', { name: 'Select lecture', exact: true });
      async function ready(lecture) {
        await page.getByRole('heading', { level: 2, name: lecture.title, exact: true }).waitFor();
        assert.equal(await select.inputValue(), lecture.id);
        assert.equal(new URL(page.url()).hash, lectureHash(lecture.id));
        await page.waitForFunction(title => document.title === title, `${lecture.numberLabel}: ${lecture.title} | Precision Dental`);
      }
      await page.goto(subjectUrl, { waitUntil: 'domcontentloaded' });
      await page.getByRole('heading', { level: 1, name: 'Crown & Bridge', exact: true }).waitFor();
      assert.equal(await select.inputValue(), 'overview');
      assert.deepEqual(await select.locator('option').evaluateAll(options => options.map(option => option.value)), ['overview', ...expectedIds]);
      assert.equal(await page.locator('main a').count(), 12);
      for (const lecture of CROWN_LECTURES) assert.equal(await page.locator(`main a[href="${lectureHash(lecture.id)}"]`).count(), 1);
      await noOverflow(page, 'Overview');

      const foundations = [
        { number: 1, title: 'Lecture 1: Crown & Bridge Fundamentals', initial: 'Prosthodontics & Its Branches', button: '4. Bridges & Components', next: 'Fixed Partial Denture (Bridge)' },
        { number: 2, title: 'Lecture 2: Evaluation of Abutment Teeth', initial: 'Evaluation of Abutment Teeth', button: '3. Axial Tilt Simulator', next: 'Axial Tilt Simulator' },
        { number: 3, title: "Lecture 3: Periodontal Support & Ante's Law", initial: 'Gingivo-Periodontal Complex', button: '2. PDL Stress Visualizer', next: 'PDL Stress Visualizer' },
      ];
      for (const item of foundations) {
        await page.goto(`${subjectUrl}#lecture-${item.number}`, { waitUntil: 'domcontentloaded' });
        await page.getByRole('heading', { level: 2, name: item.title, exact: true }).waitFor();
        await page.getByRole('heading', { level: 3, name: item.initial, exact: true }).waitFor();
        assert.equal(await select.inputValue(), `lec${item.number}`);
        await page.getByRole('button', { name: item.button, exact: true }).click();
        await page.getByRole('heading', { level: 3, name: item.next, exact: true }).waitFor();
        if (item.number > 1) {
          await page.getByRole('slider').press('End');
          await page.getByText(item.number === 2 ? /Severe angulation\. High risk/ : 'High Stress / Overload', { exact: item.number === 3 }).waitFor();
        }
        assert.equal(new URL(page.url()).hash, `#lecture-${item.number}`, 'Subsection controls preserve original lecture hashes');
        await noOverflow(page, `Original lecture ${item.number}`);
      }

      for (const [index, lecture] of LECTURES.entries()) {
        await select.selectOption(lecture.id);
        await ready(lecture);
        assert.equal(await page.getByRole('tablist', { name: 'Lecture learning modules', exact: true }).getByRole('tab').count(), 4);
        const pdf = page.getByRole('link', { name: 'Open source lecture PDF (new tab)', exact: true });
        const url = new URL(await pdf.getAttribute('href'), page.url());
        assert.equal(url.origin, server.origin);
        assert.equal(url.href, new URL(lecture.sourcePdf, subjectUrl).href, `${lecture.id}: correct source PDF`);
        assert.ok(url.pathname.startsWith(`${previewPrefix}${subjectDirectory}/assets/crown-virtual-lab/`), `Subject-prefixed PDF: ${url}`);
        assert.match(url.pathname, /\.pdf$/i);
        assert.equal(await pdf.getAttribute('target'), '_blank');
        if (!checkedPdfs.has(url.href)) {
          const response = await context.request.get(url.href, { timeout: 10_000 });
          assert.equal(response.status(), 200);
          assert.equal((await response.body()).subarray(0, 5).toString(), '%PDF-');
          await response.dispose();
          checkedPdfs.add(url.href);
        }
        await exercise3D(page, lecture, index === 0);
        await noOverflow(page, `${lecture.id}: 3D`);
        await sandboxes(page, lecture, index === 0);
        await noOverflow(page, `${lecture.id}: 2D`);
        await visuals(page, lecture);
        await noOverflow(page, `${lecture.id}: visuals`);
        await quiz(page, lecture);
        await noOverflow(page, `${lecture.id}: assessment`);
      }
      const progress = await stored(page);
      await dashboard(page, progress);
      assert.equal(Object.keys(progress.completed3D).length, 9);
      assert.equal(Object.keys(progress.visitedVisuals).length, 9);
      assert.equal(Object.keys(progress.quizScores).length, 9);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await ready(LECTURES.at(-1));
      await page.getByRole('button', { name: 'Submit Answers', exact: true }).waitFor();
      assert.deepEqual(await stored(page), progress, 'Progress survives reload');
      await dashboard(page, progress);

      await select.selectOption(LECTURES[0].id);
      await ready(LECTURES[0]);
      await page.getByRole('button', { name: 'Next lecture', exact: true }).click();
      await ready(LECTURES[1]);
      await page.goBack();
      await ready(LECTURES[0]);
      await page.goForward();
      await ready(LECTURES[1]);
      await page.getByRole('button', { name: 'Previous lecture', exact: true }).click();
      await ready(LECTURES[0]);
      const assessment = page.locator('#virtual-lab-tab-assessment');
      await assessment.focus();
      await assessment.press('ArrowLeft');
      await page.locator('#virtual-lab-tab-visuals[aria-selected="true"]').waitFor();
      assert.equal(await page.locator('#virtual-lab-tab-visuals').evaluate(element => element === document.activeElement), true);

      if (viewport.width === 1440) {
        for (const raw of ['{broken json', JSON.stringify({ activeSection: 'assessment', completed3D: { bogus: true }, completedSandboxes: ['lec-04-flow'], visitedVisuals: null, quizScores: { 'lec-04': { score: 99, total: 4 } }, showDashboard: true })]) {
          await page.evaluate(({ key, raw }) => localStorage.setItem(key, raw), { key: storageKey, raw });
          await page.reload({ waitUntil: 'domcontentloaded' });
          await ready(LECTURES[0]);
          const expectedSection = raw === '{broken json' ? 'lab3d' : 'assessment';
          await page.locator(`#virtual-lab-tab-${expectedSection}[aria-selected="true"]`).waitFor();
          assert.equal(await page.getByRole('dialog').count(), 0, 'Transient dashboard state is never hydrated');
          await tab(page, 'assessment');
          const clean = await stored(page);
          assert.deepEqual(clean.quizScores, {});
          assert.deepEqual(clean.completedSandboxes, {});
          assert.deepEqual(clean.visitedVisuals, {});
          assert.equal(clean.completed3D.bogus, undefined);
          await dashboard(page);
        }
      }
      await page.getByRole('button', { name: /^Open progress dashboard/ }).click();
      const dialog = page.getByRole('dialog');
      await dialog.getByRole('button', { name: `Open ${LECTURES.at(-1).numberLabel}: ${LECTURES.at(-1).title}`, exact: true }).click();
      await ready(LECTURES.at(-1));
      await dialog.waitFor({ state: 'detached' });
      await page.getByRole('button', { name: /^Open progress dashboard/ }).click();
      await dialog.getByRole('button', { name: 'Reset All Progress', exact: true }).click();
      await dialog.waitFor({ state: 'detached' });
      const reset = await stored(page);
      assert.equal(reset.activeSection, 'lab3d');
      for (const key of ['completedSandboxes', 'quizScores', 'visitedVisuals']) assert.deepEqual(reset[key], {});
      // Reset returns to 3D: its first real render can immediately record this
      // lecture again. It must never restore another lecture's exploration.
      assert.ok(Object.keys(reset.completed3D).every(id => id === LECTURES.at(-1).id));

      const allLectures = page.locator('header').getByRole('link', { name: 'All lectures', exact: true });
      assert.equal(await allLectures.getAttribute('href'), '#');
      await allLectures.click();
      await page.getByRole('heading', { level: 1, name: 'Crown & Bridge', exact: true }).waitFor();
      assert.equal(await select.inputValue(), 'overview');
      assert.ok(['', '#'].includes(new URL(page.url()).hash));
      assert.equal(await allLectures.getAttribute('aria-current'), 'page');
      const allSubjects = page.locator('header').getByRole('link', { name: 'All subjects', exact: true });
      assert.equal(await allSubjects.getAttribute('href'), '../index.html');
      await allSubjects.click();
      await page.locator('#subjects-grid').waitFor();
      assert.equal(page.url(), `${server.origin}${previewPrefix}index.html`);
    });
  }
});
