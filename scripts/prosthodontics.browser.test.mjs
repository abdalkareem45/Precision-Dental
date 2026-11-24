import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import { createRequire } from 'node:module';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { browserOptions, previewPrefix, startPreviewServer } from './preview-server.mjs';

const source = new URL('../pros-main/', import.meta.url);
const expectedIds = Array.from({ length: 7 }, (_, index) => `lecture-${index + 4}`);
const sandboxIds = ['sandbox-3d', '2d-anatomy', '2d-builder', '2d-workflow', '2d-diagnostic'];
const tabs = ['01. Anatomy Visual', '02. Design Configurator', '03. Workflow Sequencer', '04. Diagnostic Matrix'];
const root = page => page.locator('.prostho-studio');
const nav = page => page.getByRole('navigation', { name: 'Prosthodontics lectures', exact: true });
const scene = (page, number) => root(page).locator(`#prostho-studio-scene-${number}`);
const button = (scope, name) => scope.getByRole('button', { name, exact: true });
const stored = (page, key) => page.evaluate(key => JSON.parse(localStorage.getItem(key)), key);
const text = (scope, value) => scope.getByText(value, { exact: true });
const escape = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

async function metadata() {
  const { build } = createRequire(new URL('package.json', source))('esbuild');
  const { outputFiles } = await build({
    stdin: {
      contents: `export { LECTURES, createInitialProgress, ACHIEVEMENT_BADGES } from './src/lectures/simulation-studio/data/lectures';
        export { STORAGE_KEY, THEME_STORAGE_KEY } from './src/lectures/simulation-studio/utils/progress';
        export { SOURCE_PDFS, sourcePdfUrl } from './src/lectures/simulation-studio/utils/assets';`,
      resolveDir: fileURLToPath(source), loader: 'ts',
    },
    bundle: true, write: false, platform: 'node', format: 'esm',
    define: { 'import.meta.env.BASE_URL': JSON.stringify('./') },
  });
  const data = await import(`data:text/javascript;base64,${Buffer.from(outputFiles[0].contents).toString('base64')}`);
  assert.deepEqual(data.LECTURES.map(lecture => lecture.id), expectedIds);
  assert.equal(new Set(Object.values(data.SOURCE_PDFS)).size, 5);
  for (const lecture of data.LECTURES) {
    assert.ok(lecture.sandbox2DAnatomy.hotspots.length >= 2, lecture.id);
    assert.ok(lecture.sandbox2DBuilder.options.some(option => option.isRecommendedForPrompt), lecture.id);
    assert.ok(lecture.sandbox2DWorkflow.correctOrder.length > 1, lecture.id);
    assert.ok(lecture.sandbox2DDiagnostic.items.length, lecture.id);
    assert.equal(lecture.clinicalCases.length, 3, lecture.id);
    assert.ok(lecture.quiz.length > 1, lecture.id);
  }
  return data;
}

async function ready(page, lecture) {
  await page.getByRole('heading', { level: 1, name: lecture.title, exact: true }).waitFor();
  await root(page).waitFor();
  await root(page).getByRole('link', { name: 'Source PDF', exact: true }).waitFor();
  assert.equal(new URL(page.url()).hash, `#${lecture.id}`);
  assert.equal(await nav(page).getByRole('link', { name: `Lecture ${lecture.number}`, exact: true }).getAttribute('aria-current'), 'page');
  assert.equal(await root(page).getByRole('heading', { level: 1 }).count(), 0, 'The parent owns the new lecture h1');
}

async function select(page, lecture) {
  await nav(page).getByRole('link', { name: `Lecture ${lecture.number}`, exact: true }).click();
  await ready(page, lecture);
}

async function jump(page, label, number) {
  const trigger = button(root(page).getByRole('navigation', { name: 'Within this lecture', exact: true }), label);
  await trigger.click();
  assert.equal(await trigger.getAttribute('aria-current'), 'step');
  const target = scene(page, number);
  assert.ok(await target.evaluate(element => {
    const box = element.getBoundingClientRect();
    return box.top < innerHeight && box.bottom > 0;
  }), `${label} scrolls into view without changing the lecture hash`);
  return target;
}

