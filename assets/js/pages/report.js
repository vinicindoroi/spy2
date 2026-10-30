/* Page: /boyfriend-risk-report/ · /girlfriend-risk-report/ — Step6Base.vue
   (risk report + sticky timer + back-trap → /last-chance-offer) */
import '../navigate.js?v=20261011-sck-1';
import { store } from '../store.js?v=20261011-sck-1';
import { appendTrackingToUrl } from '../tracking.js?v=20261011-sck-1';
import { CHECKOUT_URL } from '../config.js?v=20261009-1';
import { go } from '../navigate.js?v=20261011-sck-1';

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const gender = $('.result-page').dataset.gender || 'boyfriend';
const phone = store.targetPhoneNumber || '';

/* --- Computed values (same formulas as the original) --- */
const reportId = Math.random().toString(36).slice(2, 10).toUpperCase();

const maskedPhone = (() => {
  if (!phone || phone.length < 6) return 'target';
  return phone.slice(0, 6) + '***' + phone.slice(-2);
})();

const countryInitials = store.getCountryInitials(phone);

const profileSrc = (() => {
  if (store.userPhotoUrl?.startsWith('http')) return store.userPhotoUrl;
  return store.fallbackPhotoUrl || store.generateSVGAvatar(countryInitials, 80);
})();

const reportDateTime = new Intl.DateTimeFormat('en-US', {
  month: 'long', day: 'numeric', year: 'numeric',
  hour: '2-digit', minute: '2-digit', second: '2-digit',
  hour12: true, timeZone: 'America/New_York',
}).format(new Date());

const shortReportDate = new Intl.DateTimeFormat('en-US', {
  month: 'short', day: 'numeric', year: 'numeric',
  hour: '2-digit', minute: '2-digit', second: '2-digit',
  hour12: false, timeZone: 'America/New_York',
}).format(new Date());

const offerDate = new Intl.DateTimeFormat('en-US', {
  month: 'long', day: 'numeric', year: 'numeric', timeZone: 'America/New_York',
}).format(new Date());

/* Checkout: upsell=true + tel + tracking */
const checkoutUrl = (() => {
  const url = new URL(CHECKOUT_URL);
  url.searchParams.set('upsell', 'true');
  if (phone) { url.searchParams.set('tel', phone); url.searchParams.set('phone', phone); }
  appendTrackingToUrl(url);
  return url.toString();
})();

/* --- Static content (ported 1:1) --- */
const criticalFindings = [
  '<strong>58</strong> messages were flagged.',
  'The word <strong>"Love"</strong> appears in <strong>41</strong> messages.',
  'The word <strong>"delicious"</strong> (or similar) in <strong>13</strong> posts.',
  `<strong>20</strong> photos and <strong>5</strong> videos are behind a password on this phone (<strong>${phone || '+15617393952'}</strong>).`,
  'The word <strong>"Secret"</strong> in <strong>8</strong> messages.',
  `<strong>2</strong> archived conversations flagged as suspicious (<strong>${phone || '+15617393952'}</strong>).`,
  'One unsaved contact - frequent messages, and the word <strong>nostalgia</strong>.',
  '<strong>9</strong> single-view images recovered.',
  '<strong>7</strong> locations logged near BLOCKED..',
];

const heatmapData = [
  { name: 'Messaging Apps', activity: '92%, High Activity', class: 'high', pct: 92, apps: [
    { name: 'WhatsApp', icon: '../assets/img/apps/whatsapp.png' },
    { name: 'Telegram', icon: '../assets/img/apps/telegram.png' },
  ] },
  { name: 'Social Media', activity: '65%, Medium Activity', class: 'medium', pct: 65, apps: [
    { name: 'Instagram', icon: '../assets/img/apps/instagram.png' },
    { name: 'Facebook', icon: '../assets/img/apps/facebook.png' },
  ] },
  { name: 'Dating Apps', activity: '78%, High Activity', class: 'high', pct: 78, apps: [
    { name: 'Tinder', icon: '../assets/img/apps/tinder.svg' },
    { name: 'Bumble', icon: '../assets/img/apps/bumble.png' },
  ] },
  { name: 'Email and Work', activity: '35%, Low Activity', class: 'low', pct: 35, apps: [
    { name: 'Gmail', icon: '../assets/img/apps/gmail.png' },
    { name: 'Outlook', icon: '../assets/img/apps/outlook.png' },
  ] },
];

