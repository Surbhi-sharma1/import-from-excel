import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';

/**
 * This class will be bound to the application as a `LifeCycleObserver` during
 * `boot`
 */
@lifeCycleObserver('ImportService')
export class ReceiveMessageListenerObserver implements LifeCycleObserver {
  constructor(
    @inject('importService.receiveMessageListener.provider')
    private receiveMessageListenerFn: () => void, // @inject('importService.receiveMessageListener.provider') // private receiveMessageListenerFn: () => void,
  ) {}

  async start(): Promise<void> {
    // this.receiveMessageListenerFn();
  }
}
