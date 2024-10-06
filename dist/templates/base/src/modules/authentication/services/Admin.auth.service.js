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
const models_1 = require("../../admin/models");
const Activity_service_1 = require("../../adminActivity/services/Activity.service");
const Token_service_1 = __importDefault(require("./Token.service"));
const constants_1 = require("../../../interfaces/constants");
const Otp_service_1 = __importDefault(require("./Otp.service"));
// const client = new OAuth2Client(config.GOOGLE.CLIENT_ID);
class AdminAuthService {
    constructor() {
        this.encryptionService = new Encrypt_service_1.default();
        this.tokenService = new Token_service_1.default();
    }
    create(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // const role = await Role.findOne({ title: payload.role });
                // if (!role) {
                //     throw new Error('Role not found');
                // }
                payload.email = payload.email.toLowerCase();
                const existingEmail = yield models_1.Admin.findOne({ email: payload.email });
                const existingPhoneNumber = yield models_1.Admin.findOne({ phoneNumber: payload.phoneNumber });
                if (existingEmail) {
                    throw new Error('Oops, Email already exists');
                }
                if (existingPhoneNumber) {
                    throw new Error('Oops, Phone number already exists');
                }
                const admin = yield models_1.Admin.create(Object.assign(Object.assign({}, payload), { 
                    // role: role._id,
                    status: constants_1.Status.PENDING }));
                const message = "Your account has been created clink the link to reset your password http://localhost:3000/reset-password";
                // await (new EmailService).sendAdminLoginCredentials(admin.email, admin.fullname, message)
                return admin;
            }
            catch (err) {
                console.log(err);
                throw new Error(err);
            }
        });
    }
    login(loginPayload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log({ loginPayload });
                const admin = yield models_1.Admin.findOne({
                    $or: [{ username: loginPayload.username },
                        { email: loginPayload.username }
                    ],
                }).select("+password");
                // .populate({
                //   path: "role"
                // });
                if (!admin ||
                    !(yield this.encryptionService.comparePassword(admin.password, loginPayload.password))) {
                    throw new Error(`Oops!, invalid email or password`);
                }
                // if (admin.isEmailVerified !== true) {
                //     throw new Error("Oops! your email is not verified,");
                // }
                if (!admin.mfa) {
                    const token = yield this.tokenService.generateToken(admin.id, `${admin.email}`);
                    yield (new Activity_service_1.ActivityService).createActivity({
                        admin: admin._id,
                        type: "Login"
                    });
                    return { admin, token };
                }
                const otp = yield (new Otp_service_1.default).generateOTP(admin._id, "mfaToken");
                const emailConfig = {
                    fullName: admin.full_name,
                    email: admin.email,
                    token: otp
                };
                const { fullName, email, token } = emailConfig;
                // await (new EmailService)._sendMfaTokenEmail(fullName, email, token)
                yield (new Activity_service_1.ActivityService).createActivity({
                    admin: admin._id,
                    type: "Login"
                });
                // admin.mfa = false;
                // await admin.save();
                return {
                    message: "mfa token has been sent to your email",
                    admin
                };
            }
            catch (err) {
                console.log(err);
                throw new Error(err);
            }
        });
    }
    sendResetLink(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = yield models_1.Admin.findOne({ email: payload.email });
                if (!admin)
                    throw new Error(`Oops!, admin doesn't exist`);
                const otp = yield (new Otp_service_1.default).generateOTP(admin._id, payload.type);
                const emailConfig = {
                    fullName: admin.full_name,
                    email: admin.email,
                    token: otp
                };
                const { fullName, email, token } = emailConfig;
                // const mail = await (new EmailService)._sendUserPasswordResetInstructionEmail(fullName, email, token)
                const mail = "success";
                return mail;
            }
            catch (error) {
                console.log(error);
                throw new Error(error);
            }
        });
    }
    mfa(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = yield models_1.Admin.findOne({ email: payload.email }).populate({
                    path: "role"
                });
                if (!admin)
                    throw new Error(`Oops!, admin doesn't exist`);
                const verifyPayload = {
                    token: payload.token,
                    type: "mfaToken",
                    userId: admin._id,
                    deleteOnVerify: true
                };
                const otpVerify = yield (new Otp_service_1.default).verifyOTP(Object.assign({}, verifyPayload));
                if (!otpVerify)
                    throw new Error('Oops!, Otp verification failed');
                const token = yield this.tokenService.generateToken(admin.id, `${admin.email}`);
                admin.mfa = false;
                admin.status = constants_1.Status.ACTIVE;
                yield admin.save();
                return { admin, token };
            }
            catch (error) {
                console.log(error);
                throw new Error(error);
            }
        });
    }
    passwordReset(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = yield models_1.Admin
                    .findOne({ email: payload.email })
                    .select("+password");
                if (!admin)
                    throw new Error(`Oops! admin does not exist`);
                const verifyPayload = {
                    token: payload.resetToken,
                    type: "passwordReset",
                    userId: admin._id,
                    deleteOnVerify: true
                };
                const otpVerify = yield (new Otp_service_1.default).verifyOTP(Object.assign({}, verifyPayload));
                if (!otpVerify)
                    throw new Error('Oops!, Otp verification failed');
                admin.password = payload.password;
                const newAdmin = yield admin.save();
                yield (new Activity_service_1.ActivityService).createActivity({
                    admin: admin._id,
                    type: "Reset Password"
                });
                return newAdmin;
            }
            catch (err) {
                console.log(err);
                throw new Error(err);
            }
        });
    }
    changePassword(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield models_1.Admin
                .findOne({ email: payload.email })
                .select("+password");
            if (!admin)
                throw new Error(`Oops! admin does not exist`);
            if (!(yield this.encryptionService.comparePassword(admin.password, payload.oldPassword))) {
                throw new Error(`Oops!, invalid password`);
            }
            // const password = await this.encryptionService.hashPassword(
            //     payload.newPassword
            // );
            admin.password = payload.newPassword;
            yield (new Activity_service_1.ActivityService).createActivity({
                admin: admin._id,
                type: "Change Password"
            });
            return yield admin.save();
        });
    }
}
exports.default = AdminAuthService;