async function noOverflow(page, label) {
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  // Inner navs may deliberately scroll; their contents must not widen the document.
  const overflow = await page.locator('html, body, main, nav[aria-label="Prosthodontics lectures"], .prostho-studio, [id^="prostho-studio-scene-"], [role="dialog"] > div')
    .evaluateAll(elements => elements.filter(element => element.getClientRects().length && element.clientWidth && element.scrollWidth > element.clientWidth + 2)
      .map(element => ({ tag: element.tagName, id: element.id, class: element.className, width: element.clientWidth, scroll: element.scrollWidth })));
  assert.deepEqual(overflow, [], `${label}: horizontal overflow ${JSON.stringify(overflow)}`);
}

async function activity(page, data, lecture, field, id) {
  await page.waitForFunction(({ key, lectureId, field, id }) =>
    JSON.parse(localStorage.getItem(key) || '{}')[lectureId]?.[field]?.includes(id),
  { key: data.STORAGE_KEY, lectureId: lecture.id, field, id });
}

async function notCompleted(page, data, lecture, id) {
  assert.ok(!(await stored(page, data.STORAGE_KEY))[lecture.id].completedSandboxes.includes(id), `${lecture.id}: ${id} not awarded for an incorrect/incomplete attempt`);
}

async function changeRange(slider) {
  await slider.scrollIntoViewIfNeeded();
  const before = await slider.inputValue();
  await slider.press(before === await slider.getAttribute('max') ? 'Home' : 'End');
  assert.notEqual(await slider.inputValue(), before);
}

async function renderedCanvas(page, lecture) {
  const canvas = scene(page, 3).locator('canvas');
  assert.equal(await canvas.count(), 1, `${lecture.id}: one WebGL canvas`);
  await canvas.scrollIntoViewIfNeeded();
  await page.waitForFunction(() => {
    const canvas = document.querySelector('.prostho-studio canvas');
    return canvas?.width > 0 && canvas?.height > 0 && window.__prosthoDraws?.get(canvas) > 0;
  }, undefined, { timeout: 12_000 });
  assert.equal(await text(root(page), '3D WebGL Fallback Active').count(), 0, lecture.id);
  return canvas;
}

async function threeD(page, lecture, data) {
  await jump(page, '3D & 2D Lab', 3);
  const canvas = await renderedCanvas(page, lecture);
  const panel = scene(page, 3).locator(':scope > div').filter({ has: page.getByRole('heading', { name: lecture.sandbox3D.title, exact: true }) });
  const beforeDraws = await canvas.evaluate(element => window.__prosthoDraws.get(element));
  await button(panel, 'Occlusal Top').click();
  const ranges = panel.getByRole('slider');
  assert.equal(await ranges.count(), 2);
  await changeRange(ranges.nth(0));
  await changeRange(ranges.nth(1));
  const variant = lecture.sandbox3D.variantOptions.at(-1);
  await button(panel, variant.label).click();
  assert.ok((await panel.innerText()).includes(variant.description), 'Active configuration description updates');
  const layer = button(panel, lecture.sandbox3D.layers[0].label);
  const originalClass = await layer.getAttribute('class');
  await layer.click();
  assert.notEqual(await layer.getAttribute('class'), originalClass, 'Layer visibility control updates');
  await layer.click();
  assert.equal(await layer.getAttribute('class'), originalClass);
  const hotspot = lecture.sandbox3D.hotspots[0];
  await button(panel, hotspot.label).click();
  await text(panel, hotspot.detail).waitFor();
  await page.waitForFunction(count => {
    const canvas = document.querySelector('.prostho-studio canvas');
    return window.__prosthoDraws.get(canvas) > count;
  }, beforeDraws);
  await activity(page, data, lecture, 'completedSandboxes', 'sandbox-3d');
  await button(panel, 'Hide Controls').click();
  assert.equal(await ranges.count(), 0);
  await button(panel, 'Show 3D Controls').click();
  await button(panel, 'Reset 3D view and parameters').click();
  assert.equal(Number(await ranges.nth(0).inputValue()), lecture.sandbox3D.parameterDefault);
  assert.equal(Number(await ranges.nth(1).inputValue()), 0);
}

