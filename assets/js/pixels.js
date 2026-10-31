/* Shared HTML loader: pixels.html goes to head; pixels-body.html goes to body. */
(async function loadPixels() {
  if (window.__lfPixelsLoading) return;
  window.__lfPixelsLoading = true;

  const loaderUrl = new URL(document.currentScript.src);
  const safeForward = document.currentScript.hasAttribute('data-safe-forward');

  async function loadSection(filename, target) {
    const htmlUrl = new URL(`../../${filename}`, loaderUrl);
    htmlUrl.search = loaderUrl.search;

    try {
      const response = await fetch(htmlUrl, { cache: 'no-cache' });
      if (!response.ok) throw new Error(`Pixels HTML failed: ${response.status}`);
      const html = await response.text();
      const template = document.createElement('template');
      template.innerHTML = html;

      /* Scripts parsed as HTML are inert; recreate them to execute the snippets. */
      for (const source of template.content.querySelectorAll('script')) {
        const script = document.createElement('script');
        for (const attribute of source.attributes) {
          script.setAttribute(attribute.name, attribute.value);
        }
        script.textContent = source.textContent;

        if (safeForward && source.getAttribute('src')?.includes('click-charm-73.lovable.app/funnel.js')) {
          // Disable the third-party href observer; funnel-links.js preserves attribution.
          script.setAttribute('data-forward', 'false');
          script.addEventListener('load', () => window.dispatchEvent(new Event('lf:funnel-ready')), { once: true });
        }

        let ready;
        if (source.hasAttribute('src')) {
          script.src = new URL(source.getAttribute('src'), htmlUrl).href;
          script.async = source.hasAttribute('async');
          if (!script.async) {
            ready = new Promise((resolve) => {
              script.addEventListener('load', resolve, { once: true });
              script.addEventListener('error', () => {
                console.error(`Pixel script failed: ${script.src}`);
                resolve();
              }, { once: true });
            });
          }
        }

        target.appendChild(script);
        if (ready) await ready;
      }
      return true;
    } catch (error) {
      console.error(`Unable to load ${filename}:`, error);
      return false;
    }
  }

  const headLoaded = await loadSection('pixels.html', document.head);

  if (!document.body) {
    await new Promise((resolve) => {
      document.addEventListener('DOMContentLoaded', resolve, { once: true });
    });
  }

  const bodyLoaded = await loadSection('pixels-body.html', document.body);
  if (!headLoaded || !bodyLoaded) window.__lfPixelsLoading = false;
})().catch((error) => {
  window.__lfPixelsLoading = false;
  console.error('Unable to initialize shared pixels:', error);
});
