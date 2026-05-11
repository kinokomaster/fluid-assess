// FluidAssess quiz module
// Owns answer handling, feedback, scoring, and the ≤50% redo choice screen.
// Depends on nav.js and tracker.js being loaded first.

var quiz = (function () {

  var cfg = {};
  var answered  = [];   // boolean per question
  var correct   = [];   // boolean per question
  var attemptNum = 1;

  // ─── Init ────────────────────────────────────────────────────────────────

  // config shape:
  //   questionCount  {number}  total quiz questions
  //   moduleId       {string}  e.g. 'module_1' — used in tracker events
  //   storageKey     {string}  same key as nav.js uses for progress
  //   quizStart      {number}  slide index of first quiz question
  //   onComplete     {fn}      called with (score, total) when last Q answered
  function init(config) {
    cfg = config;
    answered   = new Array(cfg.questionCount).fill(false);
    correct    = new Array(cfg.questionCount).fill(false);
    attemptNum = loadAttempt();

    // Restore any answers saved mid-session
    restoreAnswers();
  }

  // ─── Answer handler — attach to each option button ───────────────────────

  // answerQ(qIdx, clickedBtn, isCorrect, questionId, answerText)
  function answerQ(qIdx, clickedBtn, isCorrect, questionId, answerText) {
    if (answered[qIdx]) return;
    answered[qIdx] = true;
    correct[qIdx]  = isCorrect;

    // Style all buttons in this question
    var card    = clickedBtn.closest('.question-card');
    var allBtns = card.querySelectorAll('.opt-btn');
    allBtns.forEach(function (b) {
      b.disabled = true;
      if (b !== clickedBtn) b.style.opacity = '0.45';
    });

    clickedBtn.classList.add(isCorrect ? 'correct' : 'incorrect');

    // Reveal correct answer when wrong
    if (!isCorrect) {
      allBtns.forEach(function (b) {
        b.style.opacity = '1';
        if (b.dataset.correct === 'true') b.classList.add('correct');
      });
    }

    // Show feedback box
    var fb = document.getElementById('fb-' + qIdx);
    if (fb) fb.classList.add('show');

    // Save answer state
    saveAnswer(qIdx, isCorrect);

    // Log event
    tracker.logEvent({
      event_type:     'quiz_answer',
      module_id:      cfg.moduleId,
      question_id:    questionId,
      answer:         answerText,
      is_correct:     isCorrect,
      score:          null,
      attempt_number: attemptNum,
    });

    // Enable next
    nav.enableNext();

    // If last question, trigger completion
    if (allAnswered()) {
      if (typeof cfg.onComplete === 'function') {
        cfg.onComplete(getScore(), cfg.questionCount);
      }
    }
  }

  // ─── Score ───────────────────────────────────────────────────────────────

  function getScore() {
    return correct.filter(Boolean).length;
  }

  function allAnswered() {
    return answered.every(Boolean);
  }

  // ─── Retake / Review choice screen ───────────────────────────────────────

  // Call this from onComplete when score ≤ 50%.
  // redoContainerId: ID of a hidden div that holds the choice UI.
  // reviewFn: called when learner picks Review (go back to slide 0).
  // retakeFn: called when learner picks Retake (reset quiz, stay at first quiz slide).
  function showRedoChoice(redoContainerId, reviewFn, retakeFn) {
    var el = document.getElementById(redoContainerId);
    if (el) el.style.display = 'block';

    var btnReview = document.getElementById('btn-review');
    var btnRetake = document.getElementById('btn-retake');

    if (btnReview) btnReview.onclick = function () {
      tracker.logEvent({
        event_type:     'redo_choice',
        module_id:      cfg.moduleId,
        question_id:    null,
        answer:         'review',
        is_correct:     null,
        score:          getScore(),
        attempt_number: attemptNum,
      });
      if (typeof reviewFn === 'function') reviewFn();
    };

    if (btnRetake) btnRetake.onclick = function () {
      tracker.logEvent({
        event_type:     'redo_choice',
        module_id:      cfg.moduleId,
        question_id:    null,
        answer:         'retake',
        is_correct:     null,
        score:          getScore(),
        attempt_number: attemptNum,
      });
      attemptNum++;
      saveAttempt();
      resetQuiz();
      if (typeof retakeFn === 'function') retakeFn();
    };
  }

  // ─── Reset (retake path) ─────────────────────────────────────────────────

  function resetQuiz() {
    answered = new Array(cfg.questionCount).fill(false);
    correct  = new Array(cfg.questionCount).fill(false);
    clearSavedAnswers();

    // Hide the redo choice panel if present
    var redoPanel = document.getElementById('redo-panel');
    if (redoPanel) redoPanel.style.display = 'none';

    // Reset all option buttons
    document.querySelectorAll('.opt-btn').forEach(function (b) {
      b.disabled = false;
      b.classList.remove('correct', 'incorrect');
      b.style.opacity = '';
    });

    // Hide all feedback boxes
    document.querySelectorAll('.feedback-box').forEach(function (fb) {
      fb.classList.remove('show');
    });

    // Disable next (quiz questions need answering again)
    nav.disableNext();
  }

  // ─── Progress persistence ────────────────────────────────────────────────

  function saveAnswer(qIdx, wasCorrect) {
    if (!cfg.storageKey) return;
    try {
      var raw = localStorage.getItem(cfg.storageKey) || '{}';
      var data = JSON.parse(raw);
      if (!data.quiz) data.quiz = {};
      data.quiz[qIdx] = wasCorrect;
      localStorage.setItem(cfg.storageKey, JSON.stringify(data));
    } catch (_) {}
  }

  function restoreAnswers() {
    if (!cfg.storageKey) return;
    try {
      var raw = localStorage.getItem(cfg.storageKey);
      if (!raw) return;
      var data = JSON.parse(raw);
      if (!data.quiz) return;
      Object.keys(data.quiz).forEach(function (k) {
        var qIdx = parseInt(k, 10);
        // Only restore if the button exists and hasn't been answered yet
        var card = document.getElementById('q-card-' + qIdx);
        if (!card) return;
        var allBtns = card.querySelectorAll('.opt-btn');
        var wasCorrect = data.quiz[k];
        answered[qIdx] = true;
        correct[qIdx]  = wasCorrect;
        allBtns.forEach(function (b) {
          b.disabled = true;
          if (b.dataset.correct === 'true') b.classList.add('correct');
        });
        var fb = document.getElementById('fb-' + qIdx);
        if (fb) fb.classList.add('show');
      });
    } catch (_) {}
  }

  function clearSavedAnswers() {
    if (!cfg.storageKey) return;
    try {
      var raw = localStorage.getItem(cfg.storageKey) || '{}';
      var data = JSON.parse(raw);
      delete data.quiz;
      localStorage.setItem(cfg.storageKey, JSON.stringify(data));
    } catch (_) {}
  }

  function loadAttempt() {
    if (!cfg.storageKey) return 1;
    try {
      var raw = localStorage.getItem(cfg.storageKey);
      if (!raw) return 1;
      var data = JSON.parse(raw);
      return data.attempt || 1;
    } catch (_) { return 1; }
  }

  function saveAttempt() {
    if (!cfg.storageKey) return;
    try {
      var raw = localStorage.getItem(cfg.storageKey) || '{}';
      var data = JSON.parse(raw);
      data.attempt = attemptNum;
      localStorage.setItem(cfg.storageKey, JSON.stringify(data));
    } catch (_) {}
  }

  // ─── Public API ──────────────────────────────────────────────────────────

  return {
    init:           init,
    answerQ:        answerQ,
    getScore:       getScore,
    allAnswered:    allAnswered,
    isAnswered:     function (qIdx) { return answered[qIdx] || false; },
    showRedoChoice: showRedoChoice,
    resetQuiz:      resetQuiz,
  };

})();
