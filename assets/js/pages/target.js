/* Page: / — Step1Target.vue (select target gender → /quiz/) */
import '../navigate.js?v=20261011-sck-1';
import { store } from '../store.js?v=20261011-sck-1';
import { go } from '../navigate.js?v=20261011-sck-1';

document.querySelectorAll('[data-gender]').forEach((btn) => {
  btn.addEventListener('click', () => {
    store.setTargetGender(btn.dataset.gender);
    go('quiz/');
  });
});

/* Live activity feed: random valid-looking masked US numbers in a continuously scrolling ticker. */
const FEED_COUNT = 5;
const FEED_INTERVAL_MS = 3200;

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (list) => list[Math.floor(Math.random() * list.length)];

/* Real US area codes so the mock numbers look plausible; exchange skips N11 service codes. */
const US_AREA_CODES = [212, 213, 214, 305, 310, 312, 404, 415, 469, 512, 602, 617, 646, 702, 713, 718, 773, 786, 818, 917, 949];

function randomMaskedNumber() {
  let exchange = rand(201, 989);
  while (exchange % 100 === 11) exchange = rand(201, 989);
  return `(${pick(US_AREA_CODES)}) ${exchange}-XXXX`;
}

function randomFeedText() {
  const kind = Math.random();
  if (kind < 0.25) return `${rand(20, 300)} messages delivered`;
  if (kind < 0.4) return `${rand(5, 60)} photos recovered`;
  return pick([
    'scan history selected',
    'private media retrieved',
    'suspicious content flagged',
    'deleted chats restored',
    'location trace finished',
    'scan completed',
  ]);
}

const feedItem = (num, text) => `<div class="feed-item"><span class="feed-line"><img class="feed-flag" src="assets/img/flag-us.svg" alt="US" width="16" height="11" /><span class="feed-num">${num}</span><span class="feed-sep">—</span><span class="feed-text">${text}</span></span></div>`;

const reduceMotion = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Exposed counter: starts at 3,218 and grows on the same tick as the feed, paced by São Paulo local hour. */
const EXPOSED_MIN = 3218;
const HOURLY_RATE = [2, 1, 1, 1, 2, 3, 5, 9, 14, 18, 22, 24, 26, 25, 24, 23, 24, 26, 28, 27, 24, 20, 14, 8];

function spParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(date);
  const get = (type) => parts.find((part) => part.type === type)?.value;
  const dayIndex = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 }[get('weekday')] ?? 0;
  return { dayIndex, hour: Number(get('hour')) % 24, minute: Number(get('minute')) || 0 };
}

function weeklyBase(date) {
  const { dayIndex, hour, minute } = spParts(date);
  let total = EXPOSED_MIN;
  for (let d = 0; d < dayIndex; d++) for (let h = 0; h < 24; h++) total += HOURLY_RATE[h];
  for (let h = 0; h < hour; h++) total += HOURLY_RATE[h];
  return total + Math.floor((HOURLY_RATE[hour] * minute) / 60);
}

const exposedEl = document.getElementById('exposedCounter');
let exposed = weeklyBase();
if (exposedEl) {
  const paintExposed = (value = exposed) => { exposedEl.textContent = value.toLocaleString('en-US'); };
  /* Intro count-up to the real value, then a small bump on every increment. */
  const countUp = (from, to, duration) => {
    if (typeof requestAnimationFrame !== 'function' || reduceMotion()) return paintExposed();
    const start = performance.now();
    const step = (now) => {
      const t = Math.min((now - start) / duration, 1);
      paintExposed(Math.round(from + (to - from) * (1 - (1 - t) ** 3)));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const bump = () => {
    exposedEl.classList.remove('is-bump');
    void exposedEl.offsetWidth;
    exposedEl.classList.add('is-bump');
  };
  paintExposed(exposed - 48);
  setTimeout(() => countUp(exposed - 48, exposed, 1400), 500);
  setInterval(() => {
    exposed += HOURLY_RATE[spParts().hour] >= 20 ? 2 : 1;
    if (Math.random() < 0.25) exposed += 1;
    paintExposed();
    bump();
  }, FEED_INTERVAL_MS);
}

const feedList = document.getElementById('feedList');
if (feedList) {
  /* Continuous ticker: rows glide up non-stop; the row that leaves the top is
     refilled with fresh data and recycled to the bottom (seamless loop). */
  const FEED_SPEED = 16; /* px per second */
  const GAP = 6;
  const track = document.createElement('div');
  track.className = 'feed-track';
  track.innerHTML = Array.from({ length: FEED_COUNT + 1 }, () => feedItem(randomMaskedNumber(), randomFeedText())).join('');
  feedList.replaceChildren(track);

  const fitViewport = () => {
    const row = track.firstElementChild;
    if (row && row.offsetHeight) feedList.style.height = `${row.offsetHeight * FEED_COUNT + GAP * (FEED_COUNT - 1)}px`;
  };
  fitViewport();
  window.addEventListener('resize', fitViewport);
  document.fonts?.ready.then(fitViewport);

  let offset = 0;
  let lastTs = 0;
  const tick = (ts) => {
    /* Clamp dt so a backgrounded tab doesn't jump the list on return. */
    const dt = lastTs ? Math.min(ts - lastTs, 64) : 0;
    lastTs = ts;
    offset += (FEED_SPEED * dt) / 1000;
    const first = track.firstElementChild;
    const step = first.offsetHeight + GAP;
    if (offset >= step) {
      offset -= step;
      first.querySelector('.feed-num').textContent = randomMaskedNumber();
      first.querySelector('.feed-text').textContent = randomFeedText();
      track.appendChild(first);
    }
    track.style.transform = `translate3d(0, ${-offset}px, 0)`;
    requestAnimationFrame(tick);
  };
  if (typeof requestAnimationFrame === 'function') requestAnimationFrame(tick);
}
