import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { browserOptions, previewPrefix, startPreviewServer } from './preview-server.mjs';

const source = new URL('../endo-1-main/', import.meta.url);
const expectedIds = ['lecture-3', 'lecture-4', 'lecture-4b', 'lecture-5', 'lecture-7', 'lecture-8', 'lecture-9'];
const legacyKey = 'precision_dental_case_records';

async function metadata() {
  // Use the subject's compiler without generating files or importing browser components.
  const { build } = createRequire(new URL('package.json', source))('esbuild');
  const { outputFiles } = await build({
    stdin: {
      contents: `export { LECTURES } from './src/lectures/curriculum/data/lectures';
        export { LECTURE_QUIZZES, LECTURE_CASES } from './src/lectures/curriculum/data/quizzesAndCases';
        export { PROGRESS_STORAGE_KEY, THEME_STORAGE_KEY, createInitialProgress } from './src/lectures/curriculum/progress';`,
      resolveDir: fileURLToPath(source), loader: 'ts',
    },
    bundle: true, write: false, platform: 'node', format: 'esm',
    define: { 'import.meta.env.BASE_URL': JSON.stringify('./') },
  });
  const data = await import(`data:text/javascript;base64,${Buffer.from(outputFiles[0].contents).toString('base64')}`);
  assert.deepEqual(data.LECTURES.map(lecture => lecture.id), expectedIds);
  for (const lecture of data.LECTURES) {
    assert.equal(lecture.sandboxes3d.length, 3, lecture.id);
    assert.equal(lecture.sandboxes2d.length, 2, lecture.id);
    assert.ok(data.LECTURE_QUIZZES[lecture.id].length, lecture.id);
    assert.ok(data.LECTURE_CASES[lecture.id].length, lecture.id);
  }
  return data;
}

const root = page => page.locator('.endo-curriculum');
const section = (page, id) => root(page).locator(`[data-curriculum-section="${id}"]`);
const navigation = page => page.getByRole('navigation', { name: 'Endodontics lectures', exact: true });
const stored = (page, key) => page.evaluate(key => JSON.parse(localStorage.getItem(key)), key);

async function ready(page, lecture) {
  await page.getByRole('heading', { level: 1, name: lecture.title, exact: true }).waitFor();
  await root(page).waitFor();
  await root(page).getByRole('link', { name: 'Source PDF', exact: true }).waitFor();
  assert.equal(new URL(page.url()).hash, `#${lecture.id}`);
  assert.equal(await navigation(page).locator(`a[href="#${lecture.id}"]`).getAttribute('aria-current'), 'page');
  assert.equal(await root(page).getByRole('heading', { level: 1 }).count(), 0, 'Parent owns the lecture h1');
}

async function jump(page, label, id) {
  await root(page).getByRole('navigation', { name: 'Within this lecture', exact: true })
    .getByRole('button', { name: label, exact: true }).click();
  const target = section(page, id);
  await target.waitFor();
  // The parent uses an inner scrolling container, not necessarily window.scrollY.
  assert.ok(await target.evaluate(element => {
    const box = element.getBoundingClientRect();
    return box.top < innerHeight && box.bottom > 0;
  }), `${label} scrolls its section into view`);
  return target;
}

