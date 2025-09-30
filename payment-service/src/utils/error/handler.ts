import { Request, Response, NextFunction } from 'express';
import { logger } from '~/utils/logger';
import {
   AuthorizeError,
   NotFoundError,
   ValidationError,
} from './errors';

export const HandleErrorWithLogger = (error: Error, _req: Request, res: Response, _next: NextFunction) => {
   let reportError = true;
   let status = 500;
   let data = error.message;

   // skip common / known errors
   [NotFoundError, ValidationError, AuthorizeError].forEach((typeOfError) => {
      if (error instanceof typeOfError) {
         reportError = false;
         status = error.status;
         data = error.message;
      }
   });

   if (reportError) {
      // error reporting tools implementation eg: Cloudwatch,Sentry etc;
      logger.error(error);
   } else {
      logger.warn(error); // ignore common errors caused by user
   }

   return res.status(status).json(data);
};

export const HandleUncaughtException = async (
   error: Error,
) => {
   // error report / monitoring tools
   logger.error(error);
   // recover
   process.exit(1);
};