import {bind, BindingScope} from '@loopback/context';
import {AnyObject} from '@loopback/repository';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import {IParser} from '../types/parser.interface';

@bind({scope: BindingScope.SINGLETON})
export class ExcelParseService implements IParser {
  parse(buffer: Buffer): AnyObject {
    const wb = XLSX.read(buffer, {type: 'buffer', cellStyles: true});
    const wsname = wb.SheetNames[0];
    const ws = wb.Sheets[wsname];
    const rows = ws['!rows'] ?? [];
    const groupLevel: number[] = [];
    const csvData = XLSX.utils.sheet_to_csv(ws);
    /* Parsing the csv data. */
    const csvRecords = Papa.parse(csvData, {
      header: false,
      skipEmptyLines: true,
      delimiter: '\n',
    });

    for (const rowData of rows) {
      if (rowData?.level) {
        groupLevel.push(rowData.level);
      } else {
        groupLevel.push(0);
      }
    }

    return {
      csvRecords: csvRecords,
      groupLevel: groupLevel,
    };
  }
}
