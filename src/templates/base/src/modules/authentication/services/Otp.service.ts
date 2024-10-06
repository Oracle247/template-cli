import crypto from "crypto";
import { Otp } from "../models/OtpModel";
import { Otp as IOtp, OtpDocument } from "../interfaces/OtpInterface";
import { AdminDocument } from "../../admin/interface/Admin";

const OTP_EXPIRY_MINUTES = 15;

export default class OtpService {
  async generateOTP(
    user: AdminDocument["_id"],
    type: IOtp["type"]
  ): Promise<string> {
    const token = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60000); // Convert minutes to milliseconds

    const otpToken = new Otp({
      token,
      user,
      type,
      expiresAt,
    });

    await otpToken.save();
    return token;
  }

  async verifyOTP({
    token,
    type,
    userId,
    deleteOnVerify = true,
  }: {
    token: string;
    type: string;
    userId?: AdminDocument["_id"];
    deleteOnVerify?: boolean;
  }): Promise<boolean> {
    const otpToken = await Otp.findOne({
      userId,
      token,
      type,
      expiresAt: { $gt: new Date() }, // Check if token is not expired
    });

    if (!otpToken) {
      return false;
    }

    // console.log({ deleteOnVerify })

    if (deleteOnVerify) await Otp.deleteOne({ _id: otpToken._id });
    return true;
  }

  async getOTP(
    token: string,
    type: IOtp["type"]
  ): Promise<OtpDocument | null> {
    const otpToken = await Otp.findOne({
      token,
      type,
      expiresAt: { $gt: new Date() }, // Check if token is not expired
    });

    if (!otpToken) {
      return null;
    }

    return otpToken;
  }

  async deleteOTP(token: string, type: IOtp["type"]): Promise<void> {
    const otpToken = await Otp.findOne({
      token,
      type,
      expiresAt: { $gt: new Date() }, // Check if token is not expired
    });

    console.log("otpToken", otpToken);

    if (!otpToken) {
      return;
    }

    await Otp.deleteOne({ _id: otpToken._id });
  }
}
