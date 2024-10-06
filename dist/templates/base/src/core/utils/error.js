"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerShutdownHandler = registerShutdownHandler;
const logger_1 = require("./logger");
const shutdownHandler = [];
function registerShutdownHandler(handler) {
    shutdownHandler.push(handler);
}
function gracefulShutdown() {
    return __awaiter(this, void 0, void 0, function* () {
        const promises = [];
        for (const handler of shutdownHandler) {
            promises.push(handler());
        }
        Promise.all(promises);
        process.exit(0);
    });
}
function uncaughtExceptionHandler(error) {
    // logger.error('uncaughtException', error)
    process.exit(1);
}
function unhandledRejectionHandler(error) {
    // logger.error('unhandledRejection', error)
    process.exit(1);
}
process.on('uncaughtException', uncaughtExceptionHandler);
process.on('unhandledRejection', unhandledRejectionHandler);
process.on('SIGTERM', () => {
    logger_1.logger.info('SIGTERM signal received: closing HTTP server');
    gracefulShutdown();
});
