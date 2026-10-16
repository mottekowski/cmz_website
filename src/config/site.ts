/** Local draft. Fill only with verified, owner-supplied information. */
export const site = {
  name: 'Christoph Zink',
  url: 'https://www.christoph-zink.de',
  title: 'Christoph Zink — Between Signal and Noise.',
  description: 'Strukturen, Verbindungen und neue Perspektiven. Der persönliche digitale Raum von Christoph Zink zwischen IT-Architektur, künstlicher Intelligenz, Musik und visueller Kunst.',
  indexable: false,
  publicationApproved: false,
  email: process.env.CMZ_LEGAL_EMAIL?.trim() || null, // Build-time value from ignored .env.private; imprint only.
  legal: {
    responsibleName: process.env.CMZ_LEGAL_NAME?.trim() || null,
    streetAndNumber: process.env.CMZ_LEGAL_STREET?.trim() || null,
    postalCodeAndCity: process.env.CMZ_LEGAL_CITY?.trim() || null,
    country: null as string | null,
    additionalRequiredInformation: null as string | null,
    imprintReviewed: false,
    privacyText: null as string | null,
    hostingProvider: null as string | null,
    hostingLocation: null as string | null,
    serverLogPolicy: null as string | null,
    privacyReviewed: false,
  },
};

/** Presence check only; the address's actual deliverability needs owner review. */
export function validateImprintForBuild(production: boolean, config = site) {
  if (!production || !config.publicationApproved) return;
  const required = [
    ['CMZ_LEGAL_NAME', config.legal.responsibleName],
    ['CMZ_LEGAL_STREET', config.legal.streetAndNumber],
    ['CMZ_LEGAL_CITY', config.legal.postalCodeAndCity],
  ];
  const missing = required.filter(([, value]) => !value?.trim()).map(([key]) => key);
  if (missing.length) {
    throw new Error(`Impressum unvollständig: Für den freigegebenen Produktionsbuild fehlen Name oder Anschrift. Lokale Build-Variablen ergänzen: ${missing.join(', ')}.`);
  }
}

/** ASSET REPLACEMENT: replace paths with approved, text-free local artwork.
 * Keep decorative images empty-alt; preserve composition and text contrast.
 * Never use the design screenshots in references/ as production assets.
 */
export const artwork = {
  hero: '/art/hero-atmosphere.svg',
  about: '/art/threshold.svg',
};
