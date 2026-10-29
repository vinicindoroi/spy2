/* Love Finder — navigate.js: MPA navigation preserving tracking params.
   NOTE: Tag Manager + Clarity live as static snippets in each page <head>
   (not here) — container must load before/without app JS to stay reliable
   and visible to Tag Assistant. */
import { withTracking, persistTrackingFromUrl, fillTrackingGaps, normalizeUrlSck, getTrackingParams, currentQuery } from './tracking.js?v=20261011-sck-1';

persistTrackingFromUrl();
normalizeUrlSck();

/* Late re-sync: adopt a sck minted after our first run (e.g. Skalame uuid on
   organic entry). Pinning still holds — a stored sck is never overwritten. */
window.addEventListener('load', () => {
  setTimeout(() => {
    getTrackingParams(currentQuery());
    normalizeUrlSck();
  }, 1500);
});

export function go(path) {
  window.location.href = withTracking(path);
}

/* Wire <a data-nav> and forms automatically */
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-nav]');
  if (!el) return;
  e.preventDefault();
  go(el.getAttribute('data-nav'));
});

/* Safety net (capture phase, runs before pixel/VTurb handlers): any absolute
   http(s) exit link missing our params gets them filled in — never overwrites
   existing ones (e.g. VTurb's own v3_ key). Covers VTurb-rewritten anchors,
   player CTA buttons (via composedPath for shadow DOM) and hardcoded links. */
document.addEventListener('click', (e) => {
  if (e.defaultPrevented) return;
  const direct = e.target?.closest?.('a[href]');
  const anchor = direct
    || (typeof e.composedPath === 'function' && e.composedPath().find((n) => n?.tagName === 'A' && n.href))
    || null;
  if (!anchor || anchor.hasAttribute('data-nav')) return;
  let url;
  try {
    url = new URL(anchor.href, window.location.href);
  } catch { return; }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;
  try {
    anchor.href = fillTrackingGaps(url).toString();
  } catch { /* leave original href */ }
}, true);
