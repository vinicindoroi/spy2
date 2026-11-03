/* Love Finder Original — config.js: environment + checkout endpoint (single source)
   Port 1:1 of private-quizz (branch version-v1-two-backoffer-vsl-6min). */
export const API_BASE_URL = (
  document.querySelector('meta[name="lf-api-base"]')?.content ||
  window.LF_API_BASE_URL ||
  'https://private-quizz-api-production.up.railway.app'
).replace(/\/$/, '');

/* Checkout A/B Split (50% / 50%) */
export const CHECKOUT_VARIANTS = {
  A: {
    id: 'a',
    name: 'spy_official',
    host: 'secure.spy.officialprogram.online',
    baseUrl: 'https://secure.spy.officialprogram.online',
  },
  B: {
    id: 'b',
    name: 'pay_online',
    host: 'spy-secure.pay-online.lat',
    baseUrl: 'https://spy-secure.pay-online.lat',
  },
};

/**
 * Returns the assigned checkout variant for the session (50/50 split).
 * Preserves stickiness via sessionStorage so a user remains on the same checkout throughout the funnel.
 * Supports manual override: ?ck=a | ?ck=b | ?checkout=pay-online | ?checkout=spy
 */
export function getCheckoutVariant() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const forceCk = (urlParams.get('ck') || urlParams.get('checkout') || urlParams.get('split') || '').toLowerCase();
    
    if (forceCk === 'b' || forceCk.includes('pay-online') || forceCk === 'lat') {
      try { sessionStorage.setItem('lf_checkout_variant', 'B'); } catch (e) {}
      return CHECKOUT_VARIANTS.B;
    }
    if (forceCk === 'a' || forceCk.includes('official') || forceCk.includes('secure.spy')) {
      try { sessionStorage.setItem('lf_checkout_variant', 'A'); } catch (e) {}
      return CHECKOUT_VARIANTS.A;
    }

    let stored = '';
    try { stored = sessionStorage.getItem('lf_checkout_variant'); } catch (e) {}
    if (stored === 'B') return CHECKOUT_VARIANTS.B;
    if (stored === 'A') return CHECKOUT_VARIANTS.A;

    // 50% / 50% distribution
    const chosen = Math.random() < 0.5 ? 'A' : 'B';
    try { sessionStorage.setItem('lf_checkout_variant', chosen); } catch (e) {}
    return CHECKOUT_VARIANTS[chosen];
  } catch (e) {
    return Math.random() < 0.5 ? CHECKOUT_VARIANTS.A : CHECKOUT_VARIANTS.B;
  }
}

/**
 * Builds a checkout URL for the selected variant, injecting identification parameters
 * so the origin checkout is permanently recorded on Stripe customer/payment metadata.
 */
export function buildCheckoutUrl(params = {}) {
  const variant = getCheckoutVariant();
  const url = new URL(variant.baseUrl);

  // Parâmetros para identificação na Stripe e ferramentas de rastreio
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

export const CHECKOUT_URL = CHECKOUT_VARIANTS.A.baseUrl;

/* Per-offer variables: price, anchor, discount, CTA, checkout and back-trap target.
   Pages select one via data-offer="back39" | "back29" on #offerRoot. */
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
