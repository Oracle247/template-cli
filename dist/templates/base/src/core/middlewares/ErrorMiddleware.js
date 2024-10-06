"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = globalErrorHandler;
const logger_1 = require("../utils/logger");
const constants_1 = require("../constants");
function globalErrorHandler(err, req, res, next) {
    const { statusCode = constants_1.HttpCodes.SERVER_ERROR, message = 'Something went wrong', stack } = err;
    // Show stack trace only in development
    const errorResponse = {
        status: statusCode,
        message,
        stack: process.env.NODE_ENV === 'development' ? stack : undefined,
    };
    // Log error with better format and request method/path
    logger_1.logger.error(`[${req.method}] ${req.originalUrl} >> Status: ${statusCode}, Message: ${message}`);
    // Send response
    res.status(statusCode).json(errorResponse);
}
