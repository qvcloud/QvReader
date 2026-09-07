/**
 * QvReader Edition & Licensing Configuration
 */

export const isDevOrTest =
  Boolean(import.meta.env?.DEV) ||
  (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') ||
  import.meta.env?.MODE === 'test';

export const isOfficialBuild = Boolean(import.meta.env?.VITE_OFFICIAL_BUILD === 'true');

export const EDITION_CONFIG = {
  /** Commercial checkout URL on Creem */
  creemCheckoutUrl: 'https://www.creem.io/payment/prod_3Iqu6TZflQJHvDu0nqDMn9',
  /** Creem Product ID */
  creemProductId: 'prod_3Iqu6TZflQJHvDu0nqDMn9',
  /** Display price */
  priceDisplay: '$9.99',
  /** Commercial model */
  licenseModel: 'lifetime_buyout' as const,
  /** Maximum free trial sessions for Pro editing */
  maxTrialSessions: 100,
  /** Minimum devices supported per license */
  maxDevices: 3,
  /** Official website URL */
  officialWebsiteUrl: 'https://qvreader.com',
  /** Current build edition ('community' | 'pro') */
  edition: (import.meta.env?.VITE_EDITION as 'community' | 'pro') || (isOfficialBuild ? 'pro' : 'community'),
  /** Whether this build is an unofficial / community build */
  isCommunityBuild: import.meta.env?.VITE_EDITION === 'community' || !isOfficialBuild,
  /** In dev/test mode, Pro capabilities are unlocked without consuming trial sessions */
  isDevOrTest,
};
