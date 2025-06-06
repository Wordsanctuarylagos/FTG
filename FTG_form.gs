function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("FTG_Data");

  if (!e || !e.parameter || Object.keys(e.parameter).length === 0) {
    return ContentService.createTextOutput("No data received.");
  }

  const data = e.parameter;
  Logger.log("Received data: " + JSON.stringify(data));

  sheet.appendRow([
    new Date(),                     // TIMESTAMP
    data.NAME || "",               // NAME
    data.EMAIL || "",              // EMAIL
    data.PHONE || "",              // PHONE
    data.WHATSAPP || "",           // WHATSAPP
    data.PROFESSION || "",         // PROFESSION
    data.DOB || "",                // DOB
    data.INVITED || "",            // INVITED
    data["MARITAL STATUS"] || "",  // MARITAL STATUS
    data.ADDRESS || "",            // ADDRESS
    data.BLESSED || "",            // BLESSED
    data.GENDER || "",             // GENDER (new field)
    "", "", "", "", "", "", ""     // Office form fields
  ]);

  return ContentService.createTextOutput("FTG Data Added");
}


