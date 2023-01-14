import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, BindingScope} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import {AWSS3Bindings, AwsS3Component, AwsS3Config} from 'loopback4-s3';
import path from 'path';
import {ColumnAdapterService} from './adapter/column-adapter.service';
import {GroupAdapterService} from './adapter/group-adapter.service';
import {AdapterBindings} from './adapter/keys';
import {TaskAdapterService} from './adapter/task-adapter.service';
import {ImportServiceComponent} from './component';
import {MySequence} from './sequence';
export {ApplicationConfig};

export class ExcelApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);
    console.log('inspect');
    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.component(ImportServiceComponent);
    this.bind(AdapterBindings.ColumnAdapter)
      .toClass(ColumnAdapterService)
      .inScope(BindingScope.REQUEST);
    this.bind(AdapterBindings.GroupAdapter)
      .toClass(GroupAdapterService)
      .inScope(BindingScope.REQUEST);
    this.bind(AdapterBindings.TaskAdapter)
      .toClass(TaskAdapterService)
      .inScope(BindingScope.REQUEST);
    this.bind(AWSS3Bindings.Config).to({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    } as AwsS3Config);
    this.component(AwsS3Component);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
