import {model, property} from '@loopback/repository';
import {BaseContext} from './base-context.model';

@model()
export class TaskContext extends BaseContext {
  @property({
    type: 'string',
  })
  groupId: string;

  constructor(data?: Partial<TaskContext>) {
    super(data);
  }
}
