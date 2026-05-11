// FluidAssess event tracker
// Single source of truth for learner_id generation and event logging.
// All pages must include this script and call tracker.flushQueue() on load.

var tracker = (function () {

  var ENDPOINT = 'https://script.google.com/macros/s/AKfycbwp1gSNorh0TD-n4tHuT019_hENRDXtB7SuDmzIdDEGGX1qZeywi_CAtb8XUCQzenNx/exec';

  var STORAGE = {
    learnerId:  'fluidassess_learner_id',
    progress:   'fluidassess_progress',
    queue:      'fluidassess_event_queue',
  };

  // ─── Learner ID ──────────────────────────────────────────────────────────

  function getLearnerId() {
    var id = localStorage.getItem(STORAGE.learnerId);
    if (!id) {
      id = 'LRN-' + Math.random().toString(36).toUpperCase().slice(2, 8);
      localStorage.setItem(STORAGE.learnerId, id);
    }
    return id;
  }

  // ─── Event queue (retry on network failure) ───────────────────────────────

  function readQueue() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE.queue) || '[]');
    } catch (_) {
      return [];
    }
  }

  function writeQueue(q) {
    try {
      localStorage.setItem(STORAGE.queue, JSON.stringify(q));
    } catch (_) {}
  }

  function postEvent(eventObj) {
    return fetch(ENDPOINT, {
      method:    'POST',
      mode:      'no-cors',
      keepalive: true,
      headers:   { 'Content-Type': 'application/json' },
      body:      JSON.stringify(eventObj),
    });
  }

  // Flush queued events sequentially. Optional onComplete callback fires when done.
  function flushQueue(onComplete) {
    var q = readQueue();
    if (q.length === 0) { if (onComplete) onComplete(); return; }
    writeQueue([]);

    function send(i) {
      if (i >= q.length) { if (onComplete) onComplete(); return; }
      postEvent(q[i])
        .catch(function () {
          var current = readQueue();
          current.push(q[i]);
          writeQueue(current);
        })
        .then(function () {
          send(i + 1);
        });
    }
    send(0);
  }

  // ─── Public API ───────────────────────────────────────────────────────────

  function buildPayload(eventObj) {
    return Object.assign({}, eventObj, {
      learner_id:  getLearnerId(),
      timestamp:   new Date().toISOString(),
      user_agent:  navigator.userAgent.slice(0, 200),
    });
  }

  // logEvent — fire-and-forget POST; queues on failure.
  function logEvent(eventObj) {
    flushQueue();
    var payload = buildPayload(eventObj);
    postEvent(payload).catch(function () {
      var q = readQueue();
      q.push(payload);
      writeQueue(q);
    });
  }

  // queueEvent — write to localStorage queue without POSTing now.
  // Use when navigating immediately after (e.g. survey submit), so the
  // next page's flushQueue() sends everything reliably.
  function queueEvent(eventObj) {
    var payload = buildPayload(eventObj);
    var q = readQueue();
    q.push(payload);
    writeQueue(q);
  }

  return {
    getLearnerId: getLearnerId,
    logEvent:     logEvent,
    queueEvent:   queueEvent,
    flushQueue:   flushQueue,
  };

})();
