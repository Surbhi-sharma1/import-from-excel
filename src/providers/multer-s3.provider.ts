import {Provider} from '@loopback/core';
import {Request, Response} from 'express';
import multer from 'multer';
import multerS3 from 'multer-s3';

import {IUploader, MulterS3Options} from '../types';

export class MulterS3Provider implements Provider<IUploader> {
  value() {
    return {
      uploadAny: async (
        options: MulterS3Options,
        req: Request,
        res: Response,
      ) => {
        // sonarignore:start
        const upload = multer({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          storage: multerS3(options as any),
        });
        // sonarignore:end

        return new Promise<object>((resolve, reject) => {
          // sonarignore:start
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          upload.any()(req, res, (err: any) => {
            // sonarignore:end
            if (err) {
              console.log(err);
              reject(err);
            } else {
              resolve({
                files: req.files,
                reqBody: req.body,
              });
            }
          });
        });
      },
    };
  }
}
