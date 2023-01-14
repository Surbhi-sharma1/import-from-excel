import {AnyObject} from '@loopback/repository';
import {Column} from '../models/column.model';
import {Group} from '../models/group.model';
import {TaskColumnValue} from '../models/task-column-value.model';
import {Task} from '../models/task.model';

export interface ImportExcelConfig {
  columnMeta: AnyObject;
  issueFilter: ImportExcelIssueFilter;
  smartsheetId: string;
}

export interface ImportExcelColumnMeta {
  sourceId: string;
  columnType: string;
}

export interface ImportExcelIssueFilter {
  page?: number;
  pageSize?: number;
  fileKey?: string;
  headerRowIndex?: number;
  nameColumnIndex?: number;
  fileType?: string;
  selectedSheetName?: string;
}
export interface IImport {
  getColumns(config: unknown, token?: string): Promise<Column[]>;
}
export type IColumn = Partial<Column>;
export type ITaskColumnValue = Partial<TaskColumnValue>;

export type ITask = Partial<Omit<Task, 'taskColumnValues'>> & {
  taskColumnValues: ITaskColumnValue[];
};

export type IGroup = Partial<Omit<Group, 'tasks'>> & {tasks: ITask[]};
