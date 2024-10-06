"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SMSRoute = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
class SMSRoute {
    constructor() {
        this.path = '/sms';
        this.router = (0, express_1.Router)();
        this.smsController = new controllers_1.SMSController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.all(`${this.path}*`, (req, res, next) => {
            next();
        });
        this.router.post(`${this.path}/send-sms`, this.smsController.sendSMS);
        this.router.post(`${this.path}/send-sms-sequence`, this.smsController.sendSMSSequence);
    }
}
exports.SMSRoute = SMSRoute;
