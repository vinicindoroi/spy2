/* Love Finder — store.js: port of src/store/quiz.js (same localStorage keys) */
import { API_BASE_URL } from './config.js?v=20261008-2';
import { bootstrapSession } from './session.js?v=20261008-2';
import { currentQuery, getTrackingParams } from './tracking.js?v=20261011-sck-1';

export const PROFILE_PHOTO_EVENT = 'lf:profile-photo';

function notifyProfileChange() {
  window.dispatchEvent(new CustomEvent(PROFILE_PHOTO_EVENT));
}

export const LOCK_CONFIG = Object.freeze({
  storageKey: 'private_quizz_target_phone_search_lock_v1',
  durationSeconds: 1800,
});

export function readTargetPhoneSearchLock() {
  try {
    const raw = localStorage.getItem(LOCK_CONFIG.storageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.phone || !parsed?.expiresAt || Date.now() >= Number(parsed.expiresAt)) {
      localStorage.removeItem(LOCK_CONFIG.storageKey);
      return null;
    }
    return parsed;
  } catch {
    localStorage.removeItem(LOCK_CONFIG.storageKey);
    return null;
  }
}

export const store = {
  get targetGender() { return localStorage.getItem('targetGender'); },
  get targetPhoneNumber() { return localStorage.getItem('targetPhoneNumber') || ''; },
  get city() { return localStorage.getItem('lf_city') || ''; },
  get userPhotoUrl() { return localStorage.getItem('lf_photo_url') || ''; },
  get fallbackPhotoUrl() { return localStorage.getItem('lf_photo_fallback') || ''; },
  get photoStatus() { return localStorage.getItem('lf_photo_status') || 'idle'; },
  get photoPhone() { return localStorage.getItem('lf_photo_phone') || ''; },
  get profileDescription() { return localStorage.getItem('lf_profile_description') || ''; },

  setTargetGender(g) { localStorage.setItem('targetGender', g); },
  setTargetPhone(p) {
    if (p !== this.targetPhoneNumber) {
      localStorage.setItem('lf_photo_url', '');
      localStorage.setItem('lf_photo_fallback', '');
      localStorage.setItem('lf_photo_status', 'idle');
      localStorage.setItem('lf_photo_phone', '');
      localStorage.setItem('lf_profile_description', '');
    }
    localStorage.setItem('targetPhoneNumber', p);
  },
  setCity(c) { localStorage.setItem('lf_city', c || ''); },

  getTargetPhoneSearchLock() { return readTargetPhoneSearchLock(); },
  isTargetPhoneSearchLocked() { return Boolean(readTargetPhoneSearchLock()); },

  lockTargetPhoneSearch(phone) {
    const lock = { phone, lockedAt: Date.now(), expiresAt: Date.now() + LOCK_CONFIG.durationSeconds * 1000 };
    this.setTargetPhone(phone);
    localStorage.setItem(LOCK_CONFIG.storageKey, JSON.stringify(lock));
    return lock;
  },

  getCountryInitials(phone) {
    if (!phone) return 'US';
    if (phone.startsWith('+55')) return 'BR';
    if (phone.startsWith('+351')) return 'PT';
    if (phone.startsWith('+44')) return 'GB';
    return 'US';
  },

  generateSVGAvatar(initials = 'XX', size = 100) {
    const colors = ['#1a2a44', '#2c3e50', '#34495e', '#2980b9', '#8e44ad'];
    const bg = colors[(initials.charCodeAt(0) || 0) % colors.length];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="${bg}"/><text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-family="Inter, sans-serif" font-size="${size * 0.35}" fill="#fff" font-weight="600">${initials.toUpperCase().slice(0, 2)}</text></svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  },

  async fetchProfilePhotoWithRetry(phone, options = {}) {
    if (!phone) return false;
    localStorage.setItem('lf_photo_phone', phone);
    localStorage.setItem('lf_photo_url', '');
    localStorage.setItem('lf_profile_description', '');
    localStorage.setItem('lf_photo_status', 'loading');
    const fallback = this.generateSVGAvatar(this.getCountryInitials(phone), 100);
    localStorage.setItem('lf_photo_fallback', fallback);
    notifyProfileChange();
    try {
      const session = await bootstrapSession();
      const utmParams = Object.fromEntries(
        Object.entries(getTrackingParams(currentQuery()))
          .filter(([key]) => key.toLowerCase().startsWith('utm_'))
          .map(([key, value]) => [key.toLowerCase(), value])
      );
      const res = await fetch(`${API_BASE_URL}/api/v1/lookups/profile-photo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone, device_token: session.device_token, nonce: session.nonce,
          utm_params: Object.keys(utmParams).length ? utmParams : undefined,
        }),
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) throw new Error(`Profile lookup failed: ${res.status}`);
      const payload = await res.json();
      const data = Array.isArray(payload) ? payload[0] : payload;
      if (this.photoPhone !== phone || this.targetPhoneNumber !== phone) return false;
      localStorage.setItem('lf_profile_description', typeof data?.description === 'string' ? data.description.trim() : '');
      if (data?.profile_image) {
        localStorage.setItem('lf_photo_url', data.profile_image);
        localStorage.setItem('lf_photo_status', 'loaded');
        notifyProfileChange();
        return true;
      }
      throw new Error('no profile image');
    } catch {
      if (this.photoPhone !== phone || this.targetPhoneNumber !== phone) return false;
      localStorage.setItem('lf_photo_status', 'missing');
      localStorage.setItem('lf_photo_url', '');
      if (!options.allowMissing) {
        localStorage.setItem('lf_photo_fallback', this.generateSVGAvatar(this.getCountryInitials(phone), 100));
      }
      notifyProfileChange();
      return false;
    }
  },
};
