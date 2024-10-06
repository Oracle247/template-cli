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
const Encrypt_service_1 = __importDefault(require("./Encrypt.service"));
const Token_service_1 = __importDefault(require("./Token.service"));
const constants_1 = require("../../../interfaces/constants");
const Otp_service_1 = __importDefault(require("./Otp.service"));
const models_1 = require("../../user/models");
const providers_1 = require("../../email/providers");
const exceptions_1 = require("../../../core/exceptions");
const http_status_codes_1 = require("http-status-codes");
// const client = new OAuth2Client(config.GOOGLE.CLIENT_ID);
class UserAuthService {
    constructor() {
        this.encryptionService = new Encrypt_service_1.default();
        this.tokenService = new Token_service_1.default();
    }
    create(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            payload.email = payload.email.toLowerCase();
            const existingEmail = yield models_1.User.findOne({ email: payload.email });
            if (existingEmail) {
                throw new exceptions_1.AppError('Oops, Email already exists', http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const user = yield models_1.User.create(Object.assign(Object.assign({}, payload), { status: constants_1.Status.ACTIVE }));
            // const message = "Your account has been created clink the link to reset your password http://localhost:3000/reset-password"
            // await (new EmailService).sendUserLoginCredentials(user.email, user.fullname, message)
            return user;
        });
    }
    login(loginPayload) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log({ loginPayload });
            const user = yield models_1.User.findOne({ email: loginPayload.email }).select("+password");
            if (!user ||
                !(yield this.encryptionService.comparePassword(user.password, loginPayload.password))) {
                throw new exceptions_1.AppError(`Oops!, invalid email or password`, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            console.log({ user });
            const token = yield this.tokenService.generateToken(user.id, `${user.email}`);
            console.log({ token });
            return { user, token };
        });
    }
    sendResetCode(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield models_1.User.findOne({ email: payload.email });
            if (!user)
                throw new Error(`Oops!, user doesn't exist`);
            const otp = yield (new Otp_service_1.default).generateOTP(user._id, payload.type);
            const message = `this is your Token ${otp}`;
            const emailConfig = {
                to: user.email,
                subject: 'Password Reset Token',
                payload: {
                    name: user.full_name,
                    message
                },
                template: '../templates/email.handlebars'
            };
            const mail = yield (new providers_1.EmailProvider).sendMail(emailConfig);
            return mail;
        });
    }
    mfa(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield models_1.User.findOne({ email: payload.email }).populate({
                path: "role"
            });
            if (!user)
                throw new exceptions_1.AppError(`Oops!, user doesn't exist`, http_status_codes_1.StatusCodes.BAD_REQUEST);
            const verifyPayload = {
                token: payload.token,
                type: "mfaToken",
                userId: user._id,
                deleteOnVerify: true
            };
            const otpVerify = yield (new Otp_service_1.default).verifyOTP(Object.assign({}, verifyPayload));
            if (!otpVerify)
                throw new exceptions_1.AppError('Oops!, Otp verification failed', http_status_codes_1.StatusCodes.BAD_REQUEST);
            const token = yield this.tokenService.generateToken(user.id, `${user.email}`);
            user.mfa = false;
            user.status = constants_1.Status.ACTIVE;
            yield user.save();
            return { user, token };
        });
    }
    validateResetCode(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield models_1.User
                .findOne({ email: payload.email })
                .select("+password");
            if (!user)
                throw new Error(`Oops! user does not exist`);
            const verifyPayload = {
                token: payload.resetToken,
                type: "passwordReset",
                userId: user._id,
                deleteOnVerify: false
            };
            const otpVerify = yield (new Otp_service_1.default).verifyOTP(Object.assign({}, verifyPayload));
            if (!otpVerify)
                throw new exceptions_1.AppError('Oops!, Otp verification failed', http_status_codes_1.StatusCodes.BAD_REQUEST);
            return otpVerify;
        });
    }
    passwordReset(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield models_1.User
                .findOne({ email: payload.email })
                .select("+password");
            if (!user)
                throw new exceptions_1.AppError(`Oops! user does not exist`, http_status_codes_1.StatusCodes.BAD_REQUEST);
            const verifyPayload = {
                token: payload.resetToken,
                type: "passwordReset",
                userId: user._id,
                deleteOnVerify: true
            };
            const otpVerify = yield (new Otp_service_1.default).verifyOTP(Object.assign({}, verifyPayload));
            if (!otpVerify)
                throw new exceptions_1.AppError('Oops!, Otp verification failed', http_status_codes_1.StatusCodes.BAD_REQUEST);
            user.password = payload.password;
            const newUser = yield user.save();
            return newUser;
        });
    }
    changePassword(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield models_1.User
                .findOne({ email: payload.email })
                .select("+password");
            if (!user)
                throw new Error(`Oops! user does not exist`);
            if (!(yield this.encryptionService.comparePassword(user.password, payload.oldPassword))) {
                throw new exceptions_1.AppError(`Oops!, invalid password`, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            // const password = await this.encryptionService.hashPassword(
            //     payload.newPassword
            // );
            user.password = payload.newPassword;
            // await (new ActivityService).createActivity({
            //   user: user._id,
            //   type: "Change Password"
            // })
            return yield user.save();
        });
    }
}
exports.default = UserAuthService;
