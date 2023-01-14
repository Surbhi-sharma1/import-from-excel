import {inject} from '@loopback/context';
import {getModelSchemaRef, post, requestBody} from '@loopback/rest';
import {
  CONTENT_TYPE,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
} from '@sourceloop/core';
//import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {GroupAdapterService} from '../adapter/group-adapter.service';
import {AdapterBindings} from '../adapter/keys';
import {GroupConfig} from '../models/group-config.model';
import {GroupContext} from '../models/group-context.model';
import {Group} from '../models/group.model';
import {IGroup} from '../types/import-excel-config.interface';

const basePath = '/adapt/groups';
export class GroupController {
  constructor(
    @inject(AdapterBindings.GroupAdapter)
    private readonly groupAdapter: GroupAdapterService,
  ) {}

  // @authenticate(STRATEGY.BEARER, {
  //   passReqToCallback: true,
  // })
  // @authorize({permissions: ['*']})
  @post(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Groups model instance',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'array',
              minItems: 1,
              items: {type: 'object', schema: getModelSchemaRef(Group)},
            },
          },
        },
      },
    },
  })
  async adapt(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(GroupConfig, {
            title: 'GroupConfig',
          }),
        },
      },
    })
    config: GroupConfig,
  ): Promise<IGroup[]> {
    const ctx = new GroupContext({
      issueFilter: config.issueFilter,
      columnMeta: config.columnMeta,
    });
    return this.groupAdapter.adaptToEntity(ctx);
  }
}
