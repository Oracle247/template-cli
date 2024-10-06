import { Document } from "mongoose";

interface Otp {
    token: string;
    user: string;
    type: "emailVerification" | "mfaToken" | "passwordReset";
    expiresAt: Date;
}

interface OtpDocument extends Otp, Document { }

export { Otp, OtpDocument }
