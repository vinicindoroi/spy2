/* Page: /last-chance-offer/ · /last-chance-offer-29/ — Step8BackOfferBase.vue
   (offer vars via data-* on #offerRoot; optional interaction prompt + back-trap) */
import '../navigate.js?v=20261011-sck-1';
import { store } from '../store.js?v=20261011-sck-1';
import { appendTrackingToUrl, withTracking } from '../tracking.js?v=20261011-sck-1';
import { CHECKOUT_URL, OFFERS } from '../config.js?v=20261009-1';

const $ = (id) => document.getElementById(id);
const root = $('offerRoot');

/* Offer variables come from config.js (data-* attributes still win as overrides) */
const offerCfg = OFFERS[root.dataset.offer] || {};
const cfg = {
  price: Number(root.dataset.price || offerCfg.price),
  was: Number(root.dataset.was || offerCfg.was),
  save: Number(root.dataset.save || offerCfg.save),
  headline: root.dataset.headline || '',
  kicker: root.dataset.kicker || '',
  sub: root.dataset.sub || '',
  cta: root.dataset.cta || offerCfg.cta || '',
  next: root.dataset.next ?? offerCfg.next ?? '',
  checkout: root.dataset.checkout || offerCfg.checkoutUrl || CHECKOUT_URL,
};

/* --- Render offer variables --- */
$('offerHeadline').textContent = cfg.headline;
if (cfg.kicker) {
  $('offerKicker').textContent = cfg.kicker;
  $('offerKicker').classList.remove('hidden');
}
$('offerSub').innerHTML = cfg.sub;
$('priceWas').textContent = `$${cfg.was}`;
$('priceNow').textContent = cfg.price;
$('priceSave').textContent = `SAVE $${cfg.save}`;
$('offerCta').textContent = cfg.cta;

/* --- Target info --- */
const phone = store.targetPhoneNumber || '+1 (XXX) XXX-XXXX';
document.querySelectorAll('[data-phone]').forEach((el) => { el.textContent = phone; });

const initials = store.getCountryInitials(store.targetPhoneNumber);
const avatarImg = $('offerAvatar');
const avatarFallback = $('offerFallback');

function paintAvatar() {
  const url = store.userPhotoUrl;
  if (url?.startsWith('http')) {
    avatarImg.src = url;
    avatarImg.classList.remove('hidden');
    avatarFallback.classList.add('hidden');
    avatarImg.onerror = () => {
      localStorage.setItem('lf_photo_url', '');
      paintAvatar();
    };
  } else {
    avatarImg.classList.add('hidden');
    avatarImg.removeAttribute('src');
    avatarFallback.classList.remove('hidden');
    avatarFallback.textContent = initials;
  }
}
paintAvatar();
store.fetchProfilePhotoWithRetry(store.targetPhoneNumber, { allowMissing: true }).then(paintAvatar);

/* --- Checkout: offer=back + price + tel + tracking --- */
const checkoutUrl = (() => {
  const url = new URL(cfg.checkout);
  url.searchParams.set('offer', 'back');
  url.searchParams.set('price', String(cfg.price));
  if (store.targetPhoneNumber) { url.searchParams.set('tel', store.targetPhoneNumber); url.searchParams.set('phone', store.targetPhoneNumber); }
  appendTrackingToUrl(url);
  return url.toString();
})();
document.querySelectorAll('[data-checkout]').forEach((a) => {
  a.href = checkoutUrl;
  a.addEventListener('click', () => {
    try {
      if (typeof fbq === 'function') {
        fbq('track', 'InitiateCheckout', {
          content_name: 'UncoverAI Special Offer',
          currency: 'USD',
          value: Number(cfg.price) || 29.00
        });
      }
    } catch (e) {}
  });
});

/* --- Countdown 4:00 --- */
let timeLeft = 240;
const pad = (n) => String(n).padStart(2, '0');
const timerEl = $('offerTimer');

setInterval(() => {
  if (timeLeft > 0) timeLeft -= 1;
  timerEl.textContent = `${pad(Math.floor(timeLeft / 60))}:${pad(timeLeft % 60)}`;
  timerEl.style.color = timeLeft <= 60 ? '#ff5c5c' : '#E84040';
}, 1000);

/* --- Interaction prompt + back-trap (only when a next offer exists) --- */
const prompt = $('offerPrompt');
let cleanupBackTrap = null;

function redirectToNextBackOffer() {
  window.location.href = withTracking(cfg.next);
}

function installBackTrap() {
  if (cleanupBackTrap) cleanupBackTrap();

  try {
    window.history.pushState({ backOfferRedirect: true, step: 1 }, '', window.location.href);
    window.history.pushState({ backOfferRedirect: true, step: 2 }, '', window.location.href);
  } catch { /* some browsers limit pushState calls */ }

  const previousOnPopState = window.onpopstate;
  window.onpopstate = () => {
    setTimeout(redirectToNextBackOffer, 1);
  };

  cleanupBackTrap = () => {
    window.onpopstate = previousOnPopState;
  };
}

if (cfg.next) {
  prompt.classList.remove('hidden');
  $('offerPromptCta').addEventListener('click', () => {
    prompt.classList.add('hidden');
    installBackTrap();
  });
}
