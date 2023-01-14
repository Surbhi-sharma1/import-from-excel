import {service} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import moment from 'moment';
import {TaskContext} from '../models/task-context.model';
import {ExcelCsvHelperService} from '../services/excel-csv-helper.service';
import {ITask, ITaskColumnValue} from '../types/import-excel-config.interface';
import {ColumnTypeContext, ColumnTypes, ExcelRow} from '../types/shared.type';

const A_CHAR_CODE = 65;
const TASK_NAME_CHARACTER_LIMIT = 10;
export class TaskAdapterService {
  constructor(
    @service(ExcelCsvHelperService)
    private readonly excelHelperService: ExcelCsvHelperService,
  ) {}

  async adaptToEntity(ctx: TaskContext): Promise<ITask[]> {
    const tasks: ITask[] = [];
    if (
      !ctx.issueFilter.fileKey ||
      ctx.issueFilter.nameColumnIndex === undefined
    ) {
      throw new HttpErrors.UnprocessableEntity(
        `Missing either fileKey or nameColumnIndex`,
      );
    }
    /* Getting the name column index from the context object. */
    const nameColumnIndex = ctx.issueFilter.nameColumnIndex;
    const excelRows = await this.excelHelperService.getRows(
      ctx.issueFilter.fileKey,
      ctx.issueFilter,
    );

    excelRows?.forEach((cells, index) => {
      const itemCell = cells[nameColumnIndex];
      /* Checking if all the cells are empty. */
      const isEmptyCell = cells.every(cell => !cell?.value);
      if (itemCell && !isEmptyCell) {
        tasks.push({
          name: itemCell?.value?.length
            ? itemCell.value.substring(0, TASK_NAME_CHARACTER_LIMIT)
            : 'Item',
          taskColumnValues: this.adaptToTaskColumnValue(
            cells,
            nameColumnIndex,
            ctx,
          ),
          groupId: ctx?.groupId,
          metaData: {
            imported: {
              sourceId: `${itemCell?.rowNumber}`,
              rowNumber: `${itemCell?.rowNumber}`,
            },
          },
          sequenceNumber: itemCell.rowNumber,
        });
      }
    });
    return tasks;
  }
  private adaptToTaskColumnValue(
    cells: ExcelRow,
    nameColumnIndex: number,
    ctx: TaskContext,
  ): ITaskColumnValue[] {
    const taskColumnValues: ITaskColumnValue[] = [];
    cells?.forEach((cell, idx) => {
      if (nameColumnIndex !== idx) {
        const tempColumnId = String.fromCharCode(A_CHAR_CODE + idx);
        const columnMeta = ctx.columnMeta[tempColumnId];
        taskColumnValues.push({
          columnId: `COL-${tempColumnId}-${idx}`,
          value: {
            value: this.sanitizeValue(columnMeta, cell.value),
          },
        });
      }
    });
    return taskColumnValues;
  }

  private sanitizeValue(columnMeta: ColumnTypeContext, value: string | number) {
    /* Checking if the column type is date and if it has a format. If it does, it will format the date
    using moment. */
    if (columnMeta?.type === ColumnTypes.date && columnMeta.format) {
      return moment(value).format(columnMeta.format);
    } else if (columnMeta?.type === ColumnTypes.percentage) {
      return typeof value === 'string'
        ? parseFloat(value.replace('%', ''))
        : value;
    } else {
      return value;
    }
  }
}
