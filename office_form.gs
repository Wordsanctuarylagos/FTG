function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("FTG_Data");
  const data = e.parameter;
  const nameToUpdate = data.FTG_NAME ? data.FTG_NAME.trim().toLowerCase() : "";

  if (!nameToUpdate) {
    return ContentService.createTextOutput("No name provided").setMimeType(ContentService.MimeType.TEXT);
  }

  const range = sheet.getRange(2, 2, sheet.getLastRow() - 1, 1).getValues(); // NAME column
  for (let i = 0; i < range.length; i++) {
    const rowName = range[i][0].toString().trim().toLowerCase();
    if (rowName === nameToUpdate) {
      const row = i + 2;
      sheet.getRange(row, 13).setValue(data.MINISTER || "");
      sheet.getRange(row, 14).setValue(data.LC_TEACHER || "");
      sheet.getRange(row, 15).setValue(data.HOD || "");
      sheet.getRange(row, 16).setValue(data["JOIN/NOT"] || "");
      sheet.getRange(row, 17).setValue(data.DEPARTMENT || "");
      sheet.getRange(row, 18).setValue(data.SERVICE_DAY || ""); // <-- New field
      sheet.getRange(row, 19).setValue(data.COMMENT || "");
      return ContentService.createTextOutput("Office data updated");
    }
  }

  return ContentService.createTextOutput("Name not found").setMimeType(ContentService.MimeType.TEXT);
}
