/** Read TypeScript config without adding a runtime dependency (Node >=22.18). */
import { readSiteConfig } from './site-config.mjs';
const site = await readSiteConfig();
const missing = [];
if (!site.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(site.email)) missing.push('Gültige, vom Inhaber freigegebene E-Mail-Adresse für das Impressum');
for (const [field, value] of Object.entries(site.legal)) if (!value) missing.push(`site.legal.${field}`);
if (!site.publicationApproved) missing.push('Ausdrückliches OK des Inhabers zur Veröffentlichung');
if (!site.indexable) missing.push('Bewusste Freigabe der Indexierung nach Abschluss der Prüfung');
if (missing.length) {
  console.error(`NICHT VERÖFFENTLICHUNGSFÄHIG:\n${missing.map(item => `- ${item}`).join('\n')}`);
  process.exitCode = 1;
} else console.log('Konfiguration vollständig. Dieses Skript veröffentlicht nichts und ersetzt keine inhaltliche/rechtliche Prüfung.');
