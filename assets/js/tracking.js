/* Love Finder — tracking.js: port of src/lib/tracking-params.js (utm_* + ad ids) */
const STORAGE_KEY = 'private_quizz_tracking_params_v1';
const ALLOWLIST = new Set(['xcod', 'sck', 'fbclid', 'gclid', 'gbraid', 'wbraid', 'ttclid', 'msclkid']);
/* VTurb conversion key signature: value always starts with v3_ (any param name) */
const VTURB_KEY_PREFIX = 'v3_';
/* First-touch params: first value seen in the session wins, later rewrites are ignored */
const PINNED_KEYS = new Set(['sck']);

const isTrackingParam = (key, value) => {
  const k = key.toLowerCase();
  if (k.startsWith('utm_') || ALLOWLIST.has(k)) return true;
  return normalizeValue(value).startsWith(VTURB_KEY_PREFIX);
};

const normalizeValue = (value) => {
  if (Array.isArray(value)) return value.find((v) => v != null && v !== '') || '';
  if (value == null) return '';
  return String(value);
};

const storage = () => {
  try { return window.sessionStorage; } catch { return null; }
};

export function extractTrackingParams(query = {}) {
  const out = {};
  for (const [key, value] of Object.entries(query)) {
    if (!isTrackingParam(key, value)) continue;
    const v = normalizeValue(value);
    if (v) out[key] = v;
  }
  return out;
}

/* Merge stored + fresh query: fresh wins, except pinned keys (first-touch wins) */
function mergeTracking(stored = {}, fresh = {}) {
  const out = { ...stored, ...fresh };
  for (const key of PINNED_KEYS) {
    if (stored[key] && fresh[key] && stored[key] !== fresh[key]) {
      out[key] = stored[key];
    }
  }
  return out;
}

export function readStoredTrackingParams() {
  const s = storage();
  if (!s) return {};
  try {
    const parsed = JSON.parse(s.getItem(STORAGE_KEY) || '{}');
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return extractTrackingParams(parsed);
  } catch {
    s.removeItem(STORAGE_KEY);
    return {};
  }
}

export function rememberTrackingParams(params) {
  const tracked = extractTrackingParams(params);
  if (!Object.keys(tracked).length) return tracked;
  const s = storage();
  if (s) s.setItem(STORAGE_KEY, JSON.stringify(tracked));
  return tracked;
}

export function getTrackingParams(query = {}) {
  return rememberTrackingParams(mergeTracking(readStoredTrackingParams(), extractTrackingParams(query)));
}

export function currentQuery() {
  return Object.fromEntries(new URLSearchParams(window.location.search));
}

/* Persist tracking on load (equivalent to router.beforeEach in Vue) */
export function persistTrackingFromUrl() {
  return getTrackingParams(currentQuery());
}

export function withTracking(path) {
  const tracked = mergeTracking(readStoredTrackingParams(), extractTrackingParams(currentQuery()));
  if (!Object.keys(tracked).length) return path;
  // Base on the CURRENT page URL (not origin) so subfolder deploys
  // (e.g. /rfvsl5/) keep their prefix on navigation.
  const url = new URL(path, window.location.href);
  for (const [k, v] of Object.entries(tracked)) url.searchParams.set(k, v);
  // keep relative form for same-origin navigation
  return url.pathname + url.search + url.hash;
}

export function appendTrackingToUrl(url) {
  const tracked = mergeTracking(readStoredTrackingParams(), extractTrackingParams(currentQuery()));
  for (const [k, v] of Object.entries(tracked)) url.searchParams.set(k, v);
  return url;
}

/* Re-assert the pinned sck onto the page URL (silent replaceState).
   Pixel scripts (Skalame) adopt whatever sck is in the URL on load and then
   rewrite every link with it — normalizing first makes them adopt OURS. */
export function normalizeUrlSck() {
  const stored = readStoredTrackingParams();
  if (!stored.sck) return stored;
  let url;
  try {
    url = new URL(window.location.href);
  } catch { return stored; }
  if (url.searchParams.get('sck') === stored.sck) return stored;
  url.searchParams.set('sck', stored.sck);
  try {
    window.history.replaceState(null, '', url.toString());
  } catch { /* ignore */ }
  return stored;
}

/* Safety net for exit links: only fills params that are MISSING, never
   overwrites existing ones (e.g. VTurb's own v3_ key). */
export function fillTrackingGaps(url) {
  const tracked = mergeTracking(readStoredTrackingParams(), extractTrackingParams(currentQuery()));
  for (const [k, v] of Object.entries(tracked)) {
    if (!url.searchParams.has(k)) url.searchParams.set(k, v);
  }
  return url;
}
