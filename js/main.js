/* ============================================================
   main.js — entry point.
   Imports each feature module and initialises them once the DOM
   is ready. Loaded as <script type="module"> so paths are relative
   and execution is deferred automatically.
   ============================================================ */

import { initLoader } from './loader.js';
import { initScroll } from './scroll.js';
import { initCursorGlow } from './cursor-glow.js';
import { initCaseStudies } from './case-studies.js';
import { initNeuralNetwork } from './neural-network.js';
import { initCounters } from './counters.js';

function init() {
  initLoader();          // hero loading sequence + character reveal
  initScroll();          // progress bar, sticky nav, section indicator, scroll-reveal
  initCursorGlow();      // cursor glow (hover-capable devices only)
  initCaseStudies();     // horizontal drag-to-scroll (desktop)
  initNeuralNetwork();   // skill→output diagram + mobile fallback
  initCounters();        // stat count-up
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
