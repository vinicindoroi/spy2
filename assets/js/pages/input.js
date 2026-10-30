/* Page: /target-phone-lookup/ — Step3Input.vue (country + phone validation + search lock) */
import '../navigate.js?v=20261011-sck-1';
import { store } from '../store.js?v=20261011-sck-1';
import { go } from '../navigate.js?v=20261011-sck-1';

const COUNTRIES = [
  { code: 'PH', name: 'Philippines', dial: '+63', flag: 'https://flagcdn.com/w20/ph.png', regex: /^9\d{9}$/, placeholder: '917 123 4567', hint: 'Enter a valid number (10 digits)' },
  { code: 'ZA', name: 'South Africa', dial: '+27', flag: 'https://flagcdn.com/w20/za.png', regex: /^[6-8]\d{8}$/, placeholder: '71 234 5678', hint: 'Enter a valid number (9 digits)' },
  { code: 'US', name: 'United States', dial: '+1', flag: 'https://flagcdn.com/w20/us.png', regex: /^[2-9]\d{2}[2-9]\d{6}$/, placeholder: '(201) 555-0199', hint: 'Enter a valid number (10 digits)' },
  { code: 'NG', name: 'Nigeria', dial: '+234', flag: 'https://flagcdn.com/w20/ng.png', regex: /^[7-9]0?\d{8}$/, placeholder: '802 345 6789', hint: 'Enter a valid number (10-11 digits)' },
  { code: 'SA', name: 'Saudi Arabia', dial: '+966', flag: 'https://flagcdn.com/w20/sa.png', regex: /^5\d{8}$/, placeholder: '512 345 678', hint: 'Enter a valid number (9 digits)' },
  { code: 'PR', name: 'Puerto Rico', dial: '+1', flag: 'https://flagcdn.com/w20/pr.png', regex: /^(787|939)\d{7}$/, placeholder: '(787) 555-0199', hint: 'Enter a valid number (10 digits)' },
  { code: 'GR', name: 'Greece', dial: '+30', flag: 'https://flagcdn.com/w20/gr.png', regex: /^69\d{8}$/, placeholder: '691 234 5678', hint: 'Enter a valid number (10 digits)' },
  { code: 'FR', name: 'France', dial: '+33', flag: 'https://flagcdn.com/w20/fr.png', regex: /^[67]\d{8}$/, placeholder: '6 12 34 56 78', hint: 'Enter a valid number (9 digits)' },
  { code: 'AE', name: 'United Arab Emirates', dial: '+971', flag: 'https://flagcdn.com/w20/ae.png', regex: /^5[0-9]\d{7}$/, placeholder: '50 123 4567', hint: 'Enter a valid number (9 digits)' },
  { code: 'BA', name: 'Bosnia', dial: '+387', flag: 'https://flagcdn.com/w20/ba.png', regex: /^6[1-7]\d{6}$/, placeholder: '61 234 567', hint: 'Enter a valid number (8 digits)' },
  { code: 'NA', name: 'Namibia', dial: '+264', flag: 'https://flagcdn.com/w20/na.png', regex: /^8[1-5]\d{7}$/, placeholder: '81 234 5678', hint: 'Enter a valid number (9 digits)' },
  { code: 'SE', name: 'Sweden', dial: '+46', flag: 'https://flagcdn.com/w20/se.png', regex: /^7\d{8}$/, placeholder: '70 123 4567', hint: 'Enter a valid number (9 digits)' },
  { code: 'RO', name: 'Romania', dial: '+40', flag: 'https://flagcdn.com/w20/ro.png', regex: /^7\d{8}$/, placeholder: '712 345 678', hint: 'Enter a valid number (9 digits)' },
  { code: 'PG', name: 'Papua New Guinea', dial: '+675', flag: 'https://flagcdn.com/w20/pg.png', regex: /^[7-8]\d{7}$/, placeholder: '7123 4567', hint: 'Enter a valid number (8 digits)' },
  { code: 'DK', name: 'Denmark', dial: '+45', flag: 'https://flagcdn.com/w20/dk.png', regex: /^\d{8}$/, placeholder: '20 12 34 56', hint: 'Enter a valid number (8 digits)' },
  { code: 'DE', name: 'Germany', dial: '+49', flag: 'https://flagcdn.com/w20/de.png', regex: /^1[5-7]\d{8,9}$/, placeholder: '151 1234 5678', hint: 'Enter a valid number (10-11 digits)' },
  { code: 'GB', name: 'United Kingdom', dial: '+44', flag: 'https://flagcdn.com/w20/gb.png', regex: /^[1-9]\d{9}$/, placeholder: '7700 900123', hint: 'Enter a valid number (10 digits)' },
  { code: 'JP', name: 'Japan', dial: '+81', flag: 'https://flagcdn.com/w20/jp.png', regex: /^[789]0\d{8}$/, placeholder: '90 1234 5678', hint: 'Enter a valid number (10 digits)' },
  { code: 'ID', name: 'Indonesia', dial: '+62', flag: 'https://flagcdn.com/w20/id.png', regex: /^8\d{8,11}$/, placeholder: '812 3456 7890', hint: 'Enter a valid number (9-12 digits)' },
  { code: 'AU', name: 'Australia', dial: '+61', flag: 'https://flagcdn.com/w20/au.png', regex: /^\d{9}$/, placeholder: '412 345 678', hint: 'Enter a valid number (9 digits)' },
  { code: 'CA', name: 'Canada', dial: '+1', flag: 'https://flagcdn.com/w20/ca.png', regex: /^[2-9]\d{2}[2-9]\d{6}$/, placeholder: '(416) 555-0199', hint: 'Enter a valid number (10 digits)' },
  { code: 'NZ', name: 'New Zealand', dial: '+64', flag: 'https://flagcdn.com/w20/nz.png', regex: /^2\d{7,9}$/, placeholder: '21 123 4567', hint: 'Enter a valid number (8-10 digits)' },
  { code: 'IE', name: 'Ireland', dial: '+353', flag: 'https://flagcdn.com/w20/ie.png', regex: /^8[35-9]\d{7}$/, placeholder: '85 123 4567', hint: 'Enter a valid number (9 digits)' },
  { code: 'NL', name: 'Netherlands', dial: '+31', flag: 'https://flagcdn.com/w20/nl.png', regex: /^6\d{8}$/, placeholder: '6 1234 5678', hint: 'Enter a valid number (9 digits)' },
  { code: 'CH', name: 'Switzerland', dial: '+41', flag: 'https://flagcdn.com/w20/ch.png', regex: /^7[6-9]\d{7}$/, placeholder: '76 123 45 67', hint: 'Enter a valid number (9 digits)' },
  { code: 'NO', name: 'Norway', dial: '+47', flag: 'https://flagcdn.com/w20/no.png', regex: /^[49]\d{7}$/, placeholder: '412 34 567', hint: 'Enter a valid number (8 digits)' },
  { code: 'BR', name: 'Brazil', dial: '+55', flag: 'https://flagcdn.com/w20/br.png', regex: /^[1-9]{2}9?\d{8}$/, placeholder: '(11) 91234-5678', hint: 'Enter a valid number (10 or 11 digits)' },
  { code: 'IN', name: 'India', dial: '+91', flag: 'https://flagcdn.com/w20/in.png', regex: /^[6-9]\d{9}$/, placeholder: '91234 56789', hint: 'Enter a valid number (10 digits)' },
  { code: 'PK', name: 'Pakistan', dial: '+92', flag: 'https://flagcdn.com/w20/pk.png', regex: /^3\d{9}$/, placeholder: '301 234 5678', hint: 'Enter a valid number (10 digits)' },
  { code: 'KE', name: 'Kenya', dial: '+254', flag: 'https://flagcdn.com/w20/ke.png', regex: /^[17]\d{8}$/, placeholder: '712 345 678', hint: 'Enter a valid number (9 digits)' },
  { code: 'GH', name: 'Ghana', dial: '+233', flag: 'https://flagcdn.com/w20/gh.png', regex: /^[235]\d{8}$/, placeholder: '24 123 4567', hint: 'Enter a valid number (9 digits)' },
  { code: 'EG', name: 'Egypt', dial: '+20', flag: 'https://flagcdn.com/w20/eg.png', regex: /^1[0-25]\d{8}$/, placeholder: '10 1234 5678', hint: 'Enter a valid number (10 digits)' },
  { code: 'MX', name: 'Mexico', dial: '+52', flag: 'https://flagcdn.com/w20/mx.png', regex: /^\d{10}$/, placeholder: '55 1234 5678', hint: 'Enter a valid number (10 digits)' },
  { code: 'CO', name: 'Colombia', dial: '+57', flag: 'https://flagcdn.com/w20/co.png', regex: /^3\d{9}$/, placeholder: '310 123 4567', hint: 'Enter a valid number (10 digits)' },
  { code: 'PT', name: 'Portugal', dial: '+351', flag: 'https://flagcdn.com/w20/pt.png', regex: /^[29]\d{8}$/, placeholder: '912 345 678', hint: 'Enter a valid number (9 digits)' },
  { code: 'IT', name: 'Italy', dial: '+39', flag: 'https://flagcdn.com/w20/it.png', regex: /^3\d{8,9}$/, placeholder: '312 345 6789', hint: 'Enter a valid number (9-10 digits)' },
  { code: 'ES', name: 'Spain', dial: '+34', flag: 'https://flagcdn.com/w20/es.png', regex: /^[67]\d{8}$/, placeholder: '612 345 678', hint: 'Enter a valid number (9 digits)' },
];

