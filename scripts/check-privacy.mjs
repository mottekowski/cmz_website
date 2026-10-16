import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { stripTypeScriptTypes } from 'node:module';

const source = stripTypeScriptTypes(await readFile(new URL('../src/config/site.ts', import.meta.url), 'utf8'));
const { site, validatePrivacyForBuild } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const complete = {
  ...site,
  publicationApproved: true,
  email: 'test@example.invalid',
  legal: {
    ...site.legal,
    responsibleName: 'Testperson',
    streetAndNumber: 'Teststraße 1',
    postalCodeAndCity: '12345 Testort',
    serverLogPolicy: 'Bestätigte Regelung für die Produktvariante',
    privacyReviewed: true,
  },
};
assert.doesNotThrow(() => validatePrivacyForBuild(true, complete));
for (const [field, variable] of [
  ['responsibleName', 'CMZ_LEGAL_NAME'],
  ['streetAndNumber', 'CMZ_LEGAL_STREET'],
  ['postalCodeAndCity', 'CMZ_LEGAL_CITY'],
  ['serverLogPolicy', 'CMZ_SERVER_LOG_POLICY'],
]) {
  assert.throws(() => validatePrivacyForBuild(true, { ...complete, legal: { ...complete.legal, [field]: null } }), new RegExp(variable));
}
assert.throws(() => validatePrivacyForBuild(true, { ...complete, email: null }), /CMZ_LEGAL_EMAIL/);
assert.throws(() => validatePrivacyForBuild(true, { ...complete, legal: { ...complete.legal, privacyReviewed: false } }), /rechtlich prüfen/);
assert.doesNotThrow(() => validatePrivacyForBuild(false, site));
assert.doesNotThrow(() => validatePrivacyForBuild(true, site));

const page = await readFile('dist/datenschutz/index.html', 'utf8');
for (const text of [
  'Host Europe GmbH',
  'Art. 6 Abs. 1 lit. f DSGVO',
  'anonymisierte Protokollierung',
  '1&amp;1 Mail &amp; Media GmbH',
  'keine eigenen Tracking- oder Analysewerkzeuge',
  'Landesbeauftragten für Datenschutz und Informationsfreiheit Nordrhein-Westfalen',
]) assert(page.includes(text), `Missing privacy text: ${text}`);
assert.doesNotMatch(page, /Arbeitsentwurf|OFFEN|Drittländer|Hosting-Standort|Geprüfte Datenschutzerklärung/);
console.log('PASS: approved production requires confirmed privacy details; current draft stays buildable; generated privacy page has no placeholders or removed draft language.');
