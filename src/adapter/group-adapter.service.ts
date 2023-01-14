import {service} from '@loopback/core';
import {GroupContext} from '../models/group-context.model';
import {TaskContext} from '../models/task-context.model';
import {IGroup} from '../types/import-excel-config.interface';
import {TaskAdapterService} from './task-adapter.service';

const groupName = 'Table';

/* It takes a group context and returns a group entity */
export class GroupAdapterService {
  constructor(
    @service(TaskAdapterService)
    private readonly taskAdapter: TaskAdapterService,
  ) {}

  async adaptToEntity(ctx: GroupContext): Promise<IGroup[]> {
    const tempGroupId = `group`;
    const group: IGroup = {
      id: tempGroupId, //fixed table change
      name: groupName,
      tasks: [],
      archived: false,
      color: '#008CFF',
      sequenceNumber: 0,
      metaData: {
        imported: {
          sourceId: `excel_${ctx?.issueFilter?.fileKey}_group`,
        },
      },
    };
    const taskCtx = new TaskContext({
      groupId: tempGroupId,
      columnMeta: ctx.columnMeta,
      issueFilter: ctx.issueFilter,
    });
    group.tasks = await this.taskAdapter.adaptToEntity(taskCtx);
    return [group];
  }
}