const FALLBACK_COUNTRY = {
  code: '??', name: 'Other', dial: '+', flag: 'https://flagcdn.com/w20/un.png',
  regex: /^\d{7,15}$/, placeholder: 'Your phone number', hint: 'Enter 7-15 digits',
};

const TZ_TO_COUNTRY = {
  'America/New_York': 'US', 'America/Chicago': 'US', 'America/Denver': 'US', 'America/Los_Angeles': 'US',
  'America/Phoenix': 'US', 'America/Anchorage': 'US', 'Pacific/Honolulu': 'US',
  'America/Puerto_Rico': 'PR',
  'Europe/London': 'GB', 'America/Toronto': 'CA', 'America/Vancouver': 'CA',
  'Australia/Sydney': 'AU', 'Australia/Melbourne': 'AU', 'Australia/Perth': 'AU',
  'Asia/Kolkata': 'IN', 'Asia/Calcutta': 'IN', 'Africa/Lagos': 'NG',
  'Asia/Manila': 'PH', 'Africa/Johannesburg': 'ZA', 'Africa/Nairobi': 'KE',
  'Africa/Accra': 'GH', 'Asia/Karachi': 'PK', 'Africa/Cairo': 'EG',
  'America/Mexico_City': 'MX', 'America/Bogota': 'CO', 'America/Sao_Paulo': 'BR',
  'Europe/Lisbon': 'PT', 'Asia/Jakarta': 'ID', 'Pacific/Auckland': 'NZ',
  'Europe/Dublin': 'IE', 'Europe/Berlin': 'DE', 'Europe/Paris': 'FR',
  'Europe/Rome': 'IT', 'Europe/Madrid': 'ES',
  'Asia/Riyadh': 'SA', 'Asia/Dubai': 'AE', 'Europe/Athens': 'GR',
  'Europe/Sarajevo': 'BA', 'Africa/Windhoek': 'NA', 'Europe/Stockholm': 'SE',
  'Europe/Bucharest': 'RO', 'Pacific/Port_Moresby': 'PG', 'Europe/Copenhagen': 'DK',
  'Asia/Tokyo': 'JP', 'Europe/Amsterdam': 'NL', 'Europe/Zurich': 'CH', 'Europe/Oslo': 'NO',
};