async function noOverflow(page, label) {
  // setViewportSize can resolve before the studio's ResizeObserver updates its
  // pixel-sized canvas. Cross a rendering cycle before measuring settled layout.
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const overflow = await page.locator('html, body, main, nav[aria-label="Endodontics lectures"], .endo-curriculum, .endo-curriculum header, .endo-curriculum section, .endo-curriculum-dialog, .endo-curriculum-dock-content, [data-curriculum-section="lab-2d"] > div > div')
    .evaluateAll(elements => {
      const selector = element => {
        const parts = [];
        for (let node = element; node && parts.length < 5; node = node.parentElement) {
          if (node.id) { parts.unshift(`#${CSS.escape(node.id)}`); break; }
          const index = node.parentElement ? [...node.parentElement.children].indexOf(node) + 1 : 1;
          parts.unshift(`${node.tagName.toLowerCase()}:nth-child(${index})`);
        }
        return parts.join(' > ');
      };
      return elements.filter(element => element.getClientRects().length && element.clientWidth && element.scrollWidth > element.clientWidth + 2)
        .map(element => {
          const bounds = element.getBoundingClientRect();
          return {
            selector: selector(element), width: element.clientWidth, scrollWidth: element.scrollWidth,
            children: [...element.querySelectorAll('*')].filter(child => {
              const box = child.getBoundingClientRect();
              return box.width > 0 && (box.right > bounds.right + 2 || box.left < bounds.left - 2);
            }).slice(0, 6).map(child => ({ selector: selector(child), text: child.textContent?.trim().slice(0, 90) })),
          };
        });
    });
  assert.deepEqual(overflow, [], `${label}: horizontal overflow; diagnostic selectors: ${JSON.stringify(overflow)}`);
}

async function waitForActivity(page, key, lectureId, field, id) {
  await page.waitForFunction(({ key, lectureId, field, id }) =>
    JSON.parse(localStorage.getItem(key) || '{}')[lectureId]?.[field]?.includes(id),
  { key, lectureId, field, id });
}

async function changeRange(slider) {
  await slider.scrollIntoViewIfNeeded();
  const before = await slider.inputValue();
  const destination = before === await slider.getAttribute('max') ? 'Home' : 'End';
  await slider.press(destination);
  assert.notEqual(await slider.inputValue(), before, 'Keyboard interaction changes the range value');
}

async function renderedCanvas(page, label) {
  const canvas = section(page, 'lab-3d').locator('.endo-curriculum-viewport canvas');
  await canvas.waitFor();
  await canvas.scrollIntoViewIfNeeded();
  // Count only draws to the default framebuffer, not offscreen environment-map setup.
  // No pixel readback, screenshots, animation sleeps, or software-GPU frame loops.
  await page.waitForFunction(() => {
    const canvas = document.querySelector('.endo-curriculum-viewport canvas');
    return canvas?.width > 0 && canvas?.height > 0 && window.__endoDraws?.get(canvas) > 0;
  }, undefined, { timeout: 12_000 }).catch(error => {
    throw new Error(`${label}: mounted canvas never drew to its visible framebuffer`, { cause: error });
  });
  assert.equal(await root(page).getByText('WebGL unavailable', { exact: true }).count(), 0, label);
  return canvas;
}

async function labs(page, lecture, key) {
  const stage = await jump(page, '3D Labs', 'lab-3d');
  const canvases = new Set();
  for (const [index, lab] of lecture.sandboxes3d.entries()) {
    const select = stage.getByRole('button').filter({ hasText: lab.title });
    assert.equal(await select.count(), 1, `${lecture.id}: lab selection ${lab.title}`);
    await select.click();
    const shell = stage.getByRole('region', { name: lab.title, exact: true });
    await shell.waitFor();
    const canvas = await renderedCanvas(page, `${lecture.id}/${lab.id}`);
    // A new scene must be mounted for every selected lab, not just a changed label.
    const token = await canvas.evaluate(canvas => {
      window.__endoCanvasSequence = (window.__endoCanvasSequence || 0) + 1;
      if (!canvas.dataset.browserTestCanvas) canvas.dataset.browserTestCanvas = String(window.__endoCanvasSequence);
      return canvas.dataset.browserTestCanvas;
    });
    assert.ok(!canvases.has(token), `${lab.id}: distinct rendered canvas`);
    canvases.add(token);
    const dock = shell.locator('.endo-curriculum-dock-content');
    const sliders = dock.getByRole('slider');
    const selects = dock.getByRole('combobox');
    const checks = dock.getByRole('checkbox');
    if (await sliders.count()) await changeRange(sliders.first());
    else if (await selects.count()) {
      const control = selects.first();
      const before = await control.inputValue();
      const value = await control.locator('option').evaluateAll((options, before) => options.find(option => !option.disabled && option.value !== before)?.value, before);
      assert.notEqual(value, undefined, `${lab.id}: selectable alternate option`);
      await control.selectOption(value);
      assert.equal(await control.inputValue(), value);
    } else if (await checks.count()) {
      const check = checks.first();
      const before = await check.isChecked();
      await check.setChecked(!before);
      assert.equal(await check.isChecked(), !before);
    } else {
      const before = await shell.innerText();
      const buttons = dock.getByRole('button');
      // This lab's motion buttons change geometry but not text; select a file
      // instead so the assertion also verifies the descriptive readout.
      await (lecture.id === 'lecture-4b' && index === 0 ? buttons.first() : buttons.last()).click();
      assert.notEqual(await shell.innerText(), before, `${lab.id}: simulation readout changes`);
    }
    await waitForActivity(page, key, lecture.id, 'explored3dIds', lab.id);
    if (index === 0) {
      await shell.getByRole('button', { name: 'Reset 3D camera view', exact: true }).click();
      const hide = shell.getByRole('button', { name: 'Hide Controls', exact: true });
      assert.equal(await hide.getAttribute('aria-expanded'), 'true');
      await hide.click();
      assert.equal(await dock.count(), 0);
      const show = shell.getByRole('button', { name: 'Show Controls', exact: true });
      assert.equal(await show.getAttribute('aria-expanded'), 'false');
      await show.click();
      await dock.waitFor();
    }
    await noOverflow(page, `${lecture.id}, 3D lab ${index + 1}`);
  }
}

