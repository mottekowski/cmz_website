/**
 * Build-time legal details only. Never commit actual private values or use
 * PUBLIC_-prefixed variables. Astro generates static HTML during the build.
 *
 * When publishing, the imprint/contact details WILL appear in the deployed
 * HTML, as legally required; the source repository remains free of them.
 */
function privateBuildValue(variable: string): string | null {
  return process.env[variable]?.trim() || null;
}

export const site = {
  name: 'Christoph Zink',
  url: 'https://www.christoph-zink.de',
  title: 'Christoph Zink — Between Signal and Noise.',
  description: 'Strukturen, Verbindungen und neue Perspektiven. Der persönliche digitale Raum von Christoph Zink zwischen IT-Architektur, künstlicher Intelligenz, Musik und visueller Kunst.',
  indexable: false,
  publicationApproved: false,
  // Only needed on legal pages; the homepage has no contact call to action.
  email: privateBuildValue('CMZ_LEGAL_EMAIL'),
  legal: {
    responsibleName: privateBuildValue('CMZ_LEGAL_NAME'),
    streetAndNumber: privateBuildValue('CMZ_LEGAL_STREET'),
    postalCodeAndCity: privateBuildValue('CMZ_LEGAL_CITY'),
    country: privateBuildValue('CMZ_LEGAL_COUNTRY'),
    additionalRequiredInformation: privateBuildValue('CMZ_LEGAL_EXTRA'),
    // Explicit legal review remains required; no automatic release from env.
    imprintReviewed: false,
    privacyText: privateBuildValue('CMZ_PRIVACY_ADDITIONAL'),
    hostingProvider: privateBuildValue('CMZ_HOSTING_PROVIDER'),
    hostingLocation: privateBuildValue('CMZ_HOSTING_LOCATION'),
    serverLogPolicy: privateBuildValue('CMZ_SERVER_LOG_POLICY'),
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

/** A production-approved privacy page needs verified operator and log details. */
export function validatePrivacyForBuild(production: boolean, config = site) {
  if (!production || !config.publicationApproved) return;
  const required = [
    ['CMZ_LEGAL_NAME', config.legal.responsibleName],
    ['CMZ_LEGAL_STREET', config.legal.streetAndNumber],
    ['CMZ_LEGAL_CITY', config.legal.postalCodeAndCity],
    ['CMZ_LEGAL_EMAIL', config.email],
    ['CMZ_SERVER_LOG_POLICY', config.legal.serverLogPolicy],
  ];
  const missing = required.filter(([, value]) => !value?.trim()).map(([key]) => key);
  if (missing.length || !config.legal.privacyReviewed) {
    const review = config.legal.privacyReviewed ? [] : ['Datenschutzerklärung rechtlich prüfen und freigeben'];
    throw new Error(`Datenschutzerklärung unvollständig: ${[...missing, ...review].join(', ')}.`);
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
