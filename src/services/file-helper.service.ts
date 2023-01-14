import {BindingScope, inject, injectable} from '@loopback/core';
import AWS from 'aws-sdk';
import {readFileSync} from 'fs';
import path from 'path';
import {FileUploadBindings, IUploader} from '../types';
const bucket = 'import-service-bucket1';
const NOT_FOUND = 404;
@injectable({scope: BindingScope.TRANSIENT})
export class MessageFileHelperService {
  constructor(
    @inject(FileUploadBindings.SafeMulterS3Provider)
    private readonly multerS3Provider: IUploader, //@inject(LOGGER.LOGGER_INJECT) private readonly logger: ILogger,
  ) {}
  config = {
    region: process.env.S3_REGION,
    accessKeyId: process.env.S3_ACCESSKEYID,
    secretAccessKey: process.env.S3_SECRETACCESSKEY,
  };
  s3 = new AWS.S3(this.config);
  // async uploadToS3(request: Request, response: Response, s3: AWS.S3) {
  //   const safeMulterS3Options: SafeMulterS3Options = {
  //     s3,
  //     bucket,
  //     key: (
  //       _req: unknown,
  //       file: {originalname: string},
  //       cb: (arg0: null, arg1: string) => void,
  //     ) => {
  //       const fileSplitArr = file.originalname.split('.');
  //       const fileExt = fileSplitArr[fileSplitArr.length - 1];
  //       const fileName = fileSplitArr.splice(-1, 1).join('_');
  //       cb(null, `${Date.now()}_${fileName}.${fileExt}`);
  //     },
  //     tempDir: '',
  //     contentDisposition: '',
  //   };

  //   let uploadResp;
  //   try {
  //     uploadResp = await this.multerS3Provider.uploadAny(
  //       safeMulterS3Options,

  //       request as any,

  //       response as any,
  //     );
  //   } catch (err) {
  //     throw new HttpErrors.UnprocessableEntity(err.message);
  //   }

  //   if (
  //     !((uploadResp as AnyObject)?.files as Express.Multer.File[])?.every(
  //       file => file.filename,
  //     )
  //   ) {
  //     throw new HttpErrors.UnprocessableEntity('Unable to upload files');
  //   }
  //   const messageFilesPaylod = [];
  //   for (const file of (uploadResp as AnyObject)
  //     ?.files as Express.Multer.File[]) {
  //     const {
  //       filename: fileKey,
  //       size: fileSize,
  //       originalname: originalName,
  //     } = file;
  //     messageFilesPaylod.push({
  //       fileKey,
  //       metaData: {
  //         fileSize,
  //         originalName,
  //       },
  //       channelId: (uploadResp as AnyObject)?.reqBody?.channelId,
  //       deleted: true,
  //     });
  //   }
  //   return {messageFilesPaylod, uploadResp};
  // }

  async getObject(objectKey: string) {
    try {
      const params = {
        Bucket: process.env.S3_FILE_BUCKET ?? 'import-service-bucket1',
        Key: objectKey,
      };
      console.log(params);

      return this.s3.getObject(params).promise();
    } catch (error) {
      throw new Error(`Could not retrieve file from S3: ${error.message}`);
    }
  }
  async readFile() {
    try {
      const filePath = path.join(__dirname + '/../../test_50.xlsx');
      const fileResponse = readFileSync(filePath);

      return {Body: fileResponse};
    } catch (e) {
      throw new Error(`Could not retrieve file: ${e.message}`);
    }
  }
}