async function studios(page, lecture, key) {
  const panel = await jump(page, '2D Studios', 'lab-2d');
  // Studio display headings intentionally differ from some catalogue titles.
  const cards = panel.locator(':scope > div > div');
  assert.equal(await cards.count(), lecture.sandboxes2d.length, `${lecture.id}: both studios render`);
  for (let index = 0; index < lecture.sandboxes2d.length; index++) {
    const card = cards.nth(index);
    await card.scrollIntoViewIfNeeded();
    assert.ok((await card.getByRole('heading', { level: 4 }).innerText()).length > 0);
    assert.ok((await card.innerText()).length > 100, `${lecture.id}: studio ${index + 1} has content`);
    if (lecture.id === 'lecture-3' && index === 1) {
      await card.getByRole('button', { name: /^Adjust rubber stopper/ }).click();
      await card.getByRole('status').getByText('Out of order — select Step 1 next.', { exact: true }).waitFor();
      assert.ok(!(await stored(page, key))[lecture.id].completed2dIds.includes(lecture.sandboxes2d[index].id));
      for (const step of ['Measure tooth', 'Place exploring file', 'Adjust rubber stopper', 'Expose radiograph', 'Measure difference', 'Subtract 1.0 mm', 'Set endodontic']) {
        await card.getByRole('button', { name: new RegExp(`^${step.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`) }).click();
      }
      await card.getByText('Ordered: 7 / 7', { exact: true }).waitFor();
    } else if (await card.getByRole('slider').count()) {
      const before = await card.innerText();
      await changeRange(card.getByRole('slider').first());
      assert.notEqual(await card.innerText(), before, 'Studio readout follows slider');
    } else {
      const before = await card.innerText();
      const buttons = card.getByRole('button');
      await (['lecture-3', 'lecture-7'].includes(lecture.id) ? buttons.first() : buttons.last()).click();
      assert.notEqual(await card.innerText(), before, 'Studio selection updates its explanation');
    }
    await card.getByText('Explored', { exact: true }).waitFor();
    await waitForActivity(page, key, lecture.id, 'completed2dIds', lecture.sandboxes2d[index].id);
    await noOverflow(page, `${lecture.id}, 2D studio ${index + 1}`);
  }
}

