import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import test from 'node:test';
import { chromium } from 'playwright';
import { browserOptions, previewPrefix, startPreviewServer } from './preview-server.mjs';

const subjectDirectory = '8666a648e8a3f5a983a00b19e5cc39db2ef0d29c';
const source = new URL('../orthodontics-main/orthodontics-main/', import.meta.url);
const lectures = [
  { number: 4, title: 'Temporomandibular Disorders (TMDs)' },
  { number: 5, title: 'Lateral Cephalometrics' },
  { number: 6, title: 'Orthopantomogram (OPG)' },
  { number: 7, title: 'Orthodontic Study Models & Analyses' },
];

async function quizMetadata() {
  // Use the subject's existing TS compiler dependency; scripts needs only Playwright.
  const { transform } = createRequire(new URL('package.json', source))('esbuild');
  const text = await readFile(new URL('src/lectures/lectures-04-07/data/lecturesMeta.ts', source), 'utf8');
  const { code } = await transform(text, { loader: 'ts', format: 'esm' });
  const { LECTURES_META } = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
  assert.deepEqual(LECTURES_META.map(meta => meta.number), lectures.map(lecture => lecture.number));
  return LECTURES_META;
}

async function frames(page) {
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

async function noMobileOverflow(page, label) {
  const overflow = await page.evaluate(() => {
    // The header's horizontal lecture scroller is intentional; the page and
    // lecture sections must fit without relying on body overflow clipping.
    return [...document.querySelectorAll('html, body, header, main, article, article section')]
      .filter(element => element.scrollWidth > element.clientWidth + 2)
      .map(element => ({
        element: element.id || element.tagName,
        width: element.clientWidth,
        scrollWidth: element.scrollWidth,
      }));
  });
  assert.deepEqual(overflow, [], `${label}: mobile horizontal overflow`);
}

async function exerciseControl(page, number) {
  if (number === 7) {
    const sandbox = page.locator('#lec7-2d-bolton');
    const diagram = sandbox.getByRole('img', { name: 'Maxillary versus mandibular 12-tooth and 6-anterior width comparison', exact: true });
    const before = await diagram.textContent();
    await sandbox.getByRole('button', { name: 'Preset: Mandibular Anterior Excess', exact: true }).click();
    await sandbox.getByText('85.2%', { exact: true }).waitFor();
    assert.notEqual(await diagram.textContent(), before, 'Bolton preset updates the model');
    await sandbox.getByRole('button', { name: 'Reset', exact: true }).click();
    assert.equal(await diagram.textContent(), before, 'Bolton reset restores the model');
    return;
  }

  const controls = {
    4: { section: '#lec4-2d-etiology', name: 'Occlusal Instability / High Contact' },
    5: { section: '#lec5-2d-ap', name: 'Maxillary Point A (AP Position)' },
    6: { section: '#lec6-2d-ghost', name: 'Arch Offset Outside Focal Trough' },
  };
  const { section, name } = controls[number];
  const sandbox = page.locator(section);
  const slider = sandbox.getByRole('slider', { name, exact: true });
  const value = await slider.inputValue();
  const output = await sandbox.innerText();
  await slider.press('End');
  assert.equal(await slider.inputValue(), await slider.getAttribute('max'));
  assert.notEqual(await slider.inputValue(), value, `Lecture ${number}: slider changes`);
  assert.notEqual(await sandbox.innerText(), output, `Lecture ${number}: rendered output changes`);
  if (number === 6) {
    await sandbox.getByText('Too far forward: lower incisors appear artificially narrowed and blurred.', { exact: true }).waitFor();
  }
  await sandbox.getByRole('button', { name: 'Reset', exact: true }).click();
  assert.equal(await slider.inputValue(), value, `Lecture ${number}: reset restores slider`);
  assert.equal(await sandbox.innerText(), output, `Lecture ${number}: reset restores output`);
}

async function exerciseQuiz(page, meta) {
  const quiz = page.locator(`#lec${meta.number}-quiz`);
  const questions = quiz.locator('fieldset');
  assert.ok(meta.quiz.length > 0);
  assert.equal(await questions.count(), meta.quiz.length);
  await quiz.getByText(`0 of ${meta.quiz.length} answered`, { exact: true }).waitFor();

  // First-option answers exercise both correct and incorrect feedback. Compute
  // the expected score from source keys instead of assuming a perfect score.
  for (const [index, question] of meta.quiz.entries()) {
    const fieldset = questions.nth(index);
    assert.ok((await fieldset.locator('legend').innerText()).includes(question.prompt));
    assert.equal(await fieldset.getByRole('button').count(), question.options.length);
    assert.ok(question.options.some(option => option.id === question.correctOptionId));
    await fieldset.getByRole('button').first().click();
  }
  await quiz.getByText(`${meta.quiz.length} of ${meta.quiz.length} answered`, { exact: true }).waitFor();
  await quiz.getByRole('button', { name: 'Check Answers', exact: true }).click();
  const correct = meta.quiz.filter(question => question.options[0].id === question.correctOptionId).length;
  const score = `Score: ${correct} / ${meta.quiz.length} (${Math.round(correct / meta.quiz.length * 100)}%)`;
  await quiz.getByRole('status').getByText(score, { exact: true }).waitFor();
  assert.equal(await questions.getByRole('button', { disabled: false }).count(), 0);
  for (const [index, question] of meta.quiz.entries()) {
    const fieldset = questions.nth(index);
    await fieldset.getByText(question.explanation, { exact: false }).waitFor();
    await fieldset.getByText(question.options[0].id === question.correctOptionId ? 'Correct:' : 'Review:', { exact: true }).waitFor();
  }

  await quiz.getByRole('button', { name: 'Reset Quiz', exact: true }).click();
  await quiz.getByText(`0 of ${meta.quiz.length} answered`, { exact: true }).waitFor();
  assert.equal(await quiz.getByRole('status').count(), 0);
  assert.equal(await quiz.locator('button[aria-pressed="true"]').count(), 0);
  assert.equal(await questions.getByRole('button', { disabled: true }).count(), 0);
  assert.equal(await quiz.getByRole('button', { name: 'Check Answers', exact: true }).isEnabled(), true);
}

test('Orthodontics lectures 4–7 work on desktop and mobile under a repository prefix', { timeout: 180_000 }, async t => {
  const metadata = await quizMetadata();
  const server = await startPreviewServer();
  t.after(server.close);
  const browser = await chromium.launch({ ...browserOptions, timeout: 20_000 });
  t.after(() => browser.close());
  const subjectUrl = `${server.origin}${previewPrefix}${subjectDirectory}/index.html`;

  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
    await t.test(`${viewport.width}px: content, quizzes, controls and navigation`, async () => {
      const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
      const page = await context.newPage();
      page.setDefaultTimeout(30_000);
      page.setDefaultNavigationTimeout(30_000);
      const errors = [];
      const warnings = [];
      page.on('pageerror', error => errors.push(error.stack || error.message));
      page.on('console', message => {
        const { url, lineNumber, columnNumber } = message.location();
        const location = url ? `${url}:${lineNumber + 1}:${columnNumber + 1}` : '(location unavailable)';
        const diagnostic = `${message.text()} [${location}; page: ${page.url()}]`;
        if (message.type() === 'warning') warnings.push(diagnostic);
        if (message.type() === 'error') errors.push(diagnostic);
      });
      page.on('response', response => {
        if (new URL(response.url()).origin === server.origin && response.status() >= 400) {
          errors.push(`${response.status()} ${response.url()}`);
        }
      });
      page.on('requestfailed', request => {
        if (new URL(request.url()).origin === server.origin) {
          errors.push(`${request.failure()?.errorText} ${request.url()}`);
        }
      });

      const navigation = page.getByRole('navigation', { name: 'Orthodontics lectures and tools', exact: true });
      async function ready(lecture) {
        const heading = `Lecture ${lecture.number}: ${lecture.title}`;
        await page.getByRole('heading', { level: 2, name: heading, exact: true }).waitFor();
        await page.locator(`#lec${lecture.number}-quiz`).waitFor();
        assert.equal(new URL(page.url()).hash, `#lecture-${lecture.number}`);
        assert.equal(await navigation.getByRole('link', { name: `Lec ${lecture.number}: ${lecture.title}`, exact: true }).getAttribute('aria-current'), 'page');
        assert.equal(await page.title(), `${heading} | Precision Dental`);
        await frames(page);
      }
      async function select(lecture) {
        const link = navigation.getByRole('link', { name: `Lec ${lecture.number}: ${lecture.title}`, exact: true });
        assert.equal(await link.getAttribute('href'), `#lecture-${lecture.number}`);
        await link.click();
        await ready(lecture);
      }

      try {
        await page.goto(`${subjectUrl}#lecture-4`, { waitUntil: 'domcontentloaded' });
        for (const [index, lecture] of lectures.entries()) {
          if (index === 0) await ready(lecture);
          else await select(lecture);
          const meta = metadata.find(item => item.number === lecture.number);
          const article = page.getByRole('article', { name: `Lecture ${lecture.number}: ${lecture.title}`, exact: true });
          assert.equal(await article.count(), 1);
          assert.equal(meta.sandboxes.filter(item => item.kind === '3D Sandbox').length, 1);
          assert.equal(meta.sandboxes.filter(item => item.kind === '2D Sandbox').length, 4);
          assert.equal(meta.sandboxes.length, 6);
          const jumps = article.getByRole('navigation', { name: `Lecture ${lecture.number} sandbox jumps`, exact: true });
          assert.equal(await jumps.getByRole('button').count(), 6);
          for (const sandbox of meta.sandboxes) {
            const section = article.locator(`section[id="${sandbox.id}"]`);
            assert.equal(await section.count(), 1, `${sandbox.id}: section exists exactly once`);
            await section.getByRole('heading', { level: 3 }).waitFor();
            assert.ok((await section.innerText()).length > 100, `${sandbox.id}: nonempty content`);
          }
          assert.equal(await article.locator(`#lec${lecture.number}-3d canvas`).count(), 1, '3D canvas mounts');

          const pdf = article.getByRole('link', { name: `Lecture ${lecture.number} source notes (PDF, opens in a new tab)`, exact: true });
          const pdfUrl = new URL(await pdf.getAttribute('href'), page.url());
          assert.equal(pdfUrl.origin, server.origin);
          assert.ok(pdfUrl.pathname.startsWith(`${previewPrefix}${subjectDirectory}/`), `PDF stays under subject prefix: ${pdfUrl}`);
          assert.match(pdfUrl.pathname, /\.pdf$/i);
          const response = await context.request.get(pdfUrl.href, { timeout: 10_000 });
          assert.equal(response.status(), 200, `Lecture ${lecture.number}: PDF response`);
          assert.equal((await response.body()).subarray(0, 5).toString(), '%PDF-', 'Source link returns a real PDF, not an HTML fallback');
          await response.dispose();

          await exerciseControl(page, lecture.number);
          await exerciseQuiz(page, meta);
          // Jump controls must focus their section without replacing the lecture hash.
          await jumps.getByRole('button', { name: /Knowledge Check$/ }).click();
          assert.equal(await page.locator(`#lec${lecture.number}-quiz`).evaluate(element => element === document.activeElement), true);
          assert.equal(new URL(page.url()).hash, `#lecture-${lecture.number}`);
          if (viewport.width === 390) await noMobileOverflow(page, `Lecture ${lecture.number}`);
        }

        await select(lectures[0]);
        await select(lectures[1]);
        await page.goBack();
        await ready(lectures[0]);
        await page.goForward();
        await ready(lectures[1]);
        await page.reload({ waitUntil: 'domcontentloaded' });
        await ready(lectures[1]);

        for (const number of [1, 2, 3]) {
          await page.goto(`${subjectUrl}#lecture-${number}`, { waitUntil: 'domcontentloaded' });
          const name = number === 3 ? 'Occlusion & Malocclusion Concepts' : 'Orthodontic History & Clinical Examination in 3D';
          await page.getByRole('heading', { level: 1, name, exact: true }).waitFor();
          assert.equal(new URL(page.url()).hash, `#lecture-${number}`, 'Legacy deep link is preserved');
          const label = number === 3 ? 'Lec 3: Occlusion' : 'Lec 1 & 2: History & Exam';
          assert.equal(await navigation.getByRole('link', { name: label, exact: true }).getAttribute('aria-current'), 'page');
          await frames(page);
        }
        const hub = navigation.getByRole('link', { name: 'Academy Hub', exact: true });
        assert.equal(await hub.getAttribute('href'), '#');
        await hub.click();
        await page.getByRole('heading', { level: 1, name: /Precision Orthodontics.*Interactive 3D & 2D Suite/ }).waitFor();
        assert.ok(['', '#'].includes(new URL(page.url()).hash));
        assert.equal(await hub.getAttribute('aria-current'), 'page');
        const allSubjects = page.getByRole('link', { name: 'All subjects', exact: true });
        assert.equal(await allSubjects.getAttribute('href'), '../index.html');
        await allSubjects.click();
        await page.locator('#subjects-grid').waitFor();
        assert.equal(page.url(), `${server.origin}${previewPrefix}index.html`);
      } finally {
        await context.close();
        assert.deepEqual({ errors, warnings }, { errors: [], warnings: [] }, 'Runtime errors, failed local requests/responses, or browser warnings');
      }
    });
  }
});
