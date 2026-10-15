/** Check release readiness without printing any private configuration values. */
import { readSiteConfig } from './site-config.mjs';

const site = await readSiteConfig();
const missing = [];

if (!site.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(site.email)) {
  missing.push('CMZ_LEGAL_EMAIL (gültige Impressums-E-Mail)');
}

const required = {
  responsibleName: 'CMZ_LEGAL_NAME',
  streetAndNumber: 'CMZ_LEGAL_STREET',
  postalCodeAndCity: 'CMZ_LEGAL_CITY',
  country: 'CMZ_LEGAL_COUNTRY',
  hostingProvider: 'CMZ_HOSTING_PROVIDER',
  hostingLocation: 'CMZ_HOSTING_LOCATION',
  serverLogPolicy: 'CMZ_SERVER_LOG_POLICY',
};
for (const [field, variable] of Object.entries(required)) {
  if (!site.legal[field]) missing.push(variable);
}

// Optional fields: legal.additionalRequiredInformation and legal.privacyText.
// Whether those need contents depends on the final legal review.
if (!site.legal.imprintReviewed) missing.push('Impressum rechtlich geprüft und freigegeben');
if (!site.legal.privacyReviewed) missing.push('Datenschutzerklärung und Hosting geprüft und freigegeben');
if (!site.publicationApproved) missing.push('Ausdrückliche Veröffentlichungsfreigabe des Inhabers');
if (!site.indexable) missing.push('Bewusste Entscheidung zur Indexierung (und .htaccess-Abgleich)');

if (missing.length) {
  console.error(`NICHT VERÖFFENTLICHUNGSFÄHIG:\n${missing.map(item => `- ${item}`).join('\n')}`);
  process.exitCode = 1;
} else {
  console.log('Konfiguration vollständig. Prüfung ersetzt keine rechtliche Abnahme und führt kein Deployment aus.');
}