async function assessment(page, lecture, data, representative = false) {
  const panel = await jump(page, 'Cases & Quiz', 'assessment');
  const cases = data.LECTURE_CASES[lecture.id];
  for (const scenario of cases) {
    const card = panel.getByRole('heading', { name: scenario.title, exact: true }).locator('..');
    const wrong = scenario.options.find(option => !option.isOptimal);
    const optimal = scenario.options.find(option => option.isOptimal);
    assert.ok(wrong && optimal, `${scenario.id}: real case decisions`);
    const previouslyComplete = (await stored(page, data.PROGRESS_STORAGE_KEY))[lecture.id].completedCaseIds.includes(scenario.id);
    await card.getByRole('button', { name: wrong.label, exact: true }).click();
    await card.getByRole('status').getByText(wrong.rationale, { exact: true }).waitFor();
    await card.getByRole('status').getByText(wrong.clinicalOutcome, { exact: true }).waitFor();
    assert.equal((await stored(page, data.PROGRESS_STORAGE_KEY))[lecture.id].completedCaseIds.includes(scenario.id), previouslyComplete, 'A non-optimal decision neither awards nor erases case completion');
    await card.getByRole('button', { name: optimal.label, exact: true }).click();
    await card.getByRole('status').getByText(optimal.rationale, { exact: true }).waitFor();
    await card.getByRole('status').getByText(optimal.clinicalOutcome, { exact: true }).waitFor();
    await waitForActivity(page, data.PROGRESS_STORAGE_KEY, lecture.id, 'completedCaseIds', scenario.id);
    await card.getByRole('button', { name: 'Reset Case', exact: true }).click();
    assert.equal(await card.getByRole('status').count(), 0, 'Reset clears feedback, not earned progress');
  }
  const questions = data.LECTURE_QUIZZES[lecture.id];
  const submit = panel.getByRole('button', { name: /^Check Answers/ });
  assert.equal(await submit.isDisabled(), true);
  async function answer(correct) {
    for (const [index, question] of questions.entries()) {
      const card = panel.getByText(`${index + 1}. ${question.prompt}`, { exact: true }).locator('..');
      const option = question.options.find(option => correct ? option.id === question.correctOptionId : option.id !== question.correctOptionId);
      assert.ok(option, question.id);
      await card.getByRole('button', { name: option.label, exact: true }).click();
      if (index < questions.length - 1) assert.equal(await submit.isDisabled(), true);
    }
    assert.equal(await submit.isEnabled(), true);
    await submit.click();
    await panel.getByText(`Score: ${correct ? questions.length : 0}/${questions.length} (${correct ? 100 : 0}%)`, { exact: true }).waitFor();
    for (const [index, question] of questions.entries()) {
      const card = panel.getByText(`${index + 1}. ${question.prompt}`, { exact: true }).locator('..');
      await card.getByText(`${correct ? 'Correct' : 'Review'} (${question.sourceRef}):`, { exact: true }).waitFor();
      assert.ok((await card.innerText()).includes(question.explanation), `${question.id}: submitted rationale`);
      assert.equal(await card.getByRole('button', { disabled: false }).count(), 0, 'Submitted answers are locked');
    }
  }
  if (representative) {
    await answer(false);
    await panel.getByRole('button', { name: 'Retry Quiz', exact: true }).click();
    assert.equal(await submit.isDisabled(), true);
  }
  await answer(true);
  await page.waitForFunction(({ key, id, total }) => JSON.parse(localStorage.getItem(key) || '{}')[id]?.quizBestScore === total,
    { key: data.PROGRESS_STORAGE_KEY, id: lecture.id, total: questions.length });
  if (representative) {
    await panel.getByRole('button', { name: 'Retry Quiz', exact: true }).click();
    await answer(false);
    assert.equal((await stored(page, data.PROGRESS_STORAGE_KEY))[lecture.id].quizBestScore, questions.length, 'A lower retry does not erase the best score');
  }
  await noOverflow(page, `${lecture.id}: submitted assessment`);
}

