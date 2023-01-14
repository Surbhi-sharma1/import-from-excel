import {Context, inject, service} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {GetObjectOutput} from 'aws-sdk/clients/s3';
import {chunk} from 'lodash';
import {IParser} from '../types/parser.interface';
import {
  ExcelColumn,
  ExcelRow,
  FileType,
  IssueFilter,
} from '../types/shared.type';
import {ExcelParseService} from './excel-parser.service';
import {MessageFileHelperService} from './file-helper.service';

export class ExcelCsvHelperService {
  constructor(
    @service(MessageFileHelperService)
    private readonly messageFileHelperService: MessageFileHelperService,
    @service(ExcelParseService)
    private readonly excelParserService: ExcelParseService,
    @inject.context()
    private readonly ctx: Context,
  ) {}
  async getColumns(
    fileKey: string,
    options: IssueFilter,
  ): Promise<ExcelColumn[]> {
    /* A type declaration. */
    let fileResponse: GetObjectOutput;
    if (process.env.NODE_ENV === 'test') {
      fileResponse = await this.messageFileHelperService.readFile();
    } else {
      fileResponse = await this.messageFileHelperService.getObject(fileKey);
    }
    const {csvRecords} = this.excelParserService.parse(
      fileResponse.Body as Buffer,
    );
    const {data} = csvRecords;
    if (
      options.headerRowIndex === undefined ||
      options.headerRowIndex >= data.length
    ) {
      throw new HttpErrors.BadRequest('Invalid Header Row Passed');
    }
    /* Getting the header row from the data. */
    const headers: string[] = data[options.headerRowIndex];
    /* Mapping the headers array to an array of objects. */
    return headers.map(value => {
      return {
        value: this._sanitizeData(value),
      };
    });
  }

  async getRows(fileKey: string, options: IssueFilter): Promise<ExcelRow[]> {
    let fileResponse: GetObjectOutput;
    if (process.env.NODE_ENV === 'test') {
      fileResponse = await this.messageFileHelperService.readFile();
    } else {
      fileResponse = await this.messageFileHelperService.getObject(
        // process.env.ASSETS_BUCKET ?? '',
        fileKey,
      );
    }
    const {csvRecords, groupLevel} = this.excelParserService.parse(
      fileResponse.Body as Buffer,
    );
    const {data} = csvRecords;

    /* It gets the service name from the file type and then gets the service from the container. */
    // const handler = await this._getHandler(options.fileType);

    // const {csvRecords, groupLevel} = options.selectedSheetName
    //   ? handler.parse(fileResponse?.Body as Buffer, options.selectedSheetName)
    //   : handler.parse(fileResponse?.Body as Buffer);

    if (csvRecords.errors.length >= 1) {
      throw new HttpErrors.BadRequest('CSV is Invalid');
    }
    if (
      options.headerRowIndex === undefined ||
      options.headerRowIndex >= data.length
    ) {
      throw new HttpErrors.BadRequest('Invalid Header Row Passed');
    }
    /* Removing the header row from the data. */
    data.splice(options.headerRowIndex, 1);
    /* Declaring a variable named rawData of type string[][] and assigning the value of data to it. */
    const rawData: string[][] = data;
    /* Declaring a variable named response of type ExcelRow[] and assigning an empty array to it. */
    let response: ExcelRow[] = [];
    /* Iterating over the rawData array and mapping the values to an array of objects. */
    rawData.forEach((val, idx) => {
      const cells = val.map(cellValue => {
        return {
          value: this._sanitizeData(cellValue),
          /* Adding 1 to the index of the row. */
          rowNumber: idx + 1,
          /* Getting the group level of the cell. */
          groupLevel: groupLevel[idx + 1],
        };
      });
      /* Pushing the cells array to the response array. */
      response.push(cells);
    });

    if (options.page !== undefined && options.pageSize !== undefined) {
      const responseChunk = chunk(response, options.pageSize);
      response = responseChunk[options.page - 1] ?? [];
    }

    return response;
  }

  private async _getHandler(type?: FileType): Promise<IParser> {
    const serviceName = `services.${type?.charAt(0).toUpperCase()}${type?.slice(
      1,
    )}ParseService`;
    return this.ctx.getValueOrPromise<IParser>(serviceName) as IParser;
  }

  /*
    To prevent csv injection
    To read more about attack follow oawasp URL
    https://owasp.org/www-community/attacks/CSV_Injection
    To read about remediation follow below URL
    https://affinity-it-security.com/how-to-prevent-csv-injection/
  */
  private _sanitizeData(str: string) {
    if (!str) {
      return '';
    } else {
      if (new RegExp(/^([+\-@=\t\r])/).test(str)) {
        return `'${str}'`;
      } else {
        return str;
      }
    }
  }
}
