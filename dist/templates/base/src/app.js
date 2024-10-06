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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compression_1 = __importDefault(require("compression"));
const http_1 = __importDefault(require("http"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const hpp_1 = __importDefault(require("hpp"));
const path_1 = __importDefault(require("path"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const mongoose_1 = require("mongoose");
const config_1 = require("./config");
const databases_1 = require("./core/databases");
const utils_1 = require("./core/utils");
const ErrorMiddleware_1 = require("./core/middlewares/ErrorMiddleware");
// import { socket } from './customer-support/services/SocketService';
// import './jobs/crons/email.cron'
class App {
    // public io: SocketIO.Server
    constructor(routes) {
        this.app = (0, express_1.default)();
        this.env = 'production';
        config_1.NODE_ENV || 'development';
        this.port = config_1.PORT || 3000;
        this.connectDatabase();
        // this.initSocket()
        this.initializeMiddlewares();
        this.initializeRoutes(routes);
        this.initializeSwagger();
        this.initializeErrorHandling();
    }
    listen() {
        utils_1.logger.info('Starting Server ....');
        const server = this.createServer();
        server.listen(this.port, () => {
            utils_1.logger.info(`=================================`);
            utils_1.logger.info(`========= SERVER 🚀=======`);
            utils_1.logger.info(`========= ENV: ${this.env} ========`);
            utils_1.logger.info(`========= PORT: ${this.port} ========`);
            utils_1.logger.info(`🚀 Server running on  ${config_1.HOST}:${this.port} 🚀`);
            utils_1.logger.info(`=================================`);
        });
        ;
        return server;
    }
    createServer() {
        return http_1.default.createServer(this.getServer());
    }
    getServer() {
        return this.app;
    }
    connectDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.env !== 'production') {
                (0, mongoose_1.set)('debug', true);
            }
            return new Promise((resolve, reject) => {
                (0, mongoose_1.connect)(databases_1.dbConnection.url, databases_1.dbConnection.options, (error) => {
                    if (error) {
                        utils_1.logger.error(`Database Error: ${error}`);
                        reject(error);
                    }
                    else {
                        utils_1.logger.info(`=================================`);
                        utils_1.logger.info(`========= DATABASE 🚀=======`);
                        utils_1.logger.info(`🚀 Database running on ${config_1.DB_URI} 🚀`);
                        utils_1.logger.info(`=================================`);
                        resolve(undefined);
                    }
                });
            });
        });
    }
    initializeMiddlewares() {
        this.app.use((0, morgan_1.default)(config_1.LOG_FORMAT, { stream: utils_1.stream }));
        this.app.use((0, cors_1.default)({ origin: '*' }));
        this.app.use((0, hpp_1.default)());
        this.app.use((0, helmet_1.default)());
        this.app.use((0, compression_1.default)());
        this.app.use(express_1.default.json({ limit: "15mb" }));
        this.app.use(express_1.default.urlencoded({ limit: "15mb", extended: true }));
        this.app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
        this.app.use((0, cookie_parser_1.default)());
    }
    initializeRoutes(routes) {
        utils_1.logger.info('Initializing Routes ....');
        routes.forEach(route => {
            this.app.use('/api/v1', route.router);
        });
        utils_1.logger.info('Routes Initialized Successfully ✔️');
    }
    initializeSwagger() {
        utils_1.logger.info('Initializing Swagger ....');
        const options = {
            swaggerDefinition: {
                info: {
                    title: 'REST API',
                    version: '1.0.0',
                    description: 'Example docs',
                },
            },
            apis: ['swagger.yaml'],
        };
        const specs = (0, swagger_jsdoc_1.default)(options);
        this.app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));
        utils_1.logger.info('Swagger Initialized Successfully ✔️');
    }
    stopServer() {
        utils_1.logger.info('Stopping HTTP Server ❌');
        return new Promise((resolve, reject) => {
            this.listen().close(error => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(undefined);
                }
            });
        });
    }
    initializeErrorHandling() {
        utils_1.logger.info('Initializing Error Handler ....');
        this.app.use(ErrorMiddleware_1.globalErrorHandler);
        (0, utils_1.registerShutdownHandler)(this.stopServer);
        utils_1.logger.info('Error Handler Initialized Successfully ✔️');
    }
}
exports.default = App;
