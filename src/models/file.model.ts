import {model, property} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';

@model({
  name: 'message_files',
})
export class MessageFile extends UserModifiableEntity {
  @property({
    type: 'string',
  })
  id?: string;

  @property({
    type: 'string',
  })
  fileKey?: string;

  @property({
    type: 'string',
  })
  messageId?: string;

  @property({
    type: 'object',
  })
  metaData?: object;

  constructor(data?: Partial<MessageFile>) {
    super(data);
  }
}