const activityLog = [
  { time: '2026-09-09 17:23:15', type: 'log-chat', label: 'CHAT', desc: 'Suspicious message detected: "miss you" (to unknown contact)' },
  { time: '2026-09-12 22:45:33', type: 'log-media', label: 'MEDIA', desc: 'Deleted video recovered (duration: 00:03:12, text accompanying the message: for my baby...🔥)' },
  { time: '2026-09-17 01:17:08', type: 'log-chat', label: 'CHAT', desc: 'Hidden chat restored: 47 messages exchanged with saved name "Baby"' },
  { time: '2026-09-19 04:33:42', type: 'log-voice', label: 'VOICE', desc: 'Deleted voice note recovered: "don\'t tell anyone"' },
];

const textTestimonials = [
  {
    name: 'Amanda S.',
    text: "I honestly thought it was all in my head. In less than 10 minutes looking at the report, I found messages, photos, and locations that explained EVERYTHING. I'm not living in denial anymore.",
  },
  {
    name: 'Jason R.',
    text: "If I hadn't used this system, I'd still be begging for 'more attention' from someone who was giving way too much attention to somebody else. The recovered messages left zero room for excuses. It was the shock I needed to move on.",
  },
  {
    name: 'Emily M.',
    text: "I was always afraid to 'snoop and find something.' This isn't snooping, it's seeing organized data: times, numbers, the same little love words over and over... When I saw how many 'love' and 'miss you' texts went to that one hidden number, it clicked instantly.",
  },
  {
    name: 'Daniel T.',
    text: "He kept saying it was just a friend from work. The report showed archived conversations, deleted messages, and even the places where they were meeting up. There's no arguing when you have proof in your hand. I got my peace back and can finally sleep without doubting everything.",
  },
  {
    name: 'Sarah V.',
    text: "I almost backed out at the payment screen, thinking I was overreacting. Now I regret not doing it sooner. The conversations flagged as suspicious showed exactly what I was afraid of. Did it hurt to see it? A lot. But it hurts way less than being lied to in the dark.",
  },
];

const videoTestimonials = [
  {
    name: 'Amanda, 44 - Dallas, TX',
    quote: '"I was nervous, but within minutes it showed hidden messages and even voice notes. That was the confirmation I needed."',
    src: 'https://script-prod.b-cdn.net/V0.530/?videoData=https://prod-hostvsl.b-cdn.net/0e3f7df2-86a2-49f1-8227-ec87180c480f/0e12201b-a0b5-4b93-8edd-be72acf90874/videoInformations.js?VIDEO_ORIGIN=ORIGINAL',
  },
  {
    name: 'Jessica, 39 - Miami, FL',
    quote: '"I had doubts for months. The screenshots, locations, and deleted files made everything impossible to deny."',
    src: 'https://script-prod.b-cdn.net/V0.530/?videoData=https://prod-hostvsl.b-cdn.net/0e3f7df2-86a2-49f1-8227-ec87180c480f/6dd95814-2f1c-4070-8d1e-0d5d5306d795/videoInformations.js?VIDEO_ORIGIN=ORIGINAL',
  },
  {
    name: 'Daniel, 38 - Fresno, CA',
    quote: '"It\'s not guesses or random alerts... it\'s actual proof. I saw the screenshots myself. It\'s worth it."',
    src: 'https://script-prod.b-cdn.net/V0.530/?videoData=https://prod-hostvsl.b-cdn.net/0e3f7df2-86a2-49f1-8227-ec87180c480f/34f08612-c7dc-4316-aa58-4b4502e79f20/videoInformations.js?VIDEO_ORIGIN=ORIGINAL',
  },
];

