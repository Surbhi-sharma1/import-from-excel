import {
  model,
  property,
  belongsTo,
  hasMany,
  AnyObject,
} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';
import {DESCRIPTION_REGEX, NAME_REGEX} from '../enums';

import {Column, ColumnWithRelations} from './column.model';
import {Task, TaskWithRelations} from './task.model';

@model({
  name: 'groups',
})
export class Group extends UserModifiableEntity {
  @property({
    type: 'string',
    id: true,
    generated: false,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
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
  name: string;

  @property({
    type: 'string',
    jsonSchema: {
      maxLength: 500,
      pattern: DESCRIPTION_REGEX,
      errorMessage: {
        maxLength: 'Description cannot be greater than 500',
        pattern: 'Invalid Description entered!',
      },
    },
  })
  description?: string;

  @property({
    type: 'boolean',
    default: false,
  })
  archived?: boolean;

  @property({
    type: 'string',
    required: true,
  })
  color: string;

  @property({
    name: 'sequence_number',
    type: 'number',
    default: 0,
  })
  sequenceNumber?: number;

  @property({
    name: 'meta_data',
    type: 'object',
  })
  metaData?: AnyObject;

  // @belongsTo(
  //   () => Board,
  //   {
  //     name: 'board',
  //   },
  //   {
  //     name: 'board_id',
  //     required: true,
  //   },
  // )
  // boardId: string;

  @property({
    name: 'workspace_group_id',
    required: false,
  })
  workspaceGroupId?: string;

  @hasMany(() => Task, {keyTo: 'groupId'})
  tasks: Task[];

  @hasMany(() => Column, {keyTo: 'groupId'})
  columns: Column[];

  constructor(data?: Partial<Group>) {
    super(data);
  }
}

export interface GroupRelations {
  tasks: TaskWithRelations[];
  columns: ColumnWithRelations[];
}

export type GroupWithRelations = Group & GroupRelations;
