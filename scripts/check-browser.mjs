import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { readSiteConfig } from './site-config.mjs';

const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4321';
const channel = process.env.BROWSER_CHANNEL || (process.platform === 'win32' ? 'msedge' : 'chromium');
const browser = await chromium.launch({ channel, headless: true });
const reports = [];
const site = await readSiteConfig();
await mkdir('.qa', { recursive: true });
try {
  for (const width of [1440, 1024, 768, 390, 320]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const external = [];
    const errors = [];
    page.on('request', request => { if (!request.url().startsWith(base)) external.push(request.url()); });
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('main section').count(), 5);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${width}: horizontal overflow`);
    const headingClips = await page.locator('h1 span, h2, h3').evaluateAll(elements => elements.flatMap(element => {
      const range = document.createRange();
      range.selectNodeContents(element);
      return [...range.getClientRects()].filter(rect => rect.right > innerWidth + 1 || rect.left < -1).map(() => element.textContent);
    }));
    assert.deepEqual(headingClips, [], `${width}: clipped heading`);
    assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), 'auto');
    await page.keyboard.press('Tab');
    assert.equal(await page.locator('.skip-link').evaluate(element => element === document.activeElement), true);
    await page.keyboard.press('Enter');
    assert.equal(new URL(page.url()).hash, '#inhalt');
    for (const [label, id] of [['Über mich', 'ueber-mich'], ['Themen', 'themen'], ['Impulse', 'impulse'], ['Kontakt', 'kontakt'], ['Start', 'start']]) {
      await page.getByRole('navigation', { name: 'Hauptnavigation' }).getByRole('link', { name: label, exact: true }).click();
      assert.equal(new URL(page.url()).hash, `#${id}`);
    }
    if (!site.email) assert.equal(await page.getByRole('button', { name: 'KONTAKT AUFNEHMEN' }).isDisabled(), true);
    const accessibility = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice']).analyze();
    const violations = accessibility.violations.map(({ id, impact, nodes }) => ({ id, impact, elements: nodes.map(node => node.target) }));
    reports.push({ width, violations, external, errors });
    await page.mouse.click(width - 4, 1);
    await page.screenshot({ path: `.qa/home-${width}.png`, fullPage: true });
    if (width === 1440) await page.screenshot({ path: '.qa/hero-desktop.png' });
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
  console.log(JSON.stringify(reports, null, 2));
  assert(reports.every(report => report.violations.length === 0), 'Accessibility violations; see .qa/browser-report.json');
  console.log('PASS: five viewports, navigation, keyboard skip link, reduced motion, no third-party requests, no JS fallback, legal routes and axe checks.');
} finally {
  await browser.close();
}
