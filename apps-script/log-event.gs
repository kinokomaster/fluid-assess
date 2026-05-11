// FluidAssess — event logger
// Deploy as: Web App → Execute as: Me → Who has access: Anyone
// Sheet columns (auto-created on first run):
//   learner_id | event_type | module_id | question_id | answer |
//   is_correct | score | attempt_number | timestamp | user_agent

var SHEET_NAME = 'Events';

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = getOrCreateSheet();
    sheet.appendRow([
      data.learner_id     || '',
      data.event_type     || '',
      data.module_id      || '',
      data.question_id    || '',
      data.answer         || '',
      data.is_correct     !== undefined ? data.is_correct : '',
      data.score          !== undefined ? data.score      : '',
      data.attempt_number || '',
      data.timestamp      || new Date().toISOString(),
      (data.user_agent    || '').slice(0, 200),
    ]);
  } catch (err) {
    // Swallow errors — learner should never see a failure
    Logger.log('Error: ' + err.message);
  }

  // Return 200 with CORS headers (no-cors fetch ignores these, but useful for curl testing)
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Creates the sheet with a header row if it doesn't exist yet
function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      'learner_id', 'event_type', 'module_id', 'question_id', 'answer',
      'is_correct', 'score', 'attempt_number', 'timestamp', 'user_agent',
    ]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// Run this manually in the script editor to verify a row is written correctly
function testDoPost() {
  var fakeEvent = {
    postData: {
      contents: JSON.stringify({
        learner_id:     'LRN-TEST01',
        event_type:     'quiz_answer',
        module_id:      'module_1',
        question_id:    'm1_q1',
        answer:         'Fluid responsiveness and fluid tolerance',
        is_correct:     true,
        score:          null,
        attempt_number: 1,
        timestamp:      new Date().toISOString(),
        user_agent:     'Manual test run',
      }),
    },
  };
  doPost(fakeEvent);
  Logger.log('Test row written to sheet: ' + SHEET_NAME);
}