async function progressDialog(page, lectures) {
  const trigger = root(page).getByRole('button', { name: 'Progress', exact: true });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Curriculum Progress', exact: true });
  await dialog.waitFor();
  assert.equal(await dialog.locator('li').count(), lectures.length);
  for (const lecture of lectures) {
    const row = dialog.locator('li').filter({ hasText: lecture.title });
    assert.equal(await row.count(), 1, lecture.id);
    assert.match(await row.innerText(), /3D 3\/3 · 2D 2\/2/, `${lecture.id}: dashboard reflects earned activity progress`);
    assert.equal(await row.getByLabel('All activities complete with a full quiz score', { exact: true }).count(), 1);
  }
  assert.ok(await dialog.evaluate(element => element.contains(document.activeElement)), 'Modal receives focus');
  for (const key of ['Shift+Tab', 'Tab', 'Tab']) {
    await page.keyboard.press(key);
    const focus = await dialog.evaluate(element => ({
      modal: element.matches(':modal'),
      inside: element.contains(document.activeElement),
      browserChrome: !document.hasFocus() && document.activeElement === document.body,
    }));
    assert.ok(focus.modal, 'Keyboard navigation keeps the native dialog modal');
    // Native dialogs make the background inert, but Chrome may include browser
    // chrome in the tab cycle (reported as an unfocused document with body active).
    assert.ok(focus.inside || focus.browserChrome, `No background content receives focus: ${JSON.stringify(focus)}`);
    if (focus.browserChrome) {
      await page.keyboard.press(key);
      assert.ok(await dialog.evaluate(element => element.contains(document.activeElement)), 'Tabbing back from browser chrome returns to the modal');
    }
  }
  const backgroundBlocked = await navigation(page).getByRole('link', { name: 'Endodontics', exact: true }).evaluate(element => {
    element.focus();
    return document.activeElement !== element && document.querySelector('dialog:modal')?.contains(document.activeElement);
  });
  assert.ok(backgroundBlocked, 'Native modality prevents programmatic focus on background navigation');
  await noOverflow(page, 'Progress dialog');
  await page.keyboard.press('Escape');
  await dialog.waitFor({ state: 'hidden' });
  assert.equal(await trigger.evaluate(element => element === document.activeElement), true, 'Escape restores focus');
}

