import {
  Binding,
  Component,
  ControllerClass,
  CoreBindings,
  inject,
  ProviderMap,
} from '@loopback/core';
import {RestApplication} from '@loopback/rest';
import {ImportController} from './controllers';
import {ColumnController} from './controllers/column.controller';
//import {ColumnController} from './controllers/column.controller';
import {MessageFileController} from './controllers/file.controller';
import {GroupController} from './controllers/group.controller';
import {FileUploadBindings, ImportServiceBindings} from './keys';
import {ReceiveMessageListenerObserver} from './observers';
import {SendMessageProvider} from './providers';
import {MulterS3Provider} from './providers/multer-s3.provider';
import {ReceiveMessageListenerProvider} from './providers/receive-message-listener.provider';
import {MySequence} from './sequence';
import {ExcelService} from './services';
import {ExcelCsvHelperService} from './services/excel-csv-helper.service';
// import {ImportExcelService} from './services/import-excel-config.service';
export class ImportServiceComponent implements Component {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private readonly application: RestApplication,
  ) {
    this.bindings = [];
    this.providers = {};
    this.setupSequence();

    /* Binding the ExcelService to the application. */
    this.application.bind('services.ExcelService').toClass(ExcelService);
    this.application
      .bind('services.ExcelCsvHelperService')
      .toClass(ExcelCsvHelperService);
    // this.application
    //   .bind('services.ImportExcelService')
    //   .toClass(ImportExcelService);

    this.controllers = [
      ImportController,
      MessageFileController,
      ColumnController,
      GroupController,
    ];
    this.providers[
      ImportServiceBindings.SendMessageProvider.key
    ] = SendMessageProvider;
    this.providers[
      ImportServiceBindings.ReceiveMessageListenerProvider.key
    ] = ReceiveMessageListenerProvider;
    this.providers[
      FileUploadBindings.SafeMulterS3Provider.key
    ] = MulterS3Provider;
  }

  providers: ProviderMap = {};

  bindings: Binding[] = [];

  lifeCycleObservers = [ReceiveMessageListenerObserver];

  /**
   * An array of controller classes
   */
  controllers?: ControllerClass[];

  /**
   * Setup ServiceSequence by default if no other sequnce provided
   *
   * @param bindings Binding array
   */
  setupSequence() {
    this.application.sequence(MySequence);
  }
}
