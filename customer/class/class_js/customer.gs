function doGet(e) {
  var sheetName = e.parameter.sheet;
  var sheet = SpreadsheetApp.openById('1umOfCYjkPsIyYjNTpY-d40nH-qh310eSeeeJO9mcryE').getSheetByName(sheetName);
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({ error: "シートが見つかりません" }))
                         .setMimeType(ContentService.MimeType.JSON);
  }

  const data = sheet.getDataRange().getValues();
  const records = [];

  for (let i = 2; i < data.length; i++) {
    // A列: 商品名, B列: 価格, C列: 販売状況のみを取得（D列以降は無視）
    records.push({
      商品名: data[i][0],
      価格: data[i][1],
      販売状況: data[i][2]
    });
  }

  return ContentService.createTextOutput(JSON.stringify(records))
                       .setMimeType(ContentService.MimeType.JSON);
}
