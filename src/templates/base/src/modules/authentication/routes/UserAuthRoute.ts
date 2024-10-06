import { Request, Response, NextFunction, Router } from 'express';
import { Routes } from "../../../core/routes/interfaces";
import { UserAuthController } from "../controllers";

class UserAuthRoute implements Routes {
  public path = '/auth';
  public router = Router();
  public authController = new UserAuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.all(`${this.path}*`, (req: Request, res: Response, next: NextFunction) => {
      next()
    })

    this.router.post(`${this.path}/login`, this.authController.login);

    this.router.post(`${this.path}/create`, this.authController.create);

    this.router.post(`${this.path}/validate-reset-code`, this.authController.validateResetCode);

    this.router.post(`${this.path}/reset-password`, this.authController.passwordReset);

    this.router.post(`${this.path}/mfa`, this.authController.mfa);

    this.router.post(`${this.path}/send-reset-code`, this.authController.sendResetCode);

    this.router.post(`${this.path}/change-password`, this.authController.changePassword);
  }
}

export { UserAuthRoute };

