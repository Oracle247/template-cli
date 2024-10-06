
import { isUserAuthenticated } from "../../../core/middlewares/AuthMiddleware";
import { Request, Response, NextFunction, Router } from 'express';
import { UserController } from '../controllers';
import { Routes } from "../../../core/routes/interfaces";
class UserRoute implements Routes {
  public path = '/user';
  public router = Router();
  public userController = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.all(`${this.path}*`, (req: Request, res: Response, next: NextFunction) => {
      next()
    })

    this.router.get(`${this.path}`, isUserAuthenticated, this.userController.getAllUser);

    this.router.get(`${this.path}/:id`, isUserAuthenticated, this.userController.getUser);

    this.router.post(`${this.path}/`, isUserAuthenticated, this.userController.createUser);

    this.router.put(`${this.path}/:id`, isUserAuthenticated, this.userController.updateUser);

    this.router.delete(`${this.path}/:id`, isUserAuthenticated, this.userController.deleteUser);
  }
}

export { UserRoute };

