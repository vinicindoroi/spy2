/* Love Finder — location.js: port of useLocation.js (city via ip2c + ipinfo) */
import { store } from './store.js?v=20261011-sck-1';

export async function fetchLocation() {
  let city = 'BLOCKED';
  try {
    const r1 = await fetch('https://ip2c.org/s', { signal: AbortSignal.timeout(5000) });
    const text = await r1.text();
    if (text.startsWith('1;')) {
      /* country available but unused here; kept for parity */
    }
  } catch { /* silent */ }
  try {
    const r2 = await fetch('https://ipinfo.io', {
      headers: { Authorization: 'Bearer fce9902604e706' },
      signal: AbortSignal.timeout(5000),
    });
    const data = await r2.json();
    if (data?.city) {
      city = data.city;
      store.setCity(data.city);
    }
  } catch { /* silent */ }
  return city;
}