async function twoD(page, lecture, data, fresh = true) {
  const stage = scene(page, 3);
  const panel = stage.locator(':scope > div').filter({ has: page.getByRole('heading', { name: 'Explore Landmarks, Prosthesis Designs, Workflows & Diagnostics', exact: true }) });
  await panel.getByRole('button', { name: new RegExp(`^${escape(tabs[0])}`) }).click();
  const anatomy = lecture.sandbox2DAnatomy;
  const diagram = panel.getByRole('img', { name: anatomy.title, exact: true });
  for (const [index, hotspot] of anatomy.hotspots.slice(0, 2).entries()) {
    // Locator.press targets the SVG landmark directly, not browser-chrome Tab traversal.
    await diagram.getByRole('button', { name: hotspot.label, exact: true }).press(index ? 'Space' : 'Enter');
    await text(panel, hotspot.clinicalNote).waitFor();
    if (!index && fresh) await notCompleted(page, data, lecture, '2d-anatomy');
  }
  await activity(page, data, lecture, 'completedSandboxes', '2d-anatomy');
  await button(panel, 'primary').click();
  assert.equal(await diagram.getByRole('button').count(), anatomy.hotspots.filter(item => item.category === 'primary').length);
  await button(panel, 'all').click();
  await noOverflow(page, `${lecture.id} anatomy`);

  await panel.getByRole('button', { name: /^02\. Design Configurator/ }).click();
  const builder = lecture.sandbox2DBuilder;
  assert.ok(await button(panel, 'Validate Prosthesis Configuration').isDisabled());
  const wrong = builder.options.find(option => !option.isRecommendedForPrompt);
  const correct = builder.options.find(option => option.isRecommendedForPrompt);
  const choose = option => panel.getByRole('button').filter({ has: text(page, option.label) }).click();
  if (wrong) {
    await choose(wrong);
    await button(panel, 'Validate Prosthesis Configuration').click();
    assert.ok((await panel.getByRole('status').innerText()).includes(builder.feedbackRetry));
    if (fresh) await notCompleted(page, data, lecture, '2d-builder');
  }
  await choose(correct);
  await button(panel, 'Validate Prosthesis Configuration').click();
  assert.ok((await panel.getByRole('status').innerText()).includes(builder.feedbackPass));
  await activity(page, data, lecture, 'completedSandboxes', '2d-builder');
  await noOverflow(page, `${lecture.id} builder feedback`);

  await panel.getByRole('button', { name: /^03\. Workflow Sequencer/ }).click();
  const steps = lecture.sandbox2DWorkflow.correctOrder;
  await button(panel, 'Verify Clinical Sequence').click();
  await text(panel, 'Reorder highlighted steps using the Up/Down controls and verify again.').waitFor();
  if (fresh) await notCompleted(page, data, lecture, '2d-workflow');
  // Read the actual displayed order, then move metadata's next correct step into its slot.
  for (const [target, step] of steps.entries()) {
    const earlier = button(panel, `Move ${step.title} earlier`);
    const names = await panel.getByRole('button', { name: /^Move .+ earlier$/ }).evaluateAll(elements => elements.map(element => element.getAttribute('aria-label')));
    const current = names.indexOf(`Move ${step.title} earlier`);
    assert.ok(current >= target, `${lecture.id}: workflow step exists in the unfixed suffix`);
    for (let index = current; index > target; index--) await earlier.click();
  }
  await button(panel, 'Verify Clinical Sequence').click();
  await text(panel, 'Sequence verified! All clinical steps follow the textbook protocol.').waitFor();
  assert.equal(await text(panel, '· Correct Position').count(), steps.length);
  await activity(page, data, lecture, 'completedSandboxes', '2d-workflow');
  await noOverflow(page, `${lecture.id} workflow feedback`);

  await panel.getByRole('button', { name: /^04\. Diagnostic Matrix/ }).click();
  for (const [index, item] of lecture.sandbox2DDiagnostic.items.entries()) {
    const card = panel.locator('div.rounded-xl').filter({ has: text(page, item.finding) });
    if (!index && item.distractorDiagnoses.length) {
      await button(card, item.distractorDiagnoses[0]).click();
      assert.ok((await card.getByRole('status').innerText()).includes('Re-evaluate:'));
      if (fresh) await notCompleted(page, data, lecture, '2d-diagnostic');
    }
    await button(card, item.correctDiagnosis).click();
    assert.ok((await card.getByRole('status').innerText()).includes(item.management));
    if (fresh && index < lecture.sandbox2DDiagnostic.items.length - 1) await notCompleted(page, data, lecture, '2d-diagnostic');
  }
  await activity(page, data, lecture, 'completedSandboxes', '2d-diagnostic');
  await noOverflow(page, `${lecture.id} diagnostic feedback`);
}

