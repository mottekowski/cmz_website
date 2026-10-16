import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { stripTypeScriptTypes } from 'node:module';

// No private env loading or owner values needed for the validation tests.
const source = stripTypeScriptTypes(await readFile(new URL('../src/config/site.ts', import.meta.url), 'utf8'));
const { site, validateImprintForBuild, validatePrivacyForBuild } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const config = {
  ...site,
  publicationApproved: true,
  email: null,
  legal: { ...site.legal, responsibleName: 'Testperson', streetAndNumber: 'Teststraße 1', postalCodeAndCity: '12345 Testort' },
};
assert.doesNotThrow(() => validateImprintForBuild(true, config), 'Email is optional');
assert.throws(() => validatePrivacyForBuild(true, config), /CMZ_LEGAL_EMAIL/, 'Approved privacy page requires email');
const privacyConfig = { ...config, email: 'test@example.invalid', legal: { ...config.legal, serverLogPolicy: 'Bestätigte Protokollregelung', privacyReviewed: true } };
assert.doesNotThrow(() => validatePrivacyForBuild(true, privacyConfig));
assert.throws(() => validatePrivacyForBuild(true, { ...privacyConfig, legal: { ...privacyConfig.legal, serverLogPolicy: null } }), /CMZ_SERVER_LOG_POLICY/);
for (const [field, key] of [
  ['responsibleName', 'CMZ_LEGAL_NAME'],
  ['streetAndNumber', 'CMZ_LEGAL_STREET'],
  ['postalCodeAndCity', 'CMZ_LEGAL_CITY'],
]) {
  for (const value of [null, '', '   ']) {
    const incomplete = { ...config, legal: { ...config.legal, [field]: value } };
    assert.throws(() => validateImprintForBuild(true, incomplete), new RegExp(key));
    assert.doesNotThrow(() => validateImprintForBuild(false, incomplete), 'Development remains available');
    assert.doesNotThrow(() => validateImprintForBuild(true, { ...incomplete, publicationApproved: false }), 'Unapproved drafts remain buildable');
  }
}
console.log('PASS: approved production requires name and address; missing/blank fields fail; development and drafts remain buildable; email is optional.');
