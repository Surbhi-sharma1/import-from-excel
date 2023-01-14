import {
  AnyObject,
  belongsTo,
  hasMany,
  model,
  property,
} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';
import {NAME_REGEX} from '../enums';

import {Group, GroupWithRelations} from './group.model';
import {
  TaskColumnValue,
  TaskColumnValueWithRelations,
} from './task-column-value.model';

@model({
  name: 'tasks',
})
export class Task extends UserModifiableEntity {
  @property({
    type: 'string',
    id: true,
    generated: false,
  })
  id?: string;

  @property({
    type: 'string',
    jsonSchema: {
      maxLength: 300,
      minLength: 1,
      pattern: NAME_REGEX,
      errorMessage: {
        maxLength: 'Name cannot be greater than 300',
        minLength: 'Name cannot be blank',
        pattern: 'Invalid Name entered!',
      },
    },
  })
  name?: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'boolean',
    default: false,
  })
  archived: boolean;

  @property({
    name: 'sequence_number',
    type: 'number',
    default: 0,
  })
  sequenceNumber?: number;

  @belongsTo(
    () => Task,
    {name: 'task'},
    {
      name: 'parent_task_id',
      required: false,
    },
  )
  parentTaskId?: string;

  @hasMany(() => TaskColumnValue, {keyTo: 'taskId'})
  taskColumnValues: TaskColumnValue[];

  @belongsTo(
    () => Group,
    {name: 'group'},
    {
      name: 'group_id',
      required: true,
    },
  )
  groupId: string;
  @property({
    name: 'meta_data',
    type: 'object',
    default: false,
  })
  metaData?: AnyObject;

  @property({
    name: 'message_count',
    default: 0,
  })
  messageCount?: number;

  @property({
    name: 'message_file_count',
    default: 0,
  })
  messageFileCount?: number;

  @property({
    name: 'serial_number',
    required: false,
    default: null,
  })
  serialNumber?: number;

  @property({
    name: 'serial_prefix',
    required: false,
    default: null,
  })
  serialPrefix?: string;

  @property({
    name: 'previous_task_id',
    required: false,
    default: null,
  })
  previousTaskId?: string;

  @property({
    name: 'next_task_id',
    required: false,
    default: null,
  })
  nextTaskId?: string;

  constructor(data?: Partial<Task>) {
    super(data);
  }
}

export interface TaskRelations {
  group: GroupWithRelations;
  task: TaskWithRelations;
  taskColumnValues: TaskColumnValueWithRelations[];
}

export type TaskWithRelations = Task & TaskRelations;
