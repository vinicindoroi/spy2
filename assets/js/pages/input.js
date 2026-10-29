/* Page: /target-phone-lookup/ — Step3Input.vue (country + phone validation + search lock) */
import '../navigate.js?v=20261011-sck-1';
import { store } from '../store.js?v=20261011-sck-1';
import { go } from '../navigate.js?v=20261011-sck-1';

const COUNTRIES = [
  {
    code: 'US', name: 'United States', dial: '+1', flag: 'https://flagcdn.com/w20/us.png',
    /* NANP: 10 digits (area code + 7-digit number), area code 2-9, exchange 2-9 */
    regex: /^[2-9]\d{2}[2-9]\d{6}$/,
    placeholder: '(201) 555-0199',
    hint: 'Enter a valid US number (10 digits)',
  },
  {
    code: 'BR', name: 'Brazil', dial: '+55', flag: 'https://flagcdn.com/w20/br.png',
    /* Brazil: 10 digits (landline) or 11 digits (mobile with 9 prefix), DDD 11-99 */
    regex: /^[1-9]{2}9?\d{8}$/,
    placeholder: '(11) 91234-5678',
    hint: 'Enter a valid BR number (10 or 11 digits)',
  },
  {
    code: 'PT', name: 'Portugal', dial: '+351', flag: 'https://flagcdn.com/w20/pt.png',
    /* Portugal: 9 digits, starts with 2 (landline) or 9 (mobile) */
    regex: /^[29]\d{8}$/,
    placeholder: '912 345 678',
    hint: 'Enter a valid PT number (9 digits)',
  },
  {
    code: 'GB', name: 'United Kingdom', dial: '+44', flag: 'https://flagcdn.com/w20/gb.png',
    /* UK: 10 digits (after leading 0 dropped), starts with 1-9 */
    regex: /^[1-9]\d{9}$/,
    placeholder: '7700 900123',
    hint: 'Enter a valid UK number (10 digits)',
  },
];

const $ = (id) => document.getElementById(id);
let selected = COUNTRIES[0];
let lockToastTimer = null;
let shakeTimer = null;
let submitting = false;

const isLocked = () => store.isTargetPhoneSearchLocked();
const digits = () => $('phoneInput').value.replace(/\D/g, '');
const isValid = () => (isLocked() ? true : selected.regex.test(digits()));
const canSubmit = () => isLocked() || isValid();

function closeDropdown() {
  $('countryDropdown').classList.add('hidden');
  $('countrySelector').classList.remove('open');
}

function renderCountries() {
  const menu = $('countryDropdown');
  menu.innerHTML = '';
  for (const c of COUNTRIES) {
    const b = document.createElement('div');
    b.className = 'country-option';
    b.innerHTML = `<img src="${c.flag}" class="opt-flag" alt="${c.code}" /><span class="opt-name">${c.name}</span><span class="opt-dial">${c.dial}</span>`;
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isLocked()) return;
      selected = c;
      $('countryFlag').src = c.flag;
      $('countryFlag').alt = c.name;
      $('countryDial').textContent = c.dial;
      $('phoneInput').placeholder = c.placeholder;
      $('phoneInput').value = '';
      $('validationMsg').textContent = '';
      closeDropdown();
      refresh();
    });
    menu.appendChild(b);
  }
}

function refresh() {
  const valid = isValid();
  const wrap = $('phoneWrapper');
  wrap.classList.toggle('phone-valid', valid);
  wrap.classList.toggle('phone-locked', isLocked());
  wrap.classList.toggle('phone-invalid', !valid && digits().length > 3);

  const btn = $('revealBtn');
  const ok = canSubmit();
  btn.disabled = !ok;
  btn.classList.toggle('enabled', ok);

  if (!isLocked() && digits().length > 0) {
    $('validationMsg').textContent = valid ? '' : selected.hint;
  }
}

function notifyLockedSearch() {
  if (!isLocked()) return;
  $('lockToast').classList.remove('hidden');
  const btn = $('revealBtn');
  btn.classList.remove('shaking');
  requestAnimationFrame(() => btn.classList.add('shaking'));

  clearTimeout(lockToastTimer);
  clearTimeout(shakeTimer);
  lockToastTimer = setTimeout(() => $('lockToast').classList.add('hidden'), 3600);
  shakeTimer = setTimeout(() => btn.classList.remove('shaking'), 520);
}

function applyLockedPhone(phoneNumber) {
  const d = phoneNumber.replace(/\D/g, '');
  const country = [...COUNTRIES]
    .sort((a, b) => b.dial.length - a.dial.length)
    .find((item) => d.startsWith(item.dial.replace('+', '')));

  if (!country) return;

  selected = country;
  $('countryFlag').src = country.flag;
  $('countryFlag').alt = country.name;
  $('countryDial').textContent = country.dial;
  $('phoneInput').placeholder = country.placeholder;
  $('phoneInput').value = d.slice(country.dial.replace('+', '').length);
  $('phoneInput').readOnly = true;
  $('countrySelector').classList.add('locked');
  $('dropdownArrow').classList.add('hidden');
  $('validationMsg').textContent = '';
  store.setTargetPhone(phoneNumber);
}

$('countrySelector').addEventListener('click', (e) => {
  e.stopPropagation();
  if (isLocked()) return;
  const willOpen = $('countryDropdown').classList.contains('hidden');
  $('countryDropdown').classList.toggle('hidden', !willOpen);
  $('countrySelector').classList.toggle('open', willOpen);
});

document.addEventListener('click', closeDropdown);

$('phoneInput').addEventListener('input', () => {
  const d = digits();
  if (d.length === 0) {
    $('validationMsg').textContent = '';
  } else {
    $('validationMsg').textContent = isValid() ? '' : selected.hint;
  }
  refresh();
});

