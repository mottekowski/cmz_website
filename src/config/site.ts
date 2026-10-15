/** Local draft. Fill only with verified, owner-supplied information. */
export const site = {
  name: 'Christoph Zink',
  url: 'https://www.christoph-zink.de',
  title: 'Christoph Zink — Between Signal and Noise.',
  description: 'Strukturen, Verbindungen und neue Perspektiven. Der persönliche digitale Raum von Christoph Zink zwischen IT-Architektur, künstlicher Intelligenz, Musik und visueller Kunst.',
  indexable: false,
  publicationApproved: false,
  email: null as string | null,
  legal: {
    responsibleName: null as string | null,
    streetAndNumber: null as string | null,
    postalCodeAndCity: null as string | null,
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

/** ASSET REPLACEMENT: replace paths with approved, text-free local artwork.
 * Keep decorative images empty-alt; preserve composition and text contrast.
 * Never use the design screenshots in references/ as production assets.
 */
export const artwork = {
  hero: '/art/hero-atmosphere.svg',
  about: '/art/threshold.svg',
};
