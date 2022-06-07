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
import {ImportServiceBindings} from './keys';
import {ReceiveMessageListenerObserver} from './observers';
import {SendMessageProvider} from './providers';
import {ReceiveMessageListenerProvider} from './providers/receive-message-listener.provider';
import {MySequence} from './sequence';
import {ExcelService} from './services';

export class ImportServiceComponent implements Component {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private readonly application: RestApplication,
  ) {
    this.bindings = [];
    this.providers = {};
    this.setupSequence();

    this.application.bind('services.ExcelService').toClass(ExcelService);

    this.controllers = [ImportController];
    this.providers[ImportServiceBindings.SendMessageProvider.key] =
      SendMessageProvider;
    this.providers[ImportServiceBindings.ReceiveMessageListenerProvider.key] =
      ReceiveMessageListenerProvider;
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
