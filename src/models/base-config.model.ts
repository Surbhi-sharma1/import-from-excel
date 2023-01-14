import {model, Model, property} from '@loopback/repository';
import {ColumnMetaContext, IssueFilter} from '../types/shared.type';

@model({settings: {strict: false}})
export class BaseConfig extends Model {
  @property({
    type: 'object',
    required: true,
  })
  columnMeta: ColumnMetaContext = {};
  @property({
    type: 'object',
  })
  issueFilter: IssueFilter;

  constructor(data?: Partial<BaseConfig>) {
    super(data);
  }
}
