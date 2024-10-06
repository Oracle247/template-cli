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
const crypto_1 = __importDefault(require("crypto"));
const OtpModel_1 = require("../models/OtpModel");
const OTP_EXPIRY_MINUTES = 15;
class OtpService {
    generateOTP(user, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = crypto_1.default.randomInt(100000, 999999).toString();
            const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60000); // Convert minutes to milliseconds
            const otpToken = new OtpModel_1.Otp({
                token,
                user,
                type,
                expiresAt,
            });
            yield otpToken.save();
            return token;
        });
    }
    verifyOTP(_a) {
        return __awaiter(this, arguments, void 0, function* ({ token, type, userId, deleteOnVerify = true, }) {
            const otpToken = yield OtpModel_1.Otp.findOne({
                userId,
                token,
                type,
                expiresAt: { $gt: new Date() }, // Check if token is not expired
            });
            if (!otpToken) {
                return false;
            }
            // console.log({ deleteOnVerify })
            if (deleteOnVerify)
                yield OtpModel_1.Otp.deleteOne({ _id: otpToken._id });
            return true;
        });
    }
    getOTP(token, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const otpToken = yield OtpModel_1.Otp.findOne({
                token,
                type,
                expiresAt: { $gt: new Date() }, // Check if token is not expired
            });
            if (!otpToken) {
                return null;
            }
            return otpToken;
        });
    }
    deleteOTP(token, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const otpToken = yield OtpModel_1.Otp.findOne({
                token,
                type,
                expiresAt: { $gt: new Date() }, // Check if token is not expired
            });
            console.log("otpToken", otpToken);
            if (!otpToken) {
                return;
            }
            yield OtpModel_1.Otp.deleteOne({ _id: otpToken._id });
        });
    }
}
exports.default = OtpService;
