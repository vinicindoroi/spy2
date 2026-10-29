/* Page: /quiz/ — Confidential assessment (inspired by investigation_quiz_premium,
   six questions adapted to this funnel's design → /target-phone-lookup/ with thanks modal) */
import '../navigate.js?v=20261011-sck-1';
import { go } from '../navigate.js?v=20261011-sck-1';

const QUESTIONS = [
  {
    tag: 'RELATIONSHIP CONTEXT',
    icon: 'heart',
    title: 'How long have you been together?',
    hint: 'This helps establish the baseline for changes in their behavior.',
    options: ['Less than 1 year', '1–3 years', '4–10 years', 'Over 10 years'],
  },
  {
    tag: 'PARTNER PROFILE',
    icon: 'user',
    title: "What is your partner's age range?",
    hint: 'We use general life-stage context, not age as proof of wrongdoing.',
    options: ['18–29', '30–39', '40–49', '50 or older'],
  },
  {
    tag: 'DAILY ROUTINE',
    icon: 'clock',
    title: 'How much time are they usually away from home?',
    hint: 'Include work, exercise, errands, and social commitments.',
    options: ['Under 4 hours a day', '4–8 hours a day', 'More than 8 hours a day', 'Their schedule changes often'],
  },
  {
    tag: 'BEHAVIORAL CHANGES',
    icon: 'activity',
    title: 'What has changed the most recently?',
    hint: 'Choose the single change that stands out to you.',
    options: ['Unexpected absences or new excuses', 'Less attention or emotional distance', 'A sudden change in daily routines', 'Nothing specific and just a feeling'],
  },
  {
    tag: 'COMMUNICATION PATTERNS',
    icon: 'message',
    title: 'Have their phone habits changed?',
    hint: 'Think about behavior you have personally observed and not private messages.',
    options: ['They are more protective of their phone', 'They message or receive alerts at unusual times', 'They seem less available to talk', "I haven't noticed a change"],
  },
  {
    tag: 'FINAL STEP',
    icon: 'search',
    title: 'Are you ready to uncover hidden chats and deleted photos your partner might be hiding from you right now?',
    hint: '',
    options: [
      'I need undeniable proof so show me everything.',
      'I have doubts and need answers now.',
      'I just want peace of mind, even if it hurts.',
    ],
  },
];

const ICON_PATHS = {
  heart: 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z',
  user: 'M20 21v-2a6 6 0 0 0-6-6H10a6 6 0 0 0-6 6v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
  clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 6v6l4 2',
  activity: 'M3 12h4l3-8 4 16 3-8h4',
  message: 'M21 11.5a8.4 8.4 0 0 1-.9 3.8A8.5 8.5 0 0 1 12.5 20a8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 12.5 3H13a8.5 8.5 0 0 1 8 8.5Z',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM21 21l-4.35-4.35',
};

const icon = (name) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" aria-hidden="true"><path d="${ICON_PATHS[name]}"/></svg>`;

const $ = (id) => document.getElementById(id);
let current = 0;
const answers = Array(QUESTIONS.length).fill(null);

function saveAnswers() {
  try {
    localStorage.setItem('lf_quiz_answers_v1', JSON.stringify(answers));
  } catch { /* silent */ }
}

function finish() {
  saveAnswers();
  try {
    sessionStorage.setItem('lf_after_quiz', '1');
  } catch { /* silent */ }
  go('../target-phone-lookup/');
}

function render() {
  const q = QUESTIONS[current];
  const total = String(QUESTIONS.length).padStart(2, '0');

  $('progressText').textContent = `${String(current + 1).padStart(2, '0')} / ${total}`;
  $('fill').style.width = `${((current + 1) / QUESTIONS.length) * 100}%`;

  $('panel').innerHTML = `
    <div class="panel-top">
      <span class="step-tag">${q.tag}</span>
      <span class="mini-icon">${icon(q.icon)}</span>
    </div>
    <h2 class="question">${q.title}</h2>
    <p class="hint">${q.hint}</p>
    <div class="options">
      ${q.options
        .map(
          (option, i) =>
            `<button class="choice cta-main${answers[current] === i ? ' selected' : ''}" data-choice="${i}" type="button"><span>${option}</span></button>`
        )
        .join('')}
    </div>`;

  $('panel').querySelectorAll('[data-choice]').forEach((button) => {
    button.addEventListener('click', () => {
      answers[current] = Number(button.dataset.choice);
      $('panel').querySelectorAll('.choice').forEach((choice) => { choice.disabled = true; });
      button.classList.add('selected');

      if (current === 0) {
        $('quizHero')?.classList.add('is-hidden');
      }

      setTimeout(() => {
        if (current === QUESTIONS.length - 1) {
          finish();
        } else {
          current += 1;
          render();
        }
      }, 260);
    });
  });
}

render();

/* History restores the DOM after the final selection disabled the buttons. */
window.addEventListener('pageshow', (event) => {
  if (event.persisted) render();
});
