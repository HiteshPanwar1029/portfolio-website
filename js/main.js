/* ============================================================
   main.js — entry point.
   Imports each feature module and initialises them once the DOM
   is ready. Loaded as <script type="module"> so paths are relative
   and execution is deferred automatically.
   ============================================================ */

/* Import specifiers carry ?v= so a stale browser cache can never mix
   old and new modules — bump together with the <script> tag version. */
import { initLoader } from './loader.js?v=5';
import { initScroll } from './scroll.js?v=5';
import { initCursorGlow } from './cursor-glow.js?v=5';
import { initCaseStudies } from './case-studies.js?v=5';
import { initNeuralNetwork } from './neural-network.js?v=5';
import { initCounters } from './counters.js?v=5';
import { initJourney } from './journey.js?v=5';
import { initGovernance } from './governance.js?v=5';

function init() {
  initLoader();          // hero loading sequence + character reveal
  initScroll();          // progress bar, sticky nav, scroll-reveal, mobile menu
  initCursorGlow();      // cursor glow (hover-capable devices only)
  initCaseStudies();     // horizontal drag-to-scroll (desktop)
  initNeuralNetwork();   // skill→output diagram + mobile fallback
  initCounters();        // stat count-up
  initJourney();         // trajectory ascent chart + detail panel
  initGovernance();      // risk pyramid, GDPR chips, consent banner
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
