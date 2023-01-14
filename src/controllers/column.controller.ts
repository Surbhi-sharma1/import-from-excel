import {inject} from '@loopback/context';
import {getModelSchemaRef, post, requestBody} from '@loopback/rest';
import {
  CONTENT_TYPE,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
} from '@sourceloop/core';
//import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {ColumnAdapterService} from '../adapter/column-adapter.service';
import {AdapterBindings} from '../adapter/keys';
import {Test} from '../models';
import {BaseConfig} from '../models/base-config.model';
import {ColumnContext} from '../models/column-context.model';
import {IColumn} from '../types/import-excel-config.interface';

const basePath = '/adapt/columns';
export class ColumnController {
  constructor(
    @inject(AdapterBindings.ColumnAdapter)
    private readonly columnAdapter: ColumnAdapterService,
  ) {}

  // @authenticate(STRATEGY.BEARER, {
  //   passReqToCallback: true,
  // })
  // @authorize({permissions: ['*']})
  @post(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Columns model instance',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'array',
              minItems: 1,
              items: {type: 'object', schema: getModelSchemaRef(Test)},
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
          schema: getModelSchemaRef(BaseConfig, {
            title: 'BaseConfig',
          }),
        },
      },
    })
    config: BaseConfig,
  ): Promise<IColumn[]> {
    console.log(config);
    const ctx = new ColumnContext({
      issueFilter: config.issueFilter,
      columnMeta: config.columnMeta,
    });
    return this.columnAdapter.adaptToEntity(ctx);
  }
}
