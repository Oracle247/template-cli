import { NextFunction, Request, Response } from "express";
import AdminAuthService from "../services/Admin.auth.service";
import { OtpDocument } from "../interfaces/OtpInterface";
import { StatusCodes } from "http-status-codes";

class AdminAuthController {
  public authService = new AdminAuthService();

  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.authService.create({ ...req.body });

      return res.status(StatusCodes.OK).json({
        status: "success",
        message: `An email has been sent to you to create your password`,
        admin: data,
      });
    } catch (err: any) {
      next(err);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.body.username)
      const admin = await this.authService.login(req.body);
      return res.status(StatusCodes.ACCEPTED).json(admin);
    } catch (err) {
      next(err)
    }
  };

  public sendResetLink = async (
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
      const result = await this.authService.sendResetLink(data);
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

export { AdminAuthController }
