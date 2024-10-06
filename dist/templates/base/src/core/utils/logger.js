"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stream = exports.logger = void 0;
const winston_1 = require("winston");
const { combine, colorize, timestamp, errors, splat, json, simple } = winston_1.format;
function productionLogger() {
    return (0, winston_1.createLogger)({
        format: combine(timestamp(), errors({ stack: true }), splat(), json()),
        transports: [new winston_1.transports.Console()],
    });
}
function developmentLogger() {
    return (0, winston_1.createLogger)({
        level: 'debug',
        format: combine(colorize(), timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }), errors({ stack: true }), simple()),
        transports: [new winston_1.transports.Console()],
    });
}
const logger = process.env.NODE_ENV === 'development'
    ? developmentLogger()
    : productionLogger();
exports.logger = logger;
const stream = {
    write: (message) => {
        // logger.info(message.substring(0, message.lastIndexOf('\n')));
    },
};
exports.stream = stream;
