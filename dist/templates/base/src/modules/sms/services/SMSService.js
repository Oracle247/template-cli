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
exports.SMSPublisher = void 0;
const cote_1 = __importDefault(require("cote"));
const providers_1 = require("../providers");
const moment_1 = __importDefault(require("moment"));
const sentSMSs = [];
const SMSPublisher = new cote_1.default.Publisher({
    name: 'SMS Publisher',
    key: 'sms',
    broadcasts: ['send_sms']
});
exports.SMSPublisher = SMSPublisher;
const SMSSubscriber = new cote_1.default.Subscriber({
    name: 'SMS Subscriber',
    key: 'sms',
    subscribesTo: ['send_sms']
});
SMSSubscriber.on('send_sms', (body) => __awaiter(void 0, void 0, void 0, function* () {
    const foundPhoneFromSentSms = sentSMSs.find(sms => sms.to == body.to);
    if (foundPhoneFromSentSms) {
        // Do not send another sms if sent within 60 sec
        if ((0, moment_1.default)(foundPhoneFromSentSms.time).diff((0, moment_1.default)(new Date), 'seconds') <= 60)
            return;
    }
    yield new providers_1.SMSProvider().sendSMS(body);
    sentSMSs.push({ to: body.to, time: new Date() });
}));
