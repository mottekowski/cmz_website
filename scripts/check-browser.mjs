import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4321';
const channel = process.env.BROWSER_CHANNEL || (process.platform === 'win32' ? 'msedge' : 'chromium');
const browser = await chromium.launch({ channel, headless: true });
const reports = [];
const captures = [];
const reviewDir = 'review/2026-10-15';
await mkdir('.qa', { recursive: true });
await mkdir(reviewDir, { recursive: true });
async function capture(target, filename, options = {}) {
  const file = join(reviewDir, filename);
  const bytes = await target.screenshot({ path: file, ...options });
  captures.push({ file: file.replaceAll('\\', '/'), width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20), sha256: createHash('sha256').update(bytes).digest('hex') });
}
try {
  for (const width of [1440, 1024, 768, 720, 430, 390, 320]) {
    const height = width <= 430 ? 844 : 900;
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce', deviceScaleFactor: 1 });
    const page = await context.newPage();
    const external = [];
    const errors = [];
    page.on('request', request => { if (!request.url().startsWith(base)) external.push(request.url()); });
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.evaluate(() => document.fonts.check('300 32px "Manrope Variable"')), true, 'Local font did not load');
    assert.equal(await page.locator('main section').count(), 5);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${width}: horizontal overflow`);
    const headingClips = await page.locator('h1 span, h2, h3').evaluateAll(elements => elements.flatMap(element => {
      const range = document.createRange();
      range.selectNodeContents(element);
      return [...range.getClientRects()].filter(rect => rect.right > innerWidth + 1 || rect.left < -1).map(() => element.textContent);
    }));
    assert.deepEqual(headingClips, [], `${width}: clipped heading`);
    const heroLines = await page.locator('h1 > span').evaluateAll(elements => elements.map(element => {
      const range = document.createRange();
      range.selectNodeContents(element);
      const bounds = element.closest('.hero').getBoundingClientRect();
      const rects = [...range.getClientRects()];
      return { text: element.textContent, lines: rects.length, fits: rects.every(rect => rect.right <= bounds.right + 1 && rect.left >= bounds.left - 1) };
    }));
    assert.deepEqual(heroLines.map(line => line.text), ['BETWEEN', 'SIGNAL', 'AND NOISE.']);
    assert(heroLines.every(line => line.lines === 1 && line.fits), `${width}: hero must keep three unclipped lines`);
    assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), 'auto');
    await page.keyboard.press('Tab');
    assert.equal(await page.locator('.skip-link').evaluate(element => element === document.activeElement), true);
    await page.keyboard.press('Enter');
    assert.equal(new URL(page.url()).hash, '#inhalt');
    for (const [label, id] of [['Über mich', 'ueber-mich'], ['Themen', 'themen'], ['Impulse', 'impulse'], ['Start', 'start']]) {
      await page.getByRole('navigation', { name: 'Hauptnavigation' }).getByRole('link', { name: label, exact: true }).click();
      assert.equal(new URL(page.url()).hash, `#${id}`);
    }
    assert.equal(await page.locator('#kontakt, a[href*="#kontakt"], a[href^="mailto:"], button').count(), 0, 'Contact UI must be removed');
    assert.equal(await page.getByRole('navigation', { name: 'Hauptnavigation' }).getByRole('link').count(), 4);
    assert.equal(await page.locator('.closing-section h2').innerText(), 'STAY CURIOUS.');
    assert.equal(await page.locator('.closing-section a, .closing-section button').count(), 0);
    // Load every below-the-fold image before the full-page design captures.
    for (const img of await page.locator('main img').all()) await img.scrollIntoViewIfNeeded();
    await page.evaluate(async () => {
      await Promise.all([...document.images].map(img => img.decode()));
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
    const accessibility = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice']).analyze();
    const violations = accessibility.violations.map(({ id, impact, nodes }) => ({ id, impact, elements: nodes.map(node => node.target) }));
    reports.push({ width, height, heroLines, violations, external, errors });
    await page.mouse.click(width - 4, 1);
    await page.screenshot({ path: `.qa/home-${width}.png`, fullPage: true });
    if (width === 1440 || width === 390) {
      const name = width === 1440 ? 'desktop-1440' : 'mobile-390';
      await capture(page, `homepage-${name}.png`, { fullPage: true });
      await capture(page, `hero-${name}.png`);
      if (width === 1440) await capture(page.locator('#themen'), 'topics-desktop-1440.png');
    }
    assert.deepEqual(external, [], 'Unexpected external requests');
    assert.deepEqual(errors, [], 'Browser errors');
    await context.close();
  }
  const plain = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await plain.newPage();
  await page.goto(base);
  await page.getByRole('link', { name: 'MEINE WELT ENTDECKEN' }).click();
  assert.equal(new URL(page.url()).hash, '#themen');
  for (const route of ['/impressum/', '/datenschutz/', '/404.html']) {
    await page.goto(`${base}${route}`);
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.getByRole('navigation', { name: 'Hauptnavigation' }).getByRole('link', { name: 'Kontakt', exact: true }).count(), 0);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${route}: overflow`);
  }
  await plain.close();
  const legalContext = await browser.newContext();
  const legalPage = await legalContext.newPage();
  for (const route of ['/impressum/', '/datenschutz/', '/404.html']) {
    await legalPage.goto(`${base}${route}`);
    const result = await new AxeBuilder({ page: legalPage }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice']).analyze();
    reports.push({ route, violations: result.violations.map(({ id, impact }) => ({ id, impact })) });
  }
  await legalContext.close();
  await writeFile('.qa/browser-report.json', JSON.stringify(reports, null, 2));
  await writeFile(join(reviewDir, 'browser-report.json'), JSON.stringify({ browser: `${channel} ${browser.version()}`, reducedMotion: 'reduce', deviceScaleFactor: 1, reports, captures }, null, 2));
  console.log(JSON.stringify(reports, null, 2));
  assert(reports.every(report => report.violations.length === 0), 'Accessibility violations; see .qa/browser-report.json');
  console.log('PASS: seven viewports, three-line hero, no contact UI, quiet closing, navigation, keyboard skip link, reduced motion, no third-party requests, no JS fallback, legal routes and axe checks.');
} finally {
  await browser.close();
}