function detectCountry() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const code = TZ_TO_COUNTRY[tz];
    if (code) {
      const found = COUNTRIES.find(c => c.code === code);
      if (found) return found;
    }
  } catch {}
  try {
    const lang = (navigator.language || '').split('-');
    const region = (lang[1] || '').toUpperCase();
    if (region) {
      const found = COUNTRIES.find(c => c.code === region);
      if (found) return found;
    }
  } catch {}
  return COUNTRIES[2];
}

const $ = (id) => document.getElementById(id);
let selected = detectCountry();
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

function selectCountry(c) {
  selected = c;
  $('countryFlag').src = c.flag;
  $('countryFlag').alt = c.name;
  $('countryDial').textContent = c.dial;
  $('phoneInput').placeholder = c.placeholder;
}

function renderCountries() {
  const menu = $('countryDropdown');
  menu.innerHTML = '';
  for (const c of [...COUNTRIES, FALLBACK_COUNTRY]) {
    const b = document.createElement('div');
    b.className = 'country-option';
    b.innerHTML = `<img src="${c.flag}" class="opt-flag" alt="${c.code}" /><span class="opt-name">${c.name}</span><span class="opt-dial">${c.dial}</span>`;
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isLocked()) return;
      selectCountry(c);
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
  let country = [...COUNTRIES]
    .sort((a, b) => b.dial.length - a.dial.length)
    .find((item) => d.startsWith(item.dial.replace('+', '')));

  if (!country) country = { ...FALLBACK_COUNTRY, dial: '+' + d.slice(0, Math.min(3, d.length - 7)) };

  selectCountry(country);
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
  if (window.trkFunnel) { try { trkFunnel.step('varredura_profunda_vsl_inteligente'); } catch(e){} }
  go('../phone-scan-analysis/');
});

renderCountries();
selectCountry(selected);

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
  const randomMaskedNumber = () => {
    const c = selected;
    const d = c.dial;
    const len = rand(7, 10);
    const digits = Array.from({ length: len }, () => String(rand(0, 9)));
    const maskStart = rand(2, Math.max(3, len - 4));
    const maskLen = rand(3, 4);
    for (let i = maskStart; i < Math.min(maskStart + maskLen, len); i++) digits[i] = 'X';
    const raw = digits.join('');
    return `${d} ${raw.slice(0, 3)} ${raw.slice(3, 6)}-${raw.slice(6)}`;
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
