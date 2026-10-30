/* Page: /boyfriend-risk-report/ · /girlfriend-risk-report/ — Step6Base.vue
   (risk report + sticky timer + back-trap → /last-chance-offer) */
import '../navigate.js?v=20261011-sck-1';
import { store } from '../store.js?v=20261011-sck-1';
import { appendTrackingToUrl } from '../tracking.js?v=20261011-sck-1';
import { CHECKOUT_URL } from '../config.js?v=20261009-1';
import { go } from '../navigate.js?v=20261011-sck-1';

function runReport() {
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const rp = $('.result-page');
  const gender = (rp && rp.dataset && rp.dataset.gender) || 'boyfriend';
  const phone = store.targetPhoneNumber || '';

  /* --- Computed values (same formulas as the original) --- */
  const reportId = Math.random().toString(36).slice(2, 10).toUpperCase();

  const maskedPhone = (() => {
    if (!phone || phone.length < 6) return 'target';
    return phone.slice(0, 6) + '***' + phone.slice(-2);
  })();

  const countryInitials = store.getCountryInitials ? store.getCountryInitials(phone) : 'US';

  const profileSrc = (() => {
    if (store.userPhotoUrl?.startsWith('http')) return store.userPhotoUrl;
    if (store.fallbackPhotoUrl) return store.fallbackPhotoUrl;
    if (typeof store.generateSVGAvatar === 'function') {
      try { return store.generateSVGAvatar(countryInitials, 80); } catch(e){}
    }
    return '';
  })();

  function formatDate(opts, fallbackFmt) {
    try {
      return new Intl.DateTimeFormat('en-US', { ...opts, timeZone: 'America/New_York' }).format(new Date());
    } catch {
      try {
        return new Intl.DateTimeFormat('en-US', opts).format(new Date());
      } catch {
        return fallbackFmt || new Date().toLocaleDateString('en-US');
      }
    }
  }

  const reportDateTime = formatDate({
    month: 'long', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: true,
  });

  const shortReportDate = formatDate({
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
  });

  const offerDate = formatDate({
    month: 'long', day: 'numeric', year: 'numeric',
  });

  /* Checkout: upsell=true + tel + tracking */
  const checkoutUrl = (() => {
    try {
      const url = new URL(CHECKOUT_URL);
      url.searchParams.set('upsell', 'true');
      if (phone) { url.searchParams.set('tel', phone); url.searchParams.set('phone', phone); }
      if (typeof appendTrackingToUrl === 'function') appendTrackingToUrl(url);
      return url.toString();
    } catch {
      return CHECKOUT_URL;
    }
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
  ];

  const activityLog = [
    { time: '2026-09-09 17:23:15', type: 'log-chat', label: 'CHAT', desc: 'Suspicious message detected: "miss you" (to unknown contact)' },
    { time: '2026-09-12 22:45:33', type: 'log-media', label: 'MEDIA', desc: 'Deleted video recovered (duration: 00:03:12, text accompanying the message: for my baby...🔥)' },
    { time: '2026-09-17 01:17:08', type: 'log-chat', label: 'CHAT', desc: 'Hidden chat restored: 47 messages exchanged with saved name "Baby"' },
    { time: '2026-09-19 04:33:42', type: 'log-voice', label: 'VOICE', desc: 'Deleted voice note recovered: "don\'t tell anyone"' },
  ];

  const textTestimonials = [
    { text: 'I had that sickening feeling for months that something wasn\'t right. He swore I was paranoid. One scan here showed me 3 hidden apps and deleted conversations from last week. Heartbroken, but I finally have peace.', name: 'Sarah M., 31' },
    { text: 'She started putting her phone face-down and changed her passcode. This tool showed the exact locations she was visiting during her "late meetings." It gave me the truth when nobody else would.', name: 'Marcus T., 38' },
    { text: 'I didn\'t want to believe it. But seeing the recovered photos that were supposed to be "single-view" was all the evidence I needed. Confronted him that same night. Worth every single penny.', name: 'Jessica R., 27' },
    { text: 'Found secret Tinder and Bumble profiles linked to his number. He denied it until I showed him the timestamps. Saved me years of being lied to.', name: 'Elena K., 34' },
    { text: 'The location data alone blew the lid off everything. Claimed he was at the office - phone was pinging a private residence 20 miles away. You can\'t argue with raw data.', name: 'David P., 42' },
  ];

  const videoTestimonials = [
    { name: 'Chloe B., 29', quote: '"The proof was right there in the full report."', src: 'https://scripts.converteai.net/4ca429f4-1ea1-4e78-9580-c1103c809ddb/players/694ab59296e832961e08ce7a/embed.html' },
    { name: 'Rachel S., 33', quote: '"I stopped wondering and finally knew the truth."', src: 'https://scripts.converteai.net/4ca429f4-1ea1-4e78-9580-c1103c809ddb/players/694ab5576a88b8e05a013d5a/embed.html' },
    { name: 'Amanda L., 26', quote: '"Recovered messages he thought were gone forever."', src: 'https://scripts.converteai.net/4ca429f4-1ea1-4e78-9580-c1103c809ddb/players/694ab530cf56b8e84e5658e0/embed.html' },
    { name: 'Jason K., 35', quote: '"Best money I ever spent. No more second-guessing."', src: 'https://scripts.converteai.net/4ca429f4-1ea1-4e78-9580-c1103c809ddb/players/694ab4d7f57a3e7ec27b147d/embed.html' },
    { name: 'Michael V., 41', quote: '"Showed me what six months of asking never could."', src: 'https://scripts.converteai.net/4ca429f4-1ea1-4e78-9580-c1103c809ddb/players/694ab4430f55cf662df5a3c6/embed.html' },
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
  try {
    $$('[data-phone]').forEach((el) => { el.textContent = phone || '—'; });
    if ($('#reportDateTime')) $('#reportDateTime').textContent = reportDateTime;
    if ($('#reportId')) $('#reportId').textContent = reportId;
    if ($('#maskedPhone')) $('#maskedPhone').textContent = maskedPhone;
    if ($('#offerDate')) $('#offerDate').textContent = offerDate;
    if ($('#analysisDate')) $('#analysisDate').textContent = shortReportDate;
    if ($('#locationCity')) $('#locationCity').textContent = store.city || 'BLOCKED';

    const chatShot = $('#chatShot');
    if (chatShot) {
      chatShot.src = gender === 'girlfriend' ? '../assets/img/newchatwoman.png' : '../assets/img/newchatman.png';
    }

    const avatar = $('#reportAvatar');
    if (avatar) {
      if (profileSrc) avatar.src = profileSrc;
      avatar.addEventListener('error', () => {
        try {
          localStorage.setItem('lf_photo_url', '');
          avatar.src = store.fallbackPhotoUrl || (store.generateSVGAvatar ? store.generateSVGAvatar(countryInitials, 80) : '');
        } catch(e){}
      });
    }
  } catch (err) {
    console.error('Report basic info error:', err);
  }

  try {
    const fl = $('#findingsList');
    if (fl) {
      fl.innerHTML = criticalFindings
        .map((f) => `<li class="finding-item finding-item-lined"><span>${f}</span></li>`)
        .join('');
    }
  } catch (err) {
    console.error('Report findingsList error:', err);
  }

  try {
    const ale = $('#activityLogEntries');
    if (ale) {
      ale.innerHTML = activityLog
        .map((e) => `<div class="log-entry"><span class="log-time">${e.time}</span><span class="log-type ${e.type}">${e.label}</span><span class="log-desc">${e.desc}</span></div>`)
        .join('');
    }
  } catch (err) {
    console.error('Report activityLog error:', err);
  }

  try {
    const hl = $('#heatmapList');
    if (hl) {
      hl.innerHTML = heatmapData
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
    }
  } catch (err) {
    console.error('Report heatmap error:', err);
  }

  try {
    const ql = $('#quotesList');
    if (ql) {
      ql.innerHTML = textTestimonials
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
    }
  } catch (err) {
    console.error('Report quotes error:', err);
  }

  try {
    const vtl = $('#videoTestimonialsList');
    if (vtl) {
      vtl.innerHTML = videoTestimonials
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
    }
  } catch (err) {
    console.error('Report videoTestimonials error:', err);
  }

  try {
    const fc = $('#faqContainer');
    if (fc) {
      fc.innerHTML = faqs
        .map((faq, i) => `
          <div class="faq-item">
            <div class="faq-question">
              <span class="faq-number">${i + 1}</span>
              <span>${faq.question}</span>
            </div>
            <div class="faq-answer">${faq.answer}</div>
          </div>`)
        .join('');
    }
  } catch (err) {
    console.error('Report faqs error:', err);
  }

  try {
    $$('[data-checkout]').forEach((a) => {
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
  } catch (err) {
    console.error('Report checkout wires error:', err);
  }

  /* --- Sticky timer (shows when the heatmap card reaches the top) --- */
  try {
    let timerSecs = 300;
    let timerInterval = null;
    const banner = $('#stickyBanner');
    const bannerTimer = $('#bannerTimer');

    function updateStickyTimerVisibility() {
      if (!banner) return;
      const trigger = $('#stickyTrigger');
      if (!trigger) return;
      banner.classList.toggle('hidden', trigger.getBoundingClientRect().top > 0);
    }

    function renderTimer() {
      if (!banner || !bannerTimer) return;
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
    updateStickyTimerVisibility();
  } catch (err) {
    console.error('Report sticky timer error:', err);
  }

  /* --- Back-trap: browser back → /last-chance-offer --- */
  try {
    window.history.pushState({ reportBackOffer: true }, '', window.location.href);
    window.addEventListener('popstate', () => {
      if (window.trkFunnel) { try { trkFunnel.step('oferta_de_saida_1'); } catch(e){} }
      go('../last-chance-offer/');
    });
  } catch (err) {
    console.error('Report back-trap error:', err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runReport);
} else {
  runReport();
}
