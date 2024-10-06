"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoute = void 0;
const AuthMiddleware_1 = require("../../../core/middlewares/AuthMiddleware");
const express_1 = require("express");
const controllers_1 = require("../controllers");
class UserRoute {
    constructor() {
        this.path = '/user';
        this.router = (0, express_1.Router)();
        this.userController = new controllers_1.UserController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.all(`${this.path}*`, (req, res, next) => {
            next();
        });
        this.router.get(`${this.path}`, AuthMiddleware_1.isUserAuthenticated, this.userController.getAllUser);
        this.router.get(`${this.path}/:id`, AuthMiddleware_1.isUserAuthenticated, this.userController.getUser);
        this.router.post(`${this.path}/`, AuthMiddleware_1.isUserAuthenticated, this.userController.createUser);
        this.router.put(`${this.path}/:id`, AuthMiddleware_1.isUserAuthenticated, this.userController.updateUser);
        this.router.delete(`${this.path}/:id`, AuthMiddleware_1.isUserAuthenticated, this.userController.deleteUser);
    }
}
exports.UserRoute = UserRoute;
