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
  ) {}

  @post('/import')
  async importFromExcel() {
    let LevelWiseBatches = await this.excelService.getData({});

    LevelWiseBatches.forEach((data, index) => {
      this.sendMessageFn(data, index + 1);
    });
  }
}
