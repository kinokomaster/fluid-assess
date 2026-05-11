// FluidAssess navigation module
// Call nav.init(config) once per page. All other interaction goes through
// nav.next(), nav.back(), nav.enableNext(), nav.disableNext().

var nav = (function () {

  var cfg = {};
  var current = 0;

  // ─── Init ────────────────────────────────────────────────────────────────

  // config shape:
  //   slides      {number}  total slide count
  //   quizStart   {number}  index where quiz begins (back-lock activates)
  //   quizEnd     {number}  index of last quiz slide (inclusive)
  //   summaryIdx  {number}  index of summary / final slide (-1 if none)
  //   storageKey  {string}  localStorage key for progress (e.g. 'fa_m1_progress')
  //   onEnter     {fn}      called with (slideIndex) after each slide change
  function init(config) {
    cfg = config;

    tracker.flushQueue();
    tracker.getLearnerId();   // ensure ID is generated on first page load

    var saved = loadProgress();
    // Sync DOM: HTML marks slide 0 active by default; move it to the saved slide
    if (saved !== 0) {
      var slides = document.querySelectorAll('.slide');
      if (slides[0])     slides[0].classList.remove('active');
      if (slides[saved]) slides[saved].classList.add('active');
    }
    current = saved;
    render();
    if (typeof cfg.onEnter === 'function') cfg.onEnter(current);
  }

  // ─── Public navigation ───────────────────────────────────────────────────

  function next() {
    var nextBtn = document.getElementById('btn-next');
    if (nextBtn && nextBtn.disabled) return;
    if (current >= cfg.slides - 1) return;
    go(current + 1);
  }

  function back() {
    if (isBackLocked()) return;
    if (current <= 0) return;
    go(current - 1);
  }

  function goTo(index) {
    if (index < 0 || index >= cfg.slides) return;
    go(index);
  }

  function enableNext() {
    var btn = document.getElementById('btn-next');
    if (btn) btn.disabled = false;
  }

  function disableNext() {
    var btn = document.getElementById('btn-next');
    if (btn) btn.disabled = true;
  }

  function getCurrent() { return current; }

  // ─── Internal ────────────────────────────────────────────────────────────

  function go(index) {
    var slides = document.querySelectorAll('.slide');
    slides[current].classList.remove('active');
    current = index;
    slides[current].classList.add('active');
    saveProgress();
    render();
    window.scrollTo(0, 0);
    if (typeof cfg.onEnter === 'function') cfg.onEnter(current);
  }

  function isBackLocked() {
    return current >= cfg.quizStart && current <= cfg.quizEnd;
  }

  function isInQuiz() {
    return current >= cfg.quizStart && current <= cfg.quizEnd;
  }

  function render() {
    buildDots();
    updateCounter();
    updateNav();
  }

  function buildDots() {
    var container = document.getElementById('page-dots');
    if (!container) return;
    container.innerHTML = '';
    for (var i = 0; i < cfg.slides; i++) {
      var d = document.createElement('div');
      d.className = 'dot';
      if (i >= cfg.quizStart && i <= cfg.quizEnd) d.classList.add('quiz-dot');
      if (i === cfg.summaryIdx)                   d.classList.add('summary-dot');
      if (i === current)      d.classList.add('active');
      else if (i < current)   d.classList.add('done');
      container.appendChild(d);
    }
  }

  function updateCounter() {
    var el = document.getElementById('page-counter');
    if (!el) return;
    if (current < cfg.quizStart) {
      el.textContent = 'Page ' + (current + 1) + ' of ' + cfg.quizStart;
    } else if (current <= cfg.quizEnd) {
      var qNum = current - cfg.quizStart + 1;
      var qTotal = cfg.quizEnd - cfg.quizStart + 1;
      el.textContent = 'Quiz — Q' + qNum + ' of ' + qTotal;
    } else {
      el.textContent = 'Summary';
    }
  }

  function updateNav() {
    var prev = document.getElementById('btn-prev');
    var next = document.getElementById('btn-next');
    var hint = document.getElementById('nav-hint');

    if (!prev || !next) return;

    // Back button
    if (isBackLocked()) {
      prev.disabled = true;
      if (hint) hint.textContent = 'Quiz in progress — navigation locked';
    } else {
      prev.disabled = (current === 0);
      if (hint) hint.textContent = '';
    }

    // Next button label (don't change disabled state — quiz.js owns that)
    if (isInQuiz()) {
      next.textContent = (current === cfg.quizEnd) ? 'See Summary →' : 'Next Question →';
    } else if (current === cfg.summaryIdx) {
      next.textContent = '✓ Complete Module';
    } else {
      next.textContent = (current === cfg.quizStart - 1) ? 'Start Quiz →' : 'Next →';
    }

    // Ensure next is enabled on non-quiz slides
    if (!isInQuiz()) next.disabled = false;
  }

  // ─── Progress persistence ────────────────────────────────────────────────

  function loadProgress() {
    if (!cfg.storageKey) return 0;
    try {
      var raw = localStorage.getItem(cfg.storageKey);
      if (!raw) return 0;
      var saved = JSON.parse(raw);
      return (typeof saved.slide === 'number') ? saved.slide : 0;
    } catch (_) { return 0; }
  }

  function saveProgress() {
    if (!cfg.storageKey) return;
    try {
      var existing = {};
      try { existing = JSON.parse(localStorage.getItem(cfg.storageKey) || '{}'); } catch (_) {}
      existing.slide = current;
      localStorage.setItem(cfg.storageKey, JSON.stringify(existing));
    } catch (_) {}
  }

  function clearProgress() {
    if (!cfg.storageKey) return;
    try { localStorage.removeItem(cfg.storageKey); } catch (_) {}
  }

  // ─── Public API ──────────────────────────────────────────────────────────

  return {
    init:          init,
    next:          next,
    back:          back,
    goTo:          goTo,
    enableNext:    enableNext,
    disableNext:   disableNext,
    getCurrent:    getCurrent,
    clearProgress: clearProgress,
  };

})();
