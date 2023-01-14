import {
  model,
  property,
  belongsTo,
  hasMany,
  AnyObject,
} from '@loopback/repository';

import {UserModifiableEntity} from '@sourceloop/core';

@model({
  name: 'columns',
})
export class Column extends UserModifiableEntity {
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
      // pattern: NAME_REGEX,
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
      // pattern: DESCRIPTION_REGEX,
      maxLength: 500,
      errorMessage: {
        maxLength: 'Description cannot be greater than 500',
        pattern: 'Invalid Description entered!',
      },
    },
  })
  description?: string;

  // @property({
  //   type: 'number',
  //   default: 0,
  //   required: true,
  //   // jsonSchema: {
  //   //   enum: [TaskType.Task, TaskType.Subtask],
  //   // },
  // })
  // level: TaskType;

  @property({
    name: 'meta_data',
    type: 'object',
    required: true,
  })
  metaData: AnyObject;

  @property({
    name: 'sequence_number',
    type: 'number',
    default: 0,
  })
  sequenceNumber?: number;

  @property({
    name: 'column_type',
    type: 'string',
    required: true,
  })
  columnType: string;

  @property({
    type: 'object',
  })
  format?: Format;

  constructor(data?: Partial<Column>) {
    super(data);
  }
}

export type ColumnWithRelations = Column;

export interface Format {
  bold: Emphasis;
  italic: Emphasis;
  underlined: Emphasis;
  fgColor: Color;
  bgColor: Color;
}

export interface Emphasis {
  value: boolean;
  modified: Date;
}

export interface Color {
  value: string;
  modified: Date;
}
