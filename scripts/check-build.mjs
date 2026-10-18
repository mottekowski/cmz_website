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
const htmlFiles = files.filter(file => file.endsWith('.html') && !relative(root, file).startsWith('google'));
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
const privacy = await readFile(join(root, 'datenschutz/index.html'), 'utf8');
const onRepeat = await readFile(join(root, 'on-repeat/index.html'), 'utf8');
const visible = home.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
const brief = await readFile('CREATIVE_BRIEF.md', 'utf8');
const approved = [...brief.matchAll(/^> (.+)$/gm)].map(match => match[1].trim());
for (const copy of approved) assert(visible.includes(copy), `Approved copy missing: ${copy}`);
assert(visible.includes('BETWEEN SIGNAL AND NOISE.'), 'Approved headline missing');
assert.equal((home.match(/<section\b/g) ?? []).length, 5, 'Expected four content sections and a quiet closing section');
assert.doesNotMatch(visible, /(?:^|[.!?]\s+)Ich\s/);
assert.doesNotMatch(home, /id="kontakt"|#kontakt|mailto:|<button\b|KONTAKT AUFNEHMEN|STAY CONNECTED\.|Kontaktadresse folgt/);
assert.match(home, /id="closing-title"[^>]*>STAY CURIOUS\.<\/h2>/);
assert.match(home, /src="\/art\/portrait-amber\.webp"/);
assert.doesNotMatch(home, /src="\/art\/threshold\.svg"/);
assert.match(home, /href="\/on-repeat\/"/, 'ON REPEAT card must link to its published route');
assert.match(home, /ON REPEAT\.<\/h3>[\s\S]*?ENTDECKEN/, 'ON REPEAT card must expose its discovery link');
const closing = home.match(/<section class="section closing-section"[\s\S]*?<\/section>/)?.[0];
assert(closing, 'Quiet closing section missing');
assert.doesNotMatch(closing, /<a\b|<button\b|<form\b/, 'Closing must not contain a CTA');
const approvedTopicCopy = [...brief.matchAll(/German body: `([^`]+)`/g)].map(match => match[1]);
assert.equal(approvedTopicCopy.length, 4);
for (const copy of approvedTopicCopy) assert(visible.includes(copy), `Topic copy missing: ${copy}`);
const robots = await readFile(join(root, 'robots.txt'), 'utf8');
const sitemap = await readFile(join(root, 'sitemap.xml'), 'utf8');
if (site.indexable) {
  assert.match(home, /<title>Curious Current — Christoph Zink<\/title>/);
  assert.match(home, /name="description" content="Curious Current ist der persönliche kreative Raum von Christoph Zink\./);
  assert.match(home, /rel="canonical" href="https:\/\/curiouscurrent\.xyz\/"/);
  assert.match(onRepeat, /rel="canonical" href="https:\/\/curiouscurrent\.xyz\/on-repeat\/"/);
  assert.match(home, /"@type":"WebSite"/);
  assert.match(home, /"@id":"https:\/\/curiouscurrent\.xyz\/#website"/);
  assert.match(home, /"@type":"Person"/);
  assert.match(home, /"name":"Christoph Zink"/);
  assert.match(home, /An independent space by Christoph Zink\./);
  assert.match(robots, /Allow: \//);
  assert.match(robots, /Sitemap: https:\/\/curiouscurrent\.xyz\/sitemap\.xml/);
  assert.match(sitemap, /https:\/\/curiouscurrent\.xyz\//);
  assert.match(sitemap, /https:\/\/curiouscurrent\.xyz\/on-repeat\//);
} else {
  assert.match(robots, /Disallow: \//);
}
assert.doesNotMatch(privacy, /Arbeitsentwurf|OFFEN|Drittländer|Hosting-Standort|Geprüfte Datenschutzerklärung/);
assert.match(privacy, /Host Europe GmbH/);
assert.match(privacy, /1&amp;1 Mail &amp; Media GmbH/);
assert.match(onRepeat, /<title>ON REPEAT — Curious Current<\/title>/);
assert.match(onRepeat, /href="\/#impulse"/, 'ON REPEAT needs a return path to Selected Signals');
assert.equal((onRepeat.match(/<article class="music-story"/g) ?? []).length, 3, 'Expected three music stories');
assert.equal((onRepeat.match(/target="_blank" rel="noopener noreferrer"/g) ?? []).length, 3, 'Spotify links must open safely in a new tab');
for (const [artist, track, url, paragraphs] of [
  ['LINKIN PARK', 'IN THE END', 'https://open.spotify.com/track/60a0Rd6pjrkxjPbaKzXjfq', ['Manche Songs bleiben, weil sie etwas berühren, das sich nur schwer in Worte fassen lässt.', '„In the End“ ist für mich einer dieser Songs.', 'Nicht jeder Weg war einfach. Manche Erfahrungen hinterlassen Spuren, andere begleiten einen ein Leben lang. All das hat mich geprägt und gehört zu dem Menschen, der ich heute bin.', 'Mit meinen Stärken. Mit meinen Schwächen.', 'Und mit allem dazwischen.']],
  ['EMMANUEL TOP', 'ACID PHASE', 'https://open.spotify.com/track/3096gFW9ESHwrlesPicxBu', ['Musik braucht keine Worte. Sie kann eine Wucht entfalten, der man sich kaum entziehen kann.', 'Ein treibender Rhythmus. Eine Bassline. Wiederholungen, die sich langsam verändern und eine ganz eigene Dynamik entwickeln.', '„Acid Phase“ von Emmanuel Top ist für mich genau das. Wenige Elemente, die sich überlagern, verändern und eine hypnotische Wirkung entfalten.', 'Was zunächst einfach erscheint, entwickelt mit jedem Takt eine neue Intensität.', 'Musik, die nicht nur gehört, sondern erlebt wird.']],
  ['ECCA VANDAL', 'CRUISING TO SELF SOOTHE', 'https://open.spotify.com/track/43YEV5eMkQYdkk27WV1Bkv', ['Die Energie war zuerst da.', '„Cruising to Self Soothe“ von Ecca Vandal ist roh, direkt und voller Bewegung. Ein Sound, der vom ersten Moment an mitreißt und keine große Erklärung braucht.', 'Doch hinter dieser Energie steckt mehr. Der Gedanke, durch Bewegung wieder zu sich selbst zu finden, Unsicherheit zu überwinden und dem eigenen Weg zu vertrauen, gibt dem Song eine weitere Dimension.', 'Zuerst hat mich die Musik gepackt. Die Bedeutung dahinter macht das Ganze noch intensiver.', 'Eine Entdeckung, die bleibt.']],
]) {
  assert(onRepeat.includes(`${artist} <span>—</span> ${track}`), `${artist} track heading missing`);
  assert(onRepeat.includes(`href="${url}"`), `${artist} Spotify URL missing`);
  for (const paragraph of paragraphs) assert(onRepeat.includes(paragraph), `Approved ON REPEAT copy missing: ${paragraph}`);
}
console.log(`PASS: ${htmlFiles.length} HTML pages, ${links} local links/assets, four content sections plus closing, SEO metadata and no contact CTA.`);
console.log(`Output: ${files.length} files; no reference images or remote media included.`);
