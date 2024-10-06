"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = exports.successResponse = void 0;
const successResponse = (res, message, statusCode = 200, data = []) => {
    return res.status(statusCode).json({ status: true, message, data });
};
exports.successResponse = successResponse;
const errorResponse = (res, message = 'Something went wrong', statusCode = 500, error = {}) => {
    return res.status(statusCode).json({ status: false, message, error });
};
exports.errorResponse = errorResponse;
