/* Trackly's automatic forwarding observes href and rewrites href in its own
   callback, creating an endless mutation loop. Report pages opt out of that
   observer and use this idempotent forwarding instead. */
(function () {
  function decorate(anchor) {
    if (!window.trkFunnel || anchor.getAttribute('data-funnel-forward') === 'false') return;
    const href = anchor.getAttribute('href') || '';
    if (!/^https?:/i.test(href)) return;
    try {
      const url = new URL(href, window.location.href);
      if (url.origin === window.location.origin && anchor.getAttribute('data-funnel-forward') !== 'true') return;
      const sessionId = window.trkFunnel.sessionId();
      const params = { src: sessionId, sessionId, xcod: sessionId, ...window.trkFunnel.params() };
      for (const [key, value] of Object.entries(params)) {
        if (value && !url.searchParams.get(key)) url.searchParams.set(key, value);
      }
      const next = url.toString();
      if (href !== next) anchor.setAttribute('href', next);
    } catch { /* Tracking must never block navigation. */ }
  }

  function decorateWithin(node) {
    if (node.nodeType !== 1) return;
    if (node.matches('a[href]')) decorate(node);
    node.querySelectorAll('a[href]').forEach(decorate);
  }

  // Observe new content only. Our href writes cannot retrigger this observer.
  const observer = new MutationObserver((records) => {
    for (const record of records) record.addedNodes.forEach(decorateWithin);
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener('lf:funnel-ready', () => decorateWithin(document.documentElement));
  for (const event of ['pointerdown', 'click', 'auxclick']) {
    document.addEventListener(event, (e) => {
      const anchor = e.target.closest?.('a[href]');
      if (anchor) decorate(anchor);
    }, true);
  }
  decorateWithin(document.documentElement);
})();
