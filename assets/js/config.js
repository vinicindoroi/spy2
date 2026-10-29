/* Love Finder Original — config.js: environment + checkout endpoint (single source)
   Port 1:1 of private-quizz (branch version-v1-two-backoffer-vsl-6min). */
export const API_BASE_URL = (
  document.querySelector('meta[name="lf-api-base"]')?.content ||
  window.LF_API_BASE_URL ||
  'https://private-quizz-api-production.up.railway.app'
).replace(/\/$/, '');

export const CHECKOUT_URL = 'https://go.centerpag.com/PPU38CQGU6O';

/* Per-offer variables: price, anchor, discount, CTA, checkout and back-trap target.
   Pages select one via data-offer="back39" | "back29" on #offerRoot.
   CHECKOUT_URL above is the main offer (report page). */
export const OFFERS = {
  back39: {
    price: 39, was: 47, save: 8,
    cta: 'Show Me What You Found for $39',
    checkoutUrl: "https://go.centerpag.com/PPU38CQGU6S",
    next: '../last-chance-offer-29/',
  },
  back29: {
    price: 29, was: 47, save: 18,
    cta: 'Unlock For $29',
    checkoutUrl: "https://go.centerpag.com/PPU38CQGU6T",
    next: '',
  },
};
