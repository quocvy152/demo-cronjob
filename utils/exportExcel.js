// Require library
var xl = require('excel4node');

exports.EXPORT_EXCEL_TIME = (sheet, time) => {
    let value = `${time.getHours()} - ${time.getMinutes()}`;

    // Create a new instance of a Workbook class
    var wb = new xl.Workbook();

    // Create a reusable style
    var style = wb.createStyle({
        font: {
            color: '#FF0800',
            size: 12,
        },
        numberFormat: '$#,##0.00; ($#,##0.00); -',
    });

    // Add Worksheets to the workbook
    var ws = wb.addWorksheet(sheet);

    // Set value of cell A1 to 100 as a number type styled with paramaters of style
    for(let row = 1; row <= 60; row++) {
        ws.cell(row, 1).string(value + ` - ${row}`).style(style);
    }

    wb.write(`excel_time_${value}.xlsx`);
}