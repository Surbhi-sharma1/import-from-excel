import {BindingKey} from '@loopback/core';
import {IUploader, MessageData} from './types';

export namespace ImportServiceBindings {
  export const SendMessageProvider = BindingKey.create<
    (data: MessageData[]) => Promise<void>
  >(`importService.sendMessage.provider`);
  export const ReceiveMessageListenerProvider = BindingKey.create<() => void>(
    `importService.receiveMessageListener.provider`,
  );
}
export namespace FileUploadBindings {
  export const SafeMulterS3Provider = BindingKey.create<IUploader>(
    'sf.safe-multer-s3',
  );
}
