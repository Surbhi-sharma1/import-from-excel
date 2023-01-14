import {BindingKey} from '@loopback/context';
import {ColumnAdapterService} from './column-adapter.service';
import {GroupAdapterService} from './group-adapter.service';
import {TaskAdapterService} from './task-adapter.service';

export const ImportAdapterKeyPrefix = 'adapters.import.excel';

export namespace AdapterBindings {
  export const GroupAdapter = BindingKey.create<GroupAdapterService>(
    `${ImportAdapterKeyPrefix}.group`,
  );
  export const ColumnAdapter = BindingKey.create<ColumnAdapterService>(
    `${ImportAdapterKeyPrefix}.column`,
  );
  export const TaskAdapter = BindingKey.create<TaskAdapterService>(
    `${ImportAdapterKeyPrefix}.task`,
  );
}
