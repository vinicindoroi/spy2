/* Love Finder — session.js: port of usePublicSession.js (device_id + fingerprint + token) */
import { API_BASE_URL } from './config.js?v=20261008-2';

const DEVICE_ID_KEY = 'fp_device_id';

export function getOrCreateDeviceId() {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id || id.length < 16) {
    id = crypto.randomUUID().replace(/-/g, '');
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

export async function computeFingerprint() {
  const signals = [
    navigator.userAgent,
    navigator.language,
    String(screen.width),
    String(screen.height),
    String(screen.colorDepth),
    String(window.devicePixelRatio ?? 1),
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    String(navigator.hardwareConcurrency ?? 0),
  ].join('|');
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(signals));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function bootstrapSession() {
  const device_id = getOrCreateDeviceId();
  const fingerprint = await computeFingerprint();
  const res = await fetch(`${API_BASE_URL}/api/v1/public/session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ device_id, fingerprint }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Session bootstrap failed: ${res.status}`);
  const data = await res.json();
  return { device_token: data.device_token, nonce: data.nonce, fingerprint };
}
