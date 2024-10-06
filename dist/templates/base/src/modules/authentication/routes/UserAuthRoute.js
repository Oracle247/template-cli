"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAuthRoute = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
class UserAuthRoute {
    constructor() {
        this.path = '/auth';
        this.router = (0, express_1.Router)();
        this.authController = new controllers_1.UserAuthController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.all(`${this.path}*`, (req, res, next) => {
            next();
        });
        this.router.post(`${this.path}/login`, this.authController.login);
        this.router.post(`${this.path}/create`, this.authController.create);
        this.router.post(`${this.path}/validate-reset-code`, this.authController.validateResetCode);
        this.router.post(`${this.path}/reset-password`, this.authController.passwordReset);
        this.router.post(`${this.path}/mfa`, this.authController.mfa);
        this.router.post(`${this.path}/send-reset-code`, this.authController.sendResetCode);
        this.router.post(`${this.path}/change-password`, this.authController.changePassword);
    }
}
exports.UserAuthRoute = UserAuthRoute;
