import {model, property} from '@loopback/repository';
import {IssueFilter} from '../types/shared.type';
import {BaseConfig} from './base-config.model';

/* The `GroupConfig` class is a model that extends the `BaseConfig` class. It has a property called
`issueFilter` that is an object */
@model()
export class GroupConfig extends BaseConfig {
  @property({
    type: 'object',
  })
  issueFilter: IssueFilter;

  constructor(data?: Partial<GroupConfig>) {
    super(data);
  }
}
