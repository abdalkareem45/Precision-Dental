import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { build } from 'esbuild';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const directory = dirname(fileURLToPath(import.meta.url));
const subjectDirectory = resolve(directory, '../../..');
const entry = `
  export { default as Content } from './App';
  export { LECTURES_META } from './data/lecturesMeta';
  export { LECTURE_ASSETS } from './data/assets';
  export { default as Lecture4View } from './components/lectures/lecture4/Lecture4View';
  export { default as Lecture5View } from './components/lectures/lecture5/Lecture5View';
  export { default as Lecture6View } from './components/lectures/lecture6/Lecture6View';
  export { default as Lecture7View } from './components/lectures/lecture7/Lecture7View';
`;
const bundle = await build({
  stdin: { contents: entry, resolveDir: directory, loader: 'tsx' },
  bundle: true,
  write: false,
  platform: 'node',
  format: 'cjs',
  jsx: 'automatic',
  external: ['react', 'react-dom', 'react/*', 'react-dom/*'],
  loader: { '.css': 'empty' },
  define: { 'import.meta.env.BASE_URL': JSON.stringify('/nested/orthodontics/') },
  logLevel: 'silent',
});
const module = { exports: {} };
new Function('require', 'module', 'exports', bundle.outputFiles[0].text)(
  createRequire(import.meta.url), module, module.exports,
);
const { Content, LECTURES_META, LECTURE_ASSETS } = module.exports;
const escapeText = (text) => renderToStaticMarkup(createElement('span', null, text)).slice(6, -7);

for (const meta of LECTURES_META) {
  test(`${meta.id}: content-only hero, objectives, scope and subpath-safe PDF`, () => {
    const html = renderToStaticMarkup(createElement(Content, { lectureId: meta.id }));
    assert.ok(html.includes(`id="lec${meta.number}-title"`));
    assert.ok(html.includes(escapeText(`Lecture ${meta.number}: ${meta.title}`)));
    for (const text of [...meta.objectives, ...meta.summaryPoints, meta.limitationsNote]) {
      assert.ok(html.includes(escapeText(text)), text);
    }
    assert.ok(html.includes(`href="${LECTURE_ASSETS.pdfs[meta.id]}"`));
    assert.ok(!/<(?:header|footer|main)\b/.test(html));
    assert.ok(!html.includes('Brand Guideline'));
  });

  test(`${meta.id}: five sandboxes, complete quiz and accessible controls render`, () => {
    const View = module.exports[`Lecture${meta.number}View`];
    const html = renderToStaticMarkup(createElement(View, { meta }));
    for (const sandbox of meta.sandboxes) {
      assert.equal(html.split(`id="${sandbox.id}"`).length - 1, 1, sandbox.id);
    }
    assert.equal((html.match(/<section\b/g) ?? []).length, 6);
    for (const question of meta.quiz) {
      assert.ok(html.includes(escapeText(question.prompt)), question.id);
      assert.ok(question.options.some((option) => option.id === question.correctOptionId));
      for (const option of question.options) assert.ok(html.includes(escapeText(option.text)));
    }
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
    assert.equal(ids.length, new Set(ids).size, 'No duplicate element IDs');
    for (const match of html.matchAll(/<input\b[^>]*type="range"[^>]*>/g)) {
      const id = match[0].match(/\bid="([^"]+)"/)?.[1];
      assert.ok(id && html.includes(`for="${id}"`), `Range needs a label: ${match[0]}`);
    }
    for (const [svg] of html.matchAll(/<svg\b[\s\S]*?<\/svg>/g)) {
      if (svg.includes('role="button"')) {
        assert.ok(/<svg\b[^>]*role="group"/.test(svg), 'Interactive SVGs must expose their buttons');
      }
    }
  });
}

test('lecture-6: dose figure is explicitly unverified in metadata and rendered UI', () => {
  const meta = LECTURES_META.find((lecture) => lecture.id === 'lecture-6');
  const doseStatements = [meta.subtitle, ...meta.objectives, ...meta.summaryPoints, meta.limitationsNote];
  const sourceFigures = doseStatements.filter((text) => text.includes('5.06'));
  assert.equal(sourceFigures.length, 1);
  for (const text of sourceFigures) {
    assert.match(text, /unverified source figure/);
    assert.match(text, /value and units require faculty verification/);
    assert.match(text, /must not be used as a validated dose estimate/);
  }
  const hero = renderToStaticMarkup(createElement(Content, { lectureId: meta.id }));
  const view = renderToStaticMarkup(createElement(module.exports.Lecture6View, { meta }));
  for (const html of [hero, view]) {
    assert.match(html, /[Ee]xposure varies by equipment and protocol/);
    assert.match(html, /unverified source figure/);
    assert.match(html, /value and units require faculty verification/);
    const doseLabels = [...html.matchAll(/<(span|p)\b[^>]*>([^<]*5\.06 rad[^<]*)<\/\1>/g)];
    assert.ok(doseLabels.length >= 1);
    assert.equal(doseLabels.length, (html.match(/5\.06 rad/g) ?? []).length);
    for (const [, , label] of doseLabels) {
      assert.match(label, /unverified source figure/);
      assert.match(label, /value and units require faculty verification/);
      assert.match(label, /not.*validated dose estimate/);
    }
    assert.doesNotMatch(html, /low[- ]dose|less than four IOPAs|&lt; 4 IOPAs|50%|70%|digital dose advantages/i);
  }
});

test('all four PDFs and brand image are present and unmodified asset formats', async () => {
  const assets = [...Object.values(LECTURE_ASSETS.pdfs), LECTURE_ASSETS.brandImage];
  for (const url of assets) {
    assert.ok(url.startsWith('/nested/orthodontics/assets/orthodontics-04-07/'));
    const bytes = await readFile(resolve(subjectDirectory, 'public/assets/orthodontics-04-07', url.split('/').at(-1)));
    if (url.endsWith('.pdf')) assert.equal(bytes.subarray(0, 5).toString(), '%PDF-');
    else assert.deepEqual([...bytes.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  }
});

test('browser bundle preserves lazy lecture chunks without writing build artifacts', async () => {
  const result = await build({
    entryPoints: [resolve(directory, 'App.tsx')],
    outdir: resolve(directory, '.validation'),
    bundle: true,
    write: false,
    splitting: true,
    format: 'esm',
    platform: 'browser',
    jsx: 'automatic',
    define: { 'import.meta.env.BASE_URL': JSON.stringify('/nested/orthodontics/') },
    logLevel: 'silent',
  });
  for (const number of [4, 5, 6, 7]) {
    assert.ok(result.outputFiles.some((file) => file.path.includes(`Lecture${number}View-`)));
  }
  assert.ok(result.outputFiles.some((file) => file.path.endsWith('.css')));
});
