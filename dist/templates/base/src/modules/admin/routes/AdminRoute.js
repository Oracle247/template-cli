"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoute = void 0;
const AuthMiddleware_1 = require("../../../core/middlewares/AuthMiddleware");
const express_1 = require("express");
const controllers_1 = require("../controllers");
class AdminRoute {
    constructor() {
        this.path = '/admin';
        this.router = (0, express_1.Router)();
        this.adminController = new controllers_1.AdminController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.all(`${this.path}*`, (req, res, next) => {
            next();
        });
        this.router.get(`${this.path}`, AuthMiddleware_1.isAdminAuthenticated, this.adminController.getAllAdmin);
        this.router.get(`${this.path}/:id`, AuthMiddleware_1.isAdminAuthenticated, this.adminController.getAdmin);
        this.router.post(`${this.path}/`, AuthMiddleware_1.isAdminAuthenticated, this.adminController.createAdmin);
        this.router.put(`${this.path}/:id`, AuthMiddleware_1.isAdminAuthenticated, this.adminController.updateAdmin);
        this.router.delete(`${this.path}/:id`, AuthMiddleware_1.isAdminAuthenticated, this.adminController.deleteAdmin);
    }
}
exports.AdminRoute = AdminRoute;
