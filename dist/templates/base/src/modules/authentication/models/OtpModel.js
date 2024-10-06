"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Otp = void 0;
const mongoose_1 = require("mongoose");
const OtpSchema = new mongoose_1.Schema({
    token: {
        type: String,
        required: true
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Admin'
    },
    type: {
        type: String,
        enum: ["emailVerification", "mfaToken", "passwordReset"],
        required: true,
    },
    expiresAt: { type: Date, required: true },
}, {
    timestamps: true
});
const Otp = (0, mongoose_1.model)('Otp', OtpSchema);
exports.Otp = Otp;