async function assessment(page, lecture, data, negative = false) {
  const cases = await jump(page, 'Cases', 4);
  for (const item of lecture.clinicalCases) {
    await cases.getByRole('button', { name: new RegExp(`^${item.tier}(?:\\s*✓)?$`) }).click();
    await cases.getByRole('heading', { name: item.title, exact: true }).waitFor();
    const wrong = item.options.find(option => !option.isOptimal);
    const correct = item.options.find(option => option.isOptimal);
    const previouslySolved = (await stored(page, data.STORAGE_KEY))[lecture.id].solvedCases.includes(item.id);
    if (wrong) {
      await button(cases, wrong.text).click();
      assert.ok((await cases.getByRole('status').innerText()).includes(wrong.rationale));
      await text(cases, 'Suboptimal Decision').waitFor();
      assert.equal((await stored(page, data.STORAGE_KEY))[lecture.id].solvedCases.includes(item.id), previouslySolved, 'Wrong case answer does not earn completion');
    }
    await button(cases, correct.text).click();
    await text(cases, 'Optimal Clinical Reasoning').waitFor();
    assert.ok((await cases.getByRole('status').innerText()).includes(correct.rationale));
    await activity(page, data, lecture, 'solvedCases', item.id);
    await button(cases, 'Reset Case').click();
    assert.equal(await cases.getByRole('status').count(), 0);
    await activity(page, data, lecture, 'solvedCases', item.id);
  }
  await noOverflow(page, `${lecture.id} cases`);
  const quiz = await jump(page, 'Assessment', 5);
  assert.ok(await button(quiz, 'Submit Assessment').isDisabled());
  if (negative) {
    const previous = (await stored(page, data.STORAGE_KEY))[lecture.id];
    const question = lecture.quiz[0];
    await button(quiz, question.options.find(option => option.id !== question.correctOptionId).text).click();
    await button(quiz, 'Submit Assessment').click();
    await text(quiz, `Score: 0/${lecture.quiz.length} (0%)`).waitFor();
    await page.waitForFunction(({ key, id, attempts }) => JSON.parse(localStorage.getItem(key) || '{}')[id]?.quizAttempts === attempts,
      { key: data.STORAGE_KEY, id: lecture.id, attempts: previous.quizAttempts + 1 });
    assert.equal((await stored(page, data.STORAGE_KEY))[lecture.id].quizBestScore, previous.quizBestScore ?? 0, 'A lower score never replaces the best score');
    assert.equal(await text(quiz, 'Unanswered').count(), lecture.quiz.length - 1);
    for (const question of lecture.quiz) assert.ok((await quiz.innerText()).includes(question.explanation));
    await button(quiz, 'Retry Quiz').click();
  }
  for (const question of lecture.quiz) {
    // Scope by the card containing its first option; prompts contain a rendered Qn prefix.
    const card = quiz.locator('div.rounded-xl').filter({ has: button(page, question.options[0].text) });
    await button(card, question.options.find(option => option.id === question.correctOptionId).text).click();
  }
  await button(quiz, 'Submit Assessment').click();
  await text(quiz, `Score: ${lecture.quiz.length}/${lecture.quiz.length} (100%)`).waitFor();
  for (const question of lecture.quiz) {
    assert.ok((await quiz.innerText()).includes(question.explanation));
    assert.ok(await button(quiz, question.options[0].text).isDisabled());
  }
  await page.waitForFunction(({ key, id }) => JSON.parse(localStorage.getItem(key) || '{}')[id]?.quizBestScore === 100,
    { key: data.STORAGE_KEY, id: lecture.id });
  await noOverflow(page, `${lecture.id} quiz feedback`);
}