const faqs = [
  { question: 'How accurate is this system?', answer: "Our AI doesn't guess - it exposes digital proof. Words, photos, messages, hidden files, locations. If it exists, you'll see it." },
  { question: 'Can my partner hide their activity from this tool?', answer: "No chance. Password-protected files, archived chats, deleted images, even single-view content - nothing stays hidden." },
  { question: "Will I really see what they're hiding?", answer: 'Yes. You\'ll see actual messages, photos, videos, and suspicious contacts. This is raw evidence, not assumptions.' },
  { question: 'Is this information reliable?', answer: 'This is not a toy. It\'s powered by surveillance-grade AI, built to catch lies, secrets, and betrayal without fail.' },
  { question: "What happens if I don't check the full report?", answer: `Then you keep living blind. While you hesitate, the cheating continues. <a href="${checkoutUrl}" class="faq-link">Ignoring the truth only makes the betrayal grow</a>.` },
  { question: "Will my partner know I'm using this?", answer: "Never. The process is 100% invisible. They won't see alerts, notifications, or warnings. While they think they're safe, you already have proof." },
  { question: 'What if they already deleted everything?', answer: 'Doesn\'t matter. The system restores erased messages, photos, and files. Deleting is useless - the truth always resurfaces.' },
  { question: 'Does this work anywhere?', answer: 'Yes. At home, work, hotels, or secret residences - every location is tracked and reported.' },
  { question: 'How fast do I get the results?', answer: `Instantly. The AI scans in seconds, and your full report is ready immediately. <a href="${checkoutUrl}" class="faq-link">If something is happening right now, you'll see it now</a>.` },
  { question: 'Why should I pay for this instead of ignoring it?', answer: `Because ignoring means choosing to live in a lie. <a href="${checkoutUrl}" class="faq-link">The truth is cheap. Betrayal costs everything</a>.` },
  { question: 'What exactly will I see inside the report?', answer: 'You\'ll see hidden conversations, suspicious keywords, private media, restored deleted files, and tracked locations. Nothing left to doubt.' },
  { question: "What if I don't find anything?", answer: 'Then you win. You\'ll know the truth and finally have peace of mind. But if something is happening, you\'ll catch it red-handed.' },
  { question: 'Can I use this more than once?', answer: 'Yes. You can scan and re-scan as much as needed. Every time new activity happens, you\'ll have the proof.' },
  { question: 'Is this legal?', answer: 'This is digital intelligence for personal security. The report is private, confidential, and for your eyes only. Nobody else will ever know.' },
  { question: "What's the risk of waiting?", answer: `The longer you wait, the more evidence gets buried. While you hesitate, your partner keeps deleting, hiding, and betraying. <a href="${checkoutUrl}" class="faq-link">Every second counts</a>.` },
];

/* --- Render --- */
$$('[data-phone]').forEach((el) => { el.textContent = phone || '—'; });
$('#reportDateTime').textContent = reportDateTime;
$('#reportId').textContent = reportId;
$('#maskedPhone').textContent = maskedPhone;
$('#offerDate').textContent = offerDate;
$('#analysisDate').textContent = shortReportDate;
$('#locationCity').textContent = store.city || 'BLOCKED';
$('#chatShot').src = gender === 'girlfriend' ? '../assets/img/newchatwoman.png' : '../assets/img/newchatman.png';

const avatar = $('#reportAvatar');
avatar.src = profileSrc;
avatar.addEventListener('error', () => {
  localStorage.setItem('lf_photo_url', '');
  avatar.src = store.fallbackPhotoUrl || store.generateSVGAvatar(countryInitials, 80);
});

$('#findingsList').innerHTML = criticalFindings
  .map((f) => `<li class="finding-item finding-item-lined"><span>${f}</span></li>`)
  .join('');

$('#activityLogEntries').innerHTML = activityLog
  .map((e) => `<div class="log-entry"><span class="log-time">${e.time}</span><span class="log-type ${e.type}">${e.label}</span><span class="log-desc">${e.desc}</span></div>`)
  .join('');

