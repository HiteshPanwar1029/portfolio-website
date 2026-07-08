/* ============================================================
   journey.js — "Career, plotted."

   The Trajectory section is an SVG ascent chart: six milestones
   rising from B.Tech (2019) to AI Governance & Risk (now).

     • the line draws itself when the chart scrolls into view
       (stroke-dashoffset transition, .is-drawn on the <svg>);
     • each point (and each mobile list item) selects a phase,
       updating the detail panel below;
     • default selection is the destination — the section's
       resting message is "ready now".

   prefers-reduced-motion: chart appears fully drawn, no pulse.
   ============================================================ */

const PHASES = [
  {
    kicker: 'PHASE 01 · FOUNDATION — 2019–2023',
    title: 'B.Tech Computer Science — GLA University',
    desc: 'Data structures to computer vision to AI for IIoT. I learned to build the systems I now hold to account — and I can still read them down to the code.',
    carry: 'Engineering rigour'
  },
  {
    kicker: 'PHASE 02 · PROOF — 2022–2025',
    title: 'Production data science — Dysmech, Pune',
    desc: 'Defect escapes down 70%. Running costs down 15%. Cold-chain spoilage down 80%. AI in production, where a wrong model costs real money.',
    carry: 'Shipped AI has consequences'
  },
  {
    kicker: 'PHASE 03 · PERSPECTIVE — 2025–2026',
    title: 'MSc Management — UCD Smurfit, Dublin',
    desc: 'Corporate finance, global strategy, AI & business analytics. AI risk, translated into the board’s native language.',
    carry: 'Boardroom fluency'
  },
  {
    kicker: 'PHASE 04 · PRACTICE — 2025–PRESENT',
    title: 'GenAI evaluation — Outlier & RWS',
    desc: 'EU AI Act and governance frameworks applied to frontier model outputs. Daily, quantitatively, and for keeps.',
    carry: 'Model-level governance'
  },
  {
    kicker: 'PHASE 05 · CREDENTIAL — IN PROGRESS',
    title: 'CIPP/E — IAPP',
    desc: 'Europe’s benchmark privacy certification — studied with a spaced-repetition app I built myself, because encoding the law is how you learn it.',
    carry: 'GDPR fluency'
  },
  {
    kicker: 'PHASE 06 · DESTINATION — NOW',
    title: 'AI Governance & Risk — Dublin / EU',
    desc: 'Five phases, one direction, zero doubt. Engineering to read the system, industry scars to respect it, management to price it, evaluation practice to test it, CIPP/E to regulate it. Available now.',
    carry: 'Everything above, compounding',
    cta: true
  }
];

export function initJourney() {
  const section = document.querySelector('.journey');
  if (!section) return;

  const chart = section.querySelector('.jchart');
  const points = Array.from(section.querySelectorAll('[data-jpt]'));
  const detail = section.querySelector('.jdetail');
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Draw-on-view ----
  if (chart) {
    if (reduce) {
      chart.classList.add('is-drawn');
    } else {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          chart.classList.add('is-drawn');
          io.disconnect();
        });
      }, { threshold: 0.35 });
      io.observe(chart);
    }
  }

  // ---- Phase selection ----
  if (!detail || points.length === 0) return;

  const el = (name) => detail.querySelector('[data-j=' + name + ']');
  const kicker = el('kicker');
  const title = el('title');
  const desc = el('desc');
  const carry = el('carry');
  const cta = el('cta');

  const select = (idx) => {
    const data = PHASES[idx];
    if (!data) return;
    points.forEach((p) => {
      const active = parseInt(p.dataset.jpt, 10) === idx;
      p.classList.toggle('is-active', active);
      p.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    if (kicker) kicker.textContent = data.kicker;
    if (title) title.textContent = data.title;
    if (desc) desc.textContent = data.desc;
    if (carry) carry.textContent = data.carry;
    if (cta) cta.hidden = !data.cta;
    // retrigger the swap animation
    detail.classList.remove('is-swapped');
    void detail.offsetWidth;
    detail.classList.add('is-swapped');
  };

  points.forEach((p) => {
    const idx = parseInt(p.dataset.jpt, 10);
    p.addEventListener('click', () => select(idx));
    p.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(idx); }
    });
  });

  // Default: the destination.
  select(PHASES.length - 1);
}
