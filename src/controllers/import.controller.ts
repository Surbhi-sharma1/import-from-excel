import {inject} from '@loopback/core';
import {post} from '@loopback/rest';
import {ExcelService} from '../services';
import {MessageData} from '../types';

export class ImportController {
  constructor(
    @inject('services.ExcelService') private excelService: ExcelService,
    @inject('importService.sendMessage.provider')
    private sendMessageFn: (
      data: MessageData[],
      level: number,
    ) => Promise<void>,
    @inject('importService.receiveMessageListener.provider')
    private receiveMessageListenerFn: () => void, // @inject('importService.receiveMessageListener.provider') // private receiveMessageListenerFn: () => void,
  ) {}

  @post('/import')
  async importFromExcel() {
    let LevelWiseBatches = await this.excelService.getData({});

    for (let i = 0; i < LevelWiseBatches.length; i++) {
      this.sendMessageFn(LevelWiseBatches[i], i);
    }

    this.receiveMessageListenerFn();
  }
}
