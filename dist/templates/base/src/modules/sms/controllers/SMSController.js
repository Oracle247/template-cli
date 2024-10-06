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
exports.SMSController = void 0;
const utils_1 = require("../../../core/utils");
const constants_1 = require("../../../core/constants");
const providers_1 = require("../../sms/providers");
class SMSController {
    constructor() {
        this.sendSMS = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { to, message } = req.body;
                console.log({ dat: req.body });
                const mail = yield (new providers_1.SMSProvider).sendSMS({
                    to: to,
                    message: message
                });
                console.log({ mail });
                return (0, utils_1.sendResponse)(res, constants_1.HttpCodes.OK, 'Message sent successfully', mail);
                // return sendResponse(res, HttpCodes.OK, 'Message sent successfully', await this.userProvider.sendNotification({ userId: req.user._id, title: req.body.title, body: req.body.body }))
            }
            catch (error) {
                next(error);
            }
        });
        this.sendSMSSequence = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log({ dat: req.body });
                const mail = yield (new providers_1.SMSProvider).sendSMSSequence(req.body);
                console.log({ mail });
                return (0, utils_1.sendResponse)(res, constants_1.HttpCodes.OK, 'Messages sent successfully', mail);
                // return sendResponse(res, HttpCodes.OK, 'Message sent successfully', await this.userProvider.sendNotification({ userId: req.user._id, title: req.body.title, body: req.body.body }))
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.SMSController = SMSController;