async function legacy(page, mobile) {
  for (const number of [1, 2, 3]) {
    await nav(page).getByRole('link', { name: `Lecture ${number}`, exact: true }).click();
    assert.equal(new URL(page.url()).hash, `#lecture-${number}`);
    await root(page).waitFor({ state: 'detached' });
    assert.equal(await root(page).count(), 0);
    if (mobile) await button(page, 'Open navigation').click();
    const sidebar = page.locator('aside:visible');
    const label = ['Bone Height Lab', 'Material Decision Engine', 'Material Wear & VDO Timeline'][number - 1];
    await sidebar.getByRole('button', { name: new RegExp(escape(label)) }).click();
    if (number === 2) {
      await button(page, 'Opposing Natural').click();
      await page.getByRole('heading', { name: 'Acrylic with Gold Occlusals', exact: true }).waitFor();
    } else {
      await changeRange(page.getByRole('slider').first());
      await page.getByText(number === 1 ? 'Residual Bone Height: 26 mm' : 'Time elapsed: 10 Years', { exact: true }).waitFor();
    }
    assert.equal(new URL(page.url()).hash, `#lecture-${number}`, 'Original topic tools retain parent routing');
    await noOverflow(page, `${mobile ? 'Mobile' : 'Desktop'} original lecture ${number}`);
  }
}

