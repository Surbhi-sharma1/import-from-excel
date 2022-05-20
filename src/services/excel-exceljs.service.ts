// import {BindingScope, injectable} from '@loopback/core';
// const ExcelJS = require('exceljs');

// @injectable({scope: BindingScope.TRANSIENT})
// export class ExcelJSService {
//   constructor(/* Add @inject to inject parameters */) {}

//   async parseExcel() {
//     const workbook = new ExcelJS.Workbook();
//     const res = await workbook.xlsx.readFile(
//       __dirname + '/../../testSubtask.xlsx',
//     );

//     //find max outline level
//     let maxOutlineLevel = 0;
//     res._worksheets[1]._rows.forEach((row: any) => {
//       if (row._outlineLevel > maxOutlineLevel) {
//         maxOutlineLevel = row._outlineLevel;
//       }
//     });

//     let currentOutlineLevel = 0;
//     const batchSize = 10; //number of records/rows in each batch
//     const headerRow = res._worksheets[1]._rows[0];
//     let headerRowValues: any[] = [];
//     headerRow._cells.forEach((cell: any) => {
//       headerRowValues.push(cell._value.value);
//     });

//     const batches: {rows: any[]; types: any[]}[] = [];

//     // filter on basis of current outline level and make batches
//     while (currentOutlineLevel <= maxOutlineLevel) {
//       const currentLevelRows = res._worksheets[1]._rows.filter((row: any) => {
//         //assuming first row contains column names
//         return row._number !== 1 && row._outlineLevel === currentOutlineLevel;
//       });

//       //make batches
//       for (let i = 0; i < currentLevelRows.length; i += batchSize) {
//         const chunk = currentLevelRows.slice(i, i + batchSize);

//         // console.log(`level ${currentOutlineLevel} `, chunk);

//         const data: {rows: any[]; types: any[]} = {
//           rows: [],
//           types: [],
//         };
//         chunk.forEach((row: any) => {
//           let rowData: any = {};
//           row._cells.forEach((cell: any) => {
//             rowData[headerRowValues[cell._column._number - 1]] =
//               cell._value.value;
//           });
//           data.rows.push(rowData);
//         });
//         // console.log(`level ${currentOutlineLevel} `, data);
//         batches.push(data);
//         // this.sendMessage(data);
//       }

//       currentOutlineLevel++;
//     }
//     return batches;
//   }
// }
