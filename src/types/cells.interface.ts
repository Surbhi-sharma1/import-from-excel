import {AnyObject} from '@loopback/repository';

export interface CellData {
  value: string;
  displayValue?: string;
  metaData?: AnyObject;
  [key: string]: unknown;
}
export interface Cells {
  [key: string]: CellData;
}