test('Prosthodontics: ten-lecture navigation, seven rendered studios, metadata-driven labs and persistent progress', { timeout: 300_000 }, async t => {
  await access(new URL('../_site/pros-main/index.html', import.meta.url)).catch(error => {
    throw new Error('Run the full Pages build first: _site/pros-main/index.html is required', { cause: error });
  });
  const data = await metadata();
  const server = await startPreviewServer();
  let browser;
  let context;
  const errors = [];
  t.after(async () => {
    try { await context?.close(); } finally {
      try { await browser?.close(); } finally { await server.close(); }
    }
    assert.deepEqual(errors, [], 'No browser errors, WebGL failures, failed requests or missing local assets');
  });
  browser = await chromium.launch({ ...browserOptions, timeout: 20_000 });
  context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce', colorScheme: 'light' });
  await context.addInitScript(() => {
    window.__prosthoDraws = new WeakMap();
    for (const Type of [window.WebGLRenderingContext, window.WebGL2RenderingContext]) {
      if (!Type) continue;
      for (const name of ['drawArrays', 'drawElements', 'drawArraysInstanced', 'drawElementsInstanced']) {
        const original = Type.prototype[name];
        if (!original) continue;
        Type.prototype[name] = function (...args) {
          const result = original.apply(this, args);
          const count = name.startsWith('drawArrays') ? args[2] : args[1];
          if (count > 0 && this.getParameter(this.FRAMEBUFFER_BINDING) === null) {
            window.__prosthoDraws.set(this.canvas, (window.__prosthoDraws.get(this.canvas) || 0) + 1);
          }
          return result;
        };
      }
    }
  });
  const page = await context.newPage();
  page.setDefaultTimeout(6_000);
  page.setDefaultNavigationTimeout(15_000);
  page.on('pageerror', error => errors.push(`${page.url()}: ${error.stack || error.message}`));
  page.on('console', message => {
    if (message.location().url === `${server.origin}/favicon.ico` && /Failed to load resource.*404/.test(message.text())) return;
    if (message.type() === 'error' || (message.type() === 'warning' && /WebGL.*(?:lost|error)|too many active WebGL/i.test(message.text()))) {
      errors.push(`${page.url()}: ${message.type()}: ${message.text()}`);
    }
  });
  page.on('response', response => {
    if (new URL(response.url()).origin === server.origin && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
  });
  page.on('requestfailed', request => {
    if (new URL(request.url()).origin === server.origin) errors.push(`${request.failure()?.errorText} ${request.url()}`);
  });
  const subjectUrl = `${server.origin}${previewPrefix}pros-main/index.html`;
  await page.goto(subjectUrl, { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { level: 1, name: 'Prosthodontics', exact: true }).waitFor();
  const allSubjects = nav(page).getByRole('link', { name: 'All subjects', exact: true });
  const subjectsUrl = new URL(await allSubjects.getAttribute('href'), page.url()).href;
  assert.ok(subjectsUrl.startsWith(`${server.origin}${previewPrefix}`));
  for (let number = 1; number <= 10; number++) {
    assert.equal(await nav(page).getByRole('link', { name: `Lecture ${number}`, exact: true }).getAttribute('href'), `#lecture-${number}`);
    assert.equal(await page.locator(`main a[href="#lecture-${number}"]`).count(), 1);
  }
  await noOverflow(page, 'Desktop overview');
  // Seed only unrelated keys, once: never overwrite progress/theme on subsequent reloads.
  const unrelated = { theme: 'light', precision_dental_case_records: '[]', 'prosthodontics-browser-test-unrelated': 'retain-me' };
  await page.evaluate(({ key, unrelated }) => {
    for (const [name, value] of Object.entries(unrelated)) localStorage.setItem(name, value);
    localStorage.setItem(key, 'light');
  }, { key: data.THEME_STORAGE_KEY, unrelated });
  const fetchedPdfs = new Set();
  for (const [index, lecture] of data.LECTURES.entries()) {
    await select(page, lecture);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await ready(page, lecture);
    await page.waitForFunction(key => localStorage.getItem(key) !== null, data.STORAGE_KEY);
    assert.deepEqual((await stored(page, data.STORAGE_KEY))[lecture.id], data.createInitialProgress()[lecture.id], 'Loading a lecture does not earn progress');
    const pdf = root(page).getByRole('link', { name: 'Source PDF', exact: true });
    const href = await pdf.getAttribute('href');
    assert.ok(href.startsWith('./assets/prostho-studio/'), `${lecture.id}: relative Vite base`);
    const url = new URL(href, page.url());
    assert.equal(url.href, new URL(data.sourcePdfUrl(lecture.id), subjectUrl).href);
    assert.equal(await pdf.getAttribute('target'), '_blank');
    assert.ok((await pdf.getAttribute('rel')).includes('noopener'));
    if (!fetchedPdfs.has(url.href)) {
      const response = await context.request.get(url.href, { timeout: 10_000 });
      assert.equal(response.status(), 200, url.href);
      assert.equal((await response.body()).subarray(0, 5).toString(), '%PDF-', 'Source PDF body, not an HTML fallback');
      await response.dispose();
      fetchedPdfs.add(url.href);
    }
    for (const objective of lecture.journeyMap.objectives) await text(scene(page, 1), objective).waitFor();
    await threeD(page, lecture, data);
    await twoD(page, lecture, data);
    await assessment(page, lecture, data, index === 0);
    await jump(page, 'Review', 6);
    await activity(page, data, lecture, 'visitedScenes', 'scene-6');
    assert.equal(new URL(page.url()).hash, `#${lecture.id}`);
  }
  assert.equal(fetchedPdfs.size, 5);
  const earned = await stored(page, data.STORAGE_KEY);
  for (const lecture of data.LECTURES) {
    assert.deepEqual([...earned[lecture.id].completedSandboxes].sort(), [...sandboxIds].sort());
    assert.deepEqual([...earned[lecture.id].solvedCases].sort(), lecture.clinicalCases.map(item => item.id).sort());
    assert.equal(earned[lecture.id].quizBestScore, 100);
    assert.equal(earned[lecture.id].quizAttempts, lecture.id === 'lecture-4' ? 2 : 1);
  }
  await button(root(page), 'Progress').click();
  const dialog = page.getByRole('dialog', { name: 'Prosthodontics Mastery & Achievement Badges', exact: true });
  await dialog.waitFor();
  for (const lecture of data.LECTURES) {
    const row = text(dialog, `Lecture ${lecture.number}: ${lecture.shortTitle}`).locator('..').locator('..');
    assert.ok((await row.innerText()).includes('Sandboxes: 5/5 · Cases: 3/3'));
    assert.ok((await row.innerText()).includes('100%'));
  }
  for (const badge of data.ACHIEVEMENT_BADGES) await text(dialog, `${badge.title} · Unlocked`).waitFor();
  await page.keyboard.press('Escape');
  await dialog.waitFor({ state: 'detached' });

  const first = data.LECTURES[0];
  await select(page, first);
  const parentAppearance = () => page.evaluate(() =>
    [document.documentElement, document.body, document.querySelector('nav[aria-label="Prosthodontics lectures"]'), document.querySelector('h1')]
      .map(element => ({ class: element.getAttribute('class'), style: element.getAttribute('style'), theme: element.getAttribute('data-theme'), color: getComputedStyle(element).color, background: getComputedStyle(element).backgroundColor, colorScheme: getComputedStyle(element).colorScheme })));
  const outside = await parentAppearance();
  const background = await root(page).evaluate(element => getComputedStyle(element).backgroundColor);
  await button(root(page), 'Toggle studio dark theme').click();
  assert.equal(await root(page).getAttribute('data-theme'), 'dark');
  await page.waitForFunction(() => document.querySelector('.prostho-studio')?.getAttribute('data-theme') === 'dark');
  // Reduced motion does not necessarily disable CSS color transitions.
  await page.waitForFunction(before => getComputedStyle(document.querySelector('.prostho-studio')).backgroundColor !== before, background);
  assert.deepEqual(await parentAppearance(), outside, 'Studio theme does not alter the parent, body or root');
  await page.waitForFunction(key => localStorage.getItem(key) === 'dark', data.THEME_STORAGE_KEY);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await ready(page, first);
  assert.equal(await root(page).getAttribute('data-theme'), 'dark');
  assert.deepEqual(await stored(page, data.STORAGE_KEY), earned, 'Every lecture persists across reload');

  await legacy(page, false);
  await select(page, first);
  await page.goBack();
  assert.equal(new URL(page.url()).hash, '#lecture-3');
  await page.getByRole('heading', { level: 1 }).first().waitFor();
  assert.equal(await root(page).count(), 0);
  await page.goForward();
  await ready(page, first);

  await page.setViewportSize({ width: 390, height: 844 });
  for (const [index, lecture] of data.LECTURES.entries()) {
    await select(page, lecture);
    await jump(page, '3D & 2D Lab', 3);
    await renderedCanvas(page, lecture);
    await noOverflow(page, `${lecture.id} mobile WebGL/dock`);
    if (!index) {
      await twoD(page, lecture, data, false);
      await assessment(page, lecture, data, true);
    } else {
      for (const [index, label] of tabs.entries()) {
        await scene(page, 3).getByRole('button', { name: new RegExp(`^${escape(label)}`) }).click();
        await noOverflow(page, `${lecture.id} mobile 2D tab ${index + 1}`);
      }
    }
    assert.equal(await root(page).getAttribute('data-theme'), 'dark');
  }
  await button(root(page), 'Progress').click();
  await dialog.waitFor();
  await noOverflow(page, 'Mobile progress dialog');
  await button(dialog, 'Continue Learning').click();
  await legacy(page, true);
  await nav(page).getByRole('link', { name: 'Prosthodontics', exact: true }).click();
  await page.getByRole('heading', { level: 1, name: 'Prosthodontics', exact: true }).waitFor();
  await noOverflow(page, 'Mobile overview');
  await nav(page).getByRole('link', { name: 'All subjects', exact: true }).click();
  await page.waitForURL(subjectsUrl);
  await page.goBack();
  await page.getByRole('heading', { level: 1, name: 'Prosthodontics', exact: true }).waitFor();
  await select(page, first);
  assert.equal(await root(page).getAttribute('data-theme'), 'dark');
  await button(root(page), 'Progress').click();
  await button(dialog, 'Reset All Progress').click();
  await page.waitForFunction(({ key, initial }) => localStorage.getItem(key) === JSON.stringify(initial),
    { key: data.STORAGE_KEY, initial: data.createInitialProgress() });
  await button(dialog, 'Close progress dialog').click();
  await page.reload({ waitUntil: 'domcontentloaded' });
  await ready(page, first);
  assert.deepEqual(await stored(page, data.STORAGE_KEY), data.createInitialProgress(), 'Reset persists without awarding passive progress');
  assert.equal(await page.evaluate(key => localStorage.getItem(key), data.THEME_STORAGE_KEY), 'dark', 'Reset preserves studio theme');
  assert.deepEqual(await page.evaluate(keys => Object.fromEntries(keys.map(key => [key, localStorage.getItem(key)])), Object.keys(unrelated)), unrelated, 'Studio progress/theme/reset leave unrelated storage untouched');
});
