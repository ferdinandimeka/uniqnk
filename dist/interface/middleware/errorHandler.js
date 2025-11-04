"use strict";
// import { Request, Response, NextFunction } from 'express';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
// export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
//   console.error(err.stack);
//   res.status(500).json({ message: 'Internal Server Error' });
// }
const mongoose_1 = __importDefault(require("mongoose"));
const winston_logger_1 = __importDefault(require("../logger/winston.logger"));
const apiError_1 = require("../../utils/apiError");
const helper_1 = require("../../utils/helper");
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
const errorHandler = (err, req, res, next) => {
    let error = err;
    // Check if the error is an instance of an ApiError class which extends native Error class
    if (!(error instanceof apiError_1.ApiError)) {
        // if not
        // create a new ApiError instance to keep the consistency
        // assign an appropriate status code
        const statusCode = error.statusCode || error instanceof mongoose_1.default.Error ? 400 : 500;
        // set a message from native Error instance or a custom one
        const message = error.message || "Something went wrong";
        error = new apiError_1.ApiError(statusCode, message, error?.errors || [], err.stack);
    }
    // Now we are sure that the `error` variable will be an instance of ApiError class
    const response = {
        ...error,
        message: error.message,
        ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}), // Error stack traces should be visible in development for debugging
    };
    winston_logger_1.default.error(`${error.message}`);
    (0, helper_1.removeUnusedMulterImageFilesOnError)(req);
    // Send error response
    return res.status(error.statusCode).json(response);
};
exports.errorHandler = errorHandler;
