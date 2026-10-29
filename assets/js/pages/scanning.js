/* Page: /phone-scan-analysis/ — Step4Scanning.vue (simulated deep scan + VSL) */
import '../navigate.js?v=20261011-sck-1';
import { store, PROFILE_PHOTO_EVENT } from '../store.js?v=20261011-sck-1';
import { fetchLocation } from '../location.js?v=20261008-utms-1';
import { go } from '../navigate.js?v=20261011-sck-1';

const ROTATING = [
  'Initializing deep scan protocol...',
  'Establishing secure connection to WhatsApp servers...',
  'Bypassing end-to-end encryption layer...',
  'Accessing WhatsApp chat database (msgstore.db)...',
  'Extracting Instagram Stories from local cache...',
  'Analyzing TikTok engagement patterns in user_data.json...',
  'Decrypting Messenger conversation logs from SQLite...',
  'Recovering deleted WhatsApp messages from backup...',
  'WARNING: Explicit content detected in media files...',
  'ALERT: Intimate photos found in gallery cache...',
  'CRITICAL: Nude images discovered in hidden folders...',
  'URGENT: Sexual conversations identified in chat logs...',
];

const MILESTONES = [4, 9, 15, 22, 30, 38, 47, 56, 64, 72, 80, 88, 95, 99];
const SCAN_TIMING_STORAGE_KEY = 'scanningTimingSession247s';

const SOCIAL_ICONS = [
  { name: 'whatsapp', url: 'https://img.icons8.com/color/48/000000/whatsapp.png' },
  { name: 'instagram', url: 'https://img.icons8.com/color/48/000000/instagram-new.png' },
  { name: 'tiktok', url: 'https://img.icons8.com/color/48/000000/tiktok.png' },
  { name: 'messenger', url: 'https://img.icons8.com/color/48/000000/facebook-messenger.png' },
  { name: 'facebook', url: 'https://img.icons8.com/color/48/000000/facebook-new.png' },
  { name: 'reddit', url: 'https://img.icons8.com/color/48/000000/reddit.png' },
  { name: 'telegram', url: 'https://img.icons8.com/color/48/000000/telegram-app.png' },
  { name: 'snapchat', url: 'https://img.icons8.com/color/48/000000/snapchat-circled-logo.png' },
];

const $ = (id) => document.getElementById(id);
const phone = store.targetPhoneNumber || '...';
$('phoneChip').textContent = phone;
$('explicitPhone').textContent = phone;
$('socialStrip').innerHTML = SOCIAL_ICONS.map(
  (icon) => `<img src="${icon.url}" alt="${icon.name}" class="social-icon" />`
).join('');

let city = 'BLOCKED';
const technicalLogs = () => [
  'Initiating connection with WhatsApp servers...',
  'Locating the nearest server...',
  '[SUCCESS] Server located! Establishing secure connection...',
  'Verifying phone number...',
  '[SUCCESS] Valid phone number',
  'Analyzing database...',
  'Fetching profile information...',
  'Detecting device location...',
  `[WARNING] Suspicious location found in ${city !== 'BLOCKED' ? city : 'Your Area'}`,
  'Preparing private reading channel...',
  '[SUCCESS] Private channel established!',
  'Synchronizing messages...',
  '[SUCCESS] Synchronization complete!',
  '[SUCCESS] Access successfully granted!',
];

function logClass(log) {
  if (log.startsWith('[SUCCESS]')) return 'log-success';
  if (log.startsWith('[WARNING]') || log.startsWith('WARNING:')) return 'log-warning';
  if (log.startsWith('ALERT:') || log.startsWith('CRITICAL:') || log.startsWith('URGENT:')) return 'log-warning';
  if (log.startsWith('[ERROR]')) return 'log-error';
  return '';
}

/* Scan timing fixed at 4m07s (247s) to match the new VSL pitch */
function getRandomScanDurationMs() {
  return 247000;
}

