import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { HttpCodes } from '../constants';
import { AppError } from '../exceptions';

interface ErrorResponse {
  status: number;
  message: string;
  stack?: string;
}

export function globalErrorHandler(err: AppError, req: Request, res: Response, next: NextFunction) {
  const { statusCode = HttpCodes.SERVER_ERROR, message = 'Something went wrong', stack } = err;

  // Show stack trace only in development
  const errorResponse: ErrorResponse = {
    status: statusCode,
    message,
    stack: process.env.NODE_ENV === 'development' ? stack : undefined,
  };

  // Log error with better format and request method/path
  logger.error(`[${req.method}] ${req.originalUrl} >> Status: ${statusCode}, Message: ${message}`);

  // Send response
  res.status(statusCode).json(errorResponse);
}
