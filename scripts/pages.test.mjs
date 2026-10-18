import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const modules = JSON.parse(await readFile(path.join(root, 'scripts/modules.json'), 'utf8'));
const launcher = await readFile(path.join(root, 'lunch.js'), 'utf8');
const subject = await readFile(path.join(root, 'subject.html'), 'utf8');
const redirectScript = subject.match(/<script>([\s\S]*?)<\/script>/)[1];

function redirect(id) {
  let destination;
  const status = { textContent: '' };
  vm.runInNewContext(redirectScript, {
    URL, URLSearchParams,
    document: { getElementById: () => status },
    window: { location: {
      search: `?id=${encodeURIComponent(id)}`,
      href: 'https://example.github.io/precision-dental/subject.html',
      replace: value => { destination = value; }
    } }
  });
  return { destination, status };
}

test('landing page loads lunch.js once and no longer duplicates the subject data', async () => {
  const html = await readFile(path.join(root, 'index.html'), 'utf8');
  assert.match(html, /<script src="\.\/lunch\.js"><\/script>\s*<\/body>/);
  assert.equal(html.includes('const subjects'), false);
});

test('landing cards use keyboard-accessible native links', () => {
  const grid = { innerHTML: '' };
  vm.runInNewContext(launcher, {
    document: { getElementById: () => grid },
    window: { location: { href: '' } },
  });
  assert.equal([...grid.innerHTML.matchAll(/<a\s/g)].length, modules.length);
  assert.ok(!grid.innerHTML.includes('onclick='));
  for (const module of modules) assert.ok(grid.innerHTML.includes(`./subject.html?id=${module.directory}`));
});

test('all nine cards navigate through subject.html', () => {
  const context = {
    document: { getElementById: () => ({ innerHTML: '' }) },
    window: { location: { href: '' } }
  };
  vm.createContext(context);
  vm.runInContext(launcher, context);
  assert.equal(vm.runInContext('subjects.length', context), modules.length);
  for (const module of modules) {
    context.navigateToSubject(module.directory);
    assert.equal(context.window.location.href, `./subject.html?id=${module.directory}`);
  }
});

test('Endodontics advertises both integrated lectures', () => {
  const context = {
    document: { getElementById: () => ({ innerHTML: '' }) },
    window: { location: { href: '' } }
  };
  vm.createContext(context);
  vm.runInContext(launcher, context);
  assert.equal(vm.runInContext("subjects.find(subject => subject.launchCode === 'endo-1-main').lectures", context), 2);
});

test('redirects retain the GitHub Pages repository prefix', () => {
  for (const module of modules) {
    assert.equal(redirect(module.directory).destination,
      `https://example.github.io/precision-dental/${module.directory}/index.html`);
  }
});

test('invalid subject IDs cannot redirect outside the site', () => {
  for (const id of ['', '../private', 'https://evil.example', '//evil.example', 'unknown']) {
    const result = redirect(id);
    assert.equal(result.destination, undefined);
    assert.match(result.status.textContent, /Unknown or missing/);
  }
});

test('production artifact contains every module and no source/dependency archives', async () => {
  const site = path.join(root, '_site');
  assert.ok(existsSync(path.join(site, '.nojekyll')), 'Run the complete build first');
  for (const file of ['index.html', 'subject.html', 'lunch.js', 'landing.css']) {
    assert.ok(existsSync(path.join(site, file)), `Missing ${file}`);
  }
  for (const module of modules) {
    const directory = path.join(site, module.directory);
    const html = await readFile(path.join(directory, 'index.html'), 'utf8');
    // Check Vite's generated entry asset references, not external/CDN URLs.
    for (const match of html.matchAll(/<(?:script|link|img)\b[^>]*?\b(?:src|href)=["']([^"']+)["']/g)) {
      const reference = match[1];
      if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(reference)) continue;
      assert.ok(!reference.startsWith('/'), `${module.name}: root-absolute asset ${reference}`);
      const asset = decodeURIComponent(reference.split(/[?#]/)[0]);
      assert.ok(existsSync(path.resolve(directory, asset)), `${module.name}: missing asset ${reference}`);
    }
  }
  async function check(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      assert.ok(!['node_modules', '.git', 'src', 'package.json', 'package-lock.json'].includes(entry.name),
        `Non-production file: ${path.join(directory, entry.name)}`);
      assert.ok(!/\.(?:zip|tsx?|map)$/.test(entry.name), `Source/archive file: ${entry.name}`);
      if (entry.name.endsWith('.js')) {
        const code = await readFile(path.join(directory, entry.name), 'utf8');
        assert.ok(Buffer.byteLength(code) <= 500_000, `Oversized production chunk: ${entry.name}`);
      }
      if (entry.name.endsWith('.html')) {
        const html = await readFile(path.join(directory, entry.name), 'utf8');
        assert.ok(!html.includes('cdn.tailwindcss.com'), `Development Tailwind CDN in ${entry.name}`);
        assert.ok(!html.includes('text/babel'), `Browser-side JSX compilation in ${entry.name}`);
      }
      if (entry.isDirectory()) await check(path.join(directory, entry.name));
    }
  }
  await check(site);
});