$('phoneInput').addEventListener('click', () => {
  closeDropdown();
  notifyLockedSearch();
});

$('revealBtn').addEventListener('click', async () => {
  if (submitting || !canSubmit()) return;
  submitting = true;
  $('loadingModal').classList.remove('hidden');
  const lockedPhone = store.getTargetPhoneSearchLock()?.phone;
  const fullPhone = lockedPhone || `+${selected.dial.replace('+', '')}${digits()}`;
  store.lockTargetPhoneSearch(fullPhone);
  $('loadingSub').textContent = `Connecting to ${store.targetPhoneNumber || '...'}`;
  await new Promise((r) => setTimeout(r, 3000));
  go('../phone-scan-analysis/');
});

renderCountries();

const lock = store.getTargetPhoneSearchLock();
if (lock?.phone) applyLockedPhone(lock.phone);
refresh();

/* Post-assessment thanks modal — shown once when arriving from the quiz */
try {
  if (sessionStorage.getItem('lf_after_quiz')) {
    sessionStorage.removeItem('lf_after_quiz');
    $('thanksModal').classList.remove('hidden');
  }
} catch { /* silent */ }

$('thanksModalCta').addEventListener('click', () => {
  $('thanksModal').classList.add('hidden');
});

/* Live activity feed (phone step): toast-style entries — spring in, blur out. */
(() => {
  const feedList = document.getElementById('feedListPhone');
  if (!feedList) return;
  const FEED_COUNT = 5;
  const GAP = 6;
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pick = (list) => list[Math.floor(Math.random() * list.length)];
  const US_AREA_CODES = [212, 213, 214, 305, 310, 312, 404, 415, 469, 512, 602, 617, 646, 702, 713, 718, 773, 786, 818, 917, 949];
  /* Country (+1) and area code stay visible; only the local part is masked,
     with XXX in different positions. */
  const randomMaskedNumber = () => {
    const area = pick(US_AREA_CODES);
    let exchange = String(rand(201, 989));
    while (Number(exchange) % 100 === 11) exchange = String(rand(201, 989));
    const line = String(rand(0, 9999)).padStart(4, '0');
    return pick([
      `+1 (${area}) ${exchange}-XXXX`,
      `+1 (${area}) XXX-${line}`,
      `+1 (${area}) ${exchange[0]}XXX-${line}`,
      `+1 (${area}) ${exchange}-XXX${line[3]}`,
    ]);
  };
  const randomFeedText = () => {
    const kind = Math.random();
    if (kind < 0.2) return `${rand(3, 240)} hidden messages found`;
    if (kind < 0.35) return `${rand(1, 60)} photos extracted`;
    return pick([
      'WhatsApp backup decrypted',
      'Instagram DMs archived',
      'Tinder match detected',
      'Telegram session linked',
      'Snapchat history pulled',
      'location trail mapped',
      'call log analyzed',
      'private folder unlocked',
      'suspicious contact flagged',
      'dating profile linked',
      'device fingerprint captured',
      'voice notes transcribed',
      'GPS history synced',
      'encrypted chat opened',
      'hidden folder accessed',
      'blocked number identified',
    ]);
  };
  const buildItem = () => {
    const el = document.createElement('div');
    el.className = 'feed-item';
    el.innerHTML = `<span class="feed-dot"></span><span class="feed-line"><span class="feed-num">${randomMaskedNumber()}</span><span class="feed-sep">—</span><span class="feed-text">${randomFeedText()}</span></span>`;
    return el;
  };
  const insertOne = () => {
    const el = buildItem();
    el.classList.add('is-inserting');
    el.style.marginTop = `${-GAP}px`;
    el.style.maxHeight = '0px';
    el.style.paddingTop = '0px';
    el.style.paddingBottom = '0px';
    /* Hard ceiling: never let the list grow past FEED_COUNT, even if a
       previous exit was skipped (background tab, throttled timers). */
    while (feedList.children.length >= FEED_COUNT) feedList.lastElementChild.remove();
    feedList.prepend(el);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.classList.remove('is-inserting');
      el.classList.add('is-entering');
      el.style.cssText = '';
      setTimeout(() => el.classList.remove('is-entering'), 4300);
    }));
  };

  /* Bursts of varying size (1–4 numbers) with staggering, like batches of
     requests arriving at the lookup service. */
  const BATCH_SIZES = [1, 1, 1, 2, 2, 3, 4];
  const BATCH_STAGGER_MS = 130;

  const rotate = () => {
    const batch = pick(BATCH_SIZES);
    for (let i = 0; i < batch; i++) setTimeout(insertOne, i * BATCH_STAGGER_MS);
  };

  for (let i = 0; i < FEED_COUNT; i++) feedList.appendChild(buildItem());

  /* Self-scheduling with a random 2–3s gap so bursts feel irregular. Animates
     regardless of prefers-reduced-motion, matching the home ticker. */
  if (typeof requestAnimationFrame === 'function') {
    const schedule = () => setTimeout(() => { rotate(); schedule(); }, rand(2000, 3000));
    schedule();
  }
})();

/* Restore an interactive form instead of the pre-navigation loading overlay. */
window.addEventListener('pageshow', (event) => {
  if (!event.persisted) return;
  submitting = false;
  $('loadingModal').classList.add('hidden');
  closeDropdown();
  const restoredLock = store.getTargetPhoneSearchLock();
  if (restoredLock?.phone) {
    applyLockedPhone(restoredLock.phone);
  } else {
    $('phoneInput').readOnly = false;
    $('countrySelector').classList.remove('locked');
    $('dropdownArrow').classList.remove('hidden');
  }
  refresh();
});
