import {inject, service} from '@loopback/core';
import {get, param, Response, RestBindings} from '@loopback/rest';
import * as AWS from 'aws-sdk';
import {AWSS3Bindings, S3WithSigner} from 'loopback4-s3';
import moment from 'moment';
import {ExcelCsvHelperService} from '../services/excel-csv-helper.service';
import {ExcelParseService} from '../services/excel-parser.service';
//import {Message, MessageDto, MessageFile, MessageFileDto} from '../models';
import {MessageFileHelperService} from '../services/file-helper.service';
import {ColumnTypeContext, ColumnTypes, ExcelRow} from '../types/shared.type';
const A_CHAR_CODE = 65;
const basePath = 'message-files';
const TASK_NAME_CHARACTER_LIMIT = 300;
const nameColumnIndex = 0;
export class MessageFileController {
  constructor(
    // @inject(AuthenticationBindings.CURRENT_USER)
    // private readonly currentUser: IAuthUserWithPermissions,
    @service(MessageFileHelperService)
    private readonly messageFileHelperService: MessageFileHelperService,
    @inject(AWSS3Bindings.AwsS3Provider) s3: S3WithSigner,
  ) {}
  // Download file by key
  // @authenticate(STRATEGY.BEARER)
  //@authorize({permissions: [PermissionKey.ViewMessageFile]})
  @get(`${basePath}/{fileKey}`)
  async downloadMessageFileByFileKey(
    @param.path.string('fileKey') fileKey: string,
    /* Injecting the response object from the request. */
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @inject(AWSS3Bindings.AwsS3Provider) s3: AWS.S3,
    // @inject(AWSS3Bindings.AwsS3Provider) s3: S3WithSigner,
  ) {
    return fileKey;
    //this.messageFileHelperService.getObject(fileKey);
  }
}
