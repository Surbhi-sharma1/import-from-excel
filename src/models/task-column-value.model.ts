import {belongsTo, model, property} from '@loopback/repository';

import {UserModifiableEntity} from '@sourceloop/core';
import {Column, ColumnWithRelations} from './column.model';
import {Task, TaskWithRelations} from './task.model';

@model({
  name: 'task_column_values',
})
export class TaskColumnValue extends UserModifiableEntity {
  @property({
    type: 'string',
    id: true,
    generated: false,
  })
  id?: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'object',
    required: true,
  })
  value: object;

  @belongsTo(
    () => Task,
    {name: 'task'},
    {
      name: 'task_id',
      required: true,
    },
  )
  taskId: string;

  @property({
    type: 'number',
    name: 'kanban_sequence_number',
    default: 0,
  })
  kanbanSequenceNumber?: number;

  @belongsTo(
    () => Column,
    {name: 'column'},
    {
      name: 'colum_id',
      required: true,
    },
  )
  columnId: string;

  constructor(data?: Partial<TaskColumnValue>) {
    super(data);
  }
}

export interface TaskColumnValueRelations {
  task: TaskWithRelations;
  boardColumn: ColumnWithRelations;
}

export type TaskColumnValueWithRelations = TaskColumnValue &
  TaskColumnValueRelations;