function persistScanTiming(session) {
  try {
    localStorage.setItem(SCAN_TIMING_STORAGE_KEY, JSON.stringify(session));
  } catch { /* silent */ }
}

function loadOrCreateScanTiming() {
  try {
    const raw = localStorage.getItem(SCAN_TIMING_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const duration = Number(parsed?.durationMs);
      const startedAt = Number(parsed?.startedAt);
      const samePhone = parsed?.phone === phone;
      const validDuration = duration === 247000;
      const validStartedAt = startedAt > 0;
      const notExpired = Date.now() - startedAt <= duration + 30 * 60 * 1000;

      if (samePhone && validDuration && validStartedAt && notExpired) {
        return { durationMs: duration, startedAt };
      }
    }
  } catch { /* silent */ }

  const session = { phone, durationMs: getRandomScanDurationMs(), startedAt: Date.now() };
  persistScanTiming(session);
  return { durationMs: session.durationMs, startedAt: session.startedAt };
}

function mapElapsedToProgress(elapsed, duration) {
  const normalized = Math.min(1, Math.max(0, elapsed / duration));
  if (normalized <= 0.18) return (normalized / 0.18) * 32;
  if (normalized <= 0.6) return 32 + ((normalized - 0.18) / 0.42) * 46;
  if (normalized <= 0.85) return 78 + ((normalized - 0.6) / 0.25) * 17;
  return 95 + ((normalized - 0.85) / 0.15) * 5;
}

const timing = loadOrCreateScanTiming();
let progress = 0;
let logIdx = 0;
let rotIdx = 0;
let msgCount = 0;
let attachCount = 0;
let activeDot = 0;
let currentRotatingText = ROTATING[0];
let peopleCounter = Math.floor(Math.random() * 101) + 980;
let showCriticalAlert = false;
let showFinalButtons = false;
let progressInterval = null;

function updateProgressState(elapsed) {
  const clamped = Math.min(elapsed, timing.durationMs);
  progress = mapElapsedToProgress(clamped, timing.durationMs);

  const remainingSeconds = Math.ceil(Math.max(0, timing.durationMs - clamped) / 1000);
  $('progressLabel').textContent =
    progress >= 99.5 ? 'COMPLETED' :
    remainingSeconds > 180 ? 'Approximately 4 minutes left to see results' :
    remainingSeconds > 120 ? 'Approximately 3 minutes left to see results' :
    remainingSeconds > 60 ? 'Approximately 2 minutes left to see results' :
    remainingSeconds > 20 ? 'Approximately 1 minute left to see results' : 'Finalizing scan...';

  $('statusPill').textContent =
    progress >= 96 ? 'Finalizing scan...' :
    progress < 16 ? 'Establishing secure mobile bridge...' : currentRotatingText;

  if (progress >= 18) msgCount = Math.floor(progress * 0.55);
  if (progress >= 28) attachCount = Math.floor(progress * 0.5);
  if (progress >= 22) showCriticalAlert = true;
  if (progress >= 100) showFinalButtons = true;

  $('progressFill').style.width = `${progress.toFixed(0)}%`;
  $('dataFound').textContent = `${(18 + progress * 2.15).toFixed(1)} MB`;
  $('photoCount').textContent = Math.max(0, Math.floor(attachCount * 0.82));
  $('videoCount').textContent = Math.max(0, Math.floor(attachCount * 0.12));
  $('msgCount').textContent = msgCount;

  $('explicitBanner').classList.toggle('hidden', !showCriticalAlert);
  $('topCta').classList.toggle('hidden', !showFinalButtons);
  $('bottomCta').classList.toggle('hidden', !showFinalButtons);
}

function pushLogsForProgress() {
  const logs = technicalLogs();
  while (logIdx < logs.length && progress >= MILESTONES[logIdx]) {
    const line = document.createElement('div');
    line.className = `terminal-line ${logClass(logs[logIdx])}`.trim();
    line.textContent = logs[logIdx];
    $('terminalBody').appendChild(line);
    logIdx += 1;
  }
  $('terminalBody').scrollTop = $('terminalBody').scrollHeight;
}

