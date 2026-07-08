/* ============================================================
   governance.js — the interactive governance layer:

     • EU AI Act risk pyramid (click / focus a tier → detail panel)
     • GDPR principle chips (hover / tap → how this site honours it)
     • the honest consent banner (zero cookies — an Art. 5(1)(c)
       joke that doubles as a privacy statement)

   All state is in-memory except the banner dismissal, which uses
   sessionStorage so it doesn't nag on every navigation. Fittingly,
   no actual cookies are involved anywhere.
   ============================================================ */

const TIERS = [
  {
    kicker: 'TIER · PROHIBITED — ARTICLE 5',
    title: 'Off the market. Full stop.',
    what: 'Social scoring, manipulative techniques, emotion inference at work or school, untargeted facial-image scraping. Banned from the EU regardless of safeguards.',
    chips: ['Banned outright', 'No conformity path', 'Fines up to 7% of turnover'],
    take: 'The easiest compliance advice I will ever give: don’t. The hard part is recognising these systems before they ship.'
  },
  {
    kicker: 'TIER · HIGH RISK — ANNEX III',
    title: 'Where governance becomes engineering.',
    what: 'CV screening, credit scoring, exam proctoring, critical infrastructure. Permitted — but only with a full control stack in place.',
    chips: ['Risk management system', 'Data governance', 'Human oversight', 'Logging & conformity'],
    take: 'This is the tier I want to work in. It’s where the Act stops being policy and becomes an engineering problem.'
  },
  {
    kicker: 'TIER · LIMITED RISK — ARTICLE 50',
    title: 'Just say what you are.',
    what: 'Chatbots, deepfakes, AI-generated content. The obligation is transparency: people must know they’re interacting with — or looking at — AI.',
    chips: ['Disclose the AI', 'Label synthetic media'],
    take: 'Cheap to comply with, expensive to ignore. Most transparency failures are choices, not oversights.'
  },
  {
    kicker: 'TIER · MINIMAL RISK — EVERYTHING ELSE',
    title: 'Most AI lives here.',
    what: 'Spam filters, recommendation engines, game AI. No mandatory obligations — voluntary codes of conduct apply.',
    chips: ['Voluntary codes', 'No mandatory duties'],
    take: 'Knowing what falls here is half the triage. Governance is as much about knowing what not to escalate.'
  }
];

export function initGovernance() {
  initPyramid();
  initGdprChips();
  initConsentBanner();
}

/* ---------- Risk pyramid ---------- */
function initPyramid() {
  const tiers = Array.from(document.querySelectorAll('.gov-tier'));
  const detail = document.querySelector('.gov-detail');
  if (tiers.length === 0 || !detail) return;

  const el = (name) => detail.querySelector('[data-gov=' + name + ']');
  const kicker = el('kicker');
  const title = el('title');
  const what = el('what');
  const chips = el('chips');
  const take = el('take');

  const select = (idx) => {
    const data = TIERS[idx];
    if (!data) return;
    tiers.forEach((t, i) => {
      t.classList.toggle('is-active', i === idx);
      t.setAttribute('aria-selected', i === idx ? 'true' : 'false');
    });
    if (kicker) kicker.textContent = data.kicker;
    if (title) title.textContent = data.title;
    if (what) what.textContent = data.what;
    if (take) take.textContent = data.take;
    if (chips) {
      chips.innerHTML = '';
      data.chips.forEach((c) => {
        const s = document.createElement('span');
        s.className = 'chip';
        s.textContent = c;
        chips.appendChild(s);
      });
    }
    // retrigger the panel's little swap animation
    detail.classList.remove('is-swapped');
    void detail.offsetWidth;
    detail.classList.add('is-swapped');
  };

  tiers.forEach((t, i) => t.addEventListener('click', () => select(i)));
}

/* ---------- GDPR principle chips (flip on hover / tap) ---------- */
function initGdprChips() {
  document.querySelectorAll('.gdpr-chip').forEach((chip) => {
    const front = chip.textContent;
    const back = chip.dataset.flip || front;
    const show = (flipped) => {
      chip.classList.toggle('is-flipped', flipped);
      chip.textContent = flipped ? back : front;
    };
    chip.addEventListener('mouseenter', () => show(true));
    chip.addEventListener('mouseleave', () => show(false));
    chip.addEventListener('focus', () => show(true));
    chip.addEventListener('blur', () => show(false));
    // touch: tap toggles
    chip.addEventListener('click', () => show(!chip.classList.contains('is-flipped')));
  });
}

/* ---------- Consent banner ---------- */
const CONSENT_KEY = 'hp-consent-dismissed';

function initConsentBanner() {
  const banner = document.querySelector('.consent');
  if (!banner) return;

  let dismissed = false;
  try { dismissed = sessionStorage.getItem(CONSENT_KEY) === '1'; } catch { /* ignore */ }
  if (dismissed) return;

  // Appear after the visitor has settled in.
  setTimeout(() => {
    banner.hidden = false;
    requestAnimationFrame(() => banner.classList.add('is-shown'));
  }, 2200);

  const closeOut = () => {
    try { sessionStorage.setItem(CONSENT_KEY, '1'); } catch { /* ignore */ }
    banner.classList.remove('is-shown');
    setTimeout(() => { banner.hidden = true; }, 500);
  };

  const finish = () => {
    const text = banner.querySelector('[data-consent=text]');
    const actions = banner.querySelector('.consent-actions');
    if (text) text.textContent = 'Good choice. There was nothing to take. — Hitesh Panwar, your next AI governance hire.';
    if (actions) actions.remove();
    setTimeout(closeOut, 2600);
  };

  const accept = banner.querySelector('[data-consent=accept]');
  const reject = banner.querySelector('[data-consent=reject]');
  if (accept) accept.addEventListener('click', finish);
  if (reject) reject.addEventListener('click', finish);
}
