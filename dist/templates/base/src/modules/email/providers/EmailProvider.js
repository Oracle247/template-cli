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
exports.EmailProvider = void 0;
const mail_1 = __importDefault(require("@sendgrid/mail"));
const fs_1 = require("fs");
const path_1 = require("path");
const handlebars_1 = require("handlebars");
const config_1 = require("../../../config");
const nodemailer_1 = __importDefault(require("nodemailer"));
const utils_1 = require("../../../core/utils");
class EmailProvider {
    constructor() {
        this.mailer = mail_1.default;
        utils_1.logger.info("Mail provider");
    }
    compileHtmlEmail(template, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const templateSource = yield (0, fs_1.readFileSync)((0, path_1.join)((0, path_1.resolve)(__dirname, template)));
                const compiledTemplate = (0, handlebars_1.compile)(String(templateSource));
                return compiledTemplate(Object.assign(Object.assign({}, payload), { app: {
                        name: config_1.APP_NAME, url: config_1.APP_URL, logo: config_1.APP_LOGO, email: config_1.APP_EMAIL
                    } }));
            }
            catch (err) {
                utils_1.logger.error(err);
            }
        });
    }
    sendMail(_a) {
        return __awaiter(this, arguments, void 0, function* ({ to, subject, payload, template }) {
            try {
                const transporter = nodemailer_1.default.createTransport({
                    host: config_1.SMTP_HOSTNAME,
                    port: 465,
                    auth: {
                        user: config_1.SMTP_USERNAME,
                        pass: config_1.SMTP_PASSWORD,
                    },
                    debugger: true,
                    logger: true
                });
                const html = yield this.compileHtmlEmail(template, payload);
                const mailOptions = {
                    from: config_1.SMTP_USERNAME,
                    to: to,
                    subject: subject,
                    html: html
                };
                const info = yield transporter.sendMail(mailOptions);
                if (!info)
                    throw new Error("Unable to send mail");
                console.log('Email sent:', info);
                return info;
            }
            catch (error) {
                utils_1.logger.error(error);
                throw new Error(`Error sending email: ${error}`);
            }
        });
    }
}
exports.EmailProvider = EmailProvider;
