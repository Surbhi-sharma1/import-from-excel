import {BindingKey} from '@loopback/core';
import {MessageData} from './types';

export namespace ImportServiceBindings {
  export const SendMessageProvider = BindingKey.create<
    (data: MessageData[]) => Promise<void>
  >(`importService.sendMessage.provider`);
  export const ReceiveMessageListenerProvider = BindingKey.create<() => void>(
    `importService.receiveMessageListener.provider`,
  );
}
