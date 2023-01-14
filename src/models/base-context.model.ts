import {model, property, Model} from '@loopback/repository';
import {ColumnMetaContext, IssueFilter} from '../types/shared.type';

@model()
export class BaseContext extends Model {
  @property({
    type: 'object',
  })
  columnMeta: ColumnMetaContext;

  @property({
    type: 'object',
  })
  issueFilter: IssueFilter;

  constructor(data?: Partial<BaseContext>) {
    super(data);
  }
}
