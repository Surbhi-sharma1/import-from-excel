import {BindingScope, injectable} from '@loopback/core';
const XLSX = require('xlsx');

@injectable({scope: BindingScope.TRANSIENT})
export class ExcelService {
  constructor(/* Add @inject to inject parameters */) {}

  async getData(types: Record<string, string>) {
    // for now reading file from here
    const file = XLSX.readFile(__dirname + '/../../testSubtaskOneSheet.xlsx', {
      cellStyles: true,
    });

    const sheets = Object.values(file.Sheets);
    const batches: {rows: any[]; types: Record<string, string>}[][] = [];

    sheets.forEach((sheet: any) => {
      const rowOutlineLevel: number[] = [];

      //find max outline level
      let maxOutlineLevel = 0;
      sheet['!rows'].forEach((row: any, index: number) => {
        rowOutlineLevel[index] = row.level;
        if (row.level > maxOutlineLevel) {
          maxOutlineLevel = row.level;
        }
      });

      const sheetData = XLSX.utils.sheet_to_json(sheet);

      let currentOutlineLevel = 0;
      const batchSize = 10; //number of records/rows in each batch MAKE CONFIGURABLE
      //make batches according to levels
      while (currentOutlineLevel <= maxOutlineLevel) {
        batches[currentOutlineLevel] = [];
        const currentLevelRowData = sheetData.filter(
          (rowData: any, index: number) => {
            //assuming first row to be header row
            if (rowOutlineLevel[index + 1] === currentOutlineLevel) {
              return rowData;
            }
          },
        );
        //make batches
        for (let i = 0; i < currentLevelRowData.length; i += batchSize) {
          const batch = currentLevelRowData.slice(i, i + batchSize);
          batches[currentOutlineLevel].push({rows: batch, types});
        }
        currentOutlineLevel++;
      }
    });
    return batches;
  }
}
