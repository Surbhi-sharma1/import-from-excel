import {BindingScope, injectable} from '@loopback/core';
const XLSX = require('xlsx');

// MAKE CONFIGURABLE
export const batchSize = 30; //number of records/rows in each batch MAKE CONFIGURABLE

@injectable({scope: BindingScope.TRANSIENT})
export class ExcelService {
  constructor(/* Add @inject to inject parameters */) {}

  async getData(types: Record<string, string>) {
    console.time('parsing');
    const file = XLSX.readFile(__dirname + '/../../test_50.xlsx', {
      cellStyles: true,
    });

    const sheets = Object.values(file.Sheets);
    const batches: {rows: any[]; types: Record<string, string>}[][] = [];

    sheets.forEach((sheet: any) => {
      const rowOutlineLevel: number[] = [];

      //find max outline level
      let maxOutlineLevel = 0;
      sheet['!rows']?.forEach((row: any, index: number) => {
        rowOutlineLevel[index] = row.level;
        if (row.level > maxOutlineLevel) {
          maxOutlineLevel = row.level;
        }
      });

      console.log('max outline level ', maxOutlineLevel);
      const sheetData = XLSX.utils.sheet_to_json(sheet, {
        raw: false,
      });
      let currentOutlineLevel = 0;
      //make batches according to levels
      while (currentOutlineLevel <= maxOutlineLevel) {
        batches[currentOutlineLevel] = batches[currentOutlineLevel] ?? [];
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
    console.timeLog('parsing');

    console.log('parsing complete');
    return batches;
  }
}
