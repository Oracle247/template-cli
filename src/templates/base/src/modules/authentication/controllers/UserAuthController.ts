import { NextFunction, Request, Response } from "express";
import UserAuthService from "../services/User.auth.service";
import { OtpDocument } from "../interfaces/OtpInterface";
import { StatusCodes } from "http-status-codes";
import { HttpException } from "../../../core/exceptions";

class UserAuthController {
  public authService = new UserAuthService();

  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.authService.create({ ...req.body });

      return res.status(StatusCodes.OK).json({
        status: "success",
        message: `creating account successful`,
        user: data,
      });
    } catch (err: any) {
      next(err);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.authService.login(req.body);
      return res.status(StatusCodes.OK).json(user);
    } catch (error) {
      next(error)
    }
  };

  public sendResetCode = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data: {
        email: string;
        type: OtpDocument["type"];
      } = {
        email: req.body.email,
        type: "passwordReset",
      };
      const result = await this.authService.sendResetCode(data);
      return res.status(StatusCodes.OK).send({
        message: "Email Sent Successfully",
        data: result,
      });
    } catch (err: any) {
      next(err);
    }
  };

  public mfa = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: {
        email: string,
        token: string
      } = {
        email: req.body.email,
        token: req.body.token
      }
      const result = await this.authService.mfa(data)
      return res.status(StatusCodes.OK).send({
        message: "Access granted",
        data: result
      });

    } catch (err: any) {
      next(err);
    }
  }

  public validateResetCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.validateResetCode(req.body);
      res.status(StatusCodes.OK).send({
        message: "Token Validation Successful",
        data: result,
      });
    } catch (error: any) {
      next(error);
    }
  };

  public passwordReset = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.passwordReset(req.body);
      res.status(StatusCodes.OK).send({
        message: "Password changed successfully",
        data: result,
      });
    } catch (error: any) {
      next(error);
    }
  };

  public changePassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.authService.changePassword(req.body);
      res.status(StatusCodes.OK).send({
        message: "Password changed successfully",
        data: result,
      });
    } catch (error: any) {
      next(error);
    }
  };
}

export { UserAuthController }
