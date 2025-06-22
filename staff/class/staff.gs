function doGet(e) {
  var sheetName = e.parameter.sheet;
  var sheet = SpreadsheetApp.openById('1umOfCYjkPsIyYjNTpY-d40nH-qh310eSeeeJO9mcryE').getSheetByName(sheetName);
  var data = sheet.getDataRange().getValues();
  var result = [];
  // 商品数・完売数は2行目（index=1）の4・5列目
  result.push({
    pd: data[1][3],        // 2行目4列目（商品数）
    sold_out: data[1][4]   // 2行目5列目（完売数）
  });
  for (var i = 2; i < data.length; i++) { // 3行目から商品データ
    // 商品名・価格・販売状況がすべて空欄ならスキップ（ヘッダーや空行を除外）
    if (!data[i][0] && !data[i][1] && !data[i][2]) continue;
    result.push({
      pdname: String(data[i][0]),
      price: String(data[i][1]),
      sales: String(data[i][2])
    });
  }
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*");
}

function doPost(e) {
  var sheetName = e.parameter.sheet;
  var pdname = e.parameter.pdname;
  var newStatus = e.parameter.status;
  var sheet = SpreadsheetApp.openById('1umOfCYjkPsIyYjNTpY-d40nH-qh310eSeeeJO9mcryE').getSheetByName(sheetName);
  var data = sheet.getDataRange().getValues();
  for (var i = 2; i < data.length; i++) { // 3行目から商品データ
    if (String(data[i][0]).trim() == pdname) {
      sheet.getRange(i + 1, 3).setValue(newStatus); // 3列目が販売状況
      return ContentService.createTextOutput('OK')
        .setMimeType(ContentService.MimeType.TEXT)
        .setHeader("Access-Control-Allow-Origin", "*");
    }
  }
  return ContentService.createTextOutput('NG')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeader("Access-Control-Allow-Origin", "*");
}