$('#heatmapList').innerHTML = heatmapData
  .map((item) => `
    <div class="heatmap-row">
      <div class="heatmap-top-row">
        <div class="heatmap-name">${item.name}</div>
        <div class="heatmap-label ${item.class}">${item.activity}</div>
      </div>
      <div class="heatmap-apps">
        ${item.apps.map((app) => `<span class="heatmap-app"><img src="${app.icon}" alt="${app.name}" loading="lazy" onerror="this.closest('.heatmap-app').style.display='none'" />${app.name}</span>`).join('')}
      </div>
      <div class="heatmap-bar-wrap">
        <div class="heatmap-bar ${item.class}" style="width: ${item.pct}%"></div>
      </div>
    </div>`)
  .join('');

$('#quotesList').innerHTML = textTestimonials
  .map((q) => `
    <div class="quote-card">
      <div class="quote-stars">★★★★★</div>
      <p class="quote-copy">${q.text}</p>
      <div class="quote-author-row">
        <div class="quote-author">${q.name}</div>
        <div class="quote-verified">VERIFIED</div>
      </div>
    </div>`)
  .join('');

$('#videoTestimonialsList').innerHTML = videoTestimonials
  .map((v) => `
    <div class="video-testimonial-card">
      <div class="video-card-header centered">
        <span class="video-name">${v.name}</span>
        <span class="video-quote">${v.quote}</span>
      </div>
      <div class="testimonial-video-wrap">
        <iframe class="testimonial-video" src="${v.src}" title="${v.name}" allow="fullscreen" referrerpolicy="unsafe-url"></iframe>
      </div>
    </div>`)
  .join('');

$('#faqContainer').innerHTML = faqs
  .map((faq, i) => `
    <div class="faq-item">
      <div class="faq-question">
        <span class="faq-number">${i + 1}</span>
        <span>${faq.question}</span>
      </div>
      <div class="faq-answer">${faq.answer}</div>
    </div>`)
  .join('');

$('[data-checkout]').forEach((a) => {
  a.href = checkoutUrl;
  a.addEventListener('click', () => {
    if (window.trkFunnel) { try { trkFunnel.step('checkout'); } catch(e){} }
    try {
      if (typeof fbq === 'function') {
        fbq('track', 'InitiateCheckout', {
          content_name: 'UncoverAI Spy Access',
          currency: 'USD',
          value: 29.00
        });
      }
    } catch (e) {}
  });
});
$$('.faq-link').forEach((a) => { a.classList.add('cta-main'); });

/* --- Sticky timer (shows when the heatmap card reaches the top) --- */
let timerSecs = 300;
let timerInterval = null;
const banner = $('#stickyBanner');
const bannerTimer = $('#bannerTimer');

function updateStickyTimerVisibility() {
  const trigger = $('#stickyTrigger');
  if (!trigger) return;
  banner.classList.toggle('hidden', trigger.getBoundingClientRect().top > 0);
}

function renderTimer() {
  const m = Math.floor(timerSecs / 60).toString().padStart(2, '0');
  const s = (timerSecs % 60).toString().padStart(2, '0');
  bannerTimer.textContent = `${m}:${s}`;
  const state = timerSecs <= 30 ? 'critical' : timerSecs <= 60 ? 'warning' : 'normal';
  banner.classList.remove('is-normal', 'is-warning', 'is-critical');
  banner.classList.add(`is-${state}`);
}

timerInterval = setInterval(() => {
  if (timerSecs > 0) timerSecs -= 1;
  renderTimer();
}, 1000);
renderTimer();

window.addEventListener('scroll', updateStickyTimerVisibility, { passive: true });

/* --- Back-trap: browser back → /last-chance-offer --- */
window.history.pushState({ reportBackOffer: true }, '', window.location.href);
window.addEventListener('popstate', () => {
  if (window.trkFunnel) { try { trkFunnel.step('oferta_de_saida_1'); } catch(e){} }
  go('../last-chance-offer/');
});

updateStickyTimerVisibility();

/* keep interval handle referenced for clarity (page unload clears it) */
void timerInterval;
