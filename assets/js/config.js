/* Love Finder Original — config.js: environment + checkout endpoint (single source)
   Port 1:1 of private-quizz (branch version-v1-two-backoffer-vsl-6min). */
export const API_BASE_URL = (
  document.querySelector('meta[name="lf-api-base"]')?.content ||
  window.LF_API_BASE_URL ||
  'https://private-quizz-api-production.up.railway.app'
).replace(/\/$/, '');

/* Checkout Variant B (100% Traffic) */
export const CHECKOUT_VARIANTS = {
  A: {
    id: 'a',
    name: 'spy_lat',
    host: 'spy.pay-online.lat',
    baseUrl: 'https://spy.pay-online.lat',
  },
  B: {
    id: 'b',
    name: 'spy_secure_lat',
    host: 'spy-secure.pay-online.lat',
    baseUrl: 'https://spy-secure.pay-online.lat',
  },
};

export const CHECKOUT_URL = CHECKOUT_VARIANTS.B.baseUrl;

/**
 * Returns Variant B (100% of traffic dedicated to spy-secure.pay-online.lat).
 */
export function getCheckoutVariant() {
  return CHECKOUT_VARIANTS.B;
}

/**
 * Builds a checkout URL for Variant B, injecting identification parameters
 * so the origin checkout is permanently recorded on Stripe customer/payment metadata.
 */
export function buildCheckoutUrl(params = {}) {
  const variant = CHECKOUT_VARIANTS.B;
  const url = new URL(variant.baseUrl);

  url.searchParams.set('checkout_variant', variant.id);
  url.searchParams.set('checkout_source', variant.name);
  url.searchParams.set('checkout_host', variant.host);
  url.searchParams.set('utm_checkout', variant.name);

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  }

  return url;
}

/* Per-offer variables: price, anchor, discount, CTA, checkout and back-trap target.
   Pages select one via data-offer="back39" | "back29" on #offerRoot.
   CHECKOUT_URL above is the main offer (report page). */
export const OFFERS = {
  back39: {
    price: 39, was: 47, save: 8,
    cta: 'Show Me What You Found for $39',
    next: '../last-chance-offer-29/',
  },
  back29: {
    price: 29, was: 47, save: 18,
    cta: 'Unlock For $29',
    next: '',
  },
};
