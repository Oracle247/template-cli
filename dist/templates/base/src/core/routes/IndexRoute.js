"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexRoute = void 0;
const express_1 = require("express");
const config_1 = require("../../config");
class IndexRoute {
    constructor() {
        this.path = '/';
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(`${this.path}`, (req, res, next) => {
            return res.status(200)
                .json({
                msg: `Welcome to ${config_1.APP_NAME} Backend`
            });
        });
        this.router.get(`${this.path}ping`, (req, res, next) => {
            return res.status(200)
                .json({
                msg: `${config_1.APP_NAME} Backend is active`
            });
        });
    }
}
exports.IndexRoute = IndexRoute;
