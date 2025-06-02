// import { Request, Response, NextFunction } from 'express';

// export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
//   console.error(err.stack);
//   res.status(500).json({ message: 'Internal Server Error' });
// }

import mongoose from "mongoose";

import logger from "../logger/winston.logger";
import { ApiError } from '../../utils/apiError';
import asyncHandler from 'express-async-handler';
import { removeUnusedMulterImageFilesOnError } from "../../utils/helper";

/**
 *
 * @param {Error | ApiError} err
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 *
 *
 * @description This middleware is responsible to catch the errors from any request handler wrapped inside the {@link asyncHandler}
 */
const errorHandler = (err: {
  statusCode: boolean;
  message: string;
  errors: never[]; stack: string | undefined; 
}, req: any, res: { status: (arg0: any) => { (): any; new(): any; json: { (arg0: any): any; new(): any; }; }; }, next: any) => {
  let error = err;

  // Check if the error is an instance of an ApiError class which extends native Error class
  if (!(error instanceof ApiError)) {
    // if not
    // create a new ApiError instance to keep the consistency

    // assign an appropriate status code
    const statusCode =
      error.statusCode || error instanceof mongoose.Error ? 400 : 500;

    // set a message from native Error instance or a custom one
    const message = error.message || "Something went wrong";
    error = new ApiError(statusCode, message, error?.errors || [], err.stack) as unknown as typeof error;
  }

  // Now we are sure that the `error` variable will be an instance of ApiError class
  const response = {
    ...error,
    message: error.message,
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}), // Error stack traces should be visible in development for debugging
  };

  logger.error(`${error.message}`);

  removeUnusedMulterImageFilesOnError(req);
  // Send error response
  return res.status(error.statusCode).json(response);
};

export { errorHandler };