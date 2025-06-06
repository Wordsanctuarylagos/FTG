function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("FTG_Data");
  const data = sheet.getDataRange().getValues();
  const tz = Session.getScriptTimeZone();
  const today = Utilities.formatDate(new Date(), tz, "MM/dd/yyyy");

  const names = [];

  for (let i = 1; i < data.length; i++) {
    const rawTimestamp = data[i][0];
    const name = data[i][1];

    const formattedDate = Utilities.formatDate(new Date(rawTimestamp), tz, "MM/dd/yyyy");

    if (formattedDate === today && name) {
      names.push(name);
    }
  }

  return ContentService
    .createTextOutput(JSON.stringify(names))
    .setMimeType(ContentService.MimeType.JSON);
}
