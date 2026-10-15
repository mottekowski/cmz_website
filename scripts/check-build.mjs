/** Check actual generated routes, fragments, local resources and copy contracts. */
import { readFile, readdir, stat } from 'node:fs/promises';
import { join, resolve, relative, sep } from 'node:path';
import assert from 'node:assert/strict';
import { readSiteConfig } from './site-config.mjs';

const root = resolve('dist');
const site = await readSiteConfig();
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory() ? walk(join(dir, entry.name)) : join(dir, entry.name)))).flat();
}
const files = await walk(root);
const htmlFiles = files.filter(file => file.endsWith('.html'));
let links = 0;
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  assert.match(html, /<html lang="de">/);
  assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1, `${file}: one h1 required`);
  assert.doesNotMatch(html, /schnittvisite|<iframe|<script[^>]*src="https?:|src="https?:|\/references\//i);
  if (!site.indexable) assert.match(html, /name="robots" content="noindex, nofollow"/, 'Draft must not be indexed');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${file}: duplicate ids`);
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const url = match[1];
    if (/^(?:https?:|mailto:|data:)/.test(url)) continue;
    const [pathname, fragment] = url.split('#');
    let target = pathname ? resolve(root, `.${pathname}`) : file;
    assert(!relative(root, target).startsWith(`..${sep}`), 'Link escapes output directory');
    const details = await stat(target).catch(() => null);
    assert(details, `${file}: missing target ${url}`);
    if (details.isDirectory()) target = join(target, 'index.html');
    const targetBody = await readFile(target, 'utf8');
    if (fragment) assert(targetBody.includes(`id="${fragment}"`), `${file}: missing fragment ${url}`);
    links++;
  }
}
const home = await readFile(join(root, 'index.html'), 'utf8');
const visible = home.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
const brief = await readFile('CREATIVE_BRIEF.md', 'utf8');
const approved = [...brief.matchAll(/^> (.+)$/gm)].map(match => match[1].trim());
for (const copy of approved) assert(visible.includes(copy), `Approved copy missing: ${copy}`);
assert(visible.includes('BETWEEN SIGNAL AND NOISE.'), 'Approved headline missing');
assert.equal((home.match(/<section\b/g) ?? []).length, 5, 'Expected four content sections and a quiet closing section');
assert.doesNotMatch(visible, /(?:^|[.!?]\s+)Ich\s/);
assert.doesNotMatch(home, /id="kontakt"|#kontakt|mailto:|<button\b|KONTAKT AUFNEHMEN|STAY CONNECTED\.|Kontaktadresse folgt/);
assert.match(home, /id="closing-title"[^>]*>STAY CURIOUS\.<\/h2>/);
const closing = home.match(/<section class="section closing-section"[\s\S]*?<\/section>/)?.[0];
assert(closing, 'Quiet closing section missing');
assert.doesNotMatch(closing, /<a\b|<button\b|<form\b/, 'Closing must not contain a CTA');
const approvedTopicCopy = [...brief.matchAll(/German body: `([^`]+)`/g)].map(match => match[1]);
assert.equal(approvedTopicCopy.length, 4);
for (const copy of approvedTopicCopy) assert(visible.includes(copy), `Topic copy missing: ${copy}`);
if (!site.indexable) assert.match(await readFile(join(root, 'robots.txt'), 'utf8'), /Disallow: \//);
console.log(`PASS: ${htmlFiles.length} HTML pages, ${links} local links/assets, four content sections plus closing, approved hero/about/topic copy, draft indexing and no contact CTA.`);
console.log(`Output: ${files.length} files; no reference images or remote media included.`);