test('Endodontics curriculum: seven lectures, 21 rendered labs, studios and assessments under a repository prefix', { timeout: 300_000 }, async t => {
  const data = await metadata();
  const server = await startPreviewServer();
  t.after(server.close);
  const browser = await chromium.launch({ ...browserOptions, timeout: 20_000 });
  t.after(() => browser.close());
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce', colorScheme: 'light' });
  const page = await context.newPage();
  page.setDefaultTimeout(8_000);
  page.setDefaultNavigationTimeout(20_000);
  const errors = [];
  t.after(async () => {
    await context.close();
    assert.deepEqual(errors, [], 'Browser errors, WebGL failures, or missing local assets');
  });
  page.on('pageerror', error => errors.push(`${page.url()}: ${error.stack || error.message}`));
  page.on('console', message => {
    // Chrome probes this undeclared origin-root icon outside the Pages prefix.
    // Keep all authored asset failures covered by the response/request listeners.
    if (message.type() === 'error' && message.location().url === `${server.origin}/favicon.ico`
      && message.text() === 'Failed to load resource: the server responded with a status of 404 (Not Found)') return;
    if (message.type() === 'error' || (message.type() === 'warning' && /WebGL.*(?:lost|error)|too many active WebGL/i.test(message.text()))) {
      errors.push(`${page.url()}: ${message.type()}: ${message.text()} ${JSON.stringify(message.location())}`);
    }
  });
  page.on('response', response => {
    if (new URL(response.url()).origin === server.origin && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
  });
  page.on('requestfailed', request => {
    if (new URL(request.url()).origin === server.origin) errors.push(`${request.failure()?.errorText} ${request.url()}`);
  });
  await context.addInitScript(() => {
    window.__endoDraws = new WeakMap();
    for (const Type of [window.WebGLRenderingContext, window.WebGL2RenderingContext]) {
      if (!Type) continue;
      for (const name of ['drawArrays', 'drawElements', 'drawArraysInstanced', 'drawElementsInstanced']) {
        const original = Type.prototype[name];
        if (!original) continue;
        Type.prototype[name] = function (...args) {
          const result = original.apply(this, args);
          const count = name.startsWith('drawArrays') ? args[2] : args[1];
          if (count > 0 && this.getParameter(this.FRAMEBUFFER_BINDING) === null) {
            window.__endoDraws.set(this.canvas, (window.__endoDraws.get(this.canvas) || 0) + 1);
          }
          return result;
        };
      }
    }
  });
  const subjectUrl = `${server.origin}${previewPrefix}endo-1-main/index.html`;
  const lectures = data.LECTURES;
  const first = lectures[0];
  await page.goto(subjectUrl, { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { level: 1, name: 'Endodontics', exact: true }).waitFor();
  for (const id of ['lecture-1', 'lecture-2', ...expectedIds]) {
    assert.equal(await navigation(page).locator(`a[href="#${id}"]`).count(), 1, `Parent navigation retains ${id}`);
    assert.equal(await page.locator(`main a[href="#${id}"]`).count(), 1, `Overview links to ${id}`);
  }
  await noOverflow(page, 'Desktop overview');
  // A valid legacy value proves curriculum writes/reset do not clear older case records.
  await page.evaluate(key => localStorage.setItem(key, '[]'), legacyKey);
  for (const [index, lecture] of lectures.entries()) {
    await navigation(page).locator(`a[href="#${lecture.id}"]`).click();
    await ready(page, lecture);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await ready(page, lecture);
    await page.waitForFunction(key => localStorage.getItem(key) !== null, data.PROGRESS_STORAGE_KEY);
    assert.deepEqual((await stored(page, data.PROGRESS_STORAGE_KEY))[lecture.id], data.createInitialProgress()[lecture.id], 'Loading/selecting a lecture does not award progress');
    const pdf = root(page).getByRole('link', { name: 'Source PDF', exact: true });
    const url = new URL(await pdf.getAttribute('href'), page.url());
    assert.equal(url.href, new URL(lecture.sourcePdfPath, subjectUrl).href);
    assert.equal(url.origin, server.origin);
    assert.ok(url.pathname.startsWith(`${previewPrefix}endo-1-main/assets/endo-curriculum/`));
    assert.equal(await pdf.getAttribute('target'), '_blank');
    const response = await context.request.get(url.href, { timeout: 15_000 });
    assert.equal(response.status(), 200, `${lecture.id}: source PDF`);
    assert.equal((await response.body()).subarray(0, 5).toString(), '%PDF-', `${lecture.id}: PDF body, not an HTML fallback`);
    await response.dispose();
    const objectives = root(page).getByRole('button', { name: 'Learning Objectives', exact: true });
    await objectives.click();
    assert.equal(await objectives.getAttribute('aria-expanded'), 'true');
    for (const objective of lecture.objectives) await root(page).getByText(objective, { exact: true }).waitFor();
    await objectives.click();
    assert.equal(await objectives.getAttribute('aria-expanded'), 'false');
    await labs(page, lecture, data.PROGRESS_STORAGE_KEY);
    await studios(page, lecture, data.PROGRESS_STORAGE_KEY);
    await assessment(page, lecture, data, index === 0);
    assert.equal(new URL(page.url()).hash, `#${lecture.id}`, 'Curriculum controls do not change parent routing');
  }
  const earned = await stored(page, data.PROGRESS_STORAGE_KEY);
  for (const lecture of lectures) {
    const progress = earned[lecture.id];
    assert.deepEqual([...progress.explored3dIds].sort(), lecture.sandboxes3d.map(lab => lab.id).sort());
    assert.deepEqual([...progress.completed2dIds].sort(), lecture.sandboxes2d.map(studio => studio.id).sort());
    assert.deepEqual([...progress.completedCaseIds].sort(), data.LECTURE_CASES[lecture.id].map(scenario => scenario.id).sort());
  }
  await progressDialog(page, lectures);
  await navigation(page).locator(`a[href="#${first.id}"]`).click();
  await ready(page, first);
  const parentAppearance = () => page.evaluate(() => {
    const nodes = [document.documentElement, document.body, document.querySelector('nav[aria-label="Endodontics lectures"]'), document.querySelector('h1')];
    return nodes.map(node => ({ class: node.getAttribute('class'), style: node.getAttribute('style'), theme: node.getAttribute('data-theme'), color: getComputedStyle(node).color, background: getComputedStyle(node).backgroundColor, colorScheme: getComputedStyle(node).colorScheme }));
  });
  const outsideBefore = await parentAppearance();
  const lightBackground = await root(page).evaluate(element => getComputedStyle(element).backgroundColor);
  await root(page).getByRole('button', { name: 'Switch curriculum to dark theme', exact: true }).click();
  assert.equal(await root(page).getAttribute('data-endo-theme'), 'dark');
  assert.notEqual(await root(page).evaluate(element => getComputedStyle(element).backgroundColor), lightBackground);
  assert.deepEqual(await parentAppearance(), outsideBefore, 'Theme remains scoped to curriculum, including parent navigation');
  await page.waitForFunction(key => localStorage.getItem(key) === 'dark', data.THEME_STORAGE_KEY);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await ready(page, first);
  assert.equal(await root(page).getAttribute('data-endo-theme'), 'dark');
  assert.deepEqual(await stored(page, data.PROGRESS_STORAGE_KEY), earned, 'All activity progress survives reload');

  // Do the expensive 21-scene sweep once. Mobile still renders each lecture's first
  // real canvas and exercises scrolling, all studio layouts and submitted feedback.
  await page.setViewportSize({ width: 390, height: 844 });
  for (const lecture of lectures) {
    await navigation(page).locator(`a[href="#${lecture.id}"]`).click();
    await ready(page, lecture);
    await renderedCanvas(page, `${lecture.id}: mobile`);
    if (lecture.id === first.id) {
      const stage = section(page, 'lab-3d');
      const depth = stage.getByRole('slider', { name: 'File insertion depth in millimeters', exact: true });
      await depth.scrollIntoViewIfNeeded();
      await depth.press('Home');
      await stage.getByText('SHORT WORKING LENGTH', { exact: true }).waitFor();
      await depth.press('End');
      await stage.getByText('OVER-EXTENDED LENGTH', { exact: true }).waitFor();
      await stage.getByRole('button', { name: 'Hide Controls', exact: true }).click();
      assert.equal(await stage.locator('.endo-curriculum-dock-content').count(), 0);
      await stage.getByRole('button', { name: 'Show Controls', exact: true }).click();
      await depth.waitFor();
    }
    await noOverflow(page, `${lecture.id}: 390px lab`);
    await jump(page, '2D Studios', 'lab-2d');
    await noOverflow(page, `${lecture.id}: 390px studios`);
    const panel = await jump(page, 'Cases & Quiz', 'assessment');
    const scenario = data.LECTURE_CASES[lecture.id][0];
    const optimal = scenario.options.find(option => option.isOptimal);
    await panel.getByRole('button', { name: optimal.label, exact: true }).click();
    await panel.getByRole('status').getByText(optimal.rationale, { exact: true }).waitFor();
    await noOverflow(page, `${lecture.id}: 390px case feedback`);
    await page.setViewportSize({ width: 360, height: 844 });
    await noOverflow(page, `${lecture.id}: 360px all sections`);
    await page.setViewportSize({ width: 390, height: 844 });
  }
  await navigation(page).locator(`a[href="#${first.id}"]`).click();
  await ready(page, first);
  await page.setViewportSize({ width: 360, height: 844 });
  await assessment(page, first, data, true);
  await progressDialog(page, lectures);
  await root(page).getByRole('button', { name: 'Switch curriculum to light theme', exact: true }).click();
  assert.equal(await root(page).getAttribute('data-endo-theme'), 'light');
  await noOverflow(page, '360px light curriculum');
  assert.deepEqual(await stored(page, data.PROGRESS_STORAGE_KEY), earned, 'Revisits, duplicate interactions and retries retain earned progress');

  await root(page).getByRole('button', { name: 'Progress', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Curriculum Progress', exact: true });
  const reset = dialog.getByRole('button', { name: 'Reset Curriculum Progress', exact: true });
  const confirmations = [];
  page.once('dialog', async dialog => { confirmations.push(dialog.message()); await dialog.dismiss(); });
  await reset.click();
  assert.equal(confirmations.length, 1, 'Reset requires confirmation');
  assert.deepEqual(await stored(page, data.PROGRESS_STORAGE_KEY), earned, 'Cancelling reset preserves progress');
  page.once('dialog', dialog => dialog.accept());
  await reset.click();
  await page.waitForFunction(({ key, initial }) => localStorage.getItem(key) === JSON.stringify(initial),
    { key: data.PROGRESS_STORAGE_KEY, initial: data.createInitialProgress() });
  assert.equal(await page.evaluate(key => localStorage.getItem(key), legacyKey), '[]', 'Reset does not clear older lecture storage');
  assert.equal(await page.evaluate(key => localStorage.getItem(key), data.THEME_STORAGE_KEY), 'light', 'Progress reset does not reset theme');
  await dialog.getByRole('button', { name: 'Close progress dashboard', exact: true }).click();
  await page.reload({ waitUntil: 'domcontentloaded' });
  await ready(page, first);
  assert.deepEqual(await stored(page, data.PROGRESS_STORAGE_KEY), data.createInitialProgress(), 'Reset persists without automatic lab completion');
  await page.evaluate(key => localStorage.setItem(key, '{broken-json'), data.PROGRESS_STORAGE_KEY);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await ready(page, first);
  await page.waitForFunction(({ key, initial }) => localStorage.getItem(key) === JSON.stringify(initial),
    { key: data.PROGRESS_STORAGE_KEY, initial: data.createInitialProgress() });

  for (const [number, title, control] of [
    [1, null, 'Menu'],
    [2, 'Pulpal Neurophysiology & Nociception', 'Toggle Lecture 2 topics'],
  ]) {
    await navigation(page).getByRole('link', { name: `Lecture ${number}`, exact: true }).click();
    if (title) await page.getByRole('heading', { name: title, exact: true }).waitFor();
    else await page.getByRole('button', { name: '3D Model', exact: true }).waitFor();
    assert.equal(new URL(page.url()).hash, `#lecture-${number}`);
    assert.equal(await root(page).count(), 0, 'Original lectures are not replaced by curriculum');
    if (number === 1) {
      await page.getByRole('button', { name: control, exact: true }).click();
      await page.getByRole('button', { name: /Lecture Notes & Board Quiz/ }).click();
      await page.getByRole('heading', { name: 'Lecture 1 Master Companion', exact: true }).waitFor();
    } else assert.equal(await page.getByRole('button', { name: control, exact: true }).isVisible(), true);
    await page.reload({ waitUntil: 'domcontentloaded' });
    if (title) await page.getByRole('heading', { name: title, exact: true }).waitFor();
    else await page.getByRole('button', { name: '3D Model', exact: true }).waitFor();
  }
  await navigation(page).getByRole('link', { name: 'Endodontics', exact: true }).click();
  await page.getByRole('heading', { level: 1, name: 'Endodontics', exact: true }).waitFor();
  await noOverflow(page, '360px parent overview after original lectures');
  await page.goBack({ waitUntil: 'domcontentloaded' });
  assert.equal(new URL(page.url()).hash, '#lecture-2');
  await page.getByRole('heading', { name: 'Pulpal Neurophysiology & Nociception', exact: true }).waitFor();
  await navigation(page).getByRole('link', { name: 'Endodontics', exact: true }).click();
  await page.getByRole('heading', { level: 1, name: 'Endodontics', exact: true }).waitFor();
  await navigation(page).getByRole('link', { name: 'All subjects', exact: true }).click();
  assert.equal(new URL(page.url()).pathname, `${previewPrefix}index.html`);
});
