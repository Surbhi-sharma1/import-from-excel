import {AnyObject} from '@loopback/repository';

export interface IParser {
  parse(buffer: Buffer, selectedSheetName?: string): AnyObject;
}
