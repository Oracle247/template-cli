import EncryptionService from "./Encrypt.service";
import { Admin } from "../../admin/models";
import { IAdmin } from "../../admin/interface/Admin";
import { ActivityService } from "../../adminActivity/services/Activity.service";
import TokenService from "./Token.service";
import { Status } from "../../../interfaces/constants";
import OtpService from "./Otp.service";
import { OtpDocument } from "../interfaces/OtpInterface";

// const client = new OAuth2Client(config.GOOGLE.CLIENT_ID);

export default class AdminAuthService {
  public encryptionService = new EncryptionService();
  public tokenService = new TokenService();

  async create(payload: IAdmin) {
    try {
      // const role = await Role.findOne({ title: payload.role });
      // if (!role) {
      //     throw new Error('Role not found');
      // }

      payload.email = payload.email.toLowerCase()

      const existingEmail = await Admin.findOne({ email: payload.email })

      const existingPhoneNumber = await Admin.findOne({ phoneNumber: payload.phoneNumber })

      if (existingEmail) {
        throw new Error('Oops, Email already exists')
      }

      if (existingPhoneNumber) {
        throw new Error('Oops, Phone number already exists')
      }

      const admin = await Admin.create({
        ...payload,
        // role: role._id,
        status: Status.PENDING
      });

      const message = "Your account has been created clink the link to reset your password http://localhost:3000/reset-password"

      // await (new EmailService).sendAdminLoginCredentials(admin.email, admin.fullname, message)

      return admin;
    } catch (err: any) {
      console.log(err);
      throw new Error(err);
    }
  }

  async login(loginPayload: {
    username: string,
    password: string
  }) {
    try {
      console.log({ loginPayload })
      const admin = await Admin.findOne({
        $or: [{ username: loginPayload.username },
        { email: loginPayload.username }
        ],
      }).select("+password");
      // .populate({
      //   path: "role"
      // });
      if (
        !admin ||
        !(await this.encryptionService.comparePassword(
          admin.password,
          loginPayload.password
        ))
      ) {
        throw new Error(`Oops!, invalid email or password`);
      }

      // if (admin.isEmailVerified !== true) {
      //     throw new Error("Oops! your email is not verified,");
      // }

      if (!admin.mfa) {
        const token = await this.tokenService.generateToken(
          admin.id as string,
          `${admin.email}`
        );

        await (new ActivityService).createActivity({
          admin: admin._id,
          type: "Login"
        })

        return { admin, token };

      }

      const otp = await (new OtpService).generateOTP(admin._id, "mfaToken");
      const emailConfig = {
        fullName: admin.full_name,
        email: admin.email,
        token: otp
      }
      const {
        fullName,
        email,
        token
      } = emailConfig

      // await (new EmailService)._sendMfaTokenEmail(fullName, email, token)

      await (new ActivityService).createActivity({
        admin: admin._id,
        type: "Login"
      })

      // admin.mfa = false;
      // await admin.save();

      return {
        message: "mfa token has been sent to your email",
        admin
      };
    } catch (err: any) {
      console.log(err);
      throw new Error(err);

    }
  }

  async sendResetLink(payload: {
    email: string,
    type: OtpDocument["type"]
  }
  ): Promise<any> {
    try {
      const admin = await Admin.findOne({ email: payload.email })
      if (!admin) throw new Error(`Oops!, admin doesn't exist`);
      const otp = await (new OtpService).generateOTP(admin._id, payload.type);
      const emailConfig = {
        fullName: admin.full_name,
        email: admin.email,
        token: otp
      }
      const {
        fullName,
        email,
        token
      } = emailConfig

      // const mail = await (new EmailService)._sendUserPasswordResetInstructionEmail(fullName, email, token)
      const mail = "success"
      return mail;
    } catch (error: any) {
      console.log(error);
      throw new Error(error);
    }
  }

  async mfa(payload: {
    email: string,
    token: string
  }
  ): Promise<any> {
    try {
      const admin = await Admin.findOne({ email: payload.email }).populate({
        path: "role"
      });

      if (!admin) throw new Error(`Oops!, admin doesn't exist`);

      const verifyPayload = {
        token: payload.token,
        type: "mfaToken",
        userId: admin._id,
        deleteOnVerify: true
      }
      const otpVerify = await (new OtpService).verifyOTP({ ...verifyPayload })

      if (!otpVerify) throw new Error('Oops!, Otp verification failed')

      const token = await this.tokenService.generateToken(
        admin.id as string,
        `${admin.email}`
      );

      admin.mfa = false;
      admin.status = Status.ACTIVE;
      await admin.save();

      return { admin, token };
    } catch (error: any) {
      console.log(error);
      throw new Error(error);
    }
  }

  async passwordReset(payload: {
    email: string;
    resetToken: string;
    password: string;
  }) {
    try {
      const admin = await Admin
        .findOne({ email: payload.email })
        .select("+password")

      if (!admin) throw new Error(`Oops! admin does not exist`);

      const verifyPayload = {
        token: payload.resetToken,
        type: "passwordReset",
        userId: admin._id,
        deleteOnVerify: true
      }
      const otpVerify = await (new OtpService).verifyOTP({ ...verifyPayload })

      if (!otpVerify) throw new Error('Oops!, Otp verification failed')

      admin.password = payload.password

      const newAdmin = await admin.save();

      await (new ActivityService).createActivity({
        admin: admin._id,
        type: "Reset Password"
      })

      return newAdmin

    } catch (err: any) {
      console.log(err);
      throw new Error(err);
    }

  }

  async changePassword(payload: {
    email: string;
    oldPassword: string;
    newPassword: string;
  }) {
    const admin = await Admin
      .findOne({ email: payload.email })
      .select("+password")

    if (!admin) throw new Error(`Oops! admin does not exist`);

    if (!(await this.encryptionService.comparePassword(
      admin.password,
      payload.oldPassword
    ))
    ) {
      throw new Error(`Oops!, invalid password`);
    }

    // const password = await this.encryptionService.hashPassword(
    //     payload.newPassword
    // );

    admin.password = payload.newPassword

    await (new ActivityService).createActivity({
      admin: admin._id,
      type: "Change Password"
    })


    return await admin.save();
  }
}
