"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.__MODULE__Route = void 0;
//@ts-nocheck
const AuthMiddleware_1 = require("../../../core/middlewares/AuthMiddleware");
const express_1 = require("express");
const controllers_1 = require("../controllers");
class __MODULE__Route {
    constructor() {
        this.path = '/__module__';
        this.router = (0, express_1.Router)();
        this.__module__Controller = new controllers_1.__MODULE__Controller();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.all(`${this.path}*`, (req, res, next) => {
            next();
        });
        this.router.post(`${this.path}`, this.__module__Controller.create__MODULE__);
        this.router.get(`${this.path}`, AuthMiddleware_1.isUserAuthenticated, this.__module__Controller.getAll__MODULE__);
        this.router.get(`${this.path}/:id`, AuthMiddleware_1.isUserAuthenticated, this.__module__Controller.get__MODULE__);
        this.router.put(`${this.path}/:id`, AuthMiddleware_1.isUserAuthenticated, this.__module__Controller.update__MODULE__);
        this.router.delete(`${this.path}/:id`, AuthMiddleware_1.isUserAuthenticated, this.__module__Controller.delete__MODULE__);
    }
}
exports.__MODULE__Route = __MODULE__Route;
