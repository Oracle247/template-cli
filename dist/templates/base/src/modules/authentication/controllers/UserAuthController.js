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
exports.UserAuthController = void 0;
const User_auth_service_1 = __importDefault(require("../services/User.auth.service"));
const http_status_codes_1 = require("http-status-codes");
class UserAuthController {
    constructor() {
        this.authService = new User_auth_service_1.default();
        this.create = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.authService.create(Object.assign({}, req.body));
                return res.status(http_status_codes_1.StatusCodes.OK).json({
                    status: "success",
                    message: `creating account successful`,
                    user: data,
                });
            }
            catch (err) {
                next(err);
            }
        });
        this.login = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.authService.login(req.body);
                return res.status(http_status_codes_1.StatusCodes.OK).json(user);
            }
            catch (error) {
                next(error);
            }
        });
        this.sendResetCode = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = {
                    email: req.body.email,
                    type: "passwordReset",
                };
                const result = yield this.authService.sendResetCode(data);
                return res.status(http_status_codes_1.StatusCodes.OK).send({
                    message: "Email Sent Successfully",
                    data: result,
                });
            }
            catch (err) {
                next(err);
            }
        });
        this.mfa = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = {
                    email: req.body.email,
                    token: req.body.token
                };
                const result = yield this.authService.mfa(data);
                return res.status(http_status_codes_1.StatusCodes.OK).send({
                    message: "Access granted",
                    data: result
                });
            }
            catch (err) {
                next(err);
            }
        });
        this.validateResetCode = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.authService.validateResetCode(req.body);
                res.status(http_status_codes_1.StatusCodes.OK).send({
                    message: "Token Validation Successful",
                    data: result,
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.passwordReset = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.authService.passwordReset(req.body);
                res.status(http_status_codes_1.StatusCodes.OK).send({
                    message: "Password changed successfully",
                    data: result,
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.changePassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.authService.changePassword(req.body);
                res.status(http_status_codes_1.StatusCodes.OK).send({
                    message: "Password changed successfully",
                    data: result,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.UserAuthController = UserAuthController;
