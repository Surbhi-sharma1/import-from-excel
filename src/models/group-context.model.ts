import {model} from '@loopback/repository';
import {BaseContext} from './base-context.model';

@model()
export class GroupContext extends BaseContext {
  constructor(data?: Partial<GroupContext>) {
    super(data);
  }
}