function paintDots() {
  const dots = document.querySelectorAll('#statusDots .status-dot');
  dots.forEach((dot, i) => dot.classList.toggle('status-dot-active', i === activeDot));
}

let renderedPhotoState = '';

function paintPhoto() {
  const samePhone = store.photoPhone === phone;
  const status = samePhone ? store.photoStatus : 'idle';
  const url = samePhone ? store.userPhotoUrl : '';
  const circle = $('profileCircle');
  const description = samePhone ? store.profileDescription : '';
  $('profileDescription').textContent = description;
  $('profileDescription').classList.toggle('hidden', !description);
  circle.classList.toggle('ring-loading', status === 'loading');
  circle.classList.toggle('ring-loaded', status === 'loaded');

  const state = `${status}:${url}`;
  if (state === renderedPhotoState) return;
  renderedPhotoState = state;

  if (status === 'loaded' && url?.startsWith('http')) {
    const img = document.createElement('img');
    img.className = 'profile-img';
    img.alt = 'Profile photo';
    img.addEventListener('error', () => {
      if (store.photoPhone !== phone || store.userPhotoUrl !== url) return;
      localStorage.setItem('lf_photo_url', '');
      localStorage.setItem('lf_photo_status', 'missing');
      window.dispatchEvent(new CustomEvent(PROFILE_PHOTO_EVENT));
    });
    img.src = url;
    circle.replaceChildren(img);
  } else if (status === 'loading' || status === 'idle') {
    circle.innerHTML = '<span class="profile-loader"></span>';
  } else {
    circle.innerHTML = '<span class="whatsapp-avatar" aria-label="No profile photo"><span class="whatsapp-avatar-head"></span><span class="whatsapp-avatar-body"></span></span>';
  }
}

function finish() {
  try {
    localStorage.removeItem(SCAN_TIMING_STORAGE_KEY);
  } catch { /* silent */ }

  go(store.targetGender === 'girlfriend' ? '../girlfriend-risk-report/' : '../boyfriend-risk-report/');
}

$('topCta').addEventListener('click', finish);
$('bottomCta').addEventListener('click', finish);

/* Mounted */
window.addEventListener(PROFILE_PHOTO_EVENT, paintPhoto);
window.addEventListener('storage', (event) => {
  if (event.key?.startsWith('lf_photo_') || event.key === 'lf_profile_description') paintPhoto();
});
window.addEventListener('pageshow', (event) => {
  if (event.persisted) paintPhoto();
});
/* The scan owns the request: leaving the phone page cannot abandon it. */
if (phone !== '...' && (store.photoPhone !== phone || store.photoStatus !== 'loaded')) {
  store.fetchProfilePhotoWithRetry(phone);
}
fetchLocation().then((c) => {
  city = c;
  if (c && c !== 'BLOCKED') {
    const line = $('locationLine');
    line.textContent = `Detected near ${c}`;
    line.classList.remove('hidden');
  }
});

updateProgressState(0);
pushLogsForProgress();
paintDots();
paintPhoto();
$('peopleCounter').textContent = peopleCounter;

progressInterval = setInterval(() => {
  const elapsed = Math.max(0, Date.now() - timing.startedAt);
  if (progress < 100) {
    updateProgressState(elapsed);
    pushLogsForProgress();
  } else {
    clearInterval(progressInterval);
  }
}, 300);

setInterval(() => { activeDot = (activeDot + 1) % 5; paintDots(); }, 1000);

setInterval(() => {
  rotIdx = (rotIdx + 1) % ROTATING.length;
  currentRotatingText = ROTATING[rotIdx];
}, 2200);

setInterval(() => {
  const delta = Math.floor(Math.random() * 11) - 5;
  peopleCounter = Math.max(900, Math.min(1180, peopleCounter + delta));
  $('peopleCounter').textContent = peopleCounter;
}, 3000);

setInterval(paintPhoto, 3000);
