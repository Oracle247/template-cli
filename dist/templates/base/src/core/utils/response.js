"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const logger_1 = require("./logger");
const sendResponse = (res, statusCode, msg, data) => {
    const responseObject = {
        statusCode,
        msg,
        data
    };
    logger_1.logger.info(JSON.stringify(responseObject));
    return res.status(statusCode)
        .json({
        msg: (msg === null || msg === void 0 ? void 0 : msg.message) || msg,
        data
    });
};
exports.sendResponse = sendResponse;
