import { model, Schema } from 'mongoose';
import { OtpDocument } from '../../authentication/interfaces/OtpInterface';

const OtpSchema: Schema = new Schema({
    token: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
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

const Otp = model<OtpDocument>('Otp', OtpSchema);

export { Otp }
