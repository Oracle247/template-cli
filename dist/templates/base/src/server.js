"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const routes_1 = require("./core/routes");
const validateEnv_1 = require("./core/utils/validateEnv");
(0, validateEnv_1.validateEnv)();
const app = new app_1.default([
    new routes_1.UserAuthRoute(),
    new routes_1.AdminRoute(), new routes_1.UserRoute(), new routes_1.IndexRoute(),
]);
app.listen();
