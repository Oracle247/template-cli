import EncryptionService from "./Encrypt.service";
import TokenService from "./Token.service";
import { Status } from "../../../interfaces/constants";
import OtpService from "./Otp.service";
import { OtpDocument } from "../interfaces/OtpInterface";
import { IUser } from "../../user/interfaces/UserInterface";
import { User } from "../../user/models";
import { EmailProvider } from "../../email/providers";
import { EmailPayload } from "../../email/interfaces";
import { logger } from "../../../core/utils";
import { AppError } from "../../../core/exceptions";
import { StatusCodes } from "http-status-codes";

// const client = new OAuth2Client(config.GOOGLE.CLIENT_ID);

export default class UserAuthService {
  public encryptionService = new EncryptionService();
  public tokenService = new TokenService();

  async create(payload: IUser) {
    payload.email = payload.email.toLowerCase()

    const existingEmail = await User.findOne({ email: payload.email })

    if (existingEmail) {
      throw new AppError('Oops, Email already exists', StatusCodes.BAD_REQUEST)
    }

    const user = await User.create({
      ...payload,
      status: Status.ACTIVE
    });

    // const message = "Your account has been created clink the link to reset your password http://localhost:3000/reset-password"

    // await (new EmailService).sendUserLoginCredentials(user.email, user.fullname, message)

    return user;
  }

  async login(loginPayload: {
    email: string,
    password: string
  }) {
    console.log({ loginPayload })
    const user = await User.findOne({ email: loginPayload.email }).select("+password");

    if (
      !user ||
      !(await this.encryptionService.comparePassword(
        user.password,
        loginPayload.password
      ))
    ) {
      throw new AppError(`Oops!, invalid email or password`, StatusCodes.BAD_REQUEST);
    }

    console.log({ user })

    const token = await this.tokenService.generateToken(
      user.id as string,
      `${user.email}`
    );

    console.log({ token })

    return { user, token };
  }

  async sendResetCode(payload: {
    email: string,
    type: OtpDocument["type"]
  }
  ): Promise<any> {
    const user = await User.findOne({ email: payload.email })
    if (!user) throw new Error(`Oops!, user doesn't exist`);
    const otp = await (new OtpService).generateOTP(user._id, payload.type);
    const message = `this is your Token ${otp}`
    const emailConfig: EmailPayload = {
      to: user.email,
      subject: 'Password Reset Token',
      payload: {
        name: user.full_name,
        message
      },
      template: '../templates/email.handlebars'
    }

    const mail = await (new EmailProvider).sendMail(emailConfig)

    return mail;
  }

  async mfa(payload: {
    email: string,
    token: string
  }
  ): Promise<any> {
    const user = await User.findOne({ email: payload.email }).populate({
      path: "role"
    });

    if (!user) throw new AppError(`Oops!, user doesn't exist`, StatusCodes.BAD_REQUEST);

    const verifyPayload = {
      token: payload.token,
      type: "mfaToken",
      userId: user._id,
      deleteOnVerify: true
    }
    const otpVerify = await (new OtpService).verifyOTP({ ...verifyPayload })

    if (!otpVerify) throw new AppError('Oops!, Otp verification failed', StatusCodes.BAD_REQUEST)

    const token = await this.tokenService.generateToken(
      user.id as string,
      `${user.email}`
    );

    user.mfa = false;
    user.status = Status.ACTIVE;
    await user.save();

    return { user, token };
  }


  async validateResetCode(payload: {
    email: string;
    resetToken: string;
  }) {
    const user = await User
      .findOne({ email: payload.email })
      .select("+password")

    if (!user) throw new Error(`Oops! user does not exist`);

    const verifyPayload = {
      token: payload.resetToken,
      type: "passwordReset",
      userId: user._id,
      deleteOnVerify: false
    }
    const otpVerify = await (new OtpService).verifyOTP({ ...verifyPayload })

    if (!otpVerify) throw new AppError('Oops!, Otp verification failed', StatusCodes.BAD_REQUEST)

    return otpVerify;

  }

  async passwordReset(payload: {
    email: string;
    resetToken: string;
    password: string;
  }) {
    const user = await User
      .findOne({ email: payload.email })
      .select("+password")

    if (!user) throw new AppError(`Oops! user does not exist`, StatusCodes.BAD_REQUEST);

    const verifyPayload = {
      token: payload.resetToken,
      type: "passwordReset",
      userId: user._id,
      deleteOnVerify: true
    }
    const otpVerify = await (new OtpService).verifyOTP({ ...verifyPayload })

    if (!otpVerify) throw new AppError('Oops!, Otp verification failed', StatusCodes.BAD_REQUEST)

    user.password = payload.password

    const newUser = await user.save();

    return newUser

  }

  async changePassword(payload: {
    email: string;
    oldPassword: string;
    newPassword: string;
  }) {
    const user = await User
      .findOne({ email: payload.email })
      .select("+password")

    if (!user) throw new Error(`Oops! user does not exist`);

    if (!(await this.encryptionService.comparePassword(
      user.password,
      payload.oldPassword
    ))
    ) {
      throw new AppError(`Oops!, invalid password`, StatusCodes.BAD_REQUEST);
    }

    // const password = await this.encryptionService.hashPassword(
    //     payload.newPassword
    // );

    user.password = payload.newPassword

    // await (new ActivityService).createActivity({
    //   user: user._id,
    //   type: "Change Password"
    // })


    return await user.save();
  }
}
