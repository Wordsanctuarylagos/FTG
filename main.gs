/************* CONFIG *************/
const SHEET_NAME = "FTG_Data";
const OFFICE_PASSWORD = "WSLoffice"; // 🔐 change anytime

/************* ENTRY POINTS *************/
function doGet(e) {
  const action = e.parameter.action;

  if (action === "fetchNames") return fetchTodayNames();
  if (action === "fetchFTG") return fetchFTGDetails(e.parameter.name);

  return output({ error: "Invalid GET action" });
}

function doPost(e) {
  const action = e.parameter.action;

  if (action === "addFTG") return addFTG(e);
  if (action === "loginOffice") return loginOffice(e);
  if (action === "updateOffice") return updateOffice(e);

  return output({ error: "Invalid POST action" });
}

/************* ACTIONS *************/
function loginOffice(e) {
  const pass = e.parameter.password || "";
  if (pass !== OFFICE_PASSWORD) {
    return output({ success: false, message: "Incorrect password" });
  }
  return output({ success: true });
}

function addFTG(e) {
  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  const p = e.parameter;

  sheet.appendRow([
    new Date(),               // TIMESTAMP
    p.NAME || "",
    p.GENDER || "",
    p.EMAIL || "",
    p.PHONE || "",
    p.WHATSAPP || "",
    p.PROFESSION || "",
    p.DOB || "",
    p.INVITED || "",
    p["MARITAL STATUS"] || "",
    p.DEPARTMENT || "",
    p.ADDRESS || "",
    p.BLESSED || "",
    "", "", "", "", "", ""
  ]);

  const lastRow = sheet.getLastRow();
  applyRowBorders_(sheet, lastRow);

  return output({ success: true });
}

function updateOffice(e) {
  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  const p = e.parameter;
  const name = (p.FTG_NAME || "").trim().toLowerCase();

  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const nameCol = headers.indexOf("NAME");

  const rowIndex = data.findIndex(
    (r, i) => i > 0 && r[nameCol].toString().toLowerCase() === name
  );

  if (rowIndex === -1) {
    return output({ success: false, message: "Name not found" });
  }

  const row = rowIndex + 1;

  setByHeader_(sheet, headers, row, "MINISTER", p.MINISTER);
  setByHeader_(sheet, headers, row, "LC_TEACHER", p.LC_TEACHER);
  setByHeader_(sheet, headers, row, "HOD", p.HOD);
  setByHeader_(sheet, headers, row, "JOIN/NOT", p["JOIN/NOT"]);
  setByHeader_(sheet, headers, row, "SERVICE_DAY", p.SERVICE_DAY);
  setByHeader_(sheet, headers, row, "COMMENT", p.COMMENT);

  applyRowBorders_(sheet, row);

  return output({ success: true });
}

function fetchTodayNames() {
  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const tz = Session.getScriptTimeZone();
  const today = Utilities.formatDate(new Date(), tz, "MM/dd/yyyy");

  const names = [];

  for (let i = 1; i < data.length; i++) {
    const ts = data[i][0];
    const name = data[i][1];
    if (!ts || !name) continue;

    const d = Utilities.formatDate(new Date(ts), tz, "MM/dd/yyyy");
    if (d === today) names.push(name);
  }

  return output(names);
}

function fetchFTGDetails(name) {
  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  const row = data.find(
    (r, i) => i > 0 && r[headers.indexOf("NAME")] === name
  );

  if (!row) return output({});

  const result = {};
  headers.forEach((h, i) => result[h] = row[i]);

  return output(result);
}

/************* HELPERS *************/
function setByHeader_(sheet, headers, row, header, value) {
  const col = headers.indexOf(header);
  if (col !== -1) {
    sheet.getRange(row, col + 1).setValue(value || "");
  }
}

function applyRowBorders_(sheet, row) {
  sheet.getRange(row, 1, 1, sheet.getLastColumn()).setBorder(
    true, true, true, true, true, true
  );
}

function output(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
