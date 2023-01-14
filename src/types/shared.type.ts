// Keep the column types list sorted

export enum ColumnTypes {
  task = 'Task',
  checkbox = 'checkbox',
  currency = 'currency',
  date = 'date',
  datetime = 'datetime',
  dependency = 'dependency',
  dropdown = 'dropdown',
  duration = 'duration',
  formula = 'formula',
  lastUpdated = 'lastUpdated',
  number = 'number',
  people = 'people',
  percentage = 'percentage',
  priority = 'priority',
  status = 'status',
  tag = 'tag',
  text = 'text',
  timeline = 'timeline',
  variance = 'variance',
  hyperlink = 'hyperlink',
  resource = 'resource',
  effort = 'effort',
  wbs = 'wbs',
  creationLog = 'creationLog',
}
export interface ColumnTypeContext {
  type: ColumnTypes;
  format?: string;
}

/* A map of string to ColumnTypeContext. */
export interface ColumnMetaContext {
  [key: string]: ColumnTypeContext;
}
export interface IssueFilter {
  fileKey?: string;
  headerRowIndex?: number;
  nameColumnIndex?: number;
  fileType?: FileType;
  page?: number;
  pageSize?: number;
  selectedSheetName?: string;
}

export enum FileType {
  EXCEL = 'excel',
  CSV = 'csv',
}

export type ExcelColumn = {
  value: string;
};

export type ExcelCell = {
  value: string;
  rowNumber: number;
  groupLevel: number;
};

export type ExcelRow = ExcelCell[];
