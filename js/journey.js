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
    desc: 'Data structures, computer vision, AI for IIoT. This is where I learned how these systems are built — useful now that my job is asking awkward questions about them.',
    carry: 'Engineering fundamentals'
  },
  {
    kicker: 'PHASE 02 · PROOF — 2022–2025',
    title: 'Production data science — Dysmech, Pune',
    desc: 'Computer vision QA on real production lines: defect escapes down 70%, cold-chain spoilage down 80%. Also where I learned that a wrong model isn’t a research finding — it’s an invoice.',
    carry: 'Production experience'
  },
  {
    kicker: 'PHASE 03 · PERSPECTIVE — 2025–2026',
    title: 'MSc Management — UCD Smurfit, Dublin',
    desc: 'Corporate finance, global strategy, business analytics. Mostly: learning to explain technical risk to the people who own the budget.',
    carry: 'Business fluency'
  },
  {
    kicker: 'PHASE 04 · PRACTICE — 2025–PRESENT',
    title: 'GenAI evaluation — Outlier & RWS',
    desc: 'I review frontier model outputs for accuracy, bias and reasoning quality — daily, against structured rubrics. Governance work at the model level, not the policy level.',
    carry: 'Hands-on model evaluation'
  },
  {
    kicker: 'PHASE 05 · CREDENTIAL — IN PROGRESS',
    title: 'AIGP & CIPP/E — IAPP',
    desc: 'IAPP’s AI Governance and EU privacy certifications, both in progress. I built myself a study app to drill for both (see Projects) — either dedication or a very elaborate way to avoid flashcards.',
    carry: 'GDPR depth'
  },
  {
    kicker: 'PHASE 06 · NEXT — LOOKING FOR OPPORTUNITIES',
    title: 'AI Governance & Risk — Dublin / EU',
    desc: 'The role I’m working towards: engineering to understand the systems, production experience to know what breaks, management training for the business side, AIGP and CIPP/E for the law. Currently looking for opportunities.',
    carry: 'Everything above',
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
