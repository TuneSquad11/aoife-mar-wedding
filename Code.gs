/**
 * Aoife & Mar wedding RSVP backend.
 *
 * Deploy this as a Web App (Deploy > New deployment > Web app) bound to a
 * Google Sheet. See SETUP.md for the click-by-click instructions.
 *
 * Sheet header row (row 1) must be exactly:
 * Timestamp | Name | Email | Attending | Guests | Transport | Dietary Requirements
 */

var SHEET_NAME = "RSVPs";

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var data = JSON.parse(e.postData.contents);

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    }

    sheet.appendRow([
      new Date(),
      data.name || "",
      data.email || "",
      data.attending || "",
      data.guests || "",
      data.transport || "",
      data.diet || "",
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

// Lets you sanity-check the deployment URL directly in a browser tab.
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ result: "RSVP endpoint is live" }))
    .setMimeType(ContentService.MimeType.JSON);
}
