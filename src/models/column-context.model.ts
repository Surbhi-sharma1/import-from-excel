import {model} from '@loopback/repository';
import {BaseContext} from './base-context.model';

@model()
export class ColumnContext extends BaseContext {
  constructor(data?: Partial<ColumnContext>) {
    super(data);
  }
}
