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
exports.SMSProvider = void 0;
const exceptions_1 = require("../../../core/exceptions");
const utils_1 = require("../../../core/utils");
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("../../../core/constants");
class SMSProvider {
    sendSMS(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = Object.assign(Object.assign({}, payload), { sender_name: '', route: "dnd" });
                const config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: `${"sender_url"}/sms/send`,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `${"api_key"}`
                    },
                    data: data
                };
                axios_1.default.request(config)
                    .then((response) => {
                    utils_1.logger.info(`Message sent successfully`);
                    console.log(JSON.stringify(response.data));
                    return response.data;
                })
                    .catch((error) => {
                    utils_1.logger.error(`Message sending failed`);
                    console.log({ error: error.response.data });
                    throw new Error(error.response.data.message);
                });
            }
            catch (err) {
                console.log({ err: err });
                // throw new Error(`Failed to send SMS: ${err.response.data.message}`)
                throw new exceptions_1.HttpException(constants_1.HttpCodes.BAD_REQUEST, `Failed to send/z SMS: ${err.response.data.message}`);
            }
        });
    }
    sendSMSSequence(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                payload.map((item) => {
                    console.log(item);
                    const data = Object.assign(Object.assign({}, item), { sender_name: "", route: "dnd" });
                    const config = {
                        method: 'post',
                        maxBodyLength: Infinity,
                        url: `${"url"}/sms/send`,
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': `${"api_key"}`
                        },
                        data: data
                    };
                    axios_1.default.request(config)
                        .then((response) => {
                        utils_1.logger.info(`Message sent successfully`);
                        console.log(JSON.stringify(response.data));
                    })
                        .catch((error) => {
                        utils_1.logger.error(`Message sending failed`);
                        console.log({ error: error.response.data });
                        throw new Error(error.response.data.message);
                    });
                });
            }
            catch (err) {
                console.log({ err: err });
                // throw new Error(`Failed to send SMS: ${err.response.data.message}`)
                throw new exceptions_1.HttpException(constants_1.HttpCodes.BAD_REQUEST, `Failed to send/z SMS: ${err.response.data.message}`);
            }
        });
    }
}
exports.SMSProvider = SMSProvider;
