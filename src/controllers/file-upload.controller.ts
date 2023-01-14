import {inject, service} from '@loopback/core';
import {AnyObject} from '@loopback/repository';
import {
  HttpErrors,
  post,
  Request,
  requestBody,
  Response,
  RestBindings,
} from '@loopback/rest';
import * as AWS from 'aws-sdk';

import {AWSS3Bindings} from 'loopback4-s3';
import {MessageFileHelperService} from '../services/file-helper.service';
import {FileUploadBindings, IUploader, SafeMulterS3Options} from '../types';
const bucket = process.env.S3_FILE_BUCKET ?? '';
const COLUMN_NAME_CHARACTER_LIMIT = 10;
export class FileUploadController {
  constructor(
    @inject(FileUploadBindings.SafeMulterS3Provider)
    private readonly multerS3Provider: IUploader,
    @service(MessageFileHelperService)
    private readonly messageFileHelperService: MessageFileHelperService,
  ) {}

  // @authenticate(STRATEGY.BEARER, {
  //   passReqToCallback: true,
  // })
  // @authorize({permissions: ['*']})
  @post('/fileupload', {
    description: 'General file upload',
    responses: {
      '200': 'HI',
    },
  })
  async uploadFile(
    //@param.header.string('Authorization') _token: string,
    @requestBody({
      description: 'multipart/form-data value.',
      required: true,
      content: {
        'multipart/form-data': {
          // Skip body parsing
          'x-parser': 'stream',
          schema: {type: 'object'},
        },
      },
    })
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @inject(AWSS3Bindings.AwsS3Provider) s3: AWS.S3,
  ): Promise<AnyObject> {
    const safeMulterS3Options: SafeMulterS3Options = {
      s3,
      bucket,
      // Set public re,ad permissions
      // acl: 'public-read',
      //Set key/ filename as original uploaded name
      key: (_req, file, cb) => {
        const fileSplitArr = file.originalname.split('.');
        const fileExt = fileSplitArr[fileSplitArr.length - 1];
        const fileName = fileSplitArr.splice(-1, 1).join('_');

        cb(null, `${Date.now()}_${fileName}.${fileExt}`);
      },
      contentDisposition: 'attachment',
      tempDir: './.tmp',
    };
    // sonarignore:start
    let uploadResp;
    try {
      uploadResp = await this.multerS3Provider.uploadAny(
        safeMulterS3Options,

        request as any,

        response as any,
      );
    } catch (err) {
      throw new HttpErrors.UnprocessableEntity(err.message);
    }
    // if (
    //   !((uploadResp as AnyObject)?.files as Express.Multer.File[])[0]?.filename
    // ) {
    //   console.log(request);
    //   console.log(uploadResp);
    //   throw new HttpErrors.UnprocessableEntity('Unable to upload file');
    // }
    const {filename: fileKey} = ((uploadResp as AnyObject)
      .files as Express.Multer.File[])[0];
    const fileResponse = await this.messageFileHelperService.readFile();
    return {
      fileKey,
    };
  }
}
