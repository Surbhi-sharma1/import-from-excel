import {service} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {ColumnContext} from '../models/column-context.model';
import {ExcelCsvHelperService} from '../services/excel-csv-helper.service';
import {IColumn} from '../types/import-excel-config.interface';
import {ColumnTypes} from '../types/shared.type';

const A_CHAR_CODE = 65;
const COLUMN_NAME_CHARACTER_LIMIT = 10;
export class ColumnAdapterService {
  constructor(
    @service(ExcelCsvHelperService)
    private readonly excelCsvHelperService: ExcelCsvHelperService,
  ) {}

  async adaptToEntity(ctx: ColumnContext): Promise<IColumn[]> {
    const columns: IColumn[] = [];
    if (!ctx.issueFilter.fileKey) {
      throw new HttpErrors.UnprocessableEntity('FileKey can not be empty!');
    }
    const excelCols = await this.excelCsvHelperService.getColumns(
      ctx.issueFilter.fileKey,
      ctx.issueFilter,
    );
    excelCols?.forEach((column, idx) => {
      const columnTitle = String.fromCharCode(A_CHAR_CODE + idx);
      if (ctx.columnMeta[columnTitle]?.type !== ColumnTypes.task) {
        columns.push({
          name: column?.value?.length ? column.value.substring(0) : 'Column',
          columnType: ctx?.columnMeta[columnTitle]?.type ?? ColumnTypes.text,
          metaData: {
            imported: {
              sourceId: `COL-${columnTitle}-${idx}`,
              columnType: ctx.columnMeta[columnTitle]?.type ?? ColumnTypes.text,
            },
          },
        });
      }
    });
    columns.forEach((col, idx) => {
      col.sequenceNumber = idx + 1;
    });
    return columns;
  }
}